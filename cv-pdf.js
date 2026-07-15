/* Vector CV PDF — neon dark theme, matches updated cv.html */
(function () {
  const downloadBtn = document.getElementById("cv-download");
  if (!downloadBtn || document.body.dataset.doc !== "cv") return;

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
    const section = (key) => root.querySelector(`[data-cv="${key}"]`);

    const jobs = [...root.querySelectorAll("[data-cv='experience'] .cv-item")].map((item) => {
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
        place: [title, sub].filter(Boolean).join(" — "),
        bullets: textsOf(".cv-item__list li", item)
      };
    });

    const projects = [...root.querySelectorAll("[data-cv='projects'] .cv-project")].map((p) => ({
      title: textOf("h3", p),
      tech: textOf(".cv-project__tech", p),
      desc: textOf("p", p)
    }));

    const skills = [...root.querySelectorAll("[data-cv='skills'] .cv-skill-col")].map((col) => ({
      title: textOf("h4", col),
      items: textOf("p", col)
    }));

    const eduItem = root.querySelector("[data-cv='education'] .cv-item");
    const eduPlaceEl = eduItem && eduItem.querySelector(".cv-item__place");
    const eduTitle = eduPlaceEl
      ? [...eduPlaceEl.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent.trim())
          .join(" ")
          .trim()
      : "";
    const eduSub = eduPlaceEl ? textOf("span", eduPlaceEl) : "";

    const prefsSec = section("prefs");
    const prefs = prefsSec
      ? [...prefsSec.querySelectorAll(".cv-kv")].map((kv) => ({
          k: textOf(".cv-kv__k", kv),
          v: textOf(".cv-kv__v", kv)
        }))
      : [];

    const linkTexts = textsOf(".cv-links a", root);

    return {
      name: textOf(".cv-name", root),
      role: textOf(".cv-role", root),
      contact: linkTexts.join("  ·  "),
      summaryTitle: textOf("[data-cv='summary'] .cv-section__title", root),
      summary: textOf(".cv-summary", root),
      workTitle: textOf("[data-cv='experience'] .cv-section__title", root),
      jobs,
      projectsTitle: textOf("[data-cv='projects'] .cv-section__title", root),
      projects,
      skillsTitle: textOf("[data-cv='skills'] .cv-section__title", root),
      skills,
      eduTitle: textOf("[data-cv='education'] .cv-section__title", root),
      eduTime: eduItem ? textOf(".cv-item__time", eduItem) : "2563 - 2567 (พ.ศ.)",
      eduPlace: [eduTitle, eduSub].filter(Boolean).join(" — "),
      eduText: eduItem ? textOf(".cv-item__text", eduItem) : "",
      prefsTitle: textOf("[data-cv='prefs'] .cv-section__title", root),
      prefs
    };
  }

  async function createVectorPdf() {
    const JsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!JsPDFCtor) throw new Error("jsPDF library not loaded");

    const [regular, bold] = await loadFontsBase64();
    if (!regular || !bold) throw new Error("Sarabun fonts not loaded");

    const doc = new JsPDFCtor({ unit: "mm", format: "a4", orientation: "portrait" });
    doc.addFileToVFS("Sarabun-Regular.ttf", regular);
    doc.addFileToVFS("Sarabun-Bold.ttf", bold);
    doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
    doc.addFont("Sarabun-Bold.ttf", "Sarabun", "bold");
    doc.setFont("Sarabun", "normal");

    const data = collectCvData();
    const pageW = 210;
    const pageH = 297;
    const margin = 12;
    const contentW = pageW - margin * 2;
    const bg = [13, 18, 24];
    const panel = [21, 27, 36];
    const accent = [57, 255, 138];
    const accent2 = [46, 204, 113];
    const muted = [139, 154, 171];
    const text = [232, 238, 242];
    let y = 12;

    const paintPage = () => {
      doc.setFillColor(...bg);
      doc.rect(0, 0, pageW, pageH, "F");
    };
    paintPage();

    const ensureSpace = (need) => {
      if (y + need > 285) {
        doc.addPage();
        paintPage();
        y = 12;
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

    const sectionTitle = (title) => {
      ensureSpace(10);
      setBold(9);
      doc.setTextColor(...accent);
      doc.text(String(title || "").toUpperCase(), margin + 3, y);
      doc.setFillColor(...accent);
      doc.rect(margin, y - 3, 1.2, 3.8, "F");
      y += 5;
    };

    // Compact header
    setBold(16);
    doc.setTextColor(255, 255, 255);
    doc.text(data.name, margin, y);
    y += 5.5;
    setBold(10);
    doc.setTextColor(...accent);
    doc.text(data.role, margin, y);
    y += 4.5;
    setNormal(7.5);
    doc.setTextColor(...muted);
    wrapText(doc, data.contact, contentW).forEach((line) => {
      doc.text(line, margin, y);
      y += 3.5;
    });
    doc.setDrawColor(...accent2);
    doc.setLineWidth(0.4);
    doc.line(margin, y + 0.5, pageW - margin, y + 0.5);
    y += 6;

    // Summary
    sectionTitle(data.summaryTitle || "Summary");
    setNormal(8);
    doc.setTextColor(...muted);
    wrapText(doc, data.summary, contentW).forEach((line) => {
      ensureSpace(4);
      doc.text(line, margin, y);
      y += 3.6;
    });
    y += 3;

    // Experience
    sectionTitle(data.workTitle || "Experience");
    data.jobs.forEach((job) => {
      ensureSpace(16);
      setBold(7.5);
      doc.setTextColor(...accent);
      doc.text(job.time, margin, y);
      y += 4;
      setBold(9);
      doc.setTextColor(255, 255, 255);
      wrapText(doc, job.place, contentW).forEach((line) => {
        doc.text(line, margin, y);
        y += 4;
      });
      setNormal(7.5);
      doc.setTextColor(...muted);
      job.bullets.forEach((b) => {
        const lines = wrapText(doc, b, contentW - 4);
        ensureSpace(lines.length * 3.5 + 2);
        doc.setFillColor(...accent2);
        doc.circle(margin + 1, y - 1, 0.6, "F");
        lines.forEach((line) => {
          doc.text(line, margin + 4, y);
          y += 3.5;
        });
        y += 0.6;
      });
      y += 2.5;
    });

    // Projects
    sectionTitle(data.projectsTitle || "Projects");
    const colW = (contentW - 3) / 2;
    for (let i = 0; i < data.projects.length; i += 2) {
      const left = data.projects[i];
      const right = data.projects[i + 1];
      const measure = (p) => {
        if (!p) return 0;
        return (
          5 +
          wrapText(doc, p.title, colW - 5).length * 3.4 +
          3.2 +
          wrapText(doc, p.desc, colW - 5).length * 3.2 +
          4
        );
      };
      const h = Math.max(measure(left), measure(right), 18);
      ensureSpace(h + 2);

      const drawCard = (p, x) => {
        if (!p) return;
        doc.setFillColor(...panel);
        doc.setDrawColor(...accent2);
        doc.roundedRect(x, y, colW, h, 2, 2, "FD");
        let py = y + 4.5;
        setBold(8);
        doc.setTextColor(255, 255, 255);
        wrapText(doc, p.title, colW - 5).forEach((line) => {
          doc.text(line, x + 2.5, py);
          py += 3.4;
        });
        setNormal(6.5);
        doc.setTextColor(...accent);
        doc.text(p.tech, x + 2.5, py);
        py += 3.5;
        setNormal(7);
        doc.setTextColor(...muted);
        wrapText(doc, p.desc, colW - 5).forEach((line) => {
          doc.text(line, x + 2.5, py);
          py += 3.2;
        });
      };

      drawCard(left, margin);
      if (right) drawCard(right, margin + colW + 3);
      y += h + 2.5;
    }

    // Skills
    sectionTitle(data.skillsTitle || "Skills");
    ensureSpace(16);
    const skillW = (contentW - 6) / 4;
    data.skills.forEach((sk, i) => {
      const x = margin + i * (skillW + 2);
      setBold(7);
      doc.setTextColor(...accent);
      doc.text(sk.title, x, y);
      setNormal(7);
      doc.setTextColor(...muted);
      wrapText(doc, sk.items, skillW).forEach((line, li) => {
        doc.text(line, x, y + 3.5 + li * 3.3);
      });
    });
    y += 14;

    // Education
    sectionTitle(data.eduTitle || "Education");
    ensureSpace(16);
    setBold(7.5);
    doc.setTextColor(...accent);
    doc.text(data.eduTime, margin, y);
    y += 4;
    setBold(9);
    doc.setTextColor(255, 255, 255);
    wrapText(doc, data.eduPlace, contentW).forEach((line) => {
      doc.text(line, margin, y);
      y += 4;
    });
    setNormal(7.5);
    doc.setTextColor(...muted);
    wrapText(doc, data.eduText, contentW).forEach((line) => {
      doc.text(line, margin, y);
      y += 3.5;
    });
    y += 3;

    // Job preference (last)
    if (data.prefs.length) {
      sectionTitle(data.prefsTitle || "Job preference");
      const prefW = (contentW - 3) / 2;
      data.prefs.forEach((item, i) => {
        const col = i % 2;
        if (col === 0) ensureSpace(12);
        const x = margin + col * (prefW + 3);
        const boxY = y;
        doc.setFillColor(...panel);
        doc.setDrawColor(...accent2);
        doc.roundedRect(x, boxY, prefW, 11, 2, 2, "FD");
        setBold(7);
        doc.setTextColor(...muted);
        doc.text(item.k, x + 2.5, boxY + 4);
        setNormal(7.5);
        doc.setTextColor(...text);
        wrapText(doc, item.v, prefW - 5).slice(0, 2).forEach((line, li) => {
          doc.text(line, x + 2.5, boxY + 7.5 + li * 3);
        });
        if (col === 1 || i === data.prefs.length - 1) y += 13;
      });
    }

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
