---
title: Railpack & BuildKit Worker Engine
description: Mekanisme otomatis build container OCI multi-arch menggunakan Railpack dan BuildKit daemon di K3s.
---

Dokumen ini menjelaskan mekanisme build CI/CD otomatis menggunakan **Railpack** (penerus resmi Nixpacks dari Railway) dan **BuildKit Daemon** in-cluster di K3s.

---

## 1. Arsitektur Build Pipeline (`ranu-worker`)

```text
 [ranu-core] -> Pushes Task to Redis Queue: "builds"
       |
       v
 [ranu-worker] (Asynq Consumer)
       |
       +---> 1. Clone Git Repository (ke direktori /tmp/ranupod/builds/<id>)
       |
       +---> 2. Analisis & Generate Build Plan via Railpack
       |        (Menggunakan `railpack prepare` berbasis mise -> menghasilkan railpack-plan.json)
       |
       +---> 3. Eksekusi Remote Build via BuildKit Daemon di K3s
       |        (buildctl menembak tcp://192.10.1.204:31234 dengan frontend railpack)
       |        - Kompilasi native linux/amd64 di worker node K3s
       |        - Ekstrem cepat berkat layer cache BuildKit
       |        - Ukuran image 40-70% lebih kecil dibanding Nixpacks
       |
       +---> 4. Push Image Langsung ke In-Cluster Registry
       |        (Target: 192.10.1.203:30500/ranupod/{service}:{hash})
       |
       +---> 5. Enqueue Deploy Intent ke Redis Queue: "deployments"
                (Diterima oleh ranu-operator untuk deploy ke K3s)
```

---

## 2. Mengapa Migrasi dari Nixpacks ke Railpack?

1. **Status**: Nixpacks sudah resmi berstatus **Maintenance Mode (Deprecated)** oleh tim Railway.
2. **Penerus**: **Railpack** (`railwayapp/railpack`) ditulis menggunakan Go dan mengadopsi `mise` package manager.
3. **Efisiensi**:
   - Nixpacks membawa dependencies store Nix yang membengkak (~1GB).
   - Railpack menghasilkan runtime ultra-ramping (hanya package yang benar-benar dipakai).
   - BuildKit layer cache memungkinkan rebuild berikutnya selesai dalam hitungan detik.

---

## 3. Konfigurasi BuildKit Daemon di K3s

BuildKit berjalan sebagai Deployment mandiri di namespace `kube-system`:
- **Image**: `moby/buildkit:latest` (privileged container dengan overlayfs)
- **Port Internal**: `1234`
- **NodePort Eksternal**: `31234` (diakses langsung oleh `ranu-worker` via TCP)

### Insecure Registry Support (`buildkitd.toml`):
Agar BuildKit diizinkan mem-push image ke HTTP in-cluster registry `192.10.1.203:30500`:
```toml
[registry."192.10.1.203:30500"]
  http = true
  insecure = true
```
