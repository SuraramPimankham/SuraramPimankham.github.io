# Vue + ASP.NET Core — Finance Tracker

คัดลอกจาก `react-dotnet-finance` แล้วเปลี่ยน frontend เป็น **Vue 3**

## Prerequisites

- .NET SDK 10+
- Node.js 20+

## Setup (ครั้งแรก)

```powershell
cd MyMiniProject\vue-dotnet-finance\frontend
npm install
```

## Start

### 1) Backend (port 5220)

```powershell
cd MyMiniProject\vue-dotnet-finance\backend
dotnet run
```

### 2) Frontend (port 5221)

```powershell
cd MyMiniProject\vue-dotnet-finance\frontend
npm run dev
```

UI: http://localhost:5221  
หรือใช้ `run.bat`

## Login

| Username | Password |
|----------|----------|
| `admin` | `admin123` |
| `user` | `user123` |

## ฟีเจอร์ (เหมือน React)

Login · CRUD ผู้ใช้ · CRUD รายรับรายจ่าย + สลิป (resize) · Dashboard  
สลิปเก็บที่ `uploads/slips/{username}/`
