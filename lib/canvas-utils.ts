export function getTextPoints(
  text: string,
  fontSize: number,
  width: number,
  height: number,
  density: number = 2
) {
  if (typeof window === "undefined") return [];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  // 1. Standardized high-res buffer
  const bufferW = 1600;
  const bufferH = 400;
  canvas.width = bufferW;
  canvas.height = bufferH;

  // 2. Clear and prepare with black background to bypass alpha/fingerprinting issues in Firefox/Zen
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, bufferW, bufferH);

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2; // Slightly thicker
  
  // 3. Use a very heavy, reliable font string
  const finalFontSize = Math.max(40, Math.floor(fontSize)); // Lowered minimum size to fit mobile
  // If font is very small, sample more densely to get enough points
  const actualDensity = finalFontSize < 80 ? 1 : density; 
  ctx.font = `800 ${finalFontSize}px "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // 4. Single fill render for crisper text (removed strokeText which made it too thick)
  ctx.fillText(text, bufferW / 2, bufferH / 2);

  const points: { x: number; y: number }[] = [];
  try {
    const imageData = ctx.getImageData(0, 0, bufferW, bufferH).data;
    
    let minX = bufferW, minY = bufferH, maxX = 0, maxY = 0;
    const tempPoints: { x: number; y: number }[] = [];

    // 5. Permissive sampling pass
    for (let y = 0; y < bufferH; y += actualDensity) {
      for (let x = 0; x < bufferW; x += actualDensity) {
        // Read the Red channel (index 0) because we drew white on black. 
        // This avoids alpha-channel obfuscation done by anti-fingerprinting browsers.
        const red = imageData[(y * bufferW + x) * 4];
        if (red > 128) { 
          tempPoints.push({ x, y });
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // 6. Centering Normalization
    if (tempPoints.length > 0) {
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      for (const p of tempPoints) {
        points.push({
          x: p.x - centerX,
          y: p.y - centerY
        });
      }
    }
  } catch (e) {
    console.error("Critical: Canvas sampling failed", e);
  }

  // 7. Proper Fisher-Yates Shuffle for unbiased cross-browser randomness
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  return points;
}
