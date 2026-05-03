const DB_NAME = "HSE_DB";
const STORE = "reports";

// فتح قاعدة البيانات
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = e => {
      const db = e.target.result;
      db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("DB Error");
  });
}

// حفظ تقرير
async function saveReport(data) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).add(data);
}

// جلب كل التقارير
async function getReports() {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);

  return new Promise(resolve => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
  });
}

// إضافة تقرير من UI
async function addReport() {
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;

  if (!title) return;

  await saveReport({
    title,
    desc,
    date: new Date().toLocaleString()
  });

  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";

  loadReports();
}

// عرض التقارير
async function loadReports() {
  const list = document.getElementById("list");
  const data = await getReports();

  list.innerHTML = data.map(r => `
    <div class="card">
      <b>${r.title}</b><br/>
      <small>${r.date}</small>
      <p>${r.desc}</p>
    </div>
  `).join("");
}

loadReports();
