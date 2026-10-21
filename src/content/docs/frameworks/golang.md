---
title: Deploy Aplikasi Go (Golang) di RanuPod
description: Panduan deployment backend berkinerja tinggi berbasis Go menggunakan Gin, Fiber, Chi, atau net/http.
---

RanuPod mengenali proyek Go secara instan saat menemukan file `go.mod` di repositori Anda.

---

## 1. Persiapan `go.mod`

Pastikan file `go.mod` Anda memuat dependensi yang lengkap dan bersih:

```bash
go mod tidy
```

Contoh struktur proyek standar:
```text
my-go-app/
├── cmd/
│   └── api/
│       └── main.go
├── go.mod
└── go.sum
```

---

## 2. Menghormati Environment `PORT`

Pastikan kode Go Anda membaca `os.Getenv("PORT")`:

```go
package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello from Go on RanuPod!")
	})

	fmt.Printf("Server starting on port %s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		panic(err)
	}
}
```

---

## 3. Custom Entrypoint / Binary

Jika file `main.go` Anda tidak berada di root direktori (misalnya berada di `./cmd/api`), Anda dapat menentukan build command atau start command di pengaturan service RanuPod:

- **Build Command**: `go build -o server ./cmd/api`
- **Start Command**: `./server`
