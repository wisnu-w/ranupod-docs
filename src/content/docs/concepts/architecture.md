---
title: Arsitektur Sistem & Build Engine
description: Pelajari cara kerja komponen internal RanuPod, mulai dari Control Plane, Worker CI/CD, hingga Operator K3s.
---

RanuPod dirancang dengan arsitektur terdistribusi asinkron dan terpisah (*decoupled architecture*). Desain ini menjamin kestabilan platform: jika komponen build mengalami lonjakan beban, aplikasi produksi pengguna di cluster K3s tetap berjalan stabil tanpa terganggu.

---

## 1. Topologi Komponen

```
                  ┌─────────────────────────────────┐
                  │          RanuPod User           │
                  │ (Browser Console / Ranu CLI)    │
                  └───────────────┬─────────────────┘
                                  │ HTTPS (JWT Logto)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│              CONTROL PLANE (ranu-core API :8080)                 │
│  - REST API & RBAC Engine (Chi, Logto JWKS)                      │
│  - State & Metadata Database (PostgreSQL)                        │
│  - Enkripsi Secretbox AES-256-GCM                                │
│  - Billing & SKU Ledger Engine                                   │
└────────────────────────┬───────────────────────┬─────────────────┘
                         │ Enqueue Build Intent  │ Enqueue Deploy Intent
                         ▼                       ▼
┌─────────────────────────────────┐   ┌─────────────────────────────┐
│          REDIS QUEUE            │   │         REDIS QUEUE         │
│     (asynq: builds queue)       │   │    (operator:deploy queue)  │
└────────────────┬────────────────┘   └──────────────┬──────────────┘
                 │ Worker Pull                       │ Operator Pull
                 ▼                                   ▼
┌─────────────────────────────────┐   ┌─────────────────────────────┐
│    BUILD FACTORY (ranu-worker)  │   │  CLUSTER EXECUTOR           │
│  - Git Clone (Whitelist check)  │   │     (ranu-operator)         │
│  - Language Detector            │   │  - Client-Go Controller     │
│    (Railpack / Nixpacks / Docker│   │  - K3s Namespace Manager    │
│  - BuildKit Remote Daemon       │   │  - Deployment & HPA Pods    │
│  - Push to OCI Registry         │   │  - Cilium NetworkPolicies   │
└─────────────────────────────────┘   └──────────────┬──────────────┘
                                                     │ Deploys to
                                                     ▼
                                      ┌─────────────────────────────┐
                                      │       K3s RUNTIME PODS      │
                                      │  Namespace: rp-{id}-{stage} │
                                      │  - Traefik Ingress Routing  │
                                      │  - NVMe Persistent Volumes  │
                                      │  - OpenObserve Telemetry    │
                                      └─────────────────────────────┘
```

---

## 2. Peran Setiap Komponen

### A. Central Control Plane (`ranu-core`)
- Pusat kendali API berbasis Go dan Chi router.
- Mengelola state platform di PostgreSQL dan memvalidasi otentikasi JWT dari Logto.
- **Prinsip Keamanan**: `ranu-core` **tidak memiliki akses langsung ke cluster K3s**. Seluruh instruksi orkestrasi didelegasikan secara asinkron melalui antrean Redis (`ranu-operator` dan `ranu-worker`).
- Seluruh variabel lingkungan berstatus rahasia dienkripsi secara at-rest menggunakan algoritma **AES-256-GCM** sebelum disimpan ke database.

### B. CI/CD Factory (`ranu-worker`)
- Bertanggung jawab memproses antrean tugas build dari Redis Asynq.
- Mengkloning kode dari GitHub dengan sanitasi argument injection yang ketat (`--` flags, regex whitelist URL).
- Menjalankan mesin deteksi bahasa otomatis:
  1. **Dockerfile**: Jika ada di root repo, langsung diproses oleh daemon BuildKit.
  2. **Railpack & Nixpacks**: Mendeteksi `package.json`, `go.mod`, `requirements.txt`, atau `composer.json` untuk menghasilkan image OCI standar produksi secara instan.
- Mengunggah image hasil build ke OCI Registry internal yang aman.

### C. Cluster Operator (`ranu-operator`)
- Agen Go mandiri yang berjalan dengan service account berhak terbatas di cluster K3s.
- Menarik instruksi deployment dari antrean Redis (`claim-loop`).
- Mengatur siklus hidup sumber daya Kubernetes:
  - Membuat namespace khusus: `rp-{projectID[:8]}-{stage}`.
  - Mengonfigurasi `Deployment`, `Service`, `Secret`, dan `PersistentVolumeClaim`.
  - Menerapkan aturan firewall internal via `NetworkPolicy`.
  - Menandai deployment versi sebelumnya sebagai `superseded` (menyetel `replicas: 0` agar tidak memakan RAM/CPU).

### D. Edge Ingress & Gateway (Traefik)
- Menerima traffic publik masuk melalui port 80 dan 443.
- Mengelola sertifikat TLS/HTTPS wildcard secara otomatis via Let's Encrypt ACME.
- Merutekan traffic ke pod kontainer yang sehat berdasarkan header `Host`.

---

## 3. Alur Deployment Lengkap

1. **Pemicu (Trigger)**:
   Developer melakukan `git push` ke branch GitHub yang dipantau atau mengklik tombol **Deploy** di Console.
2. **Enqueue Build**:
   `ranu-core` membuat record deployment baru dengan status `queued` dan mengirimkan payload tugas ke Redis Asynq.
3. **Build & Image Creation**:
   `ranu-worker` mengambil tugas, mengkloning repositori, mendeteksi runtime, dan memanggil BuildKit untuk membuat image kontainer. Selama proses ini, log build dialirkan real-time ke OpenObserve.
4. **Deploy Intent**:
   Setelah image sukses dibuat, `ranu-worker` memperbarui status deployment menjadi `building_success` dan mengirimkan intent deploy ke antrean operator.
5. **Cluster Provisioning**:
   `ranu-operator` membuat pod baru di namespace terkait, menunggu hingga health check lulus, mengalihkan traffic Ingress ke pod baru, dan menurunkan replika versi lama ke 0.
6. **Live**:
   Deployment dinyatakan `live` dan aplikasi siap melayani traffic pengguna.
