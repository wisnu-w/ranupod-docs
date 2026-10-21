---
title: Deploy Node.js & Next.js di RanuPod
description: Panduan deployment aplikasi JavaScript/TypeScript berbasis Node.js, Next.js, Express, Remix, dan NestJS.
---

RanuPod secara otomatis mendeteksi aplikasi berbasis Node.js jika terdapat file `package.json` di root direktori repositori Anda.

---

## 1. Persiapan `package.json`

Pastikan file `package.json` Anda memiliki script `start` dan (jika ada) script `build`:

```json
{
  "name": "my-express-api",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

---

## 2. Port Binding

Aplikasi Anda **wajib** mendengarkan traffic pada port yang disediakan oleh variabel lingkungan `PORT` (RanuPod secara otomatis menyuntikkan variabel ini):

```javascript
// index.js (Express example)
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from RanuPod!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
```

> [!TIP]
> Pastikan aplikasi Anda mendengarkan host `'0.0.0.0'` (bukan hanya `'127.0.0.1'`) agar kontainer dapat menerima lalu lintas Ingress.

---

## 3. Catatan Khusus Next.js (Standalone Mode)

Untuk performa build dan ukuran image yang jauh lebih ramping pada aplikasi **Next.js**, aktifkan opsi standalone di `next.config.js`:

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
};
```

RanuPod akan otomatis mendeteksi output standalone dan menjalankan server Next.js Anda secara instan dengan jejak memori yang sangat hemat.
