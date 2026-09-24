/**
 * EventBus — ตัวกลางสำหรับ Publish/Subscribe event ข้ามโมดูล
 * ใช้ CustomEvent และ EventTarget เพื่อให้ทำงานบน Web standard API
 */
export class EventBus {
  constructor() {
    this.target = new EventTarget();
  }

  /**
   * ส่ง event ไปยัง listener ที่ลงทะเบียนไว้
   * @param {string} eventName - ชื่อ event
   * @param {any} [detail={}] - ข้อมูลที่ต้องการส่งไปพร้อม event
   */
  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    this.target.dispatchEvent(event);
  }

  /**
   * ลงทะเบียนฟังก์ชันรอรับ event
   * @param {string} eventName - ชื่อ event
   * @param {Function} callback - ฟังก์ชัน callback รับ event.detail
   */
  on(eventName, callback) {
    const listener = (event) => callback(event.detail);
    callback._wrapped = listener;
    this.target.addEventListener(eventName, listener);
  }

  /**
   * ยกเลิกการรอรับ event
   * @param {string} eventName - ชื่อ event
   * @param {Function} callback - ฟังก์ชัน callback ที่เคยลงทะเบียนไว้
   */
  off(eventName, callback) {
    const listener = callback._wrapped || callback;
    this.target.removeEventListener(eventName, listener);
  }
}

export const eventBus = new EventBus();
