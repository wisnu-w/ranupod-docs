---
title: Quickstart Deploy (60 Detik)
description: Panduan langkah demi langkah meluncurkan aplikasi web pertama Anda di RanuPod.
---

Panduan ini akan memandu Anda melakukan deployment aplikasi web pertama di RanuPod dari awal hingga aktif dan dapat diakses publik dengan HTTPS.

---

## Prasyarat

Sebelum memulai, pastikan Anda telah memiliki:
1. Akun di **[RanuPod Console](https://console-dev.ranuoutdoor.id)**.
2. Repositori kode di **GitHub** (misalnya repositori Node.js, Next.js, Go, Python, atau PHP).

---

## Langkah 1: Buat Proyek Baru

1. Masuk ke dashboard [RanuPod Console](https://console-dev.ranuoutdoor.id).
2. Klik tombol **"+ New Project"** di pojok kanan atas.
3. Beri nama proyek Anda (misalnya `toko-online-prod` atau `my-saas-api`).
4. Klik **Create Project**.

---

## Langkah 2: Tambahkan Service dari Git

1. Di dalam kanvas proyek Anda, klik **"+ Add Service"** lalu pilih **GitHub Repo**.
2. Jika ini pertama kali, hubungkan akun GitHub Anda untuk memberi akses ke repositori yang diinginkan.
3. Pilih repositori dan branch yang akan di-deploy (misalnya `main`).
4. Tentukan nama service (misalnya `api-backend` atau `frontend-web`).

---

## Langkah 3: Konfigurasi Environment Variables (Opsional)

Jika aplikasi Anda memerlukan variabel lingkungan (seperti database credentials atau API keys):
1. Buka tab **Variables** pada service card.
2. Tambahkan key dan value, misalnya:
   ```ini
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgres://user:secret@database-svc:5432/mydb
   ```
3. Klik **Save Variables**.

---

## Langkah 4: Klik Deploy

1. Klik tombol **Deploy Now**.
2. RanuPod akan otomatis:
   - Mengkloning kode dari repositori Git Anda.
   - Menganalisis file konfigurasi proyek dan membuild kontainer produksi tanpa perlu Dockerfile.
   - Meluncurkan kontainer dengan alokasi vCPU dan RAM terisolasi.
   - Mengaktifkan sertifikat SSL (HTTPS) dan membuat domain publik gratis:
     ```text
     https://api-backend-xxxxxx.ranupod.app
     ```
3. Buka tab **Deployments** dan klik **View Logs** untuk melihat proses build secara real-time.

---

## Langkah 5: Hubungkan Custom Domain (Opsional)

Ingin menggunakan nama domain Anda sendiri (misalnya `api.tokosaya.com`)?
1. Buka tab **Settings** -> **Domains**.
2. Masukkan nama domain kustom Anda.
3. Arahkan record CNAME domain Anda di penyedia DNS (seperti Cloudflare / Niagahoster / Rumahweb) ke target yang diberikan oleh RanuPod.
4. RanuPod akan otomatis menerbitkan sertifikat SSL Let's Encrypt secara instan!
