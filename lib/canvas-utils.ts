export function getTextPoints(
  text: string,
  fontSize: number,
  fontFamily: string,
  width: number,
  height: number,
  density: number = 2
) {
  if (typeof window === "undefined") return [];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  canvas.width = Math.floor(width);
  canvas.height = Math.floor(height);

  // Clear and prepare
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  
  // Use a very thick, standard font for best particle mapping
  const finalFontSize = Math.floor(fontSize);
  ctx.font = `bold ${finalFontSize}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Draw text
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const points = [];
  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    // Sample points with density
    for (let y = 0; y < canvas.height; y += density) {
      for (let x = 0; x < canvas.width; x += density) {
        const index = (y * canvas.width + x) * 4 + 3;
        if (imageData[index] > 128) {
          // Add small random jitter to avoid perfect grid lines
          points.push({ 
            x: x + (Math.random() - 0.5) * (density * 0.5), 
            y: y + (Math.random() - 0.5) * (density * 0.5) 
          });
        }
      }
    }
  } catch (e) {
    console.error("Failed to get image data", e);
  }

  // Shuffle points so particles don't map to text in sequential order (looks more organic)
  return points.sort(() => Math.random() - 0.5);
}
