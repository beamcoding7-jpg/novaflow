/**
 * StateStore — จัดการ reactive state ส่วนกลางแบบ Publish/Subscribe
 */
export class StateStore {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = new Map();
  }

  /**
   * ดึงค่า state ตาม key
   * @param {string} key - คีย์ของ state
   * @returns {any}
   */
  get(key) {
    return this.state[key];
  }

  /**
   * อัปเดตค่า state และแจ้งเตือน subscribers หากค่ามีการเปลี่ยนแปลง
   * @param {string} key - คีย์ของ state
   * @param {any} value - ค่าใหม่ที่ต้องการตั้ง
   */
  set(key, value) {
    if (this.state[key] === value) return;
    const prev = this.state[key];
    this.state[key] = value;
    if (this.listeners.has(key)) {
      for (const listener of this.listeners.get(key)) {
        listener(value, prev);
      }
    }
  }

  /**
   * สมัครรับการเปลี่ยนแปลงของ state ตาม key
   * @param {string} key - คีย์ของ state ที่ต้องการเฝ้าดู
   * @param {Function} callback - ฟังก์ชัน callback (newValue, prevValue)
   * @returns {Function} ฟังก์ชันสำหรับยกเลิก subscription
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }
}

/**
 * Singleton state store สำหรับแอปพลิเคชัน NovaFlow
 */
export const state = new StateStore({
  theme: 'light',
  timeframe: '7D',
  volume: 1500000,
  manualHours: 80,
  billingPeriod: 'monthly',
  isModalOpen: false
});
