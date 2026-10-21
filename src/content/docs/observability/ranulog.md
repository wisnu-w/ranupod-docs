---
title: RanuLog - Live Streaming Log Aplikasi
description: Cara membaca log real-time, menyaring pesan error, dan melakukan audit sistem menggunakan RanuLog.
---

**RanuLog** mengumpulkan seluruh output `stdout` dan `stderr` dari kontainer Anda secara real-time langsung ke browser tanpa perlu agen log terpisah.

---

## 1. Membaca Log di Console

1. Buka service target di **RanuPod Console**.
2. Klik tab **Logs**.
3. Log akan mengalir (stream) secara instan saat permintaan masuk ke aplikasi Anda.

---

## 2. Fitur Pencarian & Filter Cepat

RanuLog mendukung pencarian full-text dan penyaringan berbasis query:

- **Filter berdasarkan Level**:
  - `level:error`: Hanya menampilkan log error atau panic.
  - `level:warn`: Menampilkan peringatan deprecation atau retry.
  - `level:info`: Aliran operasi normal.
- **Pencarian Regex**: Ketikkan kata kunci (misal `payment_failed` atau `order_id:1284`) untuk melompat langsung ke baris log yang bermasalah.

---

## 3. Streaming Log via CLI

Anda juga dapat membaca log secara langsung dari terminal lokal Anda menggunakan Ranu CLI:

```bash
ranu logs --service api-backend --follow
```
Gunakan filter untuk mencari kata kunci tertentu:
```bash
ranu logs --service api-backend | grep "ERROR"
```
