---
title: Persistent Storage & Database
description: Cara memasang NVMe Persistent Volume pada container Anda untuk menyimpan data database atau file upload.
---

Secara default, kontainer bersifat ephemeral (data di dalam disk kontainer hilang saat kontainer di-restart atau di-update). Untuk menyimpan data database (seperti PostgreSQL, MySQL, Redis, MinIO) atau file upload pengguna, Anda memerlukan **Persistent Volume**.

---

## 1. Menambahkan Persistent Volume

1. Buka service target di **RanuPod Console**.
2. Masuk ke tab **Storage**.
3. Klik **"+ Attach Volume"**.
4. Masukkan konfigurasi:
   - **Mount Path**: Jalur folder di dalam container tempat data disimpan (contoh: `/var/lib/postgresql/data` atau `/app/uploads`).
   - **Size**: Kapasitas disk yang Anda butuhkan (contoh: `10 GB`, `30 GB`).
5. Klik **Save & Attach**.

---

## 2. Kecepatan & Ketahanan Data

- **NVMe High IOPS**: Volume disk berbasis storage NVMe enterprise dengan kecepatan baca/tulis tinggi (hingga 3.500 MB/s).
- **Restart-Safe**: Data tetap utuh dan aman saat deployment baru dilakukan, service di-restart, atau kode diperbarui.
- **Snapshot & Backup**: Anda dapat mengambil backup data disk berkala langsung dari console.
