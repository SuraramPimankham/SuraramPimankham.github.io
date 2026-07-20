# Ledger — Laravel Finance

แอปจัดการ **รายรับรายจ่าย** — Laravel ล้วน (Blade + Vanilla JS + Laravel API)

ไม่ใช้ .NET — Laravel ทำหน้าที่ทั้ง UI และ Backend

---

## สิ่งที่ต้องมีก่อน

| เครื่องมือ | ตรวจเวอร์ชัน | ดาวน์โหลด |
|------------|--------------|-----------|
| **PHP** 8.2+ | `php --version` | https://www.php.net/downloads |
| **Composer** | `composer --version` | https://getcomposer.org |

---

## Setup (ครั้งแรก)

```powershell
cd MyMiniProject\laravel-finance
composer install
copy .env.example .env
php artisan key:generate
type nul > database\database.sqlite
php artisan migrate --seed
```

---

## Start

### วิธีที่ 1 — `run.bat`

ดับเบิลคลิก `run.bat` — migrate/seed แล้วเปิดเซิร์ฟเวอร์

### วิธีที่ 2 — เทอร์มินัล

```powershell
cd MyMiniProject\laravel-finance
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

## โครงสร้าง

```
laravel-finance/
├── app/
│   ├── Http/Controllers/Api/   ← Auth, Users, Transactions, Dashboard
│   ├── Models/
│   └── Services/               ← JWT + Slip storage
├── public/
│   ├── css/finance.css
│   ├── js/finance-app.js       ← SPA เรียก /api เดียวกัน
│   └── uploads/slips/          ← รูปสลิป
├── routes/api.php
├── routes/web.php
├── run.bat
└── README.md
```

---

## ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---------|------------|
| Login | JWT เก็บใน localStorage |
| CRUD ผู้ใช้ | เฉพาะ admin |
| CRUD รายรับรายจ่าย | พร้อมอัปโหลดรูปสลิป |
| Dashboard | สรุปรายรับ / รายจ่าย / คงเหลือ / หมวด / รายเดือน |

---

## แก้ปัญหาเบื้องต้น

| ปัญหา | วิธีแก้ |
|-------|---------|
| `APP_KEY` ว่าง | `php artisan key:generate` |
| DB อยากเริ่มใหม่ | ลบ `database\database.sqlite` แล้ว `php artisan migrate --seed` |
| Port ชน | ปิดโปรแกรมที่ใช้ 5231 แล้วรันใหม่ |
