---
title: RanuRUM - Real User Monitoring & Web Vitals
description: Pantau skor Core Web Vitals (LCP, INP, CLS) dan sesi pengguna frontend secara real-time.
---

**RanuRUM** (Real User Monitoring) mengukur performa aplikasi Anda langsung dari browser pengunjung nyata (desktop & mobile).

---

## 1. Metrik yang Dipantau

RanuRUM melacak metrik standar Google Core Web Vitals:

- **Largest Contentful Paint (LCP)**: Kecepatan rendering elemen konten utama (target: &lt; 2.5s).
- **Interaction to Next Paint (INP)**: Kecepatan respon halaman saat pengguna mengklik tombol atau formulir (target: &lt; 200ms).
- **Cumulative Layout Shift (CLS)**: Pergeseran visual tak terduga saat aset sedang dimuat (target: &lt; 0.1).
- **Crash & Error Rate**: Persentase sesi bebas error JavaScript di sisi browser.

---

## 2. Cara Memasang RanuRUM di Website Anda

Cukup salin script snippet berikut ke dalam tag `<head>` file HTML atau template framework frontend Anda:

```html
<script
  src="https://rum.ranupod.app/v1/ranurum.js"
  data-app-id="YOUR_PROJECT_ID"
  data-service="frontend"
  defer>
</script>
```

Data telemetri akan langsung terindeks di tab **RanuRUM** pada dashboard proyek Anda.
