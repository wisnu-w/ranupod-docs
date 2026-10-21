---
title: Alokasi Sumber Daya & Auto-Scaling
description: Cara mengatur batas CPU, memori RAM, dan replika kontainer untuk menangani lonjakan traffic.
---

RanuPod memberikan kontrol penuh atas besaran komputasi yang diberikan ke masing-masing service di lingkungan Anda.

---

## 1. Pengaturan vCPU & RAM

1. Masuk ke service Anda -> tab **Settings** -> **Compute Resources**.
2. Geser alokasi yang Anda inginkan:
   - **vCPU Share**: Mulai dari 0.25 vCPU hingga 8 vCPU per pod.
   - **RAM Memory**: Mulai dari 256 MB hingga 16 GB per pod.
3. Klik **Apply Changes**. Service Anda akan melakukan rolling update tanpa downtime.

---

## 2. Horizontal Pod Auto-Scaling (Replika)

Untuk aplikasi dengan traffic tinggi yang fluktuatif (misal saat flash sale):
- Anda dapat menyetel **Minimum Pods** (misal 2 replika) dan **Maximum Pods** (misal 10 replika).
- RanuPod secara cerdas memantau metrik utilisasi CPU dan request per detik.
- Saat utilisasi melewati ambang batas 75%, kontainer baru akan diluncurkan secara otomatis dalam hitungan detik.
- Saat traffic reda, kontainer berlebih akan di-scale down untuk menghemat biaya komputasi Anda.
