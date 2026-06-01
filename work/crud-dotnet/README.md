# crud-dotnet

Mini CRUD ด้วย **ASP.NET Core MVC** — แยก Model / View / Controller ชัดเจน

เก็บข้อมูลใน `data/items.json`

## โครงสร้าง MVC

```
crud-dotnet/
├── Controllers/
│   ├── HomeController.cs    # View — หน้า UI
│   └── ItemsController.cs   # API CRUD /items
├── Models/
│   ├── Item.cs
│   └── ItemInput.cs
├── Services/
│   └── ItemRepository.cs    # อ่าน/เขียน JSON
├── Views/Home/Index.cshtml
├── Program.cs
└── data/items.json
```

## รัน

**Windows:** ดับเบิลคลิก `run.bat`

**macOS / Linux:**

```bash
chmod +x run.sh
./run.sh
```

**หรือ:**

```bash
cd work/crud-dotnet
dotnet run
```

พอร์ตเริ่มต้น: `5000` (เปลี่ยนได้ด้วย `set PORT=5001` แล้วรันใหม่)

เปิดเบราว์เซอร์: **http://localhost:5000** (หน้า MVC จาก `Home/Index`)

> โหมดทดลองบน GitHub Pages (ไม่ต้องรัน server): เปิด `index.html` ในโฟลเดอร์นี้โดยตรง

## API

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/items` | รายการทั้งหมด |
| GET | `/items/:id` | รายการเดียว |
| POST | `/items` | สร้าง `{ "name": "...", "description": "..." }` |
| PUT | `/items/:id` | แก้ไข |
| DELETE | `/items/:id` | ลบ |

## ตัวอย่าง

```bash
curl http://localhost:5000/items
curl -X POST http://localhost:5000/items -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"description\":\"demo\"}"
curl -X PUT http://localhost:5000/items/1 -H "Content-Type: application/json" -d "{\"name\":\"Updated\"}"
curl -X DELETE http://localhost:5000/items/1
```
