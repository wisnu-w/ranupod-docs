---
title: Panduan Ranu CLI Reference
description: Panduan instalasi dan referensi perintah Command-Line Interface (ranu) untuk mengelola deployment langsung dari terminal developer.
---

**Ranu CLI** (`ranu`) adalah alat bantu command-line untuk menghubungkan lingkungan lokal pengembang dengan cluster cloud RanuPod. Dengan CLI ini, Anda dapat menginisialisasi proyek, memicu deployment manual, mengalirkan live logs, dan mengelola secrets langsung dari terminal.

---

## 1. Instalasi Ranu CLI

### macOS & Linux (One-Liner):
Jalankan skrip instalasi otomatis di terminal:
```bash
curl -fsSL https://get.ranupod.app | sh
```

### Verifikasi Instalasi:
Periksa versi biner yang terpasang:
```bash
ranu --version
```
Output:
```text
ranu version 1.4.0 (darwin/arm64)
```

---

## 2. Autentikasi Pengguna (`ranu login`)

Sebelum mengeksekusi perintah lain, hubungkan CLI dengan akun RanuPod Anda:

```bash
ranu login
```
Terminal akan menghasilkan URL verifikasi dan membuka browser default Anda secara otomatis. Masuk dengan akun Logto RanuPod Anda dan setujui otorisasi sesi CLI.

Untuk memverifikasi sesi aktif Anda:
```bash
ranu whoami
```
Output:
```text
Logged in as: wisnu@ranupod.id (Tenant: Personal Workspace)
```

---

## 3. Inisialisasi Proyek Lokal (`ranu init`)

Arahkan terminal ke folder source code proyek di komputer Anda, lalu jalankan:

```bash
cd /path/to/my-backend-app
ranu init
```

CLI akan memandu Anda melalui wizard interaktif:
1. Memilih **Organisasi / Tenant**.
2. Memilih **Proyek Target** (atau membuat baru).
3. Memilih **Service Target** (atau membuat service baru).
4. Membuat file konfigurasi lokal di `.ranupod/config.json`:
   ```json
   {
     "project_id": "40845f6d-19e3-4f2b-95bb-a28d54d9238e",
     "service_id": "89b52a11-827c-482a-9cb2-d499120ac001",
     "environment": "production"
   }
   ```

> [!TIP]
> Tambahkan folder `.ranupod/` ke dalam file `.gitignore` Anda jika Anda ingin setiap developer di tim memiliki konteks sesi masing-masing.

---

## 4. Daftar Perintah Lengkap (CLI Reference)

### A. Memantau Status Service (`ranu status`)
Melihat status pod kontainer, penggunaan sumber daya (vCPU, RAM), dan status rilis aktif:
```bash
ranu status
```
Output:
```text
SERVICE: api-backend (Environment: production)
STATUS:  Live (Replicas: 1/1 Running)
HEALTH:  Healthy (100% checks passing)
URL:     https://api-backend-40845f6d.ranupod.app
CPU:     45m / 500m (9%)
MEMORY:  128Mi / 512Mi (25%)
```

---

### B. Deployment Manual (`ranu deploy`)
Memicu build dan rilis deployment baru secara instan:
```bash
ranu deploy
```
Gunakan flag `--message` untuk memberi catatan rilis:
```bash
ranu deploy -m "Fix memory leak in payment webhook"
```

---

### C. Live Streaming Log (`ranu logs`)
Membaca output log pod secara seketika (*real-time*):
```bash
# Streaming log terus menerus (follow mode)
ranu logs --follow

# Tampilkan 50 baris terakhir lalu stream
ranu logs --tail 50 --follow

# Cari pesan spesifik
ranu logs | grep "FATAL"
```

---

### D. Manajemen Environment Variables (`ranu env`)

Melihat seluruh variabel lingkungan aktif:
```bash
ranu env list
```

Menambahkan atau memperbarui variabel:
```bash
ranu env set CACHE_DRIVER=redis NODE_ENV=production
```

Menambahkan variabel berstatus rahasia (*encrypted secret*):
```bash
ranu env set --secret DATABASE_URL="postgres://user:secret@db:5432/main"
```

Mendownload variabel cloud ke file `.env` lokal Anda:
```bash
ranu env pull .env.local
```

---

### E. Membuka Dashboard di Browser (`ranu open`)
Membuka halaman web console untuk service saat ini secara instan:
```bash
ranu open
```

---

### F. Shell Autocompletion
Aktifkan tab completion pada shell favorit Anda:
```bash
# Untuk Zsh:
source <(ranu completion zsh)

# Untuk Bash:
source <(ranu completion bash)
```
