# Angular + ASP.NET Core — Finance Tracker

คัดลอกจาก `react-dotnet-finance` แล้วเปลี่ยน frontend เป็น **Angular 19**

## Prerequisites

- .NET SDK 10+
- Node.js 20+

## Setup (ครั้งแรก)

```powershell
cd MyMiniProject\angular-dotnet-finance\frontend
npm install
```

## Start

### 1) Backend (port 5210)

```powershell
cd MyMiniProject\angular-dotnet-finance\backend
dotnet run
```

### 2) Frontend (port 4210)

```powershell
cd MyMiniProject\angular-dotnet-finance\frontend
npm start
```

UI: http://localhost:4210  
หรือใช้ `run.bat`

## Login

| Username | Password |
|----------|----------|
| `admin` | `admin123` |
| `user` | `user123` |

## ฟีเจอร์ (เหมือน React)

Login · CRUD ผู้ใช้ · CRUD รายรับรายจ่าย + สลิป (resize) · Dashboard  
สลิปเก็บที่ `uploads/slips/{username}/`
