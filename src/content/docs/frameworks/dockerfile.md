---
title: Menggunakan Custom Dockerfile di RanuPod
description: Panduan deployment menggunakan Dockerfile kustom dengan praktik terbaik multi-stage, security non-root, dan BuildKit caching di RanuPod.
---

Meskipun RanuPod dapat membangun sebagian besar aplikasi secara otomatis tanpa Dockerfile, Anda tetap memiliki kebebasan penuh jika repositori Anda menyertakan file `Dockerfile`.

Jika terdapat file bernama `Dockerfile` di root direktori repositori Anda, RanuPod akan memprioritaskan Dockerfile tersebut untuk proses build via daemon BuildKit internal.

---

## 1. Kapan Sebaiknya Menggunakan Custom Dockerfile?

Gunakan Dockerfile jika aplikasi Anda:
- Memerlukan paket sistem level operasi khusus (misal: `ffmpeg`, `tesseract-ocr`, `poppler-utils`, `libvips`).
- Memerlukan build multi-bahasa (misal: backend Go yang mem-bundle frontend React statis).
- Memerlukan kontrol biner tingkat lanjut atau kernel capability tertentu.

---

## 2. Praktik Terbaik: Multi-Stage Build

Multi-stage build memisahkan lingkungan kompilasi dari image kontainer akhir yang dikirim ke pod produksi. Ini mengurangi ukuran image hingga 90% dan membuang compiler tools dari kontainer produksi untuk mempersempit celah serangan (*attack surface*).

### Contoh Multi-Stage Node.js:
```dockerfile
# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 2: Minimal Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Jalankan sebagai user non-root
USER node

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package*.json ./

# RanuPod menyuntikkan variabel PORT secara dinamis
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

### Contoh Multi-Stage Go (Ultra-Kecil ~15 MB):
```dockerfile
# Stage 1: Compiler
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o server ./cmd/api

# Stage 2: Distroless Scratch
FROM gcr.io/distroless/static-debian12:nonroot
WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
ENTRYPOINT ["/app/server"]
```

---

## 3. Wajib Buat File `.dockerignore`

Pastikan Anda menambahkan file `.dockerignore` di samping Dockerfile untuk mencegah pengiriman file yang tidak perlu ke daemon build:

```text
.git
.github
node_modules
dist
.env
.env.*
*.log
.DS_Store
```

Mengabaikan `node_modules` dan `.git` dapat mempercepat proses transfer konteks build dari menit menjadi hitungan detik!

---

## 4. Kecepatan Build dengan BuildKit Caching

Worker RanuPod menggunakan **BuildKit** canggih. Anda dapat memanfaatkan cache mount untuk dependensi package agar tidak perlu mengunduh ulang setiap build:

```dockerfile
# Cache direktori npm cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci
```
```dockerfile
# Cache modul Go download
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
```
Build berikutnya pada baris dependensi akan dieksekusi secara instan dari cache!
