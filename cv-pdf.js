/* Vector CV PDF (jsPDF + embedded Sarabun) */
(function () {
  const downloadBtn = document.getElementById("cv-download");
  if (!downloadBtn) return;

  function getLang() {
    return localStorage.getItem("lang") || "th";
  }

  function textOf(sel, root = document) {
    const el = root.querySelector(sel);
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }

  function textsOf(sel, root = document) {
    return [...root.querySelectorAll(sel)].map((el) =>
      el.textContent.replace(/\s+/g, " ").trim()
    ).filter(Boolean);
  }

  async function loadFontAsBase64(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Font load failed: " + url);
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  async function loadFontsBase64() {
    if (window.CV_FONTS && window.CV_FONTS.regular && window.CV_FONTS.bold) {
      return [window.CV_FONTS.regular, window.CV_FONTS.bold];
    }
    return Promise.all([
      loadFontAsBase64("fonts/Sarabun-Regular.ttf"),
      loadFontAsBase64("fonts/Sarabun-Bold.ttf")
    ]);
  }

  function wrapText(doc, text, maxWidth) {
    if (!text) return [""];
    if (doc.getTextWidth(text) <= maxWidth) return [text];

    const hasThai = /[\u0E00-\u0E7F]/.test(text);
    const lines = [];
    let line = "";

    if (hasThai) {
      for (const ch of text) {
        const test = line + ch;
        if (doc.getTextWidth(test) > maxWidth && line) {
          lines.push(line);
          line = ch.trimStart();
        } else {
          line = test;
        }
      }
    } else {
      text.split(/\s+/).forEach((word) => {
        const test = line ? line + " " + word : word;
        if (doc.getTextWidth(test) > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
    }

    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function collectCvData() {
    const root = document.querySelector(".cv");
    const sections = [...root.querySelectorAll(".cv-section")];

    const sectionTitle = (i) => {
      const el = sections[i] && sections[i].querySelector(".cv-section__title");
      return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    };

    const kvFrom = (section) =>
      section
        ? [...section.querySelectorAll(".cv-kv")].map((kv) => ({
            k: textOf(".cv-kv__k", kv),
            v: textOf(".cv-kv__v", kv)
          }))
        : [];

    const jobs = [...root.querySelectorAll(".cv-timeline .cv-item")].map((item) => {
      const placeEl = item.querySelector(".cv-item__place");
      const title = placeEl
        ? [...placeEl.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent.trim())
            .join(" ")
            .trim()
        : "";
      const sub = placeEl ? textOf("span", placeEl) : "";
      return {
        time: textOf(".cv-item__time", item),
        place: [title, sub].filter(Boolean).join(" - "),
        bullets: textsOf(".cv-item__list li", item)
      };
    });

    const eduItem = sections[2] ? sections[2].querySelector(".cv-item") : null;
    const eduPlaceEl = eduItem && eduItem.querySelector(".cv-item__place");
    const eduTitle = eduPlaceEl
      ? [...eduPlaceEl.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent.trim())
          .join(" ")
          .trim()
      : "";
    const eduSub = eduPlaceEl ? textOf("span", eduPlaceEl) : "";

    return {
      name: textOf(".cv-name", root),
      role: textOf(".cv-role", root),
      sub: textOf(".cv-sub", root),
      emails: textsOf(".cv-links a", root).filter((t) => t.includes("@")),
      github: "github.com/SuraramPimankham",
      tel: "061-125-2572",
      location: textOf(".cv-contact__row:nth-child(2) .cv-contact__value", root),
      languages: textOf(".cv-contact__row:nth-child(3) .cv-contact__value", root),
      prefsTitle: sectionTitle(0),
      prefs: kvFrom(sections[0]),
      workTitle: sectionTitle(1),
      jobs,
      eduTitle: sectionTitle(2),
      eduTime: eduItem ? textOf(".cv-item__time", eduItem) : "2020 - 2024",
      eduPlace: [eduTitle, eduSub].filter(Boolean).join(" - "),
      eduText: eduItem ? textOf(".cv-item__text", eduItem) : "",
      skillsTitle: sectionTitle(3),
      skills: textsOf(".cv-tag", root),
      applicantTitle: sectionTitle(4),
      applicant: kvFrom(sections[4])
    };
  }

  async function createVectorPdf() {
    const JsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!JsPDFCtor) {
      throw new Error("jsPDF library not loaded");
    }

    const [regular, bold] = await loadFontsBase64();
    if (!regular || !bold) {
      throw new Error("Sarabun fonts not loaded");
    }

    const doc = new JsPDFCtor({ unit: "mm", format: "a4", orientation: "portrait" });
    doc.addFileToVFS("Sarabun-Regular.ttf", regular);
    doc.addFileToVFS("Sarabun-Bold.ttf", bold);
    doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
    doc.addFont("Sarabun-Bold.ttf", "Sarabun", "bold");
    doc.setFont("Sarabun", "normal");

    const data = collectCvData();
    const pageW = 210;
    const margin = 14;
    const contentW = pageW - margin * 2;
    const accent = [12, 122, 69];
    const muted = [90, 112, 100];
    const text = [20, 36, 28];
    let y = 16;

    const ensureSpace = (need) => {
      if (y + need > 287) {
        doc.addPage();
        y = 16;
      }
    };

    const setNormal = (size) => {
      doc.setFont("Sarabun", "normal");
      doc.setFontSize(size);
    };
    const setBold = (size) => {
      doc.setFont("Sarabun", "bold");
      doc.setFontSize(size);
    };

    // Header
    setBold(20);
    doc.setTextColor(...text);
    doc.text(data.name, margin, y);
    y += 7;

    setBold(11);
    doc.setTextColor(...accent);
    doc.text(data.role, margin, y);
    y += 5;

    setNormal(9);
    doc.setTextColor(...muted);
    doc.text(data.sub, margin, y);
    y += 6;

    setNormal(8.5);
    doc.setTextColor(...text);
    const contactLine = [
      data.tel,
      ...data.emails,
      data.github
    ].join("  |  ");
    wrapText(doc, contactLine, contentW).forEach((line) => {
      doc.text(line, margin, y);
      y += 4;
    });
    if (data.location) {
      wrapText(doc, data.location, contentW).forEach((line) => {
        doc.text(line, margin, y);
        y += 4;
      });
    }
    if (data.languages) {
      doc.text(data.languages, margin, y);
      y += 5;
    }

    doc.setDrawColor(...accent);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    const sectionTitle = (title) => {
      ensureSpace(12);
      setBold(10);
      doc.setTextColor(...accent);
      doc.text(String(title || "").toUpperCase(), margin + 3, y);
      doc.setFillColor(...accent);
      doc.rect(margin, y - 3.2, 1.2, 4, "F");
      y += 6;
    };

    const drawKvGrid = (items) => {
      const colW = (contentW - 4) / 2;
      items.forEach((item, i) => {
        const col = i % 2;
        if (col === 0) ensureSpace(16);
        const x = margin + col * (colW + 4);
        const boxY = y;
        doc.setDrawColor(200, 220, 208);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, boxY, colW, 12, 2, 2, "S");
        setBold(7.5);
        doc.setTextColor(...muted);
        doc.text(item.k, x + 2.5, boxY + 4);
        setNormal(8.5);
        doc.setTextColor(...text);
        const lines = wrapText(doc, item.v, colW - 5);
        lines.slice(0, 2).forEach((line, li) => {
          doc.text(line, x + 2.5, boxY + 8 + li * 3.5);
        });
        if (col === 1 || i === items.length - 1) y += 14;
      });
      y += 2;
    };

    sectionTitle(data.prefsTitle || "Job preference");
    drawKvGrid(data.prefs);

    sectionTitle(data.workTitle || "Work Experience");
    data.jobs.forEach((job) => {
      ensureSpace(28);
      setBold(8);
      doc.setTextColor(...accent);
      doc.setFillColor(232, 245, 236);
      const badge = job.time;
      const badgeW = doc.getTextWidth(badge) + 4;
      doc.roundedRect(margin, y - 3.5, badgeW, 5, 1.5, 1.5, "F");
      doc.text(badge, margin + 2, y);
      y += 5;

      setBold(10);
      doc.setTextColor(...text);
      const placeLines = wrapText(doc, job.place, contentW);
      placeLines.forEach((line) => {
        doc.text(line, margin, y);
        y += 4.5;
      });

      setNormal(8.5);
      doc.setTextColor(...text);
      job.bullets.forEach((b) => {
        const lines = wrapText(doc, b, contentW - 5);
        ensureSpace(lines.length * 4 + 2);
        doc.setFillColor(...accent);
        doc.circle(margin + 1.2, y - 1.1, 0.7, "F");
        lines.forEach((line, idx) => {
          doc.text(line, margin + 4, y);
          y += 4;
        });
        y += 1;
      });
      y += 3;
    });

    sectionTitle(data.eduTitle || "Education");
    ensureSpace(20);
    setBold(8);
    doc.setTextColor(...accent);
    doc.text(data.eduTime, margin, y);
    y += 5;
    setBold(10);
    doc.setTextColor(...text);
    wrapText(doc, data.eduPlace, contentW).forEach((line) => {
      doc.text(line, margin, y);
      y += 4.5;
    });
    setNormal(8.5);
    wrapText(doc, data.eduText, contentW).forEach((line) => {
      doc.text(line, margin, y);
      y += 4;
    });
    y += 4;

    sectionTitle(data.skillsTitle || "Skills");
    ensureSpace(14);
    setNormal(8.5);
    let sx = margin;
    let sy = y;
    data.skills.forEach((skill) => {
      const w = doc.getTextWidth(skill) + 5;
      if (sx + w > pageW - margin) {
        sx = margin;
        sy += 7;
        ensureSpace(10);
      }
      doc.setDrawColor(...accent);
      doc.setFillColor(255, 255, 255);
      doc.setTextColor(...accent);
      doc.roundedRect(sx, sy - 3.5, w, 5.5, 2, 2, "S");
      doc.text(skill, sx + 2.5, sy);
      sx += w + 2;
    });
    y = sy + 8;

    sectionTitle(data.applicantTitle || "Applicant info");
    drawKvGrid(data.applicant);

    const filename = getLang() === "en"
      ? "Suraram-Pimankham-CV-EN.pdf"
      : "Suraram-Pimankham-CV-TH.pdf";
    doc.save(filename);
  }

  async function downloadPdf() {
    const prev = downloadBtn.innerHTML;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>PDF</span>';
    try {
      await createVectorPdf();
    } catch (err) {
      console.error(err);
      alert("Could not create PDF: " + (err && err.message ? err.message : err));
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = prev;
    }
  }

  downloadBtn.addEventListener("click", downloadPdf);

  if (new URLSearchParams(location.search).get("download") === "1") {
    setTimeout(downloadPdf, 500);
  }
})();
