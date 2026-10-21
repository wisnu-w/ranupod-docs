---
title: Environment Variables & Secrets
description: Cara menyuntikkan variabel lingkungan dan mengelola kredensial rahasia di RanuPod.
---

Aplikasi 12-factor modern memisahkan konfigurasi dari kode sumber. RanuPod menyediakan manajemen variabel lingkungan yang aman dan terenkripsi.

---

## 1. Menambahkan Variabel Lingkungan di Console

1. Buka proyek Anda di **RanuPod Console**.
2. Pilih service yang ingin Anda ubah.
3. Klik tab **Variables**.
4. Masukkan nama variabel (Key) dan isinya (Value):
   - Contoh: `DATABASE_URL` -> `postgres://postgres:secret@db:5432/main`
   - Contoh: `JWT_SECRET` -> `d92f7a93c...`
5. Klik **Save & Redeploy**.

---

## 2. Variabel Khusus Bawaan RanuPod

RanuPod menyuntikkan beberapa variabel secara otomatis saat runtime:

| Variabel | Deskripsi |
|---|---|
| `PORT` | Nomor port yang dialokasikan untuk mendengarkan traffic web. |
| `NODE_ENV` / `ENVIRONMENT` | Nama stage lingkungan aktif (misal `production` atau `staging`). |
| `RANUPOD_SERVICE_NAME` | Nama service saat ini. |
| `RANUPOD_PUBLIC_URL` | Domain publik default aplikasi (`*.ranupod.app`). |

---

## 3. Salin Variabel Antar Stage (Clone Secrets)

Ketika Anda membuat stage lingkungan baru (misalnya dari `production` ke `staging`):
- Anda dapat memilih opsi **"Copy Variables from Production"**.
- RanuPod akan menduplikasi kunci konfigurasi sehingga Anda tidak perlu mengetik ulang lusinan baris env.
