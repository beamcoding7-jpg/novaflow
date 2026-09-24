/**
 * จัดรูปแบบตัวเลขเป็นสกุลเงิน (Currency)
 * @param {number} amount - จำนวนเงิน
 * @param {string} [currency='USD'] - รหัสสกุลเงินตาม ISO 4217
 * @param {number} [decimals=2] - จำนวนทศนิยม
 * @returns {string} ข้อความที่จัดรูปแบบแล้ว เช่น "$12,458,920.40"
 */
export function formatCurrency(amount, currency = 'USD', decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

/**
 * จัดรูปแบบตัวเลขขนาดใหญ่ให้อ่านง่าย (Compact number: B, M, K)
 * @param {number} num - ตัวเลขที่ต้องการจัดรูปแบบ
 * @returns {string} ข้อความที่จัดรูปแบบแล้ว เช่น "1.45M", "50K"
 */
export function formatCompactNumber(num) {
  if (Math.abs(num) >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'B';
  }
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * จัดรูปแบบค่าทศนิยมเป็นเปอร์เซ็นต์
 * @param {number} decimal - ค่าทศนิยม เช่น 0.148 สำหรับ 14.8%
 * @param {boolean} [showSign=true] - ใส่เครื่องหมายบวกหน้าร้อยละที่เป็นบวกหรือไม่
 * @returns {string} ข้อความเปอร์เซ็นต์ เช่น "+14.8%", "-3.2%"
 */
export function formatPercent(decimal, showSign = true) {
  const percent = decimal * 100;
  const formatted = percent.toFixed(1) + '%';
  if (showSign && percent > 0) return '+' + formatted;
  return formatted;
}
