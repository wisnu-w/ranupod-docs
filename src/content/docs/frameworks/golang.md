---
title: Deploy Aplikasi Go (Golang) di RanuPod
description: Panduan deployment backend berkinerja tinggi berbasis Go menggunakan Chi, Gin, Fiber, atau net/http standar di RanuPod.
---

RanuPod mengenali proyek Go secara instan saat menemukan file `go.mod` di repositori Anda. Go adalah salah satu runtime paling hemat sumber daya dan tercepat di RanuPod.

---

## 1. Persiapan `go.mod`

Pastikan seluruh dependensi telah di-update dan bersih sebelum melakukan push ke GitHub:

```bash
go mod tidy
go mod verify
```

Versi Go yang digunakan akan disesuaikan secara otomatis dengan direktif `go` di file `go.mod` Anda (misalnya `go 1.22` atau `go 1.23`).

---

## 2. Menghormati Variabel Lingkungan `PORT`

Aplikasi Go Anda **wajib** membaca port dari environment variable `PORT`:

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"message":"Hello from Go on RanuPod!"}`)
	})

	log.Printf("Server listening on port %s", port)
	// Bind ke port yang ditentukan di seluruh interface
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
```

---

## 3. Struktur Proyek dengan Direktori `/cmd`

Jika struktur kode Anda menggunakan layout standar Go di mana file `main.go` berada di dalam subfolder (misalnya `cmd/api/main.go` atau `cmd/server/main.go`):

```text
my-go-project/
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── handlers/
│   └── models/
├── go.mod
└── go.sum
```

Anda cukup mengatur perintah build dan start di tab **Settings** -> Bagian **Build & Start Commands**:
- **Build Command**: `go build -ldflags="-s -w" -o server ./cmd/api`
- **Start Command**: `./server`

> [!TIP]
> Flag `-ldflags="-s -w"` membuang tabel simbol dan informasi debug DWARF dari binary Go, sehingga ukuran file executable mengecil hingga 40% dan mempercepat waktu peluncuran kontainer.

---

## 4. Contoh Menggunakan Chi Router & Graceful Shutdown

```go
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	server := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	go func() {
		log.Printf("Server starting on :%s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Listen failed: %v", err)
		}
	}()

	// Tangkap sinyal SIGTERM untuk graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server stopped")
}
```
