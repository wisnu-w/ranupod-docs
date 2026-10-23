---
title: RanuTrace - Distributed Latency & Spans
description: Diagnosa bottleneck performa database, external API call, dan alur request microservices dengan RanuTrace berbasis OpenTelemetry.
---

**RanuTrace** adalah alat Application Performance Monitoring (APM) bawaan di RanuPod. RanuTrace memvisualisasikan setiap permintaan HTTP yang masuk dalam bentuk grafik air terjun (*waterfall flamegraph*), memperlihatkan setiap milidetik yang dihabiskan oleh aplikasi saat memanggil database, memverifikasi token auth, atau memanggil API pihak ketiga.

---

## 1. Bagaimana RanuTrace Bekerja?

Gateway Ingress RanuPod secara otomatis menyuntikkan header standar W3C **`traceparent`** pada setiap request HTTP masuk. 

Ketika request tersebut diteruskan ke service backend Anda, SDK RanuTrace menangkap span waktu dan mengirimkannya ke engine telemetri OpenObserve.

### Visualisasi Waterfall Request:
```text
POST /api/v1/orders/checkout [200 OK] (142ms)
├── gateway.inbound (traefik-proxy)           [142ms] ====================
├── auth.jwt_verify (logto-jwks)              [14ms]  ==
├── postgres.query (SELECT * FROM carts)      [32ms]  ====
├── payment.gateway_charge (external Midtrans)[78ms]  ==========
└── redis.cache_invalidate (pod-session)      [8ms]   =
```
Dari grafik di atas, Anda dapat langsung melihat bahwa 78ms (lebih dari 50% waktu pemrosesan) dihabiskan untuk menunggu respon gateway pembayaran eksternal.

---

## 2. Pemasangan SDK di Kode Aplikasi

### A. Node.js & TypeScript
Pasang library instrumentasi RanuTrace:
```bash
npm install ranutrace-node
```

Inisialisasi di baris pertama file entrypoint Anda (`index.ts` atau `server.js`):
```javascript
// server.ts
import { initRanuTrace } from 'ranutrace-node';

// Panggil sebelum import modul database atau express apapun
const shutdownTrace = initRanuTrace({
  serviceName: 'order-api',
});

import express from 'express';
const app = express();
// ... route aplikasi Anda
```

---

### B. Go (Golang)
Gunakan package resmi Go:
```bash
go get github.com/wisnu-w/ranu-project/ranutrace-go
```

Inisialisasi di dalam `main.go`:
```go
package main

import (
	"context"
	"net/http"
	"github.com/wisnu-w/ranu-project/ranutrace-go"
)

func main() {
	// Inisialisasi tracer dengan nama service
	shutdown := ranutrace.InitTracer("order-api")
	defer shutdown(context.Background())

	mux := http.NewServeMux()
	mux.HandleFunc("/api/orders", func(w http.ResponseWriter, r *http.Request) {
		// Buat sub-span manual jika diperlukan
		ctx, span := ranutrace.StartSpan(r.Context(), "process_order")
		defer span.End()

		// Lakukan query database dengan context
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"created"}`))
	})

	http.ListenAndServe(":8080", ranutrace.HTTPMiddleware(mux))
}
```

---

### C. Python (FastAPI / Django)
Gunakan OpenTelemetry Python standard:
```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp
```
```python
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from fastapi import FastAPI

app = FastAPI()

# Otomatis merekam seluruh route dan durasi respons
FastAPIInstrumentor.instrument_app(app)
```

---

## 3. Fitur Analisis di Dashboard

Di tab **RanuTrace** pada console Anda:
1. **P95 & P99 Latency Metrics**: Lihat latensi rata-rata versus latensi 5% pengguna paling lambat.
2. **Slow Query Detector**: Temukan query SQL yang membutuhkan waktu eksekusi lebih dari 100ms.
3. **Error Traces**: Filter trace yang mengembalikan HTTP status 5xx untuk melihat di fungsi mana error terjadi.
