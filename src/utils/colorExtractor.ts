import { ProductColor } from '../types';

/**
 * Maps RGB to named color in Moroccan Darija
 */
export function getColorNameFromRGB(r: number, g: number, b: number): string {
  // Grayscale / Black / White / Gray detection
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness < 45) return 'أسود ملكي';
  if (brightness > 220 && diff < 20) return 'أبيض ناصع';
  if (diff < 25) {
    if (brightness < 120) return 'رمادي غامق';
    return 'رمادي فضي';
  }

  // Hue based detection
  let h = 0;
  if (max === r) {
    h = ((g - b) / diff) % 6;
  } else if (max === g) {
    h = (b - r) / diff + 2;
  } else {
    h = (r - g) / diff + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  if (h >= 345 || h < 15) return 'أحمر داكن';
  if (h >= 15 && h < 45) {
    if (brightness < 100) return 'بني جلدي';
    return 'برتقالي مشرق';
  }
  if (h >= 45 && h < 70) {
    if (brightness > 170) return 'أصفر ذهبي';
    return 'بيج راقي';
  }
  if (h >= 70 && h < 165) {
    if (brightness < 80) return 'أخضر زمردي';
    return 'أخضر فاتح';
  }
  if (h >= 165 && h < 260) {
    if (brightness < 80) return 'أزرق كحلي';
    return 'أزرق سماوي';
  }
  if (h >= 260 && h < 315) return 'بنفسجي فاخر';
  return 'وردي أنيق';
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Extracts dominant colors from an image URL using an offscreen Canvas
 */
export async function extractDominantColorsFromImage(imageUrl: string): Promise<ProductColor[]> {
  return new Promise((resolve) => {
    // If it's not a real image or CORS issues might occur, provide a smart fallback
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve([]);
          return;
        }

        // Small dimensions for fast extraction
        const width = 64;
        const height = 64;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height).data;
        const colorCounts: Record<string, { r: number; g: number; b: number; count: number }> = {};

        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Skip transparent or near-white background noise
          if (a < 128) continue;
          if (r > 240 && g > 240 && b > 240) continue;

          // Bucket to 32 steps to cluster similar shades
          const bucketR = Math.round(r / 32) * 32;
          const bucketG = Math.round(g / 32) * 32;
          const bucketB = Math.round(b / 32) * 32;
          const key = `${bucketR},${bucketG},${bucketB}`;

          if (!colorCounts[key]) {
            colorCounts[key] = { r: bucketR, g: bucketG, b: bucketB, count: 0 };
          }
          colorCounts[key].count++;
        }

        // Sort by frequency
        const sorted = Object.values(colorCounts).sort((a, b) => b.count - a.count);
        const top = sorted.slice(0, 3);

        const extracted: ProductColor[] = top.map((item, index) => {
          const hex = rgbToHex(
            Math.min(255, item.r),
            Math.min(255, item.g),
            Math.min(255, item.b)
          );
          const name = getColorNameFromRGB(item.r, item.g, item.b);
          return {
            name,
            hex,
            mediaIndex: 0
          };
        });

        resolve(extracted);
      } catch {
        resolve([]);
      }
    };

    img.onerror = () => {
      resolve([]);
    };
  });
}
