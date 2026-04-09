'use client';

import { Image } from 'antd';

interface ImageGalleryProps {
  mainImage: string;
  productId: string | number;
  category: 'hotel' | 'tour' | 'flight';
  altText?: string;
}

/**
 * Returns a list of image URLs for the gallery.
 * Tours & Hotels: picsum.photos with seed = "{category}-{productId}-{slot}"
 *   → deterministic, unique per product per slot, no API key needed.
 * Flights: local files (unchanged).
 */
function getGalleryImages(
  mainImage: string,
  productId: string | number,
  category: 'hotel' | 'tour' | 'flight',
  count = 8
): string[] {
  // Flights keep local images
  if (category === 'flight') {
    const id = Number(productId) || 1;
    const indices: number[] = [];
    let seed = id;
    while (indices.length < Math.min(5, count)) {
      seed = (seed * 1103515245 + 12345) % 1000000;
      const idx = (Math.abs(seed) % 5) + 1;
      if (!indices.includes(idx)) indices.push(idx);
    }
    const extras = indices.map((i) => `/images/imgflight${i}.jpg`);
    const all = [mainImage, ...extras.filter((img) => img !== mainImage)];
    return all.slice(0, count);
  }

  // Tours & Hotels: picsum.photos deterministic by seed string
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    const seedStr = `${category}-${productId}-${i}`;
    const w = i === 0 ? 800 : 400;
    const h = i === 0 ? 500 : 300;
    images.push(`https://picsum.photos/seed/${seedStr}/${w}/${h}`);
  }

  return images;
}

export default function ImageGallery({ mainImage, productId, category, altText = '' }: ImageGalleryProps) {
  const images = getGalleryImages(mainImage, productId, category, 8);

  return (
    <div>
      <Image.PreviewGroup>
        {/* Hero image */}
        <div style={{ marginBottom: 8 }}>
          <Image
            src={images[0]}
            alt={altText}
            style={{
              width: '100%',
              height: 340,
              objectFit: 'cover',
              borderRadius: 12,
              cursor: 'pointer',
            }}
            preview={{ cover: <span style={{ fontSize: 14 }}>🔍 Xem ảnh</span> }}
          />
        </div>

        {/* Thumbnail grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
          }}
        >
          {images.slice(1).map((img, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <Image
                src={img}
                alt={`${altText} ${idx + 2}`}
                style={{
                  width: '100%',
                  height: 90,
                  objectFit: 'cover',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
                preview={{
                  cover:
                    idx === images.length - 2 ? (
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Xem tất cả</span>
                    ) : undefined,
                }}
              />
            </div>
          ))}
        </div>
      </Image.PreviewGroup>

      <div style={{ fontSize: 12, color: '#888', marginTop: 6, textAlign: 'right' }}>
        📷 {images.length} ảnh • Click để xem toàn màn hình
      </div>
    </div>
  );
}
