/**
 * NovaFlow Vanilla SVG Chart Engine
 * สร้าง smooth cubic bezier curves และ SVG area chart สำหรับ visual data display
 */

/**
 * ฟังก์ชันช่วยจัดรูปแบบตัวเลขพิกัด SVG ให้กระชับและถูกต้อง
 * ตัดทศนิยมที่ไม่จำเป็น เช่น 0.0 -> 0, 100.0 -> 100
 */
function formatCoord(val) {
  if (Number.isInteger(val)) return `${val}`;
  return Number(val.toFixed(1)).toString();
}

/**
 * คำนวณ cubic bezier control points ระหว่างพิกัดแต่ละจุด
 * @param {Array<{x: number, y: number}>} points - รายการพิกัดจุด
 * @param {number} smoothing - ค่าน้ำหนักความโค้งมน (default: 0.2)
 * @returns {string} SVG path d attribute string
 */
export function generateBezierCurvePath(points, smoothing = 0.2) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${formatCoord(points[0].x)},${formatCoord(points[0].y)}`;

  // คำนวณระยะห่างและมุมระหว่างจุด 2 จุด
  const line = (pointA, pointB) => {
    const lengthX = pointB.x - pointA.x;
    const lengthY = pointB.y - pointA.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    };
  };

  // คำนวณตำแหน่ง control point สำหรับ cubic bezier
  const controlPoint = (current, previous, next, reverse) => {
    const p = previous || current;
    const n = next || current;
    const l = line(p, n);
    const angle = l.angle + (reverse ? Math.PI : 0);
    const length = l.length * smoothing;
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return { x, y };
  };

  return points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${formatCoord(point.x)},${formatCoord(point.y)}`;
    const cps = controlPoint(a[i - 1], a[i - 2], point, false);
    const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
    return `${acc} C ${formatCoord(cps.x)},${formatCoord(cps.y)} ${formatCoord(cpe.x)},${formatCoord(cpe.y)} ${formatCoord(point.x)},${formatCoord(point.y)}`;
  }, '');
}

/**
 * สร้าง SVG markup และ path สำหรับ Area Chart พร้อม gradient fill และ data points
 * @param {Object} options - คอนฟิกการวาดกราฟ
 * @returns {Object} { points, strokeD, fillD, svgMarkup, pathD, areaD, svgString }
 */
export function buildAreaChartSvg({
  data = [],
  width = 600,
  height = 240,
  padding = { top: 20, right: 20, bottom: 30, left: 20 },
  gradientId = 'chart-gradient',
  strokeColor = 'var(--accent-primary)',
  accentColor = 'var(--accent-secondary)'
} = {}) {
  const pad = { top: 20, right: 20, bottom: 30, left: 20, ...padding };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;

  // หาขอบเขตค่า min/max เพื่อ normalize ข้อมูลลงบนพื้นที่กราฟ
  const minVal = data.length > 0 ? Math.min(...data) * 0.95 : 0;
  const maxVal = data.length > 0 ? Math.max(...data) * 1.05 : 1;
  const range = maxVal - minVal || 1;
  const divisor = data.length > 1 ? data.length - 1 : 1;

  // แมปข้อมูลตัวเลขเป็นพิกัด (x, y) ภายใน SVG viewport
  const points = data.map((val, index) => {
    const x = pad.left + (index / divisor) * chartWidth;
    const y = pad.top + chartHeight - ((val - minVal) / range) * chartHeight;
    return { x, y, value: val };
  });

  const strokeD = generateBezierCurvePath(points);
  const lastPoint = points.length > 0 ? points[points.length - 1] : { x: pad.left + chartWidth, y: height - pad.bottom };
  const firstPoint = points.length > 0 ? points[0] : { x: pad.left, y: height - pad.bottom };
  const groundY = height - pad.bottom;

  // สร้าง closed area path สำหรับใส่ gradient
  const fillD = points.length > 0
    ? `${strokeD} L ${formatCoord(lastPoint.x)},${formatCoord(groundY)} L ${formatCoord(firstPoint.x)},${formatCoord(groundY)} Z`
    : '';

  // ประกอบ SVG markup สมบูรณ์
  const svgMarkup = `
    <svg viewBox="0 0 ${width} ${height}" class="novaflow-chart-svg" preserveAspectRatio="none" role="img" aria-label="Interactive Financial Analytics Chart">
      <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.32" />
          <stop offset="85%" stop-color="${strokeColor}" stop-opacity="0.02" />
          <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path class="chart-area-fill" d="${fillD}" fill="url(#${gradientId})" />
      <path class="chart-line-stroke" d="${strokeD}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <g class="chart-points">
        ${points.map((p, idx) => `
          <circle cx="${formatCoord(p.x)}" cy="${formatCoord(p.y)}" r="4" class="chart-dot" data-index="${idx}" data-val="${p.value}" fill="var(--bg-primary)" stroke="${strokeColor}" stroke-width="2" />
        `).join('')}
      </g>
    </svg>
  `.trim();

  return {
    points,
    strokeD,
    fillD,
    svgMarkup,
    pathD: strokeD,
    areaD: fillD,
    svgString: svgMarkup
  };
}

// Alias สำหรับ backward compatibility หรือเรียกใช้ในชื่ออื่น
export const renderAreaChart = buildAreaChartSvg;
