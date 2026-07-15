# Laravel + ASP.NET Core — Finance Tracker

แอปจัดการ **รายรับรายจ่าย** — Laravel Blade + Vanilla JS SPA เรียก .NET API โดยตรง

---

## สิ่งที่ต้องมีก่อน (Prerequisites)

| เครื่องมือ | ตรวจเวอร์ชัน | ดาวน์โหลด |
|------------|--------------|-----------|
| **.NET SDK** 10+ | `dotnet --version` | https://dotnet.microsoft.com/download |
| **PHP** 8.2+ | `php --version` | https://www.php.net/downloads |
| **Composer** | `composer --version` | https://getcomposer.org |

---

## Setup (ครั้งแรก)

เปิด PowerShell แล้วรัน:

```powershell
cd MyMiniProject\laravel-dotnet-finance\frontend
composer install
copy .env.example .env
php artisan key:generate
```

ตรวจว่า `.env` มี:

```
FINANCE_API_URL=http://localhost:5230
```

Backend ไม่ต้องติดตั้งอะไรเพิ่ม — `dotnet run` จะ restore package ให้อัตโนมัติ  
โฟลเดอร์ `data/` (SQLite) และ `uploads/` (รูปสลิป) สร้างเองตอนรันครั้งแรก

---

## Start

### วิธีที่ 1 — ใช้ `run.bat` (แนะนำ)

ดับเบิลคลิก `run.bat` ในโฟลเดอร์โปรเจกต์ — จะเปิด backend + Laravel UI พร้อมกัน

### วิธีที่ 2 — เปิด 2 เทอร์มินัล

**1) Backend (API)**

```powershell
cd MyMiniProject\laravel-dotnet-finance\backend
dotnet run
```

**2) Frontend (Laravel UI)**

```powershell
cd MyMiniProject\laravel-dotnet-finance\frontend
php artisan serve --port=5231 --host=127.0.0.1
```

เปิดเบราว์เซอร์: **http://127.0.0.1:5231**

---

## Login

| Username | Password | สิทธิ์ |
|----------|----------|--------|
| `admin`  | `admin123` | ผู้ดูแล — จัดการผู้ใช้ + ดูรายการทั้งหมด |
| `user`   | `user123`  | ผู้ใช้ — เห็นเฉพาะรายการตัวเอง |

---

## URL

| ส่วน | URL |
|------|-----|
| **Frontend (Laravel UI)** | http://127.0.0.1:5231 |
| **Backend (API)** | http://localhost:5230 |

เบราว์เซอร์เรียก API ที่ `FINANCE_API_URL` โดยตรง (CORS อนุญาต `localhost:5231` แล้ว)

---

## โครงสร้างโฟลเดอร์

```
laravel-dotnet-finance/
├── backend/              ← ASP.NET Core Web API
├── frontend/             ← Laravel (Blade + vanilla JS SPA)
│   ├── public/
│   │   ├── css/finance.css
│   │   └── js/finance-app.js
│   └── resources/views/finance/app.blade.php
├── data/                 ← SQLite (finance.db)
├── uploads/slips/        ← รูปสลิป
├── run.bat
└── README.md
```

---

## ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---------|------------|
| Login | JWT เก็บใน localStorage |
| CRUD ผู้ใช้ | เฉพาะ admin |
| CRUD รายรับรายจ่าย | พร้อมอัปโหลดรูปสลิป (FormData) |
| Dashboard | สรุปรายรับ / รายจ่าย / คงเหลือ / หมวด / รายเดือน |

---

## แก้ปัญหาเบื้องต้น

| ปัญหา | วิธีแก้ |
|-------|---------|
| Frontend เรียก API ไม่ได้ | ตรวจว่า backend รันที่ port **5230** และ `FINANCE_API_URL` ถูกต้อง |
| CORS error | ตรวจว่าเปิด UI ที่ port **5231** (ตามที่ backend อนุญาต) |
| `APP_KEY` ว่าง | รัน `php artisan key:generate` |
| Port ชน | ปิดโปรแกรมที่ใช้ 5230 / 5231 แล้วรันใหม่ |
| DB อยากเริ่มใหม่ | ลบไฟล์ `data\finance.db` แล้ว `dotnet run` ใหม่ |
