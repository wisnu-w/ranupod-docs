---
title: Deploy Aplikasi PHP & Laravel di RanuPod
description: Panduan deployment aplikasi PHP modern dan framework Laravel di RanuPod dengan Nginx, PHP-FPM, dan optimasi cache.
---

RanuPod mendeteksi proyek PHP jika menemukan file `composer.json` di root direktori repositori Anda. RanuPod menyediakan runtime modern berbasis PHP-FPM dan Nginx yang sudah dioptimasi untuk kinerjanya.

---

## 1. Persiapan `composer.json`

Pastikan versi PHP yang dibutuhkan telah ditentukan di `composer.json`:

```json
{
  "name": "laravel/laravel",
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0"
  }
}
```

---

## 2. Checklist Variabel Lingkungan Laravel

Untuk menjalankan Laravel secara aman dan optimal di RanuPod, tambahkan variabel berikut di tab **Variables**:

```ini
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_GENERATED_APP_KEY...
APP_URL=https://nama-service.ranupod.app
LOG_CHANNEL=stderr
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

> [!IMPORTANT]
> **Selalu set `LOG_CHANNEL=stderr`**. Konfigurasi ini membuat Laravel menulis log error langsung ke stream sistem, sehingga dapat ditangkap oleh **RanuLog** untuk pemantauan real-time di console.

---

## 3. Persistent Volume untuk Folder `storage/`

Laravel menyimpan file cache lokal, log, dan file upload pengguna di direktori `storage/`:
1. Buka tab **Storage** pada service Anda.
2. Tambahkan **Persistent Volume**:
   - **Mount Path**: `/var/www/html/storage` (atau path aplikasi Anda).
   - **Size**: Misalnya `10 GB NVMe`.
3. Dengan demikian, dokumen PDF atau gambar yang diunggah pengguna tidak akan hilang saat deployment rilis baru dilakukan.

---

## 4. Script Deployment & Migrasi Database

Untuk menjalankan migrasi database dan mengoptimalkan cache framework saat deployment rilis baru:

Atur **Start Command** pada tab **Settings**:
```bash
php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
```
Atau jika menggunakan runtime bawaan Nginx + PHP-FPM, RanuPod akan otomatis menyajikan file statis dari folder `public/` dengan routing `index.php` secara otomatis.
