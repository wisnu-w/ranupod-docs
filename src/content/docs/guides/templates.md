---
title: Katalog Template Siap Pakai (1-Klik)
description: Panduan meluncurkan database terkelola dan tool open-source siap pakai hanya dengan satu klik di RanuPod.
---

RanuPod menyediakan katalog **Template 1-Klik** untuk mempercepat instalasi database dan tool open-source populer. Template ini sudah dikonfigurasi dengan praktik terbaik keamanan, alokasi persistent volume yang tepat, dan variabel lingkungan bawaan.

Service template berjalan di dalam lingkungan (namespace) proyek yang sama dengan kode backend Anda, sehingga keduanya dapat berkomunikasi secara privat dengan latensi sub-milidetik.

---

## 1. Katalog Template yang Tersedia

### A. PostgreSQL
Database relasional open-source standar industri dengan dukungan fitur JSON, ekstensi pgvector, dan indexing berkecepatan tinggi.
- **Port Internal**: `5432`
- **Volume Default**: `10 GB NVMe` terpasang di `/var/lib/postgresql/data`
- **Variabel Lingkungan Otomatis**:
  - `POSTGRES_DB`: Nama database utama (default: `main`)
  - `POSTGRES_USER`: Username pengguna administratif
  - `POSTGRES_PASSWORD`: Password yang dienkripsi secara otomatis
- **Internal Connection String**:
  ```text
  postgres://postgres:${POSTGRES_PASSWORD}@postgres-db:5432/main
  ```

### B. Redis
Penyimpanan struktur data in-memory ultra-cepat yang cocok untuk caching, session store, dan antrean pub/sub.
- **Port Internal**: `6379`
- **Volume Default**: `5 GB NVMe` terpasang di `/data` dengan persistensi append-only file (AOF) aktif.
- **Internal Connection String**:
  ```text
  redis://default:${REDIS_PASSWORD}@redis-svc:6379
  ```

### C. n8n (Workflow Automation)
Platform otomasi alur kerja open-source untuk menghubungkan berbagai API, webhook, dan model kecerdasan buatan (AI) tanpa kode.
- **Port Ingress**: `5678` (disediakan domain publik HTTPS otomatis)
- **Volume Default**: `10 GB NVMe` terpasang di `/home/node/.n8n`
- **Fitur Khusus**:
  - Webhook URL publik otomatis aktif untuk menerima event eksternal dari Stripe, GitHub, Shopify, dll.
  - Dapat dihubungkan langsung ke instance PostgreSQL internal Anda.

### D. Evolution API (WhatsApp Automation / WABA)
Server HTTP API untuk mengintegrasikan WhatsApp Web ke dalam sistem backend Anda (pengiriman pesan notifikasi, broadcast, OTP, dan chatbot).
- **Port Ingress**: `8080` (domain HTTPS publik)
- **Volume Default**: `5 GB NVMe` terpasang di `/evolution/instances` (menyimpan session token WhatsApp agar tidak perlu scan ulang QR saat restart).
- **Variabel Wajib**:
  - `AUTHENTICATION_API_KEY`: Kunci otorisasi header `apikey` untuk melindungi endpoint Anda.

### E. MinIO (S3-Compatible Object Storage)
Penyimpanan objek berskala tinggi dengan API yang 100% kompatibel dengan Amazon S3 SDK.
- **Port Ingress Console**: `9001` (Dashboard visual manajemen bucket)
- **Port API S3**: `9000` (Endpoint unggah/unduh file dari aplikasi)
- **Volume Default**: `20 GB NVMe` terpasang di `/data`
- **Kompatibilitas**: Gunakan AWS SDK standar (AWS S3 Go, Node.js `@aws-sdk/client-s3`, atau Python `boto3`) dengan mengarahkan `endpoint` ke alamat MinIO internal.

### F. Uptime Kuma (Monitoring & Status Page)
Alat monitoring mandiri (*self-hosted*) yang powerful seperti "Uptime Robot". Mendukung pemantauan uptime HTTP(s), Ping, port TCP, DNS Query, sertifikat SSL, serta pembuatan halaman status (*Status Page*) publik yang cantik dengan integrasi 90+ saluran notifikasi (Telegram, Discord, Slack, WhatsApp, Email).
- **Port Ingress**: `3001` (disediakan domain publik HTTPS otomatis)
- **Volume Rekomendasi**: `5 GB NVMe` terpasang di `/app/data` (menyimpan database SQLite internal `kuma.db`, histori insiden, dan pengaturan alert).
- **Notifikasi Terintegrasi**: Dapat langsung dihubungkan ke bot Telegram atau service Evolution API internal di RanuPod untuk notifikasi downtime WhatsApp instan.

---

## 2. Cara Meluncurkan Template

1. Buka proyek Anda di **[RanuPod Console](https://console-dev.ranuoutdoor.id)**.
2. Di canvas proyek, klik tombol **"+ Add Service"** lalu pilih **"From Template"**.
3. Pilih template yang diinginkan (misalnya **PostgreSQL**).
4. Tentukan:
   - **Nama Service**: misalnya `db-utama`.
   - **Kapasitas Penyimpanan**: sesuaikan ukuran disk NVMe (default `10 GB`).
   - **Kredensial**: biarkan RanuPod membuat password acak yang aman atau tentukan password Anda sendiri.
5. Klik **Deploy Template**.
6. Dalam waktu kurang dari 30 detik, pod database akan aktif dan siap menerima koneksi.

---

## 3. Menghubungkan Backend ke Service Template

Karena seluruh service di dalam stage yang sama (misal `production`) berbagi namespace jaringan pribadi, backend Anda dapat langsung mengakses database menggunakan nama servicenya:

```javascript
// Contoh koneksi di backend Node.js (Prisma / TypeORM / pg)
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:rahasia@db-utama:5432/main";
```

> [!TIP]
> Anda tidak perlu mengekspos port database (5432 atau 6379) ke internet publik. Membiarkannya hanya dapat diakses melalui jaringan internal K3s memberikan perlindungan maksimal dari serangan brute-force.
