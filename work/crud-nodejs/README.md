# crud-nodejs

Mini CRUD ด้วย **Node.js แบบ MVC** (`http` module — ไม่ใช้ Express)

เก็บข้อมูลใน `data/items.json`

## โครงสร้าง MVC

```
crud-nodejs/
├── server.js                 # จุดเริ่มต้น
├── routes/index.js           # กำหนดเส้นทาง → Controller
├── controllers/
│   ├── homeController.js     # View — หน้า UI
│   └── itemsController.js    # API CRUD /items
├── models/itemModel.js       # อ่าน/เขียน JSON
├── views/index.html
├── utils/httpHelpers.js
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
cd work/crud-nodejs
npm start
```

พอร์ตเริ่มต้น: `3000` (เปลี่ยนได้ด้วย `set PORT=4000` แล้วรันใหม่)

เปิดเบราว์เซอร์: **http://localhost:3000** (หน้า UI จาก `views/index.html`)

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
curl http://localhost:3000/items
curl -X POST http://localhost:3000/items -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"description\":\"demo\"}"
curl -X PUT http://localhost:3000/items/1 -H "Content-Type: application/json" -d "{\"name\":\"Updated\"}"
curl -X DELETE http://localhost:3000/items/1
```
