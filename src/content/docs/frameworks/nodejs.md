---
title: Deploy Aplikasi Node.js & Next.js di RanuPod
description: Panduan deployment aplikasi JavaScript dan TypeScript berbasis Node.js, Next.js, Express, NestJS, dan Remix di RanuPod.
---

RanuPod mendeteksi aplikasi Node.js secara otomatis jika menemukan file `package.json` di root direktori repositori Anda. RanuPod mendukung seluruh package manager populer: **npm**, **pnpm**, **yarn**, dan **bun**.

---

## 1. Menentukan Versi Node.js

Anda dapat menentukan versi Node.js yang diinginkan menggunakan field `engines` di dalam `package.json`:

```json
{
  "name": "my-awesome-app",
  "engines": {
    "node": ">=20.0.0"
  }
}
```
Jika tidak ditentukan, RanuPod akan menggunakan versi LTS terbaru (Node.js 20).

---

## 2. Port Binding & Host Requirement

Aplikasi Anda **wajib** mendengarkan traffic pada port yang disediakan oleh variabel lingkungan `PORT` dan melakukan bind ke alamat host `'0.0.0.0'`:

### Contoh Express:
```javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Aplikasi aktif di RanuPod!');
});

// WAJIB: bind ke '0.0.0.0'
app.listen(port, '0.0.0.0', () => {
  console.log(`Server mendengarkan port ${port}`);
});
```

> [!WARNING]
> Jangan melakukan bind hanya ke `'127.0.0.1'` atau `'localhost'`, karena lalu lintas jaringan Ingress tidak akan dapat menjangkau pod Anda.

---

## 3. Catatan Khusus Next.js (Standalone Mode)

Untuk performa build tercepat dan ukuran image kontainer yang sangat ramping (dari ~1 GB berkurang menjadi ~80 MB), **sangat disarankan** mengaktifkan mode standalone di `next.config.js` atau `next.config.mjs`:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

### Start Script Next.js:
Di dalam `package.json`:
```json
{
  "scripts": {
    "build": "next build",
    "start": "node .next/standalone/server.js"
  }
}
```

### Variabel Lingkungan Frontend di Next.js:
Ingat bahwa variabel dengan prefix `NEXT_PUBLIC_` (seperti `NEXT_PUBLIC_API_URL`) dibakar ke dalam file JavaScript saat perintah `next build` dijalankan. Pastikan variabel ini telah terdaftar di tab **Variables** sebelum build dimulai.

---

## 4. Konfigurasi NestJS

Untuk aplikasi NestJS, pastikan method `listen` di `src/main.ts` menerima host `'0.0.0.0'`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0');
  console.log(`NestJS listening on port ${port}`);
}
bootstrap();
```

---

## 5. Menangani Batas Memori (RAM Tuning)

Jika proses build TypeScript atau eksekusi aplikasi Anda memerlukan memori lebih besar:
Tambahkan environment variable `NODE_OPTIONS`:
```ini
NODE_OPTIONS=--max-old-space-size=2048
```
Nilai di atas memberikan batas alokasi memori heap V8 sebesar 2 GB.
