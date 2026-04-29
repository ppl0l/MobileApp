import * as SQLite from 'expo-sqlite';

const DB_NAME = 'food_delivery.db';

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          date TEXT,
          type TEXT DEFAULT 'order',
          imageUrl TEXT,
          firebaseId TEXT
        );
        CREATE TABLE IF NOT EXISTS api_cache (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE,
          data TEXT,
          timestamp INTEGER
        );
      `);
      await this.migrate();
    } catch (error) {
      console.error(error);
    }
  }

  async migrate() {
    const tableInfo = await this.db.getAllAsync('PRAGMA table_info(orders);');
    const hasImageColumn = tableInfo.some(col => col.name === 'imageUrl');
    if (!hasImageColumn) {
      await this.db.runAsync('ALTER TABLE orders ADD COLUMN imageUrl TEXT;');
    }
    const hasFirebaseIdColumn = tableInfo.some(col => col.name === 'firebaseId');
    if (!hasFirebaseIdColumn) {
      await this.db.runAsync('ALTER TABLE orders ADD COLUMN firebaseId TEXT;');
    }
  }

  async getOrders() {
    return this.db.getAllAsync('SELECT * FROM orders ORDER BY id DESC;');
  }

  async addOrder(title, description, date, type, imageUrl, firebaseId = null) {
    if (firebaseId) {
      const existing = await this.db.getAllAsync('SELECT * FROM orders WHERE firebaseId = ?;', [firebaseId]);
      if (existing.length > 0) {
        return { lastInsertRowId: existing[0].id };
      }
    }
    
    const result = await this.db.runAsync(
      'INSERT INTO orders (title, description, date, type, imageUrl, firebaseId) VALUES (?, ?, ?, ?, ?, ?);',
      [title, description, date, type, imageUrl, firebaseId]
    );
    
    return result;
  }

  async updateFirebaseId(localId, firebaseId) {
    return this.db.runAsync(
      'UPDATE orders SET firebaseId = ? WHERE id = ?;',
      [firebaseId, localId]
    );
  }

  async updateOrder(id, title, description, date, type, imageUrl) {
    return this.db.runAsync(
      'UPDATE orders SET title = ?, description = ?, date = ?, type = ?, imageUrl = ? WHERE id = ?;',
      [title, description, date, type, imageUrl, id]
    );
  }

  async deleteOrder(id) {
    return this.db.runAsync('DELETE FROM orders WHERE id = ?;', [id]);
  }

  async cacheApiData(key, data) {
    const existing = await this.db.getAllAsync('SELECT * FROM api_cache WHERE key = ?;', [key]);
    if (existing.length > 0) {
      await this.db.runAsync('UPDATE api_cache SET data = ?, timestamp = ? WHERE key = ?;', [JSON.stringify(data), Date.now(), key]);
    } else {
      await this.db.runAsync('INSERT INTO api_cache (key, data, timestamp) VALUES (?, ?, ?);', [key, JSON.stringify(data), Date.now()]);
    }
  }

  async getCachedApiData(key) {
    const result = await this.db.getAllAsync('SELECT data FROM api_cache WHERE key = ?;', [key]);
    return result.length > 0 ? JSON.parse(result[0].data) : null;
  }
}

const db = new Database();
export const initDatabase = () => db.init();
export const getOrders = () => db.getOrders();
export const addOrder = (t, d, dt, tp, img, fid) => db.addOrder(t, d, dt, tp, img, fid);
export const updateFirebaseId = (localId, firebaseId) => db.updateFirebaseId(localId, firebaseId);
export const updateOrder = (id, t, d, dt, tp, img) => db.updateOrder(id, t, d, dt, tp, img);
export const deleteOrder = (id) => db.deleteOrder(id);
export const cacheApiData = (k, d) => db.cacheApiData(k, d);
export const getCachedApiData = (k) => db.getCachedApiData(k);