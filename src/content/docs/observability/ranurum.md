---
title: RanuRUM - Real User Monitoring & Web Vitals
description: Pantau skor Core Web Vitals (LCP, INP, CLS), performa frontend, dan error browser langsung dari pengunjung website Anda dengan RanuRUM.
---

Banyak aplikasi memiliki respon API server yang cepat (sub-50ms), namun pengunjung tetap merasakan website lambat karena ukuran file JavaScript yang bengkak, render blocking CSS, atau gambar yang tidak dioptimasi.

**RanuRUM** (Real User Monitoring) mengukur pengalaman pengguna nyata langsung dari browser pengunjung (desktop, tablet, maupun smartphone).

---

## 1. Metrik Google Core Web Vitals yang Dipantau

RanuRUM memantau metrik standar industri yang digunakan oleh Google Search Engine untuk meranking website:

| Metrik | Nama Lengkap | Nilai Ideal (Baik) | Yang Diukur |
|---|---|---|---|
| **LCP** | *Largest Contentful Paint* | **< 2.5 Detik** | Waktu yang dibutuhkan hingga konten visual utama (banner/hero image/teks) selesai dirender di layar. |
| **INP** | *Interaction to Next Paint* | **< 200 Milidetik** | Responsivitas halaman saat pengguna mengklik tombol, membuka menu, atau mengetik di formulir. |
| **CLS** | *Cumulative Layout Shift* | **< 0.1** | Seberapa banyak elemen layout melompat atau bergeser secara tiba-tiba saat aset sedang dimuat. |
| **TTFB**| *Time to First Byte* | **< 800 Milidetik** | Waktu yang dibutuhkan browser menerima byte data pertama dari server web. |
| **JS Crash Rate** | *JavaScript Error Rate* | **< 0.1%** | Persentase sesi pengunjung yang mengalami unhandled exception atau script error di konsol browser. |

---

## 2. Cara Memasang RanuRUM di Website Anda

### A. Tag Script HTML Standar
Salin kode berikut ke dalam tag `<head>` file HTML website Anda:

```html
<script
  src="https://rum.ranupod.app/v1/ranurum.js"
  data-app-id="YOUR_PROJECT_ID"
  data-service="frontend-web"
  defer>
</script>
```

---

### B. Implementasi di Next.js (App Router)
Di file `app/layout.tsx`:

```tsx
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <Script
          src="https://rum.ranupod.app/v1/ranurum.js"
          data-app-id={process.env.NEXT_PUBLIC_RANUPOD_PROJECT_ID}
          data-service="frontend-web"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### C. Implementasi di SvelteKit
Di file `src/app.html`:

```html
<!doctype html>
<html lang="id">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
		<script
			src="https://rum.ranupod.app/v1/ranurum.js"
			data-app-id="%PUBLIC_RANUPOD_PROJECT_ID%"
			data-service="frontend-web"
			defer
		></script>
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

---

## 3. Privasi & Kepatuhan Regulasi (Privacy-First)

RanuRUM dirancang dengan prinsip privasi tanpa kompromi:
- **Tanpa Cookie**: RanuRUM tidak menyimpan cookies atau melacak pengguna lintas website (*no cross-site tracking*).
- **IP Teranonimisasi**: Alamat IP pengunjung dianonimisasi secara otomatis di tingkat gateway sehingga mematuhi regulasi UU Perlindungan Data Pribadi (UU PDP) Indonesia dan GDPR.
- **Ukuran Skrip Ringan**: Skrip `ranurum.js` hanya berukuran **< 2 KB** (gzipped) dan dieksekusi secara asinkron tanpa memperlambat loading halaman utama.
