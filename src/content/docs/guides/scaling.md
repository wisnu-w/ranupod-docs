---
title: Alokasi Sumber Daya & Auto-Scaling
description: Panduan mengatur batas CPU, memori RAM, dan Horizontal Pod Auto-Scaling (HPA) untuk menangani lonjakan traffic di RanuPod.
---

RanuPod memberikan fleksibilitas penuh untuk menyesuaikan kapasitas komputasi aplikasi Anda, mulai dari prototipe hemat daya hingga sistem skala besar dengan puluhan replika kontainer.

---

## 1. Zero Cold-Starts: Komputasi Always-On

Berbeda dengan platform serverless tradisional (seperti AWS Lambda atau Vercel Serverless Functions) yang mengalami *cold-start* (jeda waktu 2–5 detik saat pod terbangun dari kondisi mati), seluruh kontainer di RanuPod beroperasi secara **Always-On**:
- Pod Anda selalu menyala di memori server.
- Respon permintaan HTTP pertama selalu instan (latensi sub-milidetik).
- Cocok untuk koneksi persistent seperti WebSockets, MQTT, gRPC, dan worker antrean yang terus mendengarkan job.

---

## 2. Alokasi Vertikal (vCPU & RAM Sizing)

Anda dapat mengubah ukuran sumber daya CPU dan RAM pod Anda kapan saja:

1. Buka service target di **[RanuPod Console](https://console-dev.ranuoutdoor.id)**.
2. Masuk ke tab **Settings** -> **Compute Resources**.
3. Sesuaikan alokasi menggunakan slider atau dropdown:
   - **vCPU Share**: Mulai dari `0.125 vCPU` (125 millicores) hingga `8.0 vCPU`.
   - **Memory (RAM)**: Mulai dari `128 MB` hingga `16 GB`.
4. Klik **Apply Changes**. Service akan melakukan rolling redeploy secara mulus tanpa downtime untuk menerapkan limit cgroups baru.

### Panduan Memilih Ukuran:
- **0.25 vCPU & 256 MB RAM**: Sangat hemat untuk bot Telegram/Discord, static web server, atau microservice webhook ringan.
- **0.5 vCPU & 512 MB RAM**: Standar untuk aplikasi Node.js Express, Go API, atau Python FastAPI.
- **1.0 vCPU & 1 GB RAM**: Standar untuk backend dengan framework full-stack (Next.js, Remix, Laravel) atau database PostgreSQL skala kecil.
- **2.0+ vCPU & 4+ GB RAM**: Ideal untuk komputasi berat, pemrosesan citra/video, atau database traffic tinggi.

---

## 3. Horizontal Pod Auto-Scaling (HPA)

Untuk menangani lonjakan traffic yang tidak terduga (misalnya saat peluncuran produk atau kampanye flash sale), Anda dapat mengaktifkan **Horizontal Auto-Scaling**:

### Langkah Konfigurasi:
1. Di tab **Compute Resources**, aktifkan tombol toggle **"Auto-Scaling (HPA)"**.
2. Tentukan parameter:
   - **Min Replicas**: Jumlah pod minimal yang selalu aktif saat traffic normal (misal: `2`).
   - **Max Replicas**: Batas pod maksimal yang boleh dibuat saat lonjakan traffic (misal: `10`).
   - **Target CPU Utilization**: Ambang batas utilisasi CPU untuk memicu scaling (default: `75%`).

### Cara Kerja Auto-Scaler:
- **Scale-Up Cepat**: Saat rata-rata CPU seluruh pod melampaui 75%, operator K3s meluncurkan replika baru dalam hitungan 5–10 detik. Ingress Traefik langsung membagi beban traffic (*load balancing*) secara merata ke seluruh pod aktif.
- **Scale-Down Stabil (Anti-Flapping)**: Saat traffic kembali normal, RanuPod menerapkan masa stabilisasi (*cooldown period*) selama 5 menit sebelum mematikan pod cadangan secara bertahap untuk mencegah lonjakan berulang.

---

## 4. Pengaruh Scaling Terhadap Penagihan (Billing)

- **Paket Bulanan**: Berjalan sesuai batas kuota paket yang Anda beli.
- **Pay-As-You-Go**: Penagihan dihitung secara dinamis per detik berdasarkan jumlah pod yang sedang berstatus `Running`. Saat sistem melakukan scale-down dari 5 pod ke 2 pod, tagihan Anda otomatis langsung turun ke tarif 2 pod!
