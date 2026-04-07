/**
 * Script thêm vé máy bay cho các điểm đến có tour nhưng chưa có sân bay:
 * Trong nước: Vũng Tàu, Sapa, Hạ Long
 * Quốc tế: New York, Las Vegas, Sydney, Hong Kong
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getFlightImage(airline) {
  if (airline.includes('Vietnam Airlines')) return '/images/imgflight1.jpg';
  if (airline.includes('Vietjet')) return '/images/imgflight2.jpg';
  if (airline.includes('Bamboo')) return '/images/imgflight3.jpg';
  const otherImages = ['/images/imgflight4.jpg', '/images/imgflight5.jpg'];
  return otherImages[Math.floor(Math.random() * otherImages.length)];
}

async function main() {
  console.log('Bắt đầu thêm vé máy bay còn thiếu...');

  // Lấy số chuyến bay hiện tại để tránh trùng code
  const existingCount = await prisma.flight.count();
  let codeCounter = 9000 + existingCount;

  const domesticAirlines = ['Vietnam Airlines', 'Vietjet Air', 'Bamboo Airways', 'Vietravel Airlines'];
  const intlAirlines = ['Singapore Airlines', 'Japan Airlines', 'Korean Air', 'Emirates', 'Qatar Airways', 'Thai Airways', 'EVA Air'];

  // Các sân bay hiện có (trong nước)
  const existingDomesticAirports = [
    { city: 'Hà Nội', code: 'HAN' },
    { city: 'TP. Hồ Chí Minh', code: 'SGN' },
    { city: 'Đà Nẵng', code: 'DAD' },
    { city: 'Nha Trang', code: 'CXR' },
    { city: 'Phú Quốc', code: 'PQC' },
    { city: 'Đà Lạt', code: 'DLI' },
    { city: 'Hải Phòng', code: 'HPH' },
    { city: 'Huế', code: 'HUI' },
    { city: 'Cần Thơ', code: 'VCA' },
    { city: 'Quy Nhơn', code: 'UIH' },
    { city: 'Buôn Ma Thuột', code: 'BMV' },
    { city: 'Côn Đảo', code: 'VCS' },
  ];

  // ===== ĐIỂM ĐẾN TRONG NƯỚC CÒN THIẾU =====
  // Vũng Tàu không có sân bay thương mại lớn → dùng trực thăng/phà nhưng trong game ta giả lập
  // Sapa → gần nhất là Lào Cai (không có sân bay), ta dùng "sân bay Lào Cai" cho realism
  // Hạ Long → gần nhất là sân bay Vân Đồn (VDO)
  const missingDomesticDestinations = [
    { city: 'Vũng Tàu', code: 'VTG', note: 'Sân bay trực thăng Vũng Tàu' },
    { city: 'Sapa', code: 'LCA', note: 'Sân bay Lào Cai' },
    { city: 'Hạ Long', code: 'VDO', note: 'Sân bay Vân Đồn' },
  ];

  // Tạo chuyến từ các sân bay hiện có đến 3 điểm đến còn thiếu
  for (const dest of missingDomesticDestinations) {
    for (const origin of existingDomesticAirports) {
      // 2 chuyến mỗi cặp (chiều đi)
      for (let k = 0; k < 2; k++) {
        const airline = domesticAirlines[Math.floor(Math.random() * domesticAirlines.length)];
        const code = `VN${codeCounter++}`;
        // chiều đi: origin → dest
        await prisma.flight.create({
          data: {
            name: `Vé máy bay ${origin.city} đi ${dest.city} (${airline})`,
            code: code,
            description: `Chuyến bay ${code} khởi hành từ ${origin.city} đến ${dest.city} (${dest.note}). Hãng hàng không ${airline} cam kết mang đến dịch vụ chất lượng cao.`,
            location: dest.city,
            price: 1000000 + Math.random() * 2500000,
            image: getFlightImage(airline),
            rating: 4 + Math.random(),
            category: 'DOMESTIC',
          },
        });

        // chiều về: dest → origin
        const codeRev = `VN${codeCounter++}`;
        await prisma.flight.create({
          data: {
            name: `Vé máy bay ${dest.city} đi ${origin.city} (${airline})`,
            code: codeRev,
            description: `Chuyến bay ${codeRev} khởi hành từ ${dest.city} (${dest.note}) đến ${origin.city}. Hãng hàng không ${airline} cam kết mang đến dịch vụ chất lượng cao.`,
            location: origin.city,
            price: 1000000 + Math.random() * 2500000,
            image: getFlightImage(airline),
            rating: 4 + Math.random(),
            category: 'DOMESTIC',
          },
        });
      }
    }

    // Tạo chuyến giữa 3 điểm đến mới với nhau
    for (const dest2 of missingDomesticDestinations) {
      if (dest.city !== dest2.city) {
        const airline = domesticAirlines[Math.floor(Math.random() * domesticAirlines.length)];
        const code = `VN${codeCounter++}`;
        await prisma.flight.create({
          data: {
            name: `Vé máy bay ${dest.city} đi ${dest2.city} (${airline})`,
            code: code,
            description: `Chuyến bay ${code} khởi hành từ ${dest.city} đến ${dest2.city}. Hãng hàng không ${airline}.`,
            location: dest2.city,
            price: 1000000 + Math.random() * 2000000,
            image: getFlightImage(airline),
            rating: 4 + Math.random(),
            category: 'DOMESTIC',
          },
        });
      }
    }

    console.log(` ✓ Đã thêm vé máy bay cho điểm đến trong nước: ${dest.city}`);
  }

  // ===== ĐIỂM ĐẾN QUỐC TẾ CÒN THIẾU =====
  const missingIntlDestinations = [
    { city: 'New York', code: 'JFK' },
    { city: 'Las Vegas', code: 'LAS' },
    { city: 'Sydney', code: 'SYD' },
    { city: 'Hong Kong', code: 'HKG' },
  ];

  // Bay từ 3 thành phố lớn VN đến 4 điểm quốc tế còn thiếu
  const mainDomesticCities = [
    { city: 'Hà Nội', code: 'HAN' },
    { city: 'TP. Hồ Chí Minh', code: 'SGN' },
    { city: 'Đà Nẵng', code: 'DAD' },
  ];

  for (const intlDest of missingIntlDestinations) {
    for (const domestic of mainDomesticCities) {
      const airline = intlAirlines[Math.floor(Math.random() * intlAirlines.length)];
      const code = `IN${codeCounter++}`;
      // chiều đi: domestic → intl
      await prisma.flight.create({
        data: {
          name: `Vé quốc tế ${domestic.city} - ${intlDest.city} (${airline})`,
          code: code,
          description: `Chuyến bay quốc tế ${code} của hãng ${airline}. Hành trình từ ${domestic.city} đến ${intlDest.city}.`,
          location: intlDest.city,
          price: 4000000 + Math.random() * 15000000,
          image: getFlightImage(airline),
          rating: 4.2 + Math.random() * 0.8,
          category: 'INTERNATIONAL',
        },
      });

      // chiều về: intl → domestic
      const codeRev = `IN${codeCounter++}`;
      await prisma.flight.create({
        data: {
          name: `Vé quốc tế ${intlDest.city} - ${domestic.city} (${airline})`,
          code: codeRev,
          description: `Chuyến bay quốc tế ${codeRev} của hãng ${airline}. Hành trình từ ${intlDest.city} đến ${domestic.city}.`,
          location: domestic.city,
          price: 4000000 + Math.random() * 15000000,
          image: getFlightImage(airline),
          rating: 4.2 + Math.random() * 0.8,
          category: 'INTERNATIONAL',
        },
      });
    }

    console.log(` ✓ Đã thêm vé máy bay cho điểm đến quốc tế: ${intlDest.city}`);
  }

  // Kiểm tra lại
  const totalFlights = await prisma.flight.count();
  const locationCounts = await prisma.flight.groupBy({
    by: ['location'],
    _count: { id: true },
    orderBy: { location: 'asc' },
  });

  console.log('\n===== TỔNG KẾT =====');
  console.log(`Tổng số vé máy bay: ${totalFlights}`);
  console.log('\nSố vé theo điểm đến:');
  for (const lc of locationCounts) {
    console.log(`  ${lc.location}: ${lc._count.id} vé`);
  }

  console.log('\n✅ Hoàn tất! Tất cả điểm đến trong tour đã có vé máy bay.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
