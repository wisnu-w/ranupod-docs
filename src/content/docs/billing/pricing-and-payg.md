---
title: Model Paket & Pay-As-You-Go
description: Panduan transparansi biaya dalam Rupiah, paket langganan bulanan, dan tarif Pay-As-You-Go harian.
---

RanuPod mengadopsi model penagihan fleksibel dan transparan dalam mata uang Rupiah (IDR).

---

## 1. Paket Langganan Bulanan

Pilihan paket terpadu untuk kebutuhan yang terprediksi:

| Paket | Tarif | Kuota Resource | Cocok Untuk |
|---|---|---|---|
| **Free Tier** | **Rp 0** / selamanya | 0.5 vCPU • 512 MB RAM • 2 GB SSD | Eksplorasi, belajar, & hobby |
| **NANO** | **Rp 61.875** / bulan | 1 vCPU • 1 GB RAM • 15 GB SSD | Side project, bot, & API kecil |
| **MICRO** | **Rp 125.250** / bulan | 2 vCPU • 2 GB RAM • 30 GB SSD | MVP, REST API, & database aktif |
| **STARTER** | **Rp 336.000** / bulan | 5.5 vCPU • 5.5 GB RAM • 80 GB SSD | Tim SaaS & staging staging environment |
| **PRO** | **Rp 683.250** / bulan | 11 vCPU • 11 GB RAM • 170 GB SSD | Database traffic tinggi & microservices |
| **BUSINESS**| **Rp 1.392.750** / bulan | 22 vCPU • 22 GB RAM • 350 GB SSD | Workload skala enterprise mission-critical |

---

## 2. Pay-As-You-Go Harian (PAYG)

Jika Anda tidak ingin terikat paket bulanan atau membutuhkan sumber daya elastis yang hanya menyala beberapa jam sehari:
- Komputasi dihitung **per detik presisi**.
- Saldo dompet hanya terpotong saat kontainer berjalan (`status: Running`).
- Saat service dimatikan (idle/stop), biaya CPU dan RAM menjadi **Rp 0**.

### Tarif Unit Satuan (SKU):
- **CPU**: Rp 150 / hari (per 0.125 vCPU)
- **RAM**: Rp 200 / hari (per 128 MB RAM)
- **Storage**: Rp 75 / hari (per 1 GB SSD NVMe)
- **Custom Domain**: Rp 100 / hari (per domain Auto-SSL)
- **Bandwidth**: **Gratis** (Unmetered ingress & egress)
- **Observabilitas**: Gratis 5 GB/bulan (Overage Rp 2.500/GB)

---

## 3. Top Up Saldo & Metode Pembayaran

Top up saldo dompet RanuPod dapat dilakukan instan melalui QRIS, Virtual Account (BCA, Mandiri, BRI, BNI), dan Transfer Bank di tab **Billing** console Anda.
