---
title: RanuTrace - Distributed Latency & Spans
description: Diagnosa bottleneck performa database, external API call, dan alur request microservices dengan RanuTrace.
---

**RanuTrace** menyajikan grafik waterfall (flamegraph) dari setiap permintaan HTTP yang masuk, memecahnya menjadi span-span kecil sehingga Anda tahu persis fungsi mana yang lambat.

---

## 1. Bagaimana RanuTrace Bekerja?

Gateway Ingress RanuPod secara otomatis menyuntikkan header W3C `traceparent` pada setiap request masuk. Header ini diteruskan ke service-service internal Anda.

Contoh visualisasi waterfall:
```text
POST /api/v1/orders/checkout [200 OK] (142ms)
├── gateway.inbound (traefik-proxy)           [142ms] ====================
├── auth.jwt_verify (logto-jwks)              [14ms]  ==
├── postgres.query (SELECT * FROM carts)      [32ms]  ====
├── payment.gateway_charge (external)         [78ms]  ==========
└── redis.cache_invalidate (pod-session)      [8ms]   =
```

---

## 2. Mengaktifkan RanuTrace di Aplikasi

Untuk mendapatkan rincian span hingga ke tingkat query database (SQL) dan HTTP client, pasang SDK OpenTelemetry atau package resmi:

### Contoh Node.js (`ranutrace-node`):
```bash
npm install ranutrace-node
```
```javascript
import { initRanuTrace } from 'ranutrace-node';
initRanuTrace({ serviceName: 'order-api' });
```

### Contoh Go (`ranutrace-go`):
```bash
go get github.com/wisnu-w/ranu-project/ranutrace-go
```
```go
package main

import "github.com/wisnu-w/ranu-project/ranutrace-go"

func main() {
    shutdown := ranutrace.InitTracer("order-api")
    defer shutdown()
    // ...
}
```
Trace akan otomatis terkirim ke engine observabilitas tanpa konfigurasi host tambahan.
