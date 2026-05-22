(function () {
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })

    const birthDate  = new Date(2002, 2, 26); // เดือนใน JavaScript เริ่มจาก 0 = มกราคม
    const ageElement = document.getElementById("age");
    if (ageElement) {
        const today = new Date();
        let age     = today.getFullYear() - birthDate.getFullYear();
        const hasBirthdayPassed = (today.getMonth() > birthDate.getMonth()) ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        if (!hasBirthdayPassed) {
            age -= 1;
        }
        ageElement.textContent = age;
    }
})();
