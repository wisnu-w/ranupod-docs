---
title: Deploy Aplikasi Python & FastAPI di RanuPod
description: Panduan deployment aplikasi Python menggunakan FastAPI, Django, Flask, atau Uvicorn.
---

RanuPod mendeteksi aplikasi Python melalui keberadaan file `requirements.txt`, `Pipfile`, atau `pyproject.toml`.

---

## 1. Persiapan `requirements.txt`

Pastikan seluruh package dependensi termasuk ASGI/WSGI server (misalnya `uvicorn` atau `gunicorn`) telah terdaftar:

```text
fastapi>=0.110.0
uvicorn[standard]>=0.29.0
pydantic>=2.7.0
```

---

## 2. Struktur Kode Aplikasi

Contoh implementasi dengan FastAPI (`main.py`):

```python
import os
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on RanuPod"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
```

---

## 3. Start Command

Jika Anda menjalankan server melalui CLI, tentukan **Start Command** di tab Settings service:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```
Atau untuk Django menggunakan Gunicorn:
```bash
gunicorn myproject.wsgi:application --bind 0.0.0.0:$PORT
```
