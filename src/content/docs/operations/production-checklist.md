---
title: Production Readiness & Go-Live Checklist
description: Panduan checklist langkah demi langkah sebelum meluncurkan ekosistem RanuPod ke production.
---

Panduan checklist langkah demi langkah sebelum meluncurkan ekosistem **RanuPod** ke production.

---

## 1. Infrastruktur Dasar

- [ ] **PostgreSQL**:
  - Konfigurasi backup berkala (pg_dump / WAL archiving).
  - Connection pooling (PgBouncer) jika traffic API tinggi.
- [ ] **Redis Asynq**:
  - Aktifkan persistence (`AOF` atau `RDB`).
  - Set memory policy `noeviction` untuk queue builds dan deployments agar job tidak hilang.
- [ ] **K3s Cluster**:
  - Minimum 1 Master + 2 Worker nodes untuk High Availability.
  - Cilium CNI beroperasi normal (`cilium status --wait`).
  - Cilium Ingress aktif dan IngressClass `cilium` diset default.

---

## 2. Container Registry & K3s Image Pull

- [ ] **In-Cluster Registry**:
  - Persistent volume storage terhubung ke registry pod (`/var/lib/registry`).
- [ ] **K3s Node Trust**:
  - File `/etc/rancher/k3s/registries.yaml` terpasang di semua node.
  - Service `k3s` dan `k3s-agent` telah direstart.
  - Uji coba pull image manual:
    ```bash
    crictl pull 192.10.1.203:30500/ranupod/web-antrian:f8eb4502
    ```

---

## 3. DNS Wildcard & TLS (HTTPS)

- [ ] **Wildcard DNS**:
  - Domain wildcard `*.ranupod.com` diarahkan ke IP LoadBalancer atau Ingress Node K3s.
- [ ] **SSL / TLS Certificate**:
  - Pasang `cert-manager` dengan ClusterIssuer Let's Encrypt (DNS-01 challenge untuk wildcard).
  - Pastikan Cilium Ingress mendukung TLS termination:
    ```yaml
    spec:
      tls:
      - hosts:
        - "*.ranupod.com"
        secretName: ranupod-wildcard-tls
    ```

---

## 4. Multi-Tenancy & Keamanan K3s

- [ ] **NetworkPolicy**:
  - Verifikasi namespace baru otomatis menerapkan NetworkPolicy `rp-isolate-network`.
  - Pastikan pod tenant tidak dapat mengakses internal network metadata API atau namespace lain.
- [ ] **Resource Quotas**:
  - Pastikan limit vCPU dan RAM diterapkan per container (telah diimplementasikan di `ranu-operator`).
- [ ] **Kubeconfig Protection**:
  - Pastikan database kolom `kubeconfig_enc` tidak terekspos ke API publik (`ranu-admin` menggunakan secret authentication).

---

## 5. Build Runner (`ranu-worker`)

- [ ] **Railpack & BuildKit**:
  - Binary `railpack` dan `buildctl` terinstal pada worker node.
  - BuildKit daemon berjalan sehat di port 31234.
- [ ] **Cleanup Job**:
  - Skrip pembersihan direktori `/tmp/ranupod/builds/*` berjalan otomatis pasca build.

---

## 6. Smoke Test Verifikasi

Jalankan pengujian end-to-end lengkap:
1. Buka `ranu-console` -> Create Project.
2. Tambahkan Service dari repositori GitHub.
3. Klik **Deploy**.
4. Pantau log real-time di UI -> Pastikan fase Railpack build sukses.
5. Pantau pod status di K3s -> Pastikan status `Running`.
6. Akses URL publik yang dihasilkan -> Pastikan HTTP `200 OK`.
