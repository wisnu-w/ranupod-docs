---
title: Custom Domain & Auto-SSL
description: Cara menghubungkan domain Anda sendiri ke aplikasi RanuPod dengan sertifikat HTTPS otomatis.
---

Setiap service di RanuPod otomatis mendapatkan domain bawaan `https://<service>-<id>.ranupod.app`. Anda dapat menambahkan nama domain kustom Anda sendiri (misalnya `api.domainanda.com` atau `app.domainanda.id`).

---

## 1. Menambahkan Domain di RanuPod Console

1. Buka service target Anda di dashboard RanuPod.
2. Masuk ke tab **Settings** -> bagian **Domains**.
3. Ketikkan nama domain atau subdomain Anda (misalnya `app.mysaas.com`).
4. Klik **Add Domain**.
5. RanuPod akan menampilkan petunjuk DNS record yang harus Anda pasang.

---

## 2. Mengatur DNS Record

Buka panel kontrol DNS domain Anda (misalnya Cloudflare, Niagahoster, DomaiNesia, Route53):

### Untuk Subdomain (misal `app.mysaas.com`):
Tambahkan record **CNAME**:
- **Type**: `CNAME`
- **Name / Host**: `app`
- **Target / Value**: `<service>-<id>.ranupod.app`
- **Proxy Status**: DNS Only (jika menggunakan Cloudflare)

### Untuk Apex / Root Domain (misal `mysaas.com`):
Gunakan record **ALIAS** atau **ANAME** (atau CNAME flattening) yang mengarah ke target RanuPod.

---

## 3. Penerbitan Sertifikat SSL Let's Encrypt Otomatis

Setelah DNS record terpropagasi:
- Ingress gateway RanuPod akan otomatis mendeteksi koneksi.
- Menerbitkan sertifikat TLS/HTTPS resmi via **Let's Encrypt** dalam 1-2 menit.
- Memperpanjang (auto-renew) sertifikat secara berkala tanpa memerlukan tindakan manual dari Anda.
