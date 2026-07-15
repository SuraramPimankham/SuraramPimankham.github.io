# React + ASP.NET Core — Finance Tracker

แอปจัดการ **รายรับรายจ่าย** — Login, CRUD ผู้ใช้, CRUD รายรับรายจ่าย (+ รูปสลิป), Dashboard

---

## สิ่งที่ต้องมีก่อน (Prerequisites)

ติดตั้งให้เรียบร้อย:

| เครื่องมือ | ตรวจเวอร์ชัน | ดาวน์โหลด |
|------------|--------------|-----------|
| **.NET SDK** 10+ | `dotnet --version` | https://dotnet.microsoft.com/download |
| **Node.js** 20+ | `node --version` | https://nodejs.org |

---

## Setup (ครั้งแรก)

เปิด PowerShell แล้วรัน:

```powershell
cd MyMiniProject\react-dotnet-finance\frontend
npm install
```

Backend ไม่ต้องติดตั้งอะไรเพิ่ม — `dotnet run` จะ restore package ให้อัตโนมัติ  
โฟลเดอร์ `data/` (SQLite) และ `uploads/` (รูปสลิป) สร้างเองตอนรันครั้งแรก

---

## Start

ต้องเปิด **2 เทอร์มินัล** (backend ก่อน แล้วค่อย frontend)

### 1) เปิด API (Backend)

```powershell
cd MyMiniProject\react-dotnet-finance\backend
dotnet run
```

รอจนเห็นข้อความประมาณ:

```
Finance API
API:   http://localhost:5200
```

### 2) เปิด UI (Frontend)

เทอร์มินัลใหม่:

```powershell
cd MyMiniProject\react-dotnet-finance\frontend
npm run dev
```

เปิดเบราว์เซอร์: **http://localhost:5173**

### หรือใช้ `run.bat`

ดับเบิลคลิกไฟล์ `run.bat` ในโฟลเดอร์โปรเจกต์ — จะเปิด backend + frontend พร้อมกัน

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
| **Frontend (UI)** | http://localhost:5173 |
| **Backend (API)** | http://localhost:5200 |

Frontend จะ proxy `/api` และ `/uploads` ไปยัง backend ให้อัตโนมัติ

---

## โครงสร้างโฟลเดอร์

```
react-dotnet-finance/
├── backend/           ← ASP.NET Core Web API
├── frontend/          ← React (Vite)
├── data/              ← SQLite (finance.db)
├── uploads/
│   └── slips/
│       └── {username}/   ← รูปสลิปแยกตาม user
│           └── slip-{id}-{hash}.jpg
├── run.bat
└── README.md
```

ตัวอย่าง:

```
uploads/slips/admin/slip-3-a1b2c3d4.jpg
uploads/slips/user/slip-7-e5f6g7h8.jpg
```

---

## รูปสลิป / หลักฐาน

ตอนอัปโหลด backend จะ **optimize** ให้ก่อนบันทึก:

| รายการ | ค่า |
|--------|-----|
| โฟลเดอร์ | `uploads/slips/{username}/` |
| ย่อขนาด | ด้านยาวสุดไม่เกิน **1280px** (คงสัดส่วน) |
| รูปแบบบันทึก | **JPEG** quality **80** |
| ขนาดอัปโหลดสูงสุด | **5 MB** |
| นามสกุลที่รับ | `.jpg` `.jpeg` `.png` `.gif` `.webp` |

---

## ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---------|------------|
| Login | JWT |
| CRUD ผู้ใช้ | เฉพาะ admin |
| CRUD รายรับรายจ่าย | พร้อมรูปสลิป |
| Dashboard | สรุปรายรับ / รายจ่าย / คงเหลือ / หมวด / รายเดือน |

---

## แก้ปัญหาเบื้องต้น

| ปัญหา | วิธีแก้ |
|-------|---------|
| Frontend เรียก API ไม่ได้ | ตรวจว่า backend รันที่ port **5200** แล้ว |
| Port ชน | ปิดโปรแกรมที่ใช้ 5173 / 5200 แล้วรันใหม่ |
| `npm install` พัง | ลบ `frontend\node_modules` แล้วรัน `npm install` ใหม่ |
| DB อยากเริ่มใหม่ | ลบไฟล์ `data\finance.db` แล้ว `dotnet run` ใหม่ (seed บัญชีทดลองใหม่อัตโนมัติ) |
| เปลี่ยนโค้ด backend แล้วไม่เห็นผล | หยุด `dotnet run` แล้วรันใหม่ |
| สลิปเก่าอยู่ราก `slips/` | ไฟล์เก่าก่อนแยก username ยังใช้ได้ — อัปโหลดใหม่จะเข้า `{username}/` |
