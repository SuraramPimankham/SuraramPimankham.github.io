(function () {
    const translations = {
        th: {
            "meta.title": "โปรไฟล์ Suraram",
            "hero.greeting": "สวัสดีครับ ผมชื่อ <br><span>สุรราม พิมานคำ</span><br />โปรแกรมเมอร์<br />เรียกผมว่า <span>ราม</span>",
            "about.title": "เกี่ยวกับ<span>ผม</span><span class=\"bg-text\">เกี่ยวกับผม</span>",
            "about.heading": "ข้อมูลเกี่ยวกับตัวผม",
            "about.text": "ฉันเรียนจบช่วงประถมที่จังหวัดขอนแก่น และเรียนต่อในระดับมัธยมที่โรงเรียนเฉลิมพระเกียรติ จังหวัดหนองบัวลำภู จากนั้นในช่วง ม.6 ฉันได้ลองเขียนเว็บและทำหุ่นยนต์ ทำให้สนใจ แล้วค่อยๆ เริ่มเขียนโค้ดจริงจังต่อเนื่องเรื่อยมาจนถึงทุกวันนี้",
            "about.exp.label": "ปี <br />ประสบการณ์เขียนโค้ด",
            "about.age.label": "ปี <br />อายุ",
            "about.skills.title": "ทักษะของผม",
            "skill.analysis": "การวิเคราะห์และออกแบบ",
            "work.title": "ประวัติ <span>การทำงาน</span>",
            "work.intern.duration": "ฝึกงาน · 565 ชั่วโมง",
            "work.intern.title": "SOFT SQUARE GROUP <span>Professional Programmer Internship Program</span>",
            "work.intern.p1": "นักศึกษาฝึกงาน ตำแหน่ง Professional Programmer Internship Program",
            "work.intern.p2": "ใช้งาน SQL/PL, Angular, .NET Core และ Jasper Report",
            "work.intern.p3": "รวมระยะเวลาฝึกงาน 565 ชั่วโมง",
            "work.edu.title": "ปริญญาตรี วิทยาการคอมพิวเตอร์และสารสนเทศ <span>Khon Kaen University Nong Khai Campus</span>",
            "work.edu.p1": "เกรดเฉลี่ย 3.56 เกียรตินิยมอันดับ 2 สำเร็จการศึกษาในปี 2024",
            "work.omc.duration": "2024 - ปัจจุบัน",
            "work.omc.title": "OMC MLM Software <span>Programmer PHP</span>",
            "work.omc.p1": "พัฒนา Web application ด้วยภาษา PHP และ jQuery",
            "work.omc.p2": "ดูแลฐานข้อมูลด้วย SQL",
            "work.omc.p3": "แก้งานตาม BRD (Business Requirements Document)",
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
            "contact.email": "อีเมล",
            "contact.education": "การศึกษา",
            "contact.phone": "เบอร์โทรศัพท์",
            "contact.languages": "ภาษา",
            "contact.languages.value": ": ไทย, อังกฤษ (พอเข้าใจนิดหน่อย)"
        },
        en: {
            "meta.title": "Suraram Profile",
            "hero.greeting": "Hi, I'm <br><span>Suraram Pimankham.</span><br />Programmer.<br />Call me <span>Ram</span>",
            "about.title": "About <span>Me</span><span class=\"bg-text\">About Me</span>",
            "about.heading": "Information About me",
            "about.text": "I completed elementary school in Khon Kaen and secondary school at Chalermprakiat School, Nong Bua Lamphu. In grade 12, I started building websites and working with robotics, which sparked my interest in coding. I have been learning and writing code seriously ever since.",
            "about.exp.label": "Years <br />Code Experience",
            "about.age.label": "Years <br />Age",
            "about.skills.title": "My Skills",
            "skill.analysis": "Analysis and Design",
            "work.title": "Work <span>Timeline</span>",
            "work.intern.duration": "Internship · 565 hours",
            "work.intern.title": "SOFT SQUARE GROUP <span>Professional Programmer Internship Program</span>",
            "work.intern.p1": "Student intern — Professional Programmer Internship Program",
            "work.intern.p2": "Used SQL/PL, Angular, .NET Core, and Jasper Report",
            "work.intern.p3": "Total internship duration: 565 hours",
            "work.edu.title": "B.Sc. Computer Science and Information <span>Khon Kaen University Nong Khai Campus</span>",
            "work.edu.p1": "GPA 3.56, Second Class Honors, graduated in 2024",
            "work.omc.duration": "2024 - Present",
            "work.omc.title": "OMC MLM Software <span>Programmer PHP</span>",
            "work.omc.p1": "Develop web applications with PHP and jQuery",
            "work.omc.p2": "Maintain databases with SQL",
            "work.omc.p3": "Implement tasks according to BRD (Business Requirements Document)",
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
            "contact.email": "Email",
            "contact.education": "Education",
            "contact.phone": "Mobile Number",
            "contact.languages": "Languages",
            "contact.languages.value": ": Thai, English (can understand a little)"
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

    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });

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
