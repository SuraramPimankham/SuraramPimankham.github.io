/* Vector Resume PDF — jsPDF + Sarabun + embedded Suraram avatar */
(function () {
  const downloadBtn = document.getElementById("cv-download");
  if (!downloadBtn || document.body.dataset.doc !== "resume") return;

  function getLang() {
    return localStorage.getItem("lang") || "th";
  }

  function clean(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function textOf(sel, root = document) {
    const el = root.querySelector(sel);
    return el ? clean(el.textContent) : "";
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

  function loadAvatarJpeg() {
    if (window.RESUME_AVATAR_JPEG) {
      return "data:image/jpeg;base64," + window.RESUME_AVATAR_JPEG;
    }
    return null;
  }

  function collectData() {
    const root = document.getElementById("resume-sheet") || document.querySelector(".rs");

    const skills = [...root.querySelectorAll(".rs-skill-group")].map((group) => ({
      title: textOf("h4", group),
      items: [...group.querySelectorAll(".rs-bar")].map((bar) => {
        const labels = [...bar.querySelectorAll(".rs-bar__top span")].map((s) => clean(s.textContent));
        const fill = bar.querySelector(".rs-bar__fill");
        const width = fill && fill.style.width ? parseFloat(fill.style.width) : 0;
        return { name: labels[0] || "", pct: labels[1] || Math.round(width) + "%", value: width };
      })
    }));

    const jobs = [...root.querySelectorAll(".rs-job")].map((job) => {
      const h3 = job.querySelector("h3");
      const company = h3
        ? [...h3.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => clean(n.textContent))
            .join(" ")
        : "";
      const role = h3 ? textOf("span", h3) : "";
      return {
        time: textOf(".rs-job__time", job),
        badge: textOf(".rs-job__badge", job),
        company,
        role,
        bullets: [...job.querySelectorAll("li")].map((li) => clean(li.textContent)).filter(Boolean)
      };
    });

    const projects = [...root.querySelectorAll(".rs-project")].map((p) => ({
      title: textOf("h4", p),
      tech: [...p.querySelectorAll(".rs-project__tech span")].map((s) => clean(s.textContent)),
      desc: textOf("p", p)
    }));

    const tech = [...root.querySelectorAll(".rs-tech-col")].map((col) => ({
      title: textOf("h4", col),
      items: [...col.querySelectorAll("li")].map((li) => clean(li.textContent))
    }));

    const langs = [...root.querySelectorAll(".rs-lang-row")].map((row) => ({
      name: clean(row.querySelector("span") && row.querySelector("span").textContent),
      level: clean(row.querySelector("b") && row.querySelector("b").textContent)
    }));

    return {
      name: textOf(".rs-head h1", root),
      role: textOf(".rs-head__role", root),
      tags: [...root.querySelectorAll(".rs-tag")].map((t) => clean(t.textContent)),
      contactTitle: textOf(".rs-side .rs-card:first-child .rs-side-title", root),
      contact: [...root.querySelectorAll(".rs-contact a, .rs-contact > span")]
        .map((el) => clean(el.textContent))
        .filter(Boolean),
      skillsTitle: textOf(".rs-side .rs-card:nth-child(2) .rs-side-title", root),
      skills,
      eduTitle: textOf(".rs-side .rs-card:nth-child(3) .rs-side-title", root),
      eduDegree: textOf(".rs-edu-item strong", root),
      eduSchool: (() => {
        const spans = [...root.querySelectorAll(".rs-edu-item > span")];
        return spans[0] ? clean(spans[0].textContent) : "";
      })(),
      eduYears: (() => {
        const spans = [...root.querySelectorAll(".rs-edu-item > span")];
        return spans[1] ? clean(spans[1].textContent) : "";
      })(),
      eduNote: textOf(".rs-edu-item p", root),
      langTitle: textOf(".rs-side .rs-card:nth-child(4) .rs-side-title", root),
      langs,
      summaryTitle: textOf(".rs-main section:nth-of-type(1) .rs-section-title", root),
      summary: textOf(".rs-summary", root),
      workTitle: textOf(".rs-main section:nth-of-type(2) .rs-section-title", root),
      jobs,
      projectsTitle: textOf(".rs-main section:nth-of-type(3) .rs-section-title", root),
      projects,
      techTitle: textOf(".rs-main section:nth-of-type(4) .rs-section-title", root),
      tech
    };
  }

  async function createVectorPdf() {
    const JsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!JsPDFCtor) throw new Error("jsPDF library not loaded");

    const [regular, bold] = await loadFontsBase64();
    if (!regular || !bold) throw new Error("Sarabun fonts not loaded");

    const avatar = loadAvatarJpeg();

    const doc = new JsPDFCtor({ unit: "mm", format: "a4", orientation: "portrait" });
    doc.addFileToVFS("Sarabun-Regular.ttf", regular);
    doc.addFileToVFS("Sarabun-Bold.ttf", bold);
    doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
    doc.addFont("Sarabun-Bold.ttf", "Sarabun", "bold");
    doc.setFont("Sarabun", "normal");

    const data = collectData();
    const pageW = 210;
    const pageH = 297;
    const margin = 10;
    const gap = 4;
    const leftW = 62;
    const leftX = margin;
    const rightX = margin + leftW + gap;
    const rightW = pageW - rightX - margin;

    const bg = [13, 18, 24];
    const panel = [21, 27, 36];
    const accent = [57, 255, 138];
    const accent2 = [46, 204, 113];
    const text = [232, 238, 242];
    const muted = [139, 154, 171];

    const setNormal = (size) => {
      doc.setFont("Sarabun", "normal");
      doc.setFontSize(size);
    };
    const setBold = (size) => {
      doc.setFont("Sarabun", "bold");
      doc.setFontSize(size);
    };

    const paintPage = () => {
      doc.setFillColor(...bg);
      doc.rect(0, 0, pageW, pageH, "F");
    };
    paintPage();

    let leftY = margin;
    let rightY = margin;

    const ensureRight = (need) => {
      if (rightY + need > pageH - margin) {
        doc.addPage();
        paintPage();
        rightY = margin;
      }
    };

    const panelBox = (x, y, w, h) => {
      doc.setFillColor(...panel);
      doc.setDrawColor(46, 204, 113);
      doc.setLineWidth(0.25);
      doc.roundedRect(x, y, w, h, 2.5, 2.5, "FD");
    };

    // --- Left: avatar + contact ---
    const contactLines = data.contact;
    let contactBlockH = 8;
    contactLines.forEach((line) => {
      contactBlockH += wrapText(doc, line, leftW - 8).length * 3.6 + 1.2;
    });
    const avatarSize = 28;
    const contactCardH = 8 + avatarSize + 6 + contactBlockH;
    panelBox(leftX, leftY, leftW, contactCardH);
    let cy = leftY + 6;

    if (avatar) {
      const ax = leftX + (leftW - avatarSize) / 2;
      const raw = String(avatar).replace(/^data:image\/jpeg;base64,/i, "");
      doc.addImage(raw, "JPEG", ax, cy, avatarSize, avatarSize);
      doc.setDrawColor(...accent);
      doc.setLineWidth(0.7);
      doc.circle(ax + avatarSize / 2, cy + avatarSize / 2, avatarSize / 2 + 0.2, "S");
    } else {
      doc.setFillColor(...accent2);
      doc.circle(leftX + leftW / 2, cy + avatarSize / 2, avatarSize / 2, "F");
    }
    cy += avatarSize + 6;

    setBold(8);
    doc.setTextColor(...accent);
    doc.text(data.contactTitle || "Contact", leftX + 4, cy);
    cy += 5;
    setNormal(7);
    doc.setTextColor(...muted);
    contactLines.forEach((line) => {
      wrapText(doc, line, leftW - 8).forEach((l) => {
        doc.text(l, leftX + 4, cy);
        cy += 3.6;
      });
      cy += 0.8;
    });
    leftY += contactCardH + 3;

    // Skills
    let skillsH = 10;
    data.skills.forEach((g) => {
      skillsH += 5 + g.items.length * 7;
    });
    const skillsTop = leftY;
    panelBox(leftX, skillsTop, leftW, skillsH);
    cy = skillsTop + 6;
    setBold(8);
    doc.setTextColor(...accent);
    doc.text(data.skillsTitle || "Skills", leftX + 4, cy);
    cy += 5;
    data.skills.forEach((g) => {
      setBold(7);
      doc.setTextColor(...text);
      doc.text(g.title, leftX + 4, cy);
      cy += 4;
      g.items.forEach((item) => {
        setNormal(6.5);
        doc.setTextColor(...muted);
        doc.text(item.name, leftX + 4, cy);
        doc.text(item.pct, leftX + leftW - 4, cy, { align: "right" });
        cy += 1.5;
        doc.setFillColor(40, 48, 58);
        doc.roundedRect(leftX + 4, cy, leftW - 8, 1.6, 0.8, 0.8, "F");
        const fillW = Math.max(1, ((item.value || 0) / 100) * (leftW - 8));
        doc.setFillColor(...accent2);
        doc.roundedRect(leftX + 4, cy, fillW, 1.6, 0.8, 0.8, "F");
        cy += 5;
      });
      cy += 1;
    });
    leftY += skillsH + 3;

    // Education
    const eduLines = [
      ...wrapText(doc, data.eduDegree, leftW - 8),
      ...wrapText(doc, data.eduSchool, leftW - 8),
      ...wrapText(doc, data.eduYears, leftW - 8),
      ...wrapText(doc, data.eduNote, leftW - 8)
    ];
    const eduH = 10 + eduLines.length * 3.6;
    panelBox(leftX, leftY, leftW, eduH);
    cy = leftY + 6;
    setBold(8);
    doc.setTextColor(...accent);
    doc.text(data.eduTitle || "Education", leftX + 4, cy);
    cy += 5;
    setBold(7);
    doc.setTextColor(...text);
    wrapText(doc, data.eduDegree, leftW - 8).forEach((l) => {
      doc.text(l, leftX + 4, cy);
      cy += 3.6;
    });
    setNormal(6.5);
    doc.setTextColor(...muted);
    [data.eduSchool, data.eduYears, data.eduNote].forEach((t) => {
      wrapText(doc, t, leftW - 8).forEach((l) => {
        doc.text(l, leftX + 4, cy);
        cy += 3.6;
      });
    });
    leftY += eduH + 3;

    // Languages
    const langH = 10 + data.langs.length * 5;
    panelBox(leftX, leftY, leftW, langH);
    cy = leftY + 6;
    setBold(8);
    doc.setTextColor(...accent);
    doc.text(data.langTitle || "Languages", leftX + 4, cy);
    cy += 5;
    data.langs.forEach((l) => {
      setNormal(7);
      doc.setTextColor(...muted);
      doc.text(l.name, leftX + 4, cy);
      setBold(7);
      doc.setTextColor(...accent);
      doc.text(l.level, leftX + leftW - 4, cy, { align: "right" });
      cy += 5;
    });

    // --- Right column ---
    const nameLines = wrapText(doc, data.name, rightW - 8);
    const headerH = 8 + nameLines.length * 7 + 10 + 8;
    ensureRight(headerH);
    panelBox(rightX, rightY, rightW, headerH);
    let ry = rightY + 8;
    setBold(16);
    doc.setTextColor(...text);
    nameLines.forEach((l) => {
      doc.text(l, rightX + 4, ry);
      ry += 7;
    });
    setBold(10);
    doc.setTextColor(...accent);
    doc.text(data.role || "Web developer", rightX + 4, ry);
    ry += 6;
    setNormal(7);
    let tagX = rightX + 4;
    data.tags.forEach((tag) => {
      const tw = doc.getTextWidth(tag) + 4;
      if (tagX + tw > rightX + rightW - 4) {
        tagX = rightX + 4;
        ry += 5.5;
      }
      doc.setDrawColor(...accent2);
      doc.setTextColor(...accent);
      doc.roundedRect(tagX, ry - 3.2, tw, 4.5, 1, 1, "S");
      doc.text(tag, tagX + 2, ry);
      tagX += tw + 2;
    });
    rightY += headerH + 3;

    // Summary
    setNormal(8);
    const summaryLines = wrapText(doc, data.summary, rightW - 8);
    const sumH = 10 + summaryLines.length * 4;
    ensureRight(sumH);
    panelBox(rightX, rightY, rightW, sumH);
    ry = rightY + 6;
    setBold(8);
    doc.setTextColor(...accent);
    doc.text(data.summaryTitle || "Summary", rightX + 4, ry);
    ry += 5;
    setNormal(7.5);
    doc.setTextColor(...muted);
    summaryLines.forEach((l) => {
      doc.text(l, rightX + 4, ry);
      ry += 4;
    });
    rightY += sumH + 3;

    // Experience
    ensureRight(10);
    setBold(8);
    doc.setTextColor(...accent);
    doc.setFillColor(...accent);
    doc.rect(rightX, rightY + 0.8, 1.2, 3.5, "F");
    doc.text(data.workTitle || "Experience", rightX + 3, rightY + 4);
    rightY += 8;

    data.jobs.forEach((job) => {
      const bulletLines = job.bullets.map((b) => wrapText(doc, b, rightW - 6));
      const need =
        12 + bulletLines.reduce((n, lines) => n + lines.length * 3.6 + 1, 0);
      ensureRight(need);

      setBold(7);
      doc.setTextColor(...accent);
      doc.text(job.time, rightX + 3, rightY);
      if (job.badge) {
        const bw = doc.getTextWidth(job.badge) + 3;
        doc.setDrawColor(...accent2);
        doc.roundedRect(rightX + rightW - bw, rightY - 3, bw, 4, 1, 1, "S");
        doc.text(job.badge, rightX + rightW - bw + 1.5, rightY);
      }
      doc.setFillColor(...accent);
      doc.circle(rightX + 0.8, rightY - 1, 1, "F");
      rightY += 4.5;

      setBold(9);
      doc.setTextColor(...text);
      doc.text(job.company, rightX + 3, rightY);
      rightY += 4;
      if (job.role) {
        setBold(7.5);
        doc.setTextColor(...accent);
        doc.text(job.role, rightX + 3, rightY);
        rightY += 4;
      }
      setNormal(7);
      doc.setTextColor(...muted);
      job.bullets.forEach((b) => {
        const lines = wrapText(doc, b, rightW - 8);
        ensureRight(lines.length * 3.6 + 2);
        doc.setFillColor(...accent2);
        doc.circle(rightX + 4, rightY - 1, 0.6, "F");
        lines.forEach((l) => {
          doc.text(l, rightX + 6, rightY);
          rightY += 3.6;
        });
        rightY += 0.8;
      });
      rightY += 3;
    });

    // Projects
    ensureRight(28);
    setBold(8);
    doc.setTextColor(...accent);
    doc.setFillColor(...accent);
    doc.rect(rightX, rightY + 0.8, 1.2, 3.5, "F");
    doc.text(data.projectsTitle || "Projects", rightX + 3, rightY + 4);
    rightY += 8;

    const colW = (rightW - 4) / 3;
    const projBlocks = data.projects.map((p) => {
      const titleLines = wrapText(doc, p.title, colW - 4);
      const descLines = wrapText(doc, p.desc, colW - 4);
      const techLine = p.tech.join(" · ");
      const techLines = wrapText(doc, techLine, colW - 4);
      const h = 6 + titleLines.length * 3.5 + techLines.length * 3.2 + descLines.length * 3.2 + 4;
      return { p, titleLines, descLines, techLines, h };
    });
    const rowH = Math.max(...projBlocks.map((b) => b.h), 20);
    ensureRight(rowH + 2);

    projBlocks.forEach((block, i) => {
      const x = rightX + i * (colW + 2);
      panelBox(x, rightY, colW, rowH);
      let py = rightY + 5;
      setBold(7.5);
      doc.setTextColor(...text);
      block.titleLines.forEach((l) => {
        doc.text(l, x + 2, py);
        py += 3.5;
      });
      setNormal(6);
      doc.setTextColor(...accent);
      block.techLines.forEach((l) => {
        doc.text(l, x + 2, py);
        py += 3.2;
      });
      setNormal(6.5);
      doc.setTextColor(...muted);
      block.descLines.forEach((l) => {
        doc.text(l, x + 2, py);
        py += 3.2;
      });
    });
    rightY += rowH + 3;

    // Tech grid
    ensureRight(28);
    setBold(8);
    doc.setTextColor(...accent);
    doc.setFillColor(...accent);
    doc.rect(rightX, rightY + 0.8, 1.2, 3.5, "F");
    doc.text(data.techTitle || "Technical Skills", rightX + 3, rightY + 4);
    rightY += 8;

    const tColW = (rightW - 6) / 4;
    const techH = 8 + Math.max(...data.tech.map((c) => c.items.length), 1) * 3.6;
    ensureRight(techH);
    data.tech.forEach((col, i) => {
      const x = rightX + i * (tColW + 2);
      setBold(7);
      doc.setTextColor(...accent);
      doc.text(col.title, x, rightY);
      let ty = rightY + 4.5;
      setNormal(6.5);
      doc.setTextColor(...muted);
      col.items.forEach((item) => {
        doc.setFillColor(...accent);
        doc.circle(x + 0.8, ty - 1, 0.55, "F");
        doc.text(item, x + 2.5, ty);
        ty += 3.6;
      });
    });

    const filename = getLang() === "en"
      ? "Suraram-Pimankham-Resume-EN.pdf"
      : "Suraram-Pimankham-Resume-TH.pdf";
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
