---
title: Hirarki Proyek, Service & Environment
description: Pahami model domain RanuPod dan bagaimana beban kerja diisolasi di tingkat cluster K3s.
---

RanuPod mengadopsi model domain modern PaaS yang memisahkan blueprint kode dari runtime stage aktif: **Tenant → Project → Service → Environment → Deployment**.

Struktur ini dirancang agar tim developer dapat mengembangkan, menguji, dan merilis aplikasi dari satu antarmuka terpadu tanpa risiko kebocoran konfigurasi antar-lingkungan.

---

## 1. Model Domain RanuPod

```
Tenant (Billing & Organisasi)
└── Project (Logical Workload, misal "Toko Online")
    ├── Service 1: "frontend-web" (Blueprint: GitHub repo / branch)
    ├── Service 2: "api-backend"  (Blueprint: GitHub repo / branch)
    └── Service 3: "postgres-db"  (Blueprint: Template Catalog)
        │
        ├── Environment: "production" (K3s Namespace: rp-40845f6d-production)
        │   ├── Pod: frontend-web (Live Deployment v4)
        │   ├── Pod: api-backend  (Live Deployment v9)
        │   └── Pod: postgres-db  (Stateful with NVMe Volume)
        │
        └── Environment: "staging" (K3s Namespace: rp-40845f6d-staging)
            ├── Pod: frontend-web (Live Deployment v5)
            ├── Pod: api-backend  (Live Deployment v10)
            └── Pod: postgres-db  (Ephemeral / Test DB)
```

---

## 2. Definisi Entitas

### A. Tenant
Tenant adalah entitas penagihan (Billing Entity) dan pemilik akun tingkat tertinggi. Tenant dapat berupa akun personal pengguna atau sebuah Organisasi.
- Seluruh tagihan komputasi, invoice bulanan, dan deposit dompet (IDR) diikat pada tingkat Tenant.
- Tenant dapat memiliki beberapa Project.

### B. Project
Project adalah wadah logis yang mengelompokkan beberapa service yang saling berhubungan untuk membentuk satu kesatuan sistem aplikasi (misalnya: *Toko Online*, *Core Banking*, *Internal CRM*).
- Variabel lingkungan global dan kontrol akses tim (RBAC) dikelola pada tingkat Project.
- Kolaborasi tim diatur melalui peran: **Owner**, **Editor**, dan **Viewer**.

### C. Service
Service adalah blueprint aplikasi atau workload spesifik. Sebuah service mewakili satu unit komputasi:
- Terhubung ke **satu repositori Git** (atau image Docker / Template).
- Menentukan strategi build (Railpack, Nixpacks, atau Dockerfile).
- Menentukan port ingress, resource limit (vCPU, RAM), dan persistent volume mount point.

### D. Environment (Stage)
Environment adalah tahap eksekusi runtime nyata tempat Service dijalankan. RanuPod menyediakan tiga jenis stage:
1. **Production**: Lingkungan stabil yang melayani traffic publik nyata dengan proteksi ketersediaan tinggi.
2. **Staging**: Lingkungan pengujian pra-rilis yang mencerminkan arsitektur produksi untuk QA dan verifikasi integrasi.
3. **Preview**: Lingkungan sementara yang dapat dipicu secara otomatis dari Pull Request (PR) GitHub untuk keperluan code-review tim.

Setiap Environment memiliki variabel lingkungan yang terpisah sehingga kredensial database staging tidak akan pernah tertukar dengan database production.

### E. Deployment
Deployment adalah versi rilis spesifik dari suatu Service di dalam Environment tertentu.
- Setiap kali Anda melakukan git commit atau menekan tombol Deploy, RanuPod mencatat rilis baru (misalnya *Deployment #12*).
- Rilis aktif berstatus **Live** (menjalankan kontainer dan menerima traffic).
- Rilis lama otomatis ditandai sebagai **Superseded** (diskalakan ke 0 replika untuk menghemat biaya tanpa menghapus histori rilis).

---

## 3. Isolasi Multi-Tenancy di Tingkat K3s

RanuPod menjamin keamanan tingkat enterprise melalui isolasi namespace yang ketat di cluster K3s:

### Format Namespace Otomatis
Namespace K3s diikat langsung ke kombinasi **Project ID** dan **Environment Name**:
```text
rp-{projectID[:8]}-{environmentName}
```
*Contoh:*
- Proyek ID `40845f6d-19e3-4f2b-95bb-a28d54d9238e` di stage `production` akan berjalan di namespace:
  ```text
  rp-40845f6d-production
  ```
- Di stage `staging`:
  ```text
  rp-40845f6d-staging
  ```

### Keuntungan Arsitektur Ini:
1. **Kolaborasi Tim Tanpa Sentuh K3s**:
   Ketika Anda mengundang rekan tim baru sebagai Editor atau memindahkan project ke Organisasi lain, hak akses diatur sepenuhnya di Control Plane database. Pod di cluster K3s **tidak perlu di-restart atau dimigrasikan**.
2. **Isolasi Jaringan (Zero-Trust Network Policy)**:
   Dengan NetworkPolicy bawaan (Cilium/K3s), pod di dalam satu namespace hanya dapat berkomunikasi dengan pod lain di namespace yang sama. Traffic antar-proyek atau antar-stage diblokir secara default.
3. **Internal DNS Service Discovery**:
   Service di dalam namespace yang sama dapat saling memanggil secara privat menggunakan nama service tanpa melewati internet publik:
   ```text
   http://api-backend:8080
   postgres://user:pass@postgres-db:5432/mydb
   ```
