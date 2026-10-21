---
title: Deploy Aplikasi PHP & Laravel di RanuPod
description: Panduan deployment aplikasi PHP modern dan framework Laravel di RanuPod.
---

RanuPod mendeteksi proyek PHP jika terdapat file `composer.json` di root direktori.

---

## 1. Persiapan Laravel

Pastikan script lifecycle standar Laravel ada pada `composer.json`:

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

## 2. Environment Variables Penting

Untuk aplikasi Laravel, pastikan Anda menambahkan variabel berikut di tab **Variables**:

```ini
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...
APP_URL=https://my-service.ranupod.app
LOG_CHANNEL=stderr
```

> [!IMPORTANT]
> Selalu set `LOG_CHANNEL=stderr` agar log Laravel langsung diteruskan ke engine **RanuLog** untuk pemantauan live stream.

---

## 3. Database Migration Otomatis

Anda dapat menyetel perintah migrasi database saat deployment baru diluncurkan:

```bash
php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
```
Atau gunakan webserver bawaan Nginx/Caddy yang disediakan oleh RanuPod runtime.
