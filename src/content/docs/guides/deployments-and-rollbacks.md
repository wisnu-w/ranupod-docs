---
title: Siklus Deployment & Rollback Instan
description: Pahami status siklus rilis, zero-downtime rolling update, dan cara melakukan rollback 1-klik di RanuPod.
---

RanuPod memperlakukan setiap rilis kode sebagai deployment yang dapat diaudit, diisolasi, dan dipulihkan kapan saja. Panduan ini menjelaskan bagaimana siklus hidup deployment berjalan dan bagaimana mekanisme rollback instan melindungi stabilitas aplikasi Anda.

---

## 1. Status Siklus Hidup Deployment

Setiap kali rilis baru dipicu, deployment melewati status-status berikut:

```
[queued] ──> [building] ──> [building_success] ──> [deploying] ──> [live]
   │              │                                     │
   ▼              ▼                                     ▼
[cancelled]    [failed]                              [superseded] (saat versi baru live)
```

| Status | Makna | Penggunaan Sumber Daya |
|---|---|---|
| `queued` | Deployment menunggu antrean worker build yang tersedia. | 0 vCPU / 0 RAM |
| `building` | Worker sedang mengkloning Git, mendeteksi runtime, dan mengompilasi image OCI via BuildKit. | Komputasi Build terisolasi |
| `building_success` | Image kontainer berhasil dibuat dan diunggah ke registry internal. | 0 vCPU / 0 RAM |
| `deploying` | Operator K3s sedang menyiapkan pod baru dan melakukan health check readiness probe. | Alokasi vCPU & RAM aktif |
| `live` | Pod baru lulus uji kesiapan. Ingress Traefik mengarahkan 100% traffic pengguna ke versi ini. | **Aktif melayani traffic** |
| `superseded` | Versi lama yang digantikan oleh versi baru yang lebih mutakhir. | **0 vCPU / 0 RAM** (Replicas: 0) |
| `failed` | Terjadi kesalahan pada proses build kode atau pod gagal lulus uji startup. | 0 vCPU / 0 RAM |
| `cancelled` | Build dibatalkan oleh pengguna sebelum selesai. | 0 vCPU / 0 RAM |

---

## 2. Memahami Status "Superseded"

Banyak pengguna baru bertanya: *"Mengapa riwayat deployment saya memiliki 10 rilis, apakah saya ditagih 10 kali?"*

**Jawabannya: TIDAK.**

Di RanuPod:
- Hanya ada **1 deployment aktif berstatus `live`** per environment pada satu waktu (kecuali Anda menyetel horizontal auto-scaling multi-pod).
- Ketika rilis baru berhasil menjadi `live`, rilis sebelumnya secara otomatis diubah menjadi `superseded`.
- RanuPod menyetel jumlah pod versi lama menjadi **0 replika** (`replicas: 0`).
- Artinya: Deployment berstatus `superseded` **tidak memakan memori RAM maupun siklus CPU**, dan **sama sekali tidak memotong saldo atau kuota komputasi Anda**.
- Mengapa versi lama disimpan? Agar Anda dapat melakukan audit histori commit dan melakukan **Rollback Instan** kapan saja tanpa perlu membangun ulang (*rebuild*) dari awal.

---

## 3. Zero-Downtime Rolling Updates

Ketika Anda memicu deployment baru:
1. Pod versi lama yang sedang berjalan (`live`) **tetap melayani traffic pengunjung**.
2. Pod versi baru diluncurkan secara paralel di latar belakang.
3. RanuPod melakukan pengecekan kesehatan (*Readiness Probe*) pada pod baru:
   - Jika pod baru siap merespons HTTP `200 OK`, Ingress gateway secara mulus mengalihkan aliran traffic ke pod baru.
   - Pod versi lama kemudian menerima sinyal `SIGTERM` (diberi waktu hingga 30 detik untuk menyelesaikan request yang masih menggantung) sebelum dimatikan.
4. Pengunjung website Anda tidak akan pernah mengalami halaman *502 Bad Gateway* atau gangguan koneksi saat Anda merilis fitur baru.

---

## 4. Rollback Instan (Sub-Detik)

Jika rilis terbaru Anda memiliki bug kritis atau masalah performa:

1. Buka service target di **[RanuPod Console](https://console-dev.ranuoutdoor.id)**.
2. Masuk ke tab **Deployments**.
3. Cari deployment sebelumnya yang berstatus stabil (misalnya *Deployment #8* yang dirilis kemarin).
4. Klik tombol **"Rollback"** di sebelah deployment tersebut.
5. Konfirmasi tindakan rollback.

### Mengapa Rollback di RanuPod Sangat Cepat?
Karena image OCI versi lama telah tersimpan di registry kontainer internal, RanuPod **tidak perlu mengkloning ulang Git atau mengompilasi kode dari nol**. 

Operator langsung memutar pod dari image lama yang sudah teruji dalam hitungan **kurang dari 3 detik**, mengembalikan layanan ke kondisi stabil secara instan!
