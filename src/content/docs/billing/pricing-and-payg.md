---
title: Model Biaya, Paket & Pay-As-You-Go
description: Rincian transparansi biaya dalam mata uang Rupiah (IDR), spesifikasi Free Tier, paket bulanan, dan perhitungan matematis Pay-As-You-Go per detik.
---

RanuPod percaya bahwa infrastruktur cloud modern harus memiliki skema harga yang adil, transparan, dan tidak membingungkan pengguna dengan biaya tak terduga (*hidden fees*). 

Semua tagihan dihitung dalam mata uang **Rupiah (IDR)** tanpa risiko fluktuasi kurs mata uang asing.

---

## 1. Paket Gratis Selamanya (Free Tier)

Setiap pengguna baru langsung mendapatkan kuota Free Tier untuk belajar, bereksperimen, dan meluncurkan proyek sampingan (*side project*) tanpa perlu memasukkan kartu kredit:

| Sumber Daya | Kuota Free Tier | Catatan |
|---|---|---|
| **Komputasi vCPU** | **0.5 vCPU** (500 millicores) | Cukup untuk Express, Go, atau FastAPI |
| **Memori RAM** | **512 MB** | Cukup untuk aplikasi web modern |
| **Storage NVMe** | **2 GB NVMe SSD** | Penyimpanan file atau database ringan |
| **Subdomain Publik** | Gratis `*.ranupod.app` | Dilengkapi sertifikat SSL otomatis |
| **Trafik Bandwidth** | **Unlimited (Gratis)** | Tanpa pembatasan kuota gigabyte |
| **RanuObserve Ingest** | **5 GB / bulan** | Retensi log & trace selama 7 hari |
| **Batas Waktu** | **Aktif Selamanya** | Tanpa masa kedaluwarsa 30 hari |

---

## 2. Pilihan Paket Langganan Bulanan

Untuk tim atau aplikasi bisnis dengan beban kerja yang terprediksi setiap harinya:

| Paket | Tarif Bulanan | Alokasi Sumber Daya | Kapasitas Rekomendasi |
|---|---|---|---|
| **NANO** | **Rp 61.875** / bulan | 1 vCPU • 1 GB RAM • 15 GB NVMe | Bot Telegram, webhook, REST API ringan |
| **MICRO** | **Rp 125.250** / bulan | 2 vCPU • 2 GB RAM • 30 GB NVMe | MVP Startup, Laravel/Next.js, database kecil |
| **STARTER**| **Rp 336.000** / bulan | 5.5 vCPU • 5.5 GB RAM • 80 GB NVMe | Tim SaaS, multi-stage staging & production |
| **PRO** | **Rp 683.250** / bulan | 11 vCPU • 11 GB RAM • 170 GB NVMe | E-commerce traffic tinggi, microservices |
| **BUSINESS**| **Rp 1.392.750** / bulan | 22 vCPU • 22 GB RAM • 350 GB NVMe | Workload enterprise mission-critical |

*Semua paket di atas mencakup unlimited bandwidth dan penerbitan SSL gratis.*

---

## 3. Pay-As-You-Go Harian (PAYG)

Jika Anda membutuhkan sumber daya elastis yang hanya menyala saat jam kerja kantor atau ingin fleksibilitas penuh tanpa komitmen bulanan:

- **Perhitungan Presisi Per Detik**: Saldo dompet Anda hanya dipotong saat kontainer berada dalam status `Running`.
- **Rp 0 Saat Dimatikan**: Ketika pod di-stop atau dalam status `superseded` (0 replika), biaya CPU dan RAM langsung menjadi **Rp 0**.

### Tarif Unit Satuan (SKU):
| Komponen | Spesifikasi Unit | Tarif Harian | Rumus Detik |
|---|---|---|---|
| **vCPU** | Per 0.125 vCPU (125 millicores) | Rp 150 / hari | `Rp 150 ÷ 86.400 / detik` |
| **RAM** | Per 128 MB Memory | Rp 200 / hari | `Rp 200 ÷ 86.400 / detik` |
| **Storage NVMe**| Per 1 GB Persistent Volume | Rp 75 / hari | `Rp 75 ÷ 86.400 / detik` |
| **Custom Domain**| Per domain aktif dengan Auto-SSL | Rp 100 / hari | Dihitung per hari kalender |
| **Bandwidth** | Egress & Ingress data transfer | **Rp 0 (GRATIS)** | Tanpa biaya tersembunyi |
| **RanuObserve** | Kuota log di atas 5 GB/bulan | Rp 2.500 / GB | Hanya jika melebihi kuota free |

### Contoh Simulasi Biaya PAYG:
Anda menjalankan service backend dengan **0.5 vCPU** dan **512 MB RAM** selama 10 jam untuk pengujian tim:
- CPU: `(4 × 0.125 vCPU) × Rp 150 × (10 ÷ 24 jam) = Rp 250`
- RAM: `(4 × 128 MB) × Rp 200 × (10 ÷ 24 jam) = Rp 333`
- **Total Biaya Pengujian**: Hanya sekitar **Rp 583**!

---

## 4. Top Up Saldo & Keamanan Pembayaran

1. Buka tab **Billing** di **[RanuPod Console](https://console-dev.ranuoutdoor.id)**.
2. Masukkan nominal top up yang diinginkan (minimal Rp 20.000).
3. Pilih metode pembayaran:
   - **QRIS Instan**: GoPay, OVO, Dana, ShopeePay, LinkAja, BCA Mobile.
   - **Virtual Account (VA)**: BCA, Bank Mandiri, BRI, BNI, Permata Bank.
4. Saldo dompet langsung bertambah secara *real-time* setelah pembayaran terverifikasi.

---

## 5. Ambang Batas Saldo & Masa Tenggang (Grace Period)

RanuPod melindungi aplikasi produksi Anda agar tidak mendadak mati jika saldo Anda habis di tengah malam:
- **Peringatan Saldo Rendah**: Notifikasi otomatis dikirimkan via email saat sisa saldo dompet di bawah estimasi kebutuhan 3 hari.
- **Masa Tenggang 7 Hari (Grace Period)**: Jika saldo mencapai Rp 0, aplikasi produksi Anda **tetap berjalan selama 7 hari** sebelum sistem melakukan hibernasi sementara pada pod. Anda memiliki waktu yang cukup untuk melakukan top up tanpa mengganggu pelanggan Anda.
