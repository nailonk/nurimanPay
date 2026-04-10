# NurimanPay - Online Donation Platform
## Deskripsi Singkat Projek
NurimanPay adalah aplikasi berbasis web yang dirancang untuk mengelola dan memfasilitasi proses donasi online secara efisien. Aplikasi ini bertujuan memberikan pengalaman berdonasi yang mudah dan nyaman bagi pengguna melalui antarmuka yang intuitif serta sistem pembayaran yang terintegrasi.

## Petunjuk Setup Environment
Ikuti langkah-langkah berikut untuk menyiapkan lingkungan pengembangan di lokal:
### 1. Clone repository
```bash
git clone https://github.com/nailonk/nurimanPay.git
```
### 2. Masuk ke folder
```bash
cd nurimanPay
```
### 3. Setup Backend
Masuk ke folder Backend
```bash
cd backend
```
Install Dependencies
```bash
npm install
```
Buat file .env
```bash
DATABASE_URL=""
JWT_EXPIRES_IN=""
JWT_SECRET=""
MIDTRANS_CLIENT_KEY=""
MIDTRANS_MERCHANT_ID=""
MIDTRANS_SERVER_KEY=""
PORT=""
VITE_API_URL=""
```

### 4. Setup Frontend
Buka terminal baru, lalu masuk ke folder frontend
```bash
cd frontend
```
Install Dependencies
```bash
npm install
```
Buat file .env
```bash
VITE_API_URL=
```
## Cara Menjalankan Aplikasi
### Run di localhost
Jalankan Backend dahulu
```bash
cd backend
npm run dev
```
Kemudian jalankan frontend
```bash
cd frontend
npm run dev
```
Buka aplikasi di browser
http://localhost:5173
### Deployment
- Backend: https://nurimanpay-production.up.railway.app/api
- Frontend: https://nuriman-fe.vercel.app
