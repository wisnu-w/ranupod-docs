---
title: Menggunakan Custom Dockerfile di RanuPod
description: Panduan deployment menggunakan Dockerfile kustom saat Anda membutuhkan setup runtime khusus.
---

Meskipun RanuPod dapat membangun aplikasi secara otomatis tanpa Dockerfile, Anda tetap memiliki kontrol penuh jika ingin menyertakan `Dockerfile` Anda sendiri.

---

## 1. Kapan Harus Menggunakan Dockerfile?

Gunakan Dockerfile jika aplikasi Anda:
- Memerlukan paket sistem level OS khusus (misalnya `ffmpeg`, `poppler-utils`, `tesseract-ocr`).
- Memerlukan build multi-stage kompleks.
- Menjalankan binary yang sudah dikompilasi sebelumnya.

---

## 2. Praktik Terbaik Menulis Dockerfile

Berikut adalah contoh template Dockerfile minimalis multi-stage:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# RanuPod secara dinamis menyuntikkan $PORT
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## 3. Menghubungkan ke RanuPod

1. Letakkan file bernama `Dockerfile` di root direktori repositori Anda.
2. Saat deployment dipicu, RanuPod akan memprioritaskan Dockerfile Anda dibanding deteksi otomatis.
3. BuildKit remote daemon akan mengeksekusi tahapan build dengan caching layer maksimal.
