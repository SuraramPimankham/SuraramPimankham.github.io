/* Download PDF uses the browser print dialog so the PDF is the A4 sheet.
   Skill bars are shifted onto the device-pixel grid so every bar rasterizes
   at the same thickness at any zoom or sheet scale. */
(function () {
  function sheetScale(sheet) {
    if (!sheet || !sheet.offsetWidth) return 1;
    const width = sheet.getBoundingClientRect().width;
    return width / sheet.offsetWidth || 1;
  }

  /* CSS length that lands on a whole device pixel at this zoom.
     125% is 5/4, so positions must be multiples of 4px; 150% is 3/2,
     so multiples of 2px. A fractional CSS pixel is filtered and looks thicker. */
  function pixelStep() {
    /* Print maps 4px to 3pt, so a 4px grid stays sharp at 100%, 125%, and 150% in the PDF. */
    if (window.matchMedia && window.matchMedia("print").matches) return 4;
    const dpr = window.devicePixelRatio || 1;
    for (let step = 1; step <= 16; step += 1) {
      const device = dpr * step;
      if (Math.abs(device - Math.round(device)) < 1e-4) return step;
    }
    return 1;
  }

  function snapSkillBars() {
    const sheet = document.querySelector(".sheet");
    const tracks = sheet ? [...sheet.querySelectorAll(".rs-bar__track")] : [];
    if (!tracks.length) return;

    const scale = sheetScale(sheet);
    const step = pixelStep();

    tracks.forEach((el) => {
      el.style.top = "0px";
    });

    tracks.forEach((el) => {
      const base = el.getBoundingClientRect().top;
      const target = Math.round(base / step) * step;
      const ideal = (target - base) / scale;
      let best = 0;
      let bestErr = Math.abs(base - target);
      const start = Math.round(ideal * 64);
      for (let n = start - 8; n <= start + 8; n += 1) {
        const candidate = n / 64;
        el.style.top = candidate.toFixed(6) + "px";
        const err = Math.abs(el.getBoundingClientRect().top - target);
        if (err < bestErr) {
          bestErr = err;
          best = candidate;
        }
      }
      el.style.top = Math.abs(best) < 1 / 128 ? "0px" : best.toFixed(6) + "px";
    });
  }

  let snapFrame = 0;
  function scheduleSnap() {
    cancelAnimationFrame(snapFrame);
    snapFrame = requestAnimationFrame(snapSkillBars);
  }

  window.addEventListener("load", scheduleSnap);
  window.addEventListener("resize", scheduleSnap);
  window.addEventListener("beforeprint", snapSkillBars);
  window.addEventListener("afterprint", scheduleSnap);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleSnap);
  }
  if (window.matchMedia) {
    const printMedia = window.matchMedia("print");
    const onPrint = () => snapSkillBars();
    if (printMedia.addEventListener) printMedia.addEventListener("change", onPrint);
    else if (printMedia.addListener) printMedia.addListener(onPrint);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleSnap).catch(() => {});
  }
  scheduleSnap();

  const btn = document.getElementById("cv-download");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    } catch (err) {
      /* print still uses whatever faces are ready */
    }
    snapSkillBars();
    btn.disabled = false;
    window.print();
  });
})();
