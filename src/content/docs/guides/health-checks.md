---
title: Health Checks & Graceful Shutdown
description: Konfigurasi probe kesiapan aplikasi dan penanganan sinyal SIGTERM agar rilis berjalan mulus tanpa koneksi terputus.
---

Agar sistem orkestrasi K3s RanuPod dapat mengetahui kapan aplikasi Anda siap menerima traffic dan kapan aplikasi harus di-restart jika mengalami hang/deadlock, RanuPod menggunakan mekanisme **Health Checks** dan **Graceful Shutdown**.

---

## 1. Jenis Health Probe di RanuPod

RanuPod mengonfigurasi dua jenis probe kesehatan pada setiap kontainer:

### A. Readiness Probe (Uji Kesiapan)
- Menentukan apakah kontainer sudah siap menerima lalu lintas HTTP publik dari Ingress gateway.
- Selama probe ini belum mengembalikan status sukses (HTTP 200–399), pod tidak akan dimasukkan ke dalam daftar routing Ingress.
- **Nilai Bawaan**: Endpoint HTTP `GET /healthz` atau `GET /` dengan interval polling 5 detik.

### B. Liveness Probe (Uji Kehidupan)
- Menentukan apakah aplikasi di dalam kontainer masih hidup atau mengalami crash/infinite-loop.
- Jika probe ini gagal sebanyak 3 kali berturut-turut, RanuPod akan secara otomatis me-restart kontainer untuk memulihkan layanan.

---

## 2. Mengonfigurasi Endpoint Health Check

Buatlah route ringan di aplikasi Anda yang tidak melakukan query berat atau operasi I/O yang membebani database:

### Contoh Express.js / Node.js:
```javascript
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});
```

### Contoh Go (Chi / net/http):
```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"status":"ok"}`))
})
```

### Contoh FastAPI (Python):
```python
@app.get("/healthz")
def healthz():
    return {"status": "ok"}
```

---

## 3. Menangani Graceful Shutdown (`SIGTERM`)

Ketika deployment baru diluncurkan atau pod lama akan dihentikan, RanuPod mengirimkan sinyal sistem operasi **`SIGTERM`** ke proses aplikasi Anda. 

Aplikasi memiliki batas toleransi (*Termination Grace Period*) selama **30 detik** untuk:
1. Berhenti menerima request HTTP baru.
2. Menyelesaikan request atau transaksi database yang sedang diproses.
3. Menutup koneksi database pool dan Redis secara tertib.
4. Keluar (*exit*) dengan kode status `0`.

Jika aplikasi tidak keluar setelah 30 detik, sinyal paksa `SIGKILL` akan dikirimkan.

### Contoh Penanganan `SIGTERM` di Node.js:
```javascript
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });
});
```

### Contoh Penanganan `SIGTERM` di Go:
```go
quit := make(chan os.Signal, 1)
signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
<-quit

log.Println("Shutting down server...")

ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

if err := server.Shutdown(ctx); err != nil {
    log.Fatalf("Server forced to shutdown: %v", err)
}
log.Println("Server exiting properly")
```
