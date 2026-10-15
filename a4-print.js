/* Download PDF uses the browser print dialog so the PDF is the A4 sheet. */
(function () {
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
    btn.disabled = false;
    window.print();
  });
})();
