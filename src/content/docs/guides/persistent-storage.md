---
title: Persistent Storage (NVMe Volumes)
description: Panduan memasang volume disk NVMe persisten untuk database, file upload pengguna, dan penyimpanan stateful yang aman dari restart.
---

Secara bawaan, kontainer bersifat **ephemeral** (sementara). File apapun yang ditulis ke dalam filesystem kontainer akan hilang saat kontainer di-restart, mengalami crash, atau ketika Anda melakukan deployment versi kode baru.

Untuk aplikasi yang membutuhkan penyimpanan permanen—seperti database (PostgreSQL, MySQL, Redis) atau folder upload media pengguna—RanuPod menyediakan **Persistent Volume** berbasis drive NVMe enterprise.

---

## 1. Perbedaan Ephemeral vs Persistent Storage

| Aspek | Ephemeral Disk (Bawaan) | Persistent Volume (NVMe) |
|---|---|---|
| **Masa Hidup Data** | Direset saat pod di-restart / dideploy ulang | **Permanen & Utuh** meski pod di-redeploy atau di-rollback |
| **Kecepatan IOPS** | Bergantung pada root disk node | **High-Performance NVMe** (Hingga puluhan ribu IOPS) |
| **Kasus Penggunaan** | File cache sementara, log sementara, file build | File database, sesi login WhatsApp, media upload user |
| **Biaya** | Gratis (termasuk kuota container) | Dihitung per GB (Rp 75 / GB / hari) |

---

## 2. Cara Memasang Persistent Volume ke Service

1. Buka service target Anda di **[RanuPod Console](https://console-dev.ranuoutdoor.id)**.
2. Masuk ke tab **Storage**.
3. Klik tombol **"+ Attach Volume"**.
4. Masukkan konfigurasi disk:
   - **Volume Name**: Nama pengenal volume (contoh: `pg-data` atau `uploads-disk`).
   - **Mount Path**: Lokasi folder di dalam kontainer yang ingin Anda jadikan persisten (contoh: `/var/lib/postgresql/data` atau `/app/uploads`).
   - **Size (Kapasitas)**: Kapasitas disk yang dibutuhkan (mulai dari `5 GB`, `10 GB`, hingga `500 GB`).
5. Klik **Save & Attach**. Pod akan melakukan rolling update untuk memasang volume tersebut ke kontainer Anda.

---

## 3. Daftar Mount Path Standar untuk Aplikasi Populer

Berikut adalah daftar lokasi mount path standar untuk software yang umum digunakan:

| Software | Mount Path Standar |
|---|---|
| **PostgreSQL** | `/var/lib/postgresql/data` |
| **MySQL / MariaDB** | `/var/lib/mysql` |
| **Redis (AOF / RDB)** | `/data` |
| **MongoDB** | `/data/db` |
| **MinIO Object Storage** | `/data` |
| **n8n Workflow Automation**| `/home/node/.n8n` |
| **Evolution API (WABA)** | `/evolution/instances` |
| **WordPress Media Upload** | `/var/www/html/wp-content/uploads` |
| **PocketBase / SQLite** | `/pb_data` |

---

## 4. Keamanan & Ketahanan Data Saat Deployment

Ketika Anda merilis versi kode baru atau mengubah variabel lingkungan:
1. Pod baru diluncurkan oleh operator K3s.
2. Volume NVMe secara otomatis dipindahkan (*reattached*) ke pod baru.
3. Seluruh tabel database, relasi data, atau file dokumen Anda tetap berada dalam kondisi persis seperti sebelum deployment.
4. **Data Loss Prevention**: Menghapus service atau environment akan memberikan dialog konfirmasi ganda dengan verifikasi nama proyek untuk mencegah penghapusan disk yang tidak disengaja.

---

## 5. Menambah Kapasitas Disk (Volume Expansion)

Kapasitas disk Anda hampir penuh? Anda dapat menaikkan kapasitas volume secara langsung tanpa perlu mematikan aplikasi (*Online Expansion*):
1. Masuk ke tab **Storage** pada service Anda.
2. Klik tombol **Resize** pada volume yang diinginkan.
3. Masukkan ukuran baru (misalnya dari `10 GB` menjadi `30 GB`).
4. Sistem filesystem Linux di dalam pod akan otomatis memperluas kapasitas partisi secara langsung.
