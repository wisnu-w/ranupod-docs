---
title: Environment Variables & Secrets
description: Cara menyuntikkan variabel lingkungan, mengenkripsi kredensial rahasia (AES-256-GCM), dan membedakan env frontend vs backend di RanuPod.
---

Aplikasi modern berbasis metodologi 12-Factor memisahkan seluruh konfigurasi dari kode sumber. RanuPod menyediakan sistem manajemen variabel lingkungan yang aman dengan enkripsi at-rest tingkat militer, dukungan impor file `.env` massal, dan pemisahan kredensial antar-stage.

---

## 1. Menambahkan Variabel di Console

1. Masuk ke **[RanuPod Console](https://console-dev.ranuoutdoor.id)** dan pilih service target Anda.
2. Buka tab **Variables**.
3. Klik tombol **"+ Add Variable"**.
4. Isi data:
   - **Key**: Nama variabel (contoh: `DATABASE_URL`, `REDIS_HOST`, `JWT_SECRET`).
   - **Value**: Nilai dari variabel tersebut.
   - **Checkbox "Is Secret"**: Centang opsi ini jika nilai tersebut berisi data sensitif (password, private key, token API).
5. Klik **Save Variables**. Perubahan akan otomatis memicu rolling redeploy secara mulus.

---

## 2. Enkripsi Secretbox (AES-256-GCM)

Keamanan kredensial adalah prioritas utama di RanuPod. Variabel yang ditandai sebagai **Secret (`is_secret: true`)**:

- **Enkripsi At-Rest**: Dienkripsi langsung di memori menggunakan cipher **AES-256-GCM** dengan *nonce* unik sebelum disimpan ke database PostgreSQL (disimpan dengan awalan `enc:v1:`).
- **Masking di UI**: Nilai rahasia dimaskir menjadi `••••••••` di antarmuka web untuk mencegah pengintipan (*shoulder surfing*).
- **Anti-Kebocoran API**: Respon JSON dari endpoint API umum tidak pernah memuat plaintext dari secret.
- **Injeksi Aman ke Pod**: Saat pod kontainer diluncurkan, operator K3s mendekripsi nilai tersebut secara aman langsung ke dalam memory namespace kontainer sebagai variabel lingkungan standar sistem operasi.

---

## 3. Variabel Bawaan Sistem (System Environment Variables)

RanuPod secara otomatis menyuntikkan variabel sistem berikut ke dalam setiap kontainer:

| Variabel | Deskripsi | Contoh Nilai |
|---|---|---|
| `PORT` | Nomor port yang dialokasikan untuk mendengarkan lalu lintas web. | `8080` atau `3000` |
| `ENVIRONMENT` | Nama stage aktif tempat service berjalan. | `production` / `staging` / `preview` |
| `NODE_ENV` | Mode lingkungan untuk aplikasi Node.js. | `production` |
| `RANUPOD_PROJECT_ID` | UUID unik dari proyek Anda. | `40845f6d-19e3-...` |
| `RANUPOD_SERVICE_NAME` | Nama service saat ini. | `api-backend` |
| `RANUPOD_PUBLIC_URL` | Domain publik default aplikasi dengan HTTPS aktif. | `https://api-backend-xxxx.ranupod.app` |

> [!IMPORTANT]
> Aplikasi Anda **wajib** mendengarkan port yang disediakan oleh variabel `PORT` dan melakukan *bind* ke host `'0.0.0.0'`.

---

## 4. Perbedaan Kritis: Frontend vs Backend Variables

Banyak developer sering mengalami kebingungan mengenai variabel lingkungan pada framework frontend:

### A. Runtime Variables (Backend / Server-Side)
- Contoh: Node.js (Express, NestJS), Go, Python (FastAPI, Django), PHP (Laravel).
- Variabel dibaca saat aplikasi berjalan menggunakan `process.env.DB_PASS` atau `os.Getenv("DB_PASS")`.
- Aman untuk menyimpan password database dan API secret karena kode hanya dieksekusi di server terisolasi.

### B. Build-Time Variables (Frontend / Static Client)
- Contoh: Next.js (`NEXT_PUBLIC_`), Vite / Svelte / React (`VITE_`), Astro (`PUBLIC_`), Nuxt (`NUXT_PUBLIC_`).
- Framework ini **membakar (hardcode) nilai variabel ke dalam file bundle JavaScript (HTML/JS statis)** pada saat perintah build (`npm run build`) dieksekusi!
- **Konsekuensi Penting**:
  1. Variabel frontend **dapat dibaca oleh siapa saja** melalui Inspect Element / DevTools browser pengguna. **Jangan pernah memasukkan secret database atau private key pembayaran ke variabel prefix frontend!**
  2. Jika Anda mengubah nilai variabel frontend di Console, aplikasi **harus di-rebuild (Deploy Ulang)** agar file statis JavaScript diperbarui dengan nilai baru.

---

## 5. Impor Massal Format `.env` (Bulk Upload)

Jika Anda memiliki file `.env` lokal dengan puluhan baris konfigurasi, Anda tidak perlu memasukkannya satu-per-satu secara manual:

1. Di tab **Variables**, klik tombol **"Raw Editor / Import .env"**.
2. Salin dan tempel seluruh isi file `.env` Anda:
   ```ini
   PORT=8080
   APP_ENV=production
   CACHE_DRIVER=redis
   STRIPE_SECRET_KEY=sk_live_51Mz...
   DATABASE_URL=postgres://user:secret@postgres-db:5432/main
   ```
3. RanuPod akan otomatis mem-parsing setiap baris dan mendeteksi kunci yang berpotensi merupakan secret untuk dienkripsi.
4. Klik **Save & Apply**.

---

## 6. Duplikasi Variabel Antar Stage (Clone Secrets)

Saat membuat stage baru (misalnya membuat stage `staging` dari `production`):
- Anda dapat mencentang opsi **"Copy Variables from Production"**.
- RanuPod akan menyalin seluruh pasangan key-value, sehingga Anda hanya perlu mengubah nilai tertentu (seperti mengganti database URL ke database staging) tanpa mengetik ulang variabel lainnya.
