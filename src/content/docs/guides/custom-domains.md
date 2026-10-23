---
title: Custom Domain & Auto-SSL Let's Encrypt
description: Panduan menghubungkan domain kustom Anda sendiri ke aplikasi RanuPod dengan sertifikat HTTPS otomatis dan konfigurasi DNS yang benar.
---

Setiap service yang dideploy di RanuPod otomatis mendapatkan subdomain HTTPS gratis:
```text
https://<service-name>-<id>.ranupod.app
```
Anda dapat dengan mudah menghubungkan nama domain kustom Anda sendiri (seperti `api.tokosaya.com` atau `tokosaya.com`) dengan penerbitan sertifikat SSL Let's Encrypt otomatis tanpa biaya tambahan.

---

## 1. Menambahkan Domain di RanuPod Console

1. Buka service target Anda di **[RanuPod Console](https://console-dev.ranuoutdoor.id)**.
2. Masuk ke tab **Settings** -> bagian **Domains**.
3. Ketikkan nama domain atau subdomain Anda:
   - Contoh Subdomain: `api.tokosaya.com` atau `app.bisnisanda.id`
   - Contoh Apex / Root: `tokosaya.com`
4. Klik **Add Domain**.
5. RanuPod akan mencatat domain dan menampilkan petunjuk DNS Record yang harus dipasang di penyedia DNS Anda.

---

## 2. Pengaturan DNS Record di Penyedia Domain

Buka panel DNS tempat Anda membeli atau mengelola domain (misalnya Cloudflare, Niagahoster, DomaiNesia, IDCloudHost, Namecheap, atau AWS Route53).

### Skenario A: Untuk Subdomain (Contoh: `api.tokosaya.com`)
Tambahkan record **CNAME**:

| Tipe | Nama / Host | Target / Nilai | TTL |
|---|---|---|---|
| `CNAME` | `api` | Target yang tertera di Console (misal `cname.ranupod.app` atau `<service>.ranupod.app`) | Auto / 300 |

---

### Skenario B: Untuk Root / Apex Domain (Contoh: `tokosaya.com`)
Spesifikasi DNS asli tidak memperbolehkan record CNAME pada root domain (apex). Untuk mengatasinya, gunakan salah satu opsi berikut:

#### Opsi 1: Menggunakan CNAME Flattening / ALIAS / ANAME (Direkomendasikan)
Penyedia DNS modern seperti Cloudflare, DNSimple, dan Route53 mendukung CNAME flattening pada root domain:
- **Tipe**: `CNAME` atau `ALIAS`
- **Nama / Host**: `@` (atau tinggalkan kosong)
- **Target / Nilai**: Target CNAME RanuPod

#### Opsi 2: Menggunakan Record A
Jika penyedia DNS Anda tidak mendukung CNAME flattening:
- **Tipe**: `A`
- **Nama / Host**: `@`
- **Nilai**: Alamat IP Ingress VIP publik cluster RanuPod yang tertera di halaman instruksi Console.

---

## 3. Catatan Khusus Pengguna Cloudflare

Jika domain Anda menggunakan nameserver Cloudflare:

1. **Saat Pemasangan Pertama**:
   - Set status proxy menjadi **"DNS Only" (Ikon Awan Abu-abu / Gray Cloud)** selama 5 menit.
   - Hal ini memungkinkan Ingress Traefik RanuPod menyelesaikan verifikasi HTTP-01 ACME Challenge dari Let's Encrypt secara langsung.
2. **Setelah SSL Terbit**:
   - Anda dapat mengaktifkan kembali Proxy Cloudflare (**Orange Cloud**) jika menginginkan proteksi DDoS Cloudflare.
   - **PENTING**: Pada tab **SSL/TLS** di Cloudflare, pastikan mode enkripsi diatur ke **"Full"** atau **"Full (Strict)"** agar tidak terjadi loop redirect (*ERR_TOO_MANY_REDIRECTS*).

---

## 4. Penerbitan & Pembaruan Sertifikat SSL Otomatis

- **Penerbitan Instan**: Setelah record DNS terdeteksi (biasanya 1–5 menit), RanuPod akan otomatis meminta sertifikat TLS resmi dari **Let's Encrypt**.
- **Otomatis Diperbarui (Auto-Renewal)**: Sertifikat TLS berlaku selama 90 hari dan diperbarui secara otomatis di latar belakang oleh sistem RanuPod 30 hari sebelum masa berlaku habis. Anda tidak perlu melakukan konfigurasi manual apapun selamanya!

---

## 5. Menguji Status Domain

Untuk memeriksa apakah DNS Anda telah terpasang dengan benar di terminal lokal:

```bash
# Periksa propagasi CNAME
dig CNAME api.tokosaya.com +short

# Periksa status sertifikat SSL HTTPS
curl -Iv https://api.tokosaya.com
```
Jika respon mengembalikan status HTTP dari aplikasi Anda dengan handshake TLS yang valid, domain Anda telah sukses terhubung!
