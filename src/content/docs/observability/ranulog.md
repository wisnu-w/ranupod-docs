---
title: RanuLog - Live Streaming Log Aplikasi
description: Pantau output stdout/stderr real-time, cari pesan error, dan lakukan audit sistem dengan RanuLog berbasis OpenObserve.
---

**RanuLog** adalah sistem pengumpulan dan pencarian log bawaan di RanuPod. Tanpa perlu menginstal daemon pihak ketiga (seperti Fluentbit, Logstash, atau agen Datadog), seluruh output `stdout` dan `stderr` dari kontainer Anda langsung ditangkap, diindeks, dan dapat dicari secara instan.

---

## 1. Membaca Log di Console Dashboard

1. Buka service target Anda di **[RanuPod Console](https://console-dev.ranuoutdoor.id)**.
2. Masuk ke tab **Logs**.
3. Log aplikasi Anda akan mengalir (*stream*) secara real-time melalui koneksi WebSocket.
4. Anda dapat menjeda streaming (*Pause*), membersihkan layar (*Clear*), atau mengunduh log ke file `.log`.

---

## 2. Sintaks Pencarian & Filter Cepat

RanuLog didukung oleh mesin pengindeksan berkecepatan tinggi **OpenObserve**:

### A. Filter Berdasarkan Tingkat Keparahan (Level)
Jika aplikasi Anda mencetak log dalam format JSON terstruktur (`{"level":"error", "msg":"..."}`):
- `level:error`: Hanya menampilkan log error kritis dan panic.
- `level:warn`: Menampilkan peringatan degradasi sistem atau deprecated warning.
- `level:info`: Aliran operasi transaksi reguler.

### B. Pencarian Teks Bebas & Keyword
Ketikkan kata kunci spesifik di kolom pencarian:
```text
payment_failed
```
```text
user_id:9482
```
```text
"connection refused"
```

### C. Filter Berdasarkan Replikasi Pod
Jika Anda mengaktifkan auto-scaling dan memiliki 4 pod yang berjalan, Anda dapat memilih pod spesifik dari menu dropdown untuk mengisolasi masalah pada pod tertentu.

---

## 3. Streaming Log via Ranu CLI

Anda dapat memantau log aplikasi langsung dari terminal lokal Anda seperti menggunakan `tail -f`:

### Mengalirkan Log Real-Time:
```bash
ranu logs --service api-backend --follow
```

### Memfilter Berdasarkan Baris Terakhir (Tail):
```bash
# Tampilkan 100 baris log terakhir
ranu logs --service api-backend --tail 100
```

### Menggabungkan dengan Unix Pipeline:
```bash
# Cari pesan error dan format dengan jq
ranu logs --service api-backend | grep "ERROR"
```

---

## 4. Retensi & Kuota Log

- **Retensi Bawaan**: Log disimpan selama **30 hari** penuh untuk keperluan audit dan investigasi pasca-insiden.
- **Kuota Gratis**: Setiap akun mendapatkan kuota ingest log sebesar **5 GB per bulan** tanpa biaya.
- **Format yang Direkomendasikan**: Sangat disarankan agar aplikasi Anda mencetak log dalam format **JSON Single-Line** (seperti menggunakan library `zerolog` / `zap` di Go, `pino` / `winston` di Node.js, atau `structlog` di Python) agar seluruh atribut metadata otomatis menjadi kolom yang dapat difilter.
