# LearningCode — DotnetMVC

โปรเจกต์ฝึก **CRUD + REST API** ด้วย **ASP.NET Core MVC** + SQLite

```
LearningCode/
├── DotnetMVC/          ← โปรเจกต์ .NET (MVC)
├── data/members.db     ← SQLite
└── uploads/            ← รูป + ไฟล์แนบ
```

## Model: Member

| ฟิลด์ | เก็บอะไร |
|-------|----------|
| `name` | ชื่อ (บังคับ) |
| `email` | อีเมล |
| `phone` | เบอร์โทร |
| `role` | admin / user / guest |
| `bio` | ประวัติ |
| `photo` | รูปโปรไฟล์ |
| `file` | ไฟล์แนบ |
| `department`, `status` | extra fields (แก้ใน fields.json ได้) |

## รัน

```powershell
cd LearningCode\DotnetMVC
dotnet run
```

| URL | หน้าที่ |
|-----|---------|
| http://localhost:5100/ | **Hub** |
| http://localhost:5100/test.html | API Tester |
| http://localhost:5100/api/members | REST CRUD |

## Filter (WHERE แบบ REST)

```
GET /api/members?role=user
GET /api/members?status=active&department=IT
GET /api/members?name=สมชาย
```

| Query | เทียบ SQL |
|-------|-----------|
| `role=admin` | `WHERE Role = 'admin'` |
| `name=สม` | `WHERE Name LIKE '%สม%'` |
| `status=active` | filter ใน extra field |

ปลอดภัย — ใช้ EF Core ไม่ต่อ SQL string จาก user

## ตัวอย่าง JSON (POST)

```json
{
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "role": "user",
  "bio": "นักพัฒนา",
  "department": "IT",
  "status": "active"
}
```

## เพิ่มฟิลด์ทดสอบ

แก้ **`DotnetMVC/fields.json`** แล้ว restart

| storage | ความหมาย |
|---------|----------|
| `extra` | เพิ่มได้ทันที (ExtraJson) |
| `column` | ต้องมีใน `Member.cs` ด้วย |
| `file` | รูป/ไฟล์แนบ |

| `filterable` | `true` / `false` / ไม่ใส่ (auto สำหรับ column+extra) |

เพิ่มฟิลด์ใน `fields.json` → filter + ไฟล์แนบ + UI อัปเดตอัตโนมัติ (restart server)

```json
{
  "name": "cv",
  "label": "เรซูเม่",
  "type": "file",
  "storage": "file",
  "maxSizeMb": 5
}
```

PUT ลบไฟล์: ส่ง `clearCv=true` ใน form (หรือ JSON ใน tester)
