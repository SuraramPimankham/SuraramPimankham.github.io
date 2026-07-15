(function () {
    const translations = {
        th: {
            "meta.title": "โปรไฟล์ Suraram",
            "hero.greeting": "<span class=\"hero-hello\">สวัสดีครับ ผมชื่อ</span><br><span class=\"hero-name\">สุรราม พิมานคำ</span><br><span class=\"hero-role\">โปรแกรมเมอร์</span><br><span class=\"hero-nick\">เรียกผมว่า <em>ราม</em></span>",
            "hero.downloadCv": "ดาวน์โหลด CV",
            "about.title": "เกี่ยวกับ<span>ผม</span><span class=\"bg-text\">เกี่ยวกับผม</span>",
            "about.heading": "ข้อมูลเกี่ยวกับตัวผม",
            "about.text": "ฉันเรียนจบช่วงประถมที่จังหวัดขอนแก่น และเรียนต่อในระดับมัธยมที่โรงเรียนเฉลิมพระเกียรติ จังหวัดหนองบัวลำภู จากนั้นในช่วง ม.6 ฉันได้ลองเขียนเว็บและทำหุ่นยนต์ ทำให้สนใจ แล้วค่อยๆ เริ่มเขียนโค้ดจริงจังต่อเนื่องเรื่อยมาจนถึงทุกวันนี้",
            "about.exp.label": "ปี <br />ประสบการณ์เขียนโค้ด",
            "about.age.label": "ปี <br />อายุ",
            "about.job.role.label": "ตำแหน่ง <br />ที่ต้องการ",
            "about.job.role.value": "Programmer",
            "about.job.salary.label": "เงินเดือน <br />ที่คาดหวัง",
            "about.job.salary.value": "20,000 - 30,000",
            "about.skills.title": "ทักษะของผม",
            "about.skills.more.title": "ทักษะเพิ่มเติม",
            "extras.title": "ข้อมูล<span>เพิ่มเติม</span><span class=\"bg-text\">ข้อมูลเพิ่มเติม</span>",
            "extras.job.title": "งานที่ต้องการ",
            "extras.job.role.label": "ตำแหน่ง",
            "extras.job.role.value": "Programmer",
            "extras.job.field.label": "สาขาอาชีพ",
            "extras.job.field.value": "ไอที",
            "extras.job.subfield.label": "สาขาย่อย",
            "extras.job.subfield.value": "Programmer/Developer",
            "extras.job.location.label": "พื้นที่ที่ต้องการทำงาน",
            "extras.job.location.value": "ได้ทุกพื้นที่ · ขอนแก่น (พิเศษ)",
            "extras.job.salary.label": "เงินเดือน",
            "extras.job.salary.value": "20,000 - 30,000 บาท",
            "extras.job.type.label": "รูปแบบงาน",
            "extras.job.type.value": "ได้ทุกรูปแบบ · Work from Home (พิเศษ)",
            "extras.job.start.label": "ระยะเวลาเริ่มงาน",
            "extras.job.start.value": "หลัง 01/08/2569 (พ.ศ.) · หลังจากได้งาน 1 สัปดาห์",
            "extras.job.bkk.label": "ทำงานในกรุงเทพฯ",
            "extras.job.bkk.value": "ได้",
            "extras.job.province.label": "ทำงานต่างจังหวัด",
            "extras.job.province.value": "ได้",
            "extras.job.abroad.label": "ยินดีทำงานต่างประเทศ",
            "extras.job.abroad.value": "ได้",
            "extras.applicant.title": "ข้อมูลผู้สมัคร",
            "extras.applicant.religion.label": "ศาสนา",
            "extras.applicant.religion.value": "พุทธ",
            "extras.applicant.nationality.label": "สัญชาติ",
            "extras.applicant.nationality.value": "ไทย",
            "extras.applicant.height.label": "ส่วนสูง",
            "extras.applicant.height.value": "170 ซม.",
            "extras.applicant.weight.label": "น้ำหนัก",
            "extras.applicant.weight.value": "55 กก.",
            "extras.applicant.gender.label": "เพศ",
            "extras.applicant.gender.value": "ชาย",
            "extras.applicant.status.label": "สถานะ",
            "extras.applicant.status.value": "โสด",
            "extras.applicant.birth.label": "วันเดือนปีเกิด",
            "extras.applicant.birth.value": "26/03/2545",
            "extras.applicant.military.label": "สถานภาพทางทหาร",
            "extras.applicant.military.value": "ได้รับการยกเว้น",
            "extras.applicant.vehicle.label": "ยานพาหนะที่มี",
            "extras.applicant.vehicle.value": "จักรยานยนต์",
            "extras.applicant.license.label": "ใบขับขี่",
            "extras.applicant.license.value": "จักรยานยนต์",
            "extras.applicant.drive.label": "ความสามารถในการขับขี่",
            "extras.applicant.drive.value": "จักรยานยนต์",
            "skill.analysis": "การวิเคราะห์และออกแบบ",
            "work.title": "ประวัติ <span>การทำงาน</span><span class=\"bg-text\">ประวัติการทำงาน</span>",
            "work.title.plain": "ประวัติการทำงาน",
            "cv.name": "สุรราม พิมานคำ",
            "cv.summary.title": "Summary",
            "cv.summary.body": "Web Developer (PHP) ประสบการณ์ 2+ ปีพัฒนาระบบ Web MLM ออกแบบฐานข้อมูล Commission แก้ปัญหาฐานข้อมูล MLM และปรับปรุงประสิทธิภาพระบบระดับสิบล้านเรคอร์ด ใช้ PHP เป็นหลัก เริ่ม Laravel ในช่วงเปลี่ยนผ่าน พร้อมโปรเจกต์ fullstack (React / Angular / Vue / Laravel + .NET)",
            "cv.omc.a1": "ออกแบบฐานข้อมูลระบบ Commission และแก้โครงสร้างฐานข้อมูลของระบบ MLM",
            "cv.omc.a2": "ปรับปรุงประสิทธิภาพระบบที่รองรับข้อมูลประมาณ 60 ล้านเรคอร์ด ให้ตอบสนองเร็วขึ้น",
            "cv.omc.a3": "พัฒนาและดูแลแพลตฟอร์ม Web MLM ครบวงจรด้วย PHP รองรับลูกค้า/สมาชิกใช้งานจริง",
            "cv.omc.a4": "ร่วมพัฒนาบางโมดูลด้วย Laravel ในช่วงเปลี่ยนผ่านจาก PHP เดิม และแก้บั๊กจากลูกค้า",
            "cv.projects.title": "Projects",
            "cv.projects.mlm.title": "MLM Platform — Commission & Database",
            "cv.projects.mlm.desc": "ออกแบบฐานข้อมูล Commission แก้โครงสร้าง DB ของระบบ MLM และปรับ performance ของชุดข้อมูลขนาดใหญ่ (~60M records)",
            "resume.summary": "PHP Programmer · Web MLM · ได้ทุกที่ / WFH (พิเศษ)",
            "resume.contact": "ติดต่อ",
            "resume.location": "ได้ทุกที่ · ขอนแก่น (พิเศษ) · WFH (พิเศษ)",
            "resume.title": "Web developer",
            "resume.summary.title": "สรุปโปรไฟล์",
            "resume.summary.body": "Programmer PHP ประสบการณ์พัฒนาระบบ Web MLM ครบวงจร ดูแลแก้ปัญหาให้ลูกค้า และเริ่มใช้ Laravel ในช่วงเปลี่ยนผ่านเทคโนโลยี เปิดรับงานได้ทุกพื้นที่ (ขอนแก่นพิเศษ) และได้ทุกรูปแบบงาน โดย Work from Home เป็นพิเศษ",
            "resume.badge.omc": "~2 ปี 2 เดือน",
            "resume.projects.title": "โปรเจกต์เด่น",
            "resume.tech.title": "Technical Skills",
            "resume.edu.degree": "วท.บ. วิทยาการคอมพิวเตอร์และสารสนเทศ",
            "resume.lang.th": "ไทย",
            "resume.lang.th.level": "เจ้าของภาษา",
            "resume.lang.en": "อังกฤษ",
            "resume.lang.en.level": "พื้นฐาน",
            "work.intern.duration": "ฝึกงาน · 565 ชั่วโมง",
            "work.intern.title": "SOFT SQUARE GROUP <span>Professional Programmer Internship Program</span>",
            "work.intern.p1": "นักศึกษาฝึกงาน ตำแหน่ง Professional Programmer Internship Program",
            "work.intern.p2": "ใช้งาน SQL/PL, Angular, .NET Core และ Jasper Report",
            "work.intern.p3": "รวมระยะเวลาฝึกงาน 565 ชั่วโมง",
            "work.edu.title": "ปริญญาตรี วิทยาการคอมพิวเตอร์และสารสนเทศ <span>Khon Kaen University Nong Khai Campus</span>",
            "work.edu.duration": "2563 - 2567 (พ.ศ.)",
            "work.edu.p1": "เกรดเฉลี่ย 3.56 เกียรตินิยมอันดับ 2 สำเร็จการศึกษาในปี 2567 (พ.ศ.)",
            "work.omc.duration": "เม.ย. 2567 - พ.ค. 2569 (พ.ศ.)",
            "work.omc.title": "OMC MLM Software <span>Programmer PHP</span>",
            "work.omc.p1": "พัฒนาและดูแลระบบ Web MLM ครบวงจรของบริษัทด้วย PHP เป็นหลัก",
            "work.omc.p2": "วิเคราะห์ แก้ไขบั๊ก และแก้ปัญหาจากลูกค้าร้องเรียน เพื่อให้ระบบทำงานได้ต่อเนื่อง",
            "work.omc.p3": "ให้คำปรึกษาการใช้งานระบบ MLM และประสานงานกับลูกค้าและทีมพัฒนา",
            "work.omc.p4": "ร่วมพัฒนาบางโมดูลด้วย Laravel ในช่วงที่บริษัทเริ่มเปลี่ยนผ่านจาก PHP เดิม",
            "projects.title": "โปรเจกต์<span>ของผม</span><span class=\"bg-text\">โปรเจกต์ของผม</span>",
            "projects.intro": "โปรเจกต์ฝึกปฏิบัติ — Ledger (MyMiniProject) และ EToon (Flutter Mobile)",
            "projects.finance.title": "Ledger — React",
            "projects.finance.desc": "React + ASP.NET Core · Login · CRUD · สลิป · Dashboard",
            "projects.angular.title": "Ledger — Angular",
            "projects.angular.desc": "Angular + ASP.NET Core · Login · CRUD · สลิป · Dashboard",
            "projects.vue.title": "Ledger — Vue",
            "projects.vue.desc": "Vue 3 + ASP.NET Core · Login · CRUD · สลิป · Dashboard",
            "projects.laravel.title": "Ledger — Laravel",
            "projects.laravel.desc": "Laravel Blade + ASP.NET Core API · Login · CRUD · สลิป · Dashboard",
            "projects.etoon.title": "EToon — Flutter Mobile",
            "projects.etoon.desc": "แอปอ่านเว็บตูน · Firebase Auth · รายการโปรด · อ่านตอน · ค้นหา",
            "hobby.title": "งานอดิเรก<span>ของผม</span><span class=\"bg-text\">งานอดิเรกของผม</span>",
            "hobby.game.title": "เล่นเกม",
            "hobby.game.text": "เกมส่วนใหญ่ที่ผมเล่นเป็นเกมที่เน้นเล่นกับเพื่อนและทำงานเป็นทีม เช่น Dead By Daylight, Rainbow Six Siege เป็นต้น",
            "hobby.draw.title": "วาดภาพ",
            "hobby.draw.text": "การวาดภาพช่วยให้จิตใจสงบและมีสมาธิมากขึ้น ทำให้เรามีสมาธิและเพิ่มความเข้มข้นในการทำสิ่งต่างๆ ได้ดีขึ้น",
            "hobby.model.title": "สร้างโมเดล 3D",
            "hobby.model.text": "เมื่อได้หมุนดูโมเดล 3D ที่ทำไว้ รู้สึกว่ามันไม่ใช่เรื่องง่ายเลย",
            "contact.title": "ติดต่อ<span>ผม</span><span class=\"bg-text\">ติดต่อ</span>",
            "contact.heading": "ติดต่อผมได้ที่นี่",
            "contact.location": "ที่อยู่",
            "contact.location.value": "888 หมู่ 8 ซอยรัตนาธิเบศร์ 24 บางกระสอ เมืองนนทบุรี นนทบุรี 11000",
            "contact.jobpref": "งานที่ต้องการ",
            "contact.jobpref.value": "Programmer · ได้ทุกที่ · ขอนแก่น (พิเศษ) · ได้ทุกรูปแบบ · WFH (พิเศษ) · 20,000–30,000 บาท · เริ่มงานได้หลัง 01/08/2569 (พ.ศ.) · หลังจากได้งาน 1 สัปดาห์",
            "contact.email": "อีเมล",
            "contact.education": "การศึกษา",
            "contact.phone": "เบอร์โทรศัพท์",
            "contact.languages": "ภาษา",
            "contact.languages.value": "ไทย (ดีมาก), อังกฤษ (พอใช้)"
        },
        en: {
            "meta.title": "Suraram Profile",
            "hero.greeting": "<span class=\"hero-hello\">Hi, my name is</span><br><span class=\"hero-name\">Suraram Pimankham</span><br><span class=\"hero-role\">Programmer</span><br><span class=\"hero-nick\">Call me <em>Ram</em></span>",
            "hero.downloadCv": "Download CV",
            "about.title": "About <span>Me</span><span class=\"bg-text\">About Me</span>",
            "about.heading": "Information About me",
            "about.text": "I completed elementary school in Khon Kaen and secondary school at Chalermprakiat School, Nong Bua Lamphu. In grade 12, I started building websites and working with robotics, which sparked my interest in coding. I have been learning and writing code seriously ever since.",
            "about.exp.label": "Years <br />Code Experience",
            "about.age.label": "Years <br />Age",
            "about.job.role.label": "Desired <br />Role",
            "about.job.role.value": "Programmer",
            "about.job.salary.label": "Expected <br />Salary",
            "about.job.salary.value": "20,000 - 30,000 THB",
            "about.skills.title": "My Skills",
            "about.skills.more.title": "More skills",
            "extras.title": "More <span>Info</span><span class=\"bg-text\">More Info</span>",
            "extras.job.title": "Job preference",
            "extras.job.role.label": "Role",
            "extras.job.role.value": "Programmer",
            "extras.job.field.label": "Field",
            "extras.job.field.value": "IT",
            "extras.job.subfield.label": "Specialization",
            "extras.job.subfield.value": "Programmer/Developer",
            "extras.job.location.label": "Preferred location",
            "extras.job.location.value": "Open to anywhere · Khon Kaen (preferred)",
            "extras.job.salary.label": "Expected salary",
            "extras.job.salary.value": "20,000 - 30,000 THB",
            "extras.job.type.label": "Job type",
            "extras.job.type.value": "Open to all types · Work from home (preferred)",
            "extras.job.start.label": "Start date",
            "extras.job.start.value": "After 01/08/2026 (CE) · 1 week after offer",
            "extras.job.bkk.label": "Bangkok",
            "extras.job.bkk.value": "Available",
            "extras.job.province.label": "Other provinces",
            "extras.job.province.value": "Available",
            "extras.job.abroad.label": "Overseas",
            "extras.job.abroad.value": "Available",
            "extras.applicant.title": "Applicant info",
            "extras.applicant.religion.label": "Religion",
            "extras.applicant.religion.value": "Buddhism",
            "extras.applicant.nationality.label": "Nationality",
            "extras.applicant.nationality.value": "Thai",
            "extras.applicant.height.label": "Height",
            "extras.applicant.height.value": "170 cm",
            "extras.applicant.weight.label": "Weight",
            "extras.applicant.weight.value": "55 kg",
            "extras.applicant.gender.label": "Gender",
            "extras.applicant.gender.value": "Male",
            "extras.applicant.status.label": "Marital status",
            "extras.applicant.status.value": "Single",
            "extras.applicant.birth.label": "Date of birth",
            "extras.applicant.birth.value": "26/03/2002",
            "extras.applicant.military.label": "Military status",
            "extras.applicant.military.value": "Exempted",
            "extras.applicant.vehicle.label": "Vehicle",
            "extras.applicant.vehicle.value": "Motorcycle",
            "extras.applicant.license.label": "License",
            "extras.applicant.license.value": "Motorcycle",
            "extras.applicant.drive.label": "Driving",
            "extras.applicant.drive.value": "Motorcycle",
            "skill.analysis": "Analysis and Design",
            "work.title": "Work <span>Timeline</span><span class=\"bg-text\">Work Timeline</span>",
            "work.title.plain": "Work Experience",
            "cv.name": "Suraram Pimankham",
            "cv.summary.title": "Summary",
            "cv.summary.body": "Web Developer (PHP) with 2+ years building Web MLM platforms — designed commission databases, fixed MLM database issues, and improved performance on ~60M-record systems. Primary stack PHP with Laravel during a tech transition, plus fullstack practice apps (React / Angular / Vue / Laravel + .NET).",
            "cv.omc.a1": "Designed commission database schema and fixed MLM system database structures",
            "cv.omc.a2": "Improved performance of a system handling ~60 million records",
            "cv.omc.a3": "Built and maintained a full-cycle Web MLM platform in PHP for production users",
            "cv.omc.a4": "Contributed Laravel modules during migration from legacy PHP and resolved customer issues",
            "cv.projects.title": "Projects",
            "cv.projects.mlm.title": "MLM Platform — Commission & Database",
            "cv.projects.mlm.desc": "Designed commission DB, fixed MLM database structures, and tuned performance for large datasets (~60M records)",
            "resume.summary": "PHP Programmer · Web MLM · Open anywhere / WFH (preferred)",
            "resume.contact": "Contact",
            "resume.location": "Open anywhere · Khon Kaen (preferred) · WFH (preferred)",
            "resume.title": "Web developer",
            "resume.summary.title": "Profile Summary",
            "resume.summary.body": "PHP programmer with experience building full-cycle Web MLM systems, resolving customer issues, and starting Laravel during a technology transition. Open to any location (Khon Kaen preferred) and all work types, with Work from Home preferred.",
            "resume.badge.omc": "~2 yr 2 mo",
            "resume.projects.title": "Featured Projects",
            "resume.tech.title": "Technical Skills",
            "resume.edu.degree": "B.Sc. Computer Science and Information",
            "resume.lang.th": "Thai",
            "resume.lang.th.level": "Native",
            "resume.lang.en": "English",
            "resume.lang.en.level": "Basic",
            "work.intern.duration": "Internship · 565 hours",
            "work.intern.title": "SOFT SQUARE GROUP <span>Professional Programmer Internship Program</span>",
            "work.intern.p1": "Student intern — Professional Programmer Internship Program",
            "work.intern.p2": "Used SQL/PL, Angular, .NET Core, and Jasper Report",
            "work.intern.p3": "Total internship duration: 565 hours",
            "work.edu.title": "B.Sc. Computer Science and Information <span>Khon Kaen University Nong Khai Campus</span>",
            "work.edu.duration": "2020 - 2024 (CE)",
            "work.edu.p1": "GPA 3.56, Second Class Honors, graduated in 2024 (CE)",
            "work.omc.duration": "Apr 2024 - May 2026 (CE)",
            "work.omc.title": "OMC MLM Software <span>Programmer PHP</span>",
            "work.omc.p1": "Develop and maintain the company's full-cycle Web MLM platform primarily with PHP",
            "work.omc.p2": "Analyze and fix bugs and customer-reported issues to keep the system running smoothly",
            "work.omc.p3": "Advise clients on MLM system usage and coordinate with customers and the development team",
            "work.omc.p4": "Contribute to selected modules in Laravel as the company begins migrating from legacy PHP",
            "projects.title": "My <span>Projects</span><span class=\"bg-text\">My Projects</span>",
            "projects.intro": "Practice projects — Ledger (MyMiniProject) and EToon (Flutter Mobile)",
            "projects.finance.title": "Ledger — React",
            "projects.finance.desc": "React + ASP.NET Core · Login · CRUD · slips · Dashboard",
            "projects.angular.title": "Ledger — Angular",
            "projects.angular.desc": "Angular + ASP.NET Core · Login · CRUD · slips · Dashboard",
            "projects.vue.title": "Ledger — Vue",
            "projects.vue.desc": "Vue 3 + ASP.NET Core · Login · CRUD · slips · Dashboard",
            "projects.laravel.title": "Ledger — Laravel",
            "projects.laravel.desc": "Laravel Blade + ASP.NET Core API · Login · CRUD · slips · Dashboard",
            "projects.etoon.title": "EToon — Flutter Mobile",
            "projects.etoon.desc": "Flutter webtoon reader · Firebase Auth · Favorites · Episode reader · Search",
            "hobby.title": "My <span>Hobby</span><span class=\"bg-text\">My Hobby</span>",
            "hobby.game.title": "Play Game",
            "hobby.game.text": "Most of the games I play are friend-focused and highly teamwork-based, such as Dead By Daylight and Rainbow Six Siege.",
            "hobby.draw.title": "Draw a picture",
            "hobby.draw.text": "Drawing helps calm the mind and improves focus and concentration.",
            "hobby.model.title": "3D Modeling",
            "hobby.model.text": "Rotating the 3D models I made showed me it is not as easy as it looks.",
            "contact.title": "Contact <span>Me</span><span class=\"bg-text\">Contact</span>",
            "contact.heading": "Contact me here",
            "contact.location": "Location",
            "contact.location.value": "Nonthaburi, Thailand",
            "contact.jobpref": "Job preference",
            "contact.jobpref.value": "Programmer · Open anywhere · Khon Kaen (preferred) · All work types · WFH (preferred) · 20,000–30,000 THB · Available after 01/08/2026 (CE) · 1 week after offer",
            "contact.email": "Email",
            "contact.education": "Education",
            "contact.phone": "Mobile Number",
            "contact.languages": "Languages",
            "contact.languages.value": "Thai (native), English (basic)"
        }
    };

    let currentLang = localStorage.getItem("lang") || "th";

    function applyLanguage(lang) {
        const dict = translations[lang];
        if (!dict) return;

        currentLang = lang;
        localStorage.setItem("lang", lang);
        document.documentElement.lang = lang;

        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.dataset.i18n;
            if (dict[key] !== undefined) {
                el.textContent = dict[key];
            }
        });

        document.querySelectorAll("[data-i18n-html]").forEach((el) => {
            const key = el.dataset.i18nHtml;
            if (dict[key] !== undefined) {
                el.innerHTML = dict[key];
            }
        });

        const titleEl = document.querySelector("title[data-i18n]");
        if (titleEl && dict["meta.title"]) {
            titleEl.textContent = dict["meta.title"];
        }

        const langBtnText = document.querySelector(".lang-btn__text");
        if (langBtnText) {
            langBtnText.textContent = lang === "th" ? "TH" : "EN";
        }
        const langBtnFlag = document.querySelector(".lang-btn__flag");
        if (langBtnFlag) {
            langBtnFlag.src = lang === "th"
                ? "https://flagcdn.com/w40/th.png"
                : "https://flagcdn.com/w40/gb.png";
            langBtnFlag.alt = lang === "th" ? "Thai" : "English";
        }
    }

    [...document.querySelectorAll(".control")].forEach((button) => {
        button.addEventListener("click", function () {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        });
    });

    const themeBtn = document.querySelector(".theme-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
        });
    }

    const langBtn = document.querySelector(".lang-btn");
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            applyLanguage(currentLang === "th" ? "en" : "th");
        });
    }

    applyLanguage(currentLang);

    const today = new Date();

    const birthDate = new Date(2002, 2, 26);
    const ageElement = document.getElementById("age");
    if (ageElement) {
        let age = today.getFullYear() - birthDate.getFullYear();
        const hasBirthdayPassed = (today.getMonth() > birthDate.getMonth()) ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        if (!hasBirthdayPassed) {
            age -= 1;
        }
        ageElement.textContent = age;
    }

    const codingStart = new Date(2019, 0, 1);
    const codeExpElement = document.getElementById("code-exp");
    if (codeExpElement) {
        let years = today.getFullYear() - codingStart.getFullYear();
        const hasAnniversaryPassed = (today.getMonth() > codingStart.getMonth()) ||
            (today.getMonth() === codingStart.getMonth() && today.getDate() >= codingStart.getDate());
        if (!hasAnniversaryPassed) {
            years -= 1;
        }
        codeExpElement.textContent = Math.max(years, 0);
    }
})();
