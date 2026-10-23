---
title: Quickstart Deploy (60 Detik)
description: Panduan langkah demi langkah meluncurkan aplikasi web pertama Anda di RanuPod dari GitHub ke kontainer HTTPS aktif.
---

Panduan ini memandu Anda melakukan deployment aplikasi web pertama di RanuPod hingga aktif dan dapat diakses publik dengan HTTPS dalam waktu kurang dari 60 detik.

---

## Alur Quickstart

```
1. Buat Project ──> 2. Sambungkan GitHub ──> 3. Set Variables ──> 4. Deploy Instan ──> 5. HTTPS Aktif!
   (Canvas Tim)        (Auto-Detect Bahasa)     (Enkripsi Secret)     (Rolling Update)     (*.ranupod.app)
```

---

## Prasyarat

Sebelum memulai, pastikan Anda telah memiliki:
1. Akun aktif di **[RanuPod Console](https://console-dev.ranuoutdoor.id)**.
2. Repositori kode di **GitHub** (publik atau privat) yang memuat aplikasi web (misal: Node.js, Go, Python, atau PHP).

---

## Langkah 1: Buat Proyek Baru

1. Masuk ke dashboard [RanuPod Console](https://console-dev.ranuoutdoor.id).
2. Klik tombol **"+ New Project"** di pojok kanan atas layar.
3. Masukkan nama proyek Anda (misalnya: `toko-online-prod` atau `my-saas-core`).
4. Klik **Create Project**. Anda akan langsung dibawa ke kanvas visual proyek.

---

## Langkah 2: Tambahkan Service dari GitHub

1. Di kanvas proyek, klik tombol **"+ Add Service"** lalu pilih opsi **GitHub Repo**.
2. Jika ini adalah kunjungan pertama Anda, klik **Authorize GitHub** untuk memberi izin akses RanuPod ke akun atau organisasi GitHub Anda.
3. Pilih repositori target dan tentukan branch produksi (misalnya `main`).
4. Tentukan **Root Directory** jika kode aplikasi Anda berada di dalam subfolder (misalnya `backend` atau `apps/api`), atau biarkan `/` jika berada di root repositori.
5. Beri nama service Anda (contoh: `api-backend` atau `web-frontend`).

---

## Langkah 3: Konfigurasi Variabel Lingkungan & Secret

Jika aplikasi Anda membutuhkan koneksi database atau API key:
1. Buka tab **Variables** pada service card.
2. Tambahkan key dan value:
   ```ini
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgres://postgres:secret@db-utama:5432/main
   ```
3. Centang opsi **"Is Secret"** untuk variabel sensitif seperti `DATABASE_URL` atau `JWT_SECRET`. Nilai ini akan dienkripsi secara at-rest dengan cipher **AES-256-GCM**.
4. Klik **Save Variables**.

---

## Langkah 4: Klik Deploy & Pantau Live Build

1. Klik tombol **Deploy Now**.
2. Sistem worker RanuPod akan otomatis:
   - Mengkloning kode dari repositori GitHub Anda.
   - Mendeteksi bahasa pemrograman (`package.json`, `go.mod`, `requirements.txt`, dll).
   - Membangun image kontainer produksi yang optimal menggunakan BuildKit.
   - Mengalokasikan pod kontainer terisolasi di cluster K3s.
   - Mengonfigurasi sertifikat SSL gratis dan menerbitkan subdomain:
     ```text
     https://api-backend-xxxx.ranupod.app
     ```
3. Klik tab **Deployments** lalu pilih **View Logs** untuk melihat output kompilasi dan streaming server secara real-time via **RanuLog**.

---

## Langkah 5: Verifikasi Aplikasi Anda

1. Klik URL publik aplikasi yang muncul di header service dashboard.
2. Browser Anda akan membuka aplikasi dengan gembok hijau HTTPS yang valid.
3. Buka tab **RanuTrace** di console untuk melihat latensi request pertama Anda yang direkam oleh sistem observabilitas!

---

## Langkah Selanjutnya

Sekarang aplikasi Anda sudah aktif di internet. Pelajari fitur pelengkap lainnya:
- [Menghubungkan Custom Domain Anda Sendiri](/guides/custom-domains/)
- [Menambahkan Database PostgreSQL atau Redis 1-Klik](/guides/templates/)
- [Mengatur Auto-Scaling (HPA) saat Traffic Melonjak](/guides/scaling/)
- [Memasang RanuTrace Distributed Tracing di Kode Anda](/observability/ranutrace/)
