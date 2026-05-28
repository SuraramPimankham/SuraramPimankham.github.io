(function () {
    const translations = {
        th: {
            "meta.title": "โปรไฟล์ Suraram",
            "hero.greeting": "สวัสดีครับ ผมชื่อ <br><span>สุรราม พิมานคำ</span><br />โปรแกรมเมอร์<br />เรียกผมว่า <span>ราม</span>",
            "hero.downloadCv": "ดาวน์โหลด CV",
            "about.title": "เกี่ยวกับ<span>ผม</span><span class=\"bg-text\">เกี่ยวกับผม</span>",
            "about.heading": "ข้อมูลเกี่ยวกับตัวผม",
            "about.text": "ฉันเรียนจบช่วงประถมที่จังหวัดขอนแก่น และเรียนต่อในระดับมัธยมที่โรงเรียนเฉลิมพระเกียรติ จังหวัดหนองบัวลำภู จากนั้นในช่วง ม.6 ฉันได้ลองเขียนเว็บและทำหุ่นยนต์ ทำให้สนใจ แล้วค่อยๆ เริ่มเขียนโค้ดจริงจังต่อเนื่องเรื่อยมาจนถึงทุกวันนี้",
            "about.exp.label": "ปี <br />ประสบการณ์เขียนโค้ด",
            "about.age.label": "ปี <br />อายุ",
            "about.job.role.label": "ตำแหน่ง <br />ที่ต้องการ",
            "about.job.role.value": "Programmer",
            "about.job.salary.label": "เงินเดือน <br />ที่คาดหวัง",
            "about.job.salary.value": "25,000 - 30,000",
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
            "extras.job.location.value": "ขอนแก่น (ทุกเขต)",
            "extras.job.salary.label": "เงินเดือน",
            "extras.job.salary.value": "25,000 - 30,000 บาท",
            "extras.job.type.label": "รูปแบบงาน",
            "extras.job.type.value": "งานประจำ",
            "extras.job.start.label": "ระยะเวลาเริ่มงาน",
            "extras.job.start.value": "มากกว่า 30 วัน",
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
            "work.title": "ประวัติ <span>การทำงาน</span>",
            "work.intern.duration": "ฝึกงาน · 565 ชั่วโมง",
            "work.intern.title": "SOFT SQUARE GROUP <span>Professional Programmer Internship Program</span>",
            "work.intern.p1": "นักศึกษาฝึกงาน ตำแหน่ง Professional Programmer Internship Program",
            "work.intern.p2": "ใช้งาน SQL/PL, Angular, .NET Core และ Jasper Report",
            "work.intern.p3": "รวมระยะเวลาฝึกงาน 565 ชั่วโมง",
            "work.edu.title": "ปริญญาตรี วิทยาการคอมพิวเตอร์และสารสนเทศ <span>Khon Kaen University Nong Khai Campus</span>",
            "work.edu.p1": "เกรดเฉลี่ย 3.56 เกียรตินิยมอันดับ 2 สำเร็จการศึกษาในปี 2024",
            "work.omc.duration": "เม.ย. 2024 - พ.ค. 2026",
            "work.omc.title": "OMC MLM Software <span>Programmer PHP</span>",
            "work.omc.p1": "ตรวจสอบ/วิเคราะห์ และแก้ไข bug จากลูกค้าร้องเรียน เพื่อให้ระบบทำงานได้ราบรื่น",
            "work.omc.p2": "ร่วมออกแบบและพัฒนาระบบใหม่ รวมถึงทดสอบ/ประเมินผลก่อนใช้งานจริง",
            "work.omc.p3": "สื่อสารอัปเดตสถานะกับลูกค้า และประสานงานร่วมกับทีมพัฒนา",
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
            "contact.location.value": ": 888 หมู่ 8 ซอยรัตนาธิเบศร์ 24 บางกระสอ เมืองนนทบุรี นนทบุรี 11000",
            "contact.jobpref": "งานที่ต้องการ",
            "contact.jobpref.value": ": Programmer (งานประจำ) · พื้นที่ ขอนแก่น · 25,000–30,000 บาท · เริ่มงานได้มากกว่า 30 วัน",
            "contact.email": "อีเมล",
            "contact.education": "การศึกษา",
            "contact.phone": "เบอร์โทรศัพท์",
            "contact.languages": "ภาษา",
            "contact.languages.value": ": ไทย (ดีมาก), อังกฤษ (พอใช้)"
        },
        en: {
            "meta.title": "Suraram Profile",
            "hero.greeting": "Hi, I'm <br><span>Suraram Pimankham.</span><br />Programmer.<br />Call me <span>Ram</span>",
            "hero.downloadCv": "Download CV",
            "about.title": "About <span>Me</span><span class=\"bg-text\">About Me</span>",
            "about.heading": "Information About me",
            "about.text": "I completed elementary school in Khon Kaen and secondary school at Chalermprakiat School, Nong Bua Lamphu. In grade 12, I started building websites and working with robotics, which sparked my interest in coding. I have been learning and writing code seriously ever since.",
            "about.exp.label": "Years <br />Code Experience",
            "about.age.label": "Years <br />Age",
            "about.job.role.label": "Desired <br />Role",
            "about.job.role.value": "Programmer",
            "about.job.salary.label": "Expected <br />Salary",
            "about.job.salary.value": "25,000 - 30,000 THB",
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
            "extras.job.location.value": "Khon Kaen (any district)",
            "extras.job.salary.label": "Expected salary",
            "extras.job.salary.value": "25,000 - 30,000 THB",
            "extras.job.type.label": "Job type",
            "extras.job.type.value": "Full-time",
            "extras.job.start.label": "Start date",
            "extras.job.start.value": "In 30+ days",
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
            "work.title": "Work <span>Timeline</span>",
            "work.intern.duration": "Internship · 565 hours",
            "work.intern.title": "SOFT SQUARE GROUP <span>Professional Programmer Internship Program</span>",
            "work.intern.p1": "Student intern — Professional Programmer Internship Program",
            "work.intern.p2": "Used SQL/PL, Angular, .NET Core, and Jasper Report",
            "work.intern.p3": "Total internship duration: 565 hours",
            "work.edu.title": "B.Sc. Computer Science and Information <span>Khon Kaen University Nong Khai Campus</span>",
            "work.edu.p1": "GPA 3.56, Second Class Honors, graduated in 2024",
            "work.omc.duration": "Apr 2024 - May 2026",
            "work.omc.title": "OMC MLM Software <span>Programmer PHP</span>",
            "work.omc.p1": "Investigated and fixed customer-reported bugs to keep the system stable",
            "work.omc.p2": "Collaborated on new features and performed testing/validation before production",
            "work.omc.p3": "Communicated updates with customers and coordinated with the dev team",
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
            "contact.location.value": ": Nonthaburi, Thailand",
            "contact.jobpref": "Job preference",
            "contact.jobpref.value": ": Programmer (Full-time) · Khon Kaen · 25,000–30,000 THB · Available in 30+ days",
            "contact.email": "Email",
            "contact.education": "Education",
            "contact.phone": "Mobile Number",
            "contact.languages": "Languages",
            "contact.languages.value": ": Thai (native), English (basic)"
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
