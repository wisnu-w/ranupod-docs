---
title: Panduan Ranu CLI
description: Panduan instalasi dan referensi perintah Command-Line Interface (ranu) untuk otomasi workflow developer.
---

**Ranu CLI** memungkinkan Anda menginisialisasi, mengonfigurasi variabel, dan men-deploy proyek Anda langsung dari terminal lokal Anda.

---

## 1. Instalasi CLI

Jalankan perintah one-liner berikut di terminal Anda (macOS / Linux):

```bash
curl -fsSL https://get.ranupod.app | sh
```

Verifikasi instalasi dengan memeriksa versi CLI:

```bash
ranu --version
```

---

## 2. Autentikasi CLI

Sebelum menjalankan perintah lain, hubungkan CLI dengan akun RanuPod Anda:

```bash
ranu login
```
Terminal akan membuka browser Anda untuk menyelesaikan proses login dengan akun RanuPod Anda.

---

## 3. Inisialisasi Proyek Lokal

Arahkan terminal ke folder source code proyek Anda, lalu jalankan:

```bash
cd /path/to/my-awesome-app
ranu init
```

CLI akan memandu Anda:
- Memilih organisasi dan proyek target di RanuPod.
- Menghubungkan service saat ini atau membuat service baru.
- Membuat file konfigurasi lokal `.ranupod/config.json`.

---

## 4. Perintah Umum

### Melakukan Deployment Manual
Deploy versi lokal aplikasi Anda secara instan:
```bash
ranu deploy
```

### Membaca Log Secara Real-Time
Stream live logs dari pod yang sedang berjalan:
```bash
ranu logs --follow
```

### Mengelola Variabel Lingkungan
Melihat variabel lingkungan saat ini:
```bash
ranu env list
```

Menambahkan variabel lingkungan baru:
```bash
ranu env set KEY=value DATABASE_URL="postgres://..."
```

Mendownload variabel lingkungan ke file `.env` lokal:
```bash
ranu env pull
```

### Membuka Dashboard di Browser
Buka halaman proyek langsung di browser:
```bash
ranu open
```
