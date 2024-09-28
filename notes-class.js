class Notes {
  dbVersion = 1;
  dbName = "NotesDB";
  reverseOrder = false;

  connect() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = () => {
        let db = request.result;

        if (!db.objectStoreNames.contains("notes")) {
          db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error.message);
      request.onblocked = () => console.log("Storage is blocked");
    });
  }

  async accessStore(accessType) {
    let connect = await this.connect();
    let tx = connect.transaction("notes", accessType);
    return tx.objectStore("notes");
  }

  async add(note) {
    let store = await this.accessStore("readwrite");
    return store.add(note);
  }

  async delete(noteId) {
    let store = await this.accessStore("readwrite");
    return store.delete(noteId);
  }

  async update(note) {
    let store = await this.accessStore("readwrite");
    return store.put(note);
  }

  async all() {
    let notes = await this.accessStore("readonly");
    return notes.openCursor(null, this.reverseOrder ? "prev" : "next");
  }

  async clear() {
    let notes = await this.accessStore("readwrite");
    return notes.clear();
  }
}
