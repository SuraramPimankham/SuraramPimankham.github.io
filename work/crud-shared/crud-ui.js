(function () {
    const script = document.currentScript;
    const storageKey = script?.dataset.storageKey || "crud-demo";
    const projectName = script?.dataset.project || "CRUD";
    const serverPort = script?.dataset.port || "";
    const localUrl = serverPort ? `http://localhost:${serverPort}` : "";

    let apiBase = "/items";
    let useApi = false;
    let pendingImageBase64 = null;
    let clearImageFlag = false;

    const form = document.getElementById("item-form");
    const formTitle = document.getElementById("form-title");
    const editId = document.getElementById("edit-id");
    const nameInput = document.getElementById("name");
    const descInput = document.getElementById("description");
    const imageInput = document.getElementById("image-file");
    const imagePreview = document.getElementById("image-preview");
    const clearImageBtn = document.getElementById("clear-image");
    const submitBtn = document.getElementById("submit-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const msg = document.getElementById("msg");
    const tbody = document.getElementById("items-body");
    const modeBadge = document.getElementById("mode-badge");
    const apiStatus = document.getElementById("api-status");
    const connectBtn = document.getElementById("connect-backend");

    function setApiStatus(html) {
        if (apiStatus) apiStatus.innerHTML = html;
    }

    function setMsg(text, isError) {
        msg.textContent = text;
        msg.className = isError ? "error" : "";
    }

    function setModeBadge(text, type) {
        if (!modeBadge) return;
        modeBadge.textContent = text;
        modeBadge.className = "mode-badge mode-badge--" + type;
    }

    function imageSrc(image) {
        if (!image) return "";
        if (image.startsWith("data:") || image.startsWith("http")) return image;
        if (image.startsWith("/") && useApi) {
            return apiBase.replace(/\/items\/?$/, "") + image;
        }
        return image;
    }

    function resetImageState() {
        pendingImageBase64 = null;
        clearImageFlag = false;
        if (imageInput) imageInput.value = "";
        if (imagePreview) {
            imagePreview.hidden = true;
            imagePreview.removeAttribute("src");
        }
    }

    function resetForm() {
        editId.value = "";
        formTitle.textContent = "เพิ่มรายการ";
        submitBtn.textContent = "บันทึก";
        cancelBtn.hidden = true;
        form.reset();
        resetImageState();
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function renderImageCell(image) {
        if (!image) return '<span class="no-img">—</span>';
        const src = escapeHtml(imageSrc(image));
        return `<img class="thumb" src="${src}" alt="">`;
    }

    function renderItems(items) {
        if (!items.length) {
            tbody.innerHTML = '<tr><td colspan="5">ยังไม่มีรายการ — ลองเพิ่มด้านบน</td></tr>';
            return;
        }
        tbody.innerHTML = items
            .map(
                (item) => `
                <tr>
                    <td>${item.id}</td>
                    <td>${renderImageCell(item.image)}</td>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${escapeHtml(item.description || "")}</td>
                    <td class="actions">
                        <button type="button" class="btn-ghost" data-edit="${item.id}">แก้ไข</button>
                        <button type="button" class="btn-danger" data-del="${item.id}">ลบ</button>
                    </td>
                </tr>
            `
            )
            .join("");
    }

    function readLocal() {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function writeLocal(items) {
        localStorage.setItem(storageKey, JSON.stringify(items));
    }

    function nextId(items) {
        if (!items.length) return 1;
        return Math.max(...items.map((i) => Number(i.id))) + 1;
    }

    function itemUrl(id) {
        return id ? `${apiBase}/${id}` : apiBase;
    }

    function buildPayload(name, description) {
        const payload = { name, description };
        if (pendingImageBase64) payload.imageBase64 = pendingImageBase64;
        else if (clearImageFlag) payload.clearImage = true;
        return payload;
    }

    async function probeUrl(url) {
        try {
            const res = await fetch(url, { method: "GET" });
            if (!res.ok) return false;
            const data = await res.json();
            return Array.isArray(data);
        } catch {
            return false;
        }
    }

    async function probeApi() {
        if (await probeUrl("/items")) {
            apiBase = "/items";
            return true;
        }
        if (localUrl && (await probeUrl(`${localUrl}/items`))) {
            apiBase = `${localUrl}/items`;
            return true;
        }
        return false;
    }

    function applyApiMode(on) {
        useApi = on;
        if (connectBtn) connectBtn.hidden = on;
        if (on) {
            setModeBadge("Backend จริง — เชื่อม API แล้ว", "server");
            setApiStatus(
                `API: <code>${apiBase}</code><br>` +
                    "รูปเก็บใน <code>uploads/</code> (โฟลเดอร์หลัก) · ดู Network → <code>POST/PUT /items</code>"
            );
            setMsg("ข้อมูลมาจาก Supabase PostgreSQL + รูปใน uploads/");
            console.info("[CRUD] Backend:", apiBase);
        } else {
            setModeBadge("โหมดทดลอง — ไม่ส่ง Network", "demo");
            const page = location.href;
            const link = localUrl
                ? `<a href="${localUrl}">${localUrl}</a>`
                : "localhost";
            setApiStatus(
                `เปิดจาก: <code>${page}</code><br>` +
                    "<strong>กดบันทึก = ไม่มี Network</strong> (ใช้ localStorage, รูปเก็บในเบราว์เซอร์)<br>" +
                    `วิธีเห็น Network: รัน server แล้วเปิด ${link} หรือกดปุ่มด้านล่าง`
            );
            setMsg("ข้อมูลอยู่ในเบราว์เซอร์เท่านั้น — ไม่ผ่าน Node/.NET");
        }
    }

    async function loadItems() {
        if (useApi) {
            const res = await fetch(apiBase);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || res.statusText);
            renderItems(data);
            return;
        }
        renderItems(readLocal());
    }

    async function getItem(id) {
        if (useApi) {
            const res = await fetch(itemUrl(id));
            const item = await res.json();
            if (!res.ok) throw new Error(item.error || "ไม่พบรายการ");
            return item;
        }
        const item = readLocal().find((i) => String(i.id) === String(id));
        if (!item) throw new Error("ไม่พบรายการ");
        return item;
    }

    async function createItem(payload) {
        if (useApi) {
            const url = apiBase;
            console.info("[CRUD] Network POST", url, { ...payload, imageBase64: payload.imageBase64 ? "(base64)" : undefined });
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");
            console.info("[CRUD] Response", res.status, data);
            return data;
        }
        console.warn("[CRUD] ไม่ส่ง Network — บันทึก localStorage แทน", payload);
        const items = readLocal();
        const item = {
            id: nextId(items),
            name: payload.name,
            description: payload.description || "",
            image: payload.imageBase64 || "",
        };
        items.push(item);
        writeLocal(items);
        return item;
    }

    async function updateItem(id, payload) {
        if (useApi) {
            const url = itemUrl(id);
            console.info("[CRUD] Network PUT", url, { ...payload, imageBase64: payload.imageBase64 ? "(base64)" : undefined });
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");
            console.info("[CRUD] Response", res.status, data);
            return data;
        }
        console.warn("[CRUD] ไม่ส่ง Network — บันทึก localStorage แทน", { id, ...payload });
        const items = readLocal();
        const index = items.findIndex((i) => String(i.id) === String(id));
        if (index < 0) throw new Error("ไม่พบรายการ");
        if (payload.name !== undefined) items[index].name = payload.name;
        if (payload.description !== undefined) items[index].description = payload.description;
        if (payload.imageBase64) items[index].image = payload.imageBase64;
        else if (payload.clearImage) items[index].image = "";
        writeLocal(items);
        return items[index];
    }

    async function deleteItem(id) {
        if (useApi) {
            const url = itemUrl(id);
            console.info("[CRUD] Network DELETE", url);
            const res = await fetch(url, { method: "DELETE" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "ลบไม่สำเร็จ");
            console.info("[CRUD] Response", res.status, data);
            return data;
        }
        console.warn("[CRUD] ไม่ส่ง Network — ลบ localStorage แทน", { id });
        const items = readLocal();
        const index = items.findIndex((i) => String(i.id) === String(id));
        if (index < 0) throw new Error("ไม่พบรายการ");
        const removed = items.splice(index, 1)[0];
        writeLocal(items);
        return removed;
    }

    tbody.addEventListener("click", async (e) => {
        const edit = e.target.dataset.edit;
        const del = e.target.dataset.del;
        if (edit) {
            try {
                const item = await getItem(edit);
                editId.value = item.id;
                nameInput.value = item.name;
                descInput.value = item.description || "";
                resetImageState();
                if (item.image && imagePreview) {
                    imagePreview.src = imageSrc(item.image);
                    imagePreview.hidden = false;
                }
                formTitle.textContent = `แก้ไข #${item.id}`;
                submitBtn.textContent = "อัปเดต";
                cancelBtn.hidden = false;
                setMsg("");
            } catch (err) {
                setMsg(err.message, true);
            }
            return;
        }
        if (del) {
            if (!confirm(`ลบรายการ #${del}?`)) return;
            try {
                await deleteItem(del);
                setMsg("ลบแล้ว");
                if (String(editId.value) === String(del)) resetForm();
                loadItems();
            } catch (err) {
                setMsg(err.message, true);
            }
        }
    });

    cancelBtn.addEventListener("click", () => {
        resetForm();
        setMsg("");
    });

    if (clearImageBtn) {
        clearImageBtn.addEventListener("click", () => {
            pendingImageBase64 = null;
            clearImageFlag = true;
            if (imageInput) imageInput.value = "";
            if (imagePreview) {
                imagePreview.hidden = true;
                imagePreview.removeAttribute("src");
            }
            setMsg("จะลบรูปเมื่อกดบันทึก");
        });
    }

    if (imageInput) {
        imageInput.addEventListener("change", () => {
            const file = imageInput.files && imageInput.files[0];
            if (!file) return;
            if (!file.type.startsWith("image/")) {
                setMsg("เลือกไฟล์รูปภาพเท่านั้น", true);
                imageInput.value = "";
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setMsg("รูปต้องไม่เกิน 2 MB", true);
                imageInput.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                pendingImageBase64 = reader.result;
                clearImageFlag = false;
                if (imagePreview) {
                    imagePreview.src = pendingImageBase64;
                    imagePreview.hidden = false;
                }
                setMsg("");
            };
            reader.readAsDataURL(file);
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        const description = descInput.value.trim();
        if (!name) {
            setMsg("กรุณากรอกชื่อ", true);
            return;
        }
        const payload = buildPayload(name, description);
        const id = editId.value;
        try {
            if (id) await updateItem(id, payload);
            else await createItem(payload);
            setMsg(id ? "อัปเดตแล้ว" : "เพิ่มแล้ว");
            resetForm();
            loadItems();
        } catch (err) {
            setMsg(err.message, true);
        }
    });

    async function connectBackend() {
        if (!localUrl) return;
        setMsg("กำลังเชื่อม backend...");
        if (await probeUrl(`${localUrl}/items`)) {
            apiBase = `${localUrl}/items`;
            applyApiMode(true);
            await loadItems();
            return;
        }
        setMsg(`เชื่อมไม่ได้ — รัน run.bat ก่อน แล้วลองอีกครั้ง (${localUrl})`, true);
    }

    if (connectBtn) {
        connectBtn.addEventListener("click", connectBackend);
    }

    async function init() {
        tbody.innerHTML = '<tr><td colspan="5">กำลังโหลด...</td></tr>';
        const ok = await probeApi();
        applyApiMode(ok);
        if (!ok && !readLocal().length) {
            writeLocal([
                {
                    id: 1,
                    name: "ตัวอย่างรายการ",
                    description: "ลองเพิ่ม แก้ไข หรือลบได้เลย",
                    image: "",
                },
            ]);
        }
        await loadItems();
    }

    init().catch((err) => {
        tbody.innerHTML = '<tr><td colspan="5">โหลดไม่สำเร็จ</td></tr>';
        setMsg(err.message, true);
    });
})();
