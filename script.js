const DB_NAME = "HSE_DB";
const STORE_NAME = "reports";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = function (e) {
      const db = e.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("DB Error");
  });
}
