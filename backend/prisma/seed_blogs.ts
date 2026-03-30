import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu seed Blog...');
  await prisma.blog.deleteMany();

  const blogData = [
    {
      title: 'Kinh nghiệm du lịch Phú Quốc 3 ngày 2 đêm tự túc',
      content: 'Phú Quốc luôn là điểm đến hấp dẫn với biển xanh, cát trắng và hải sản tươi ngon. Trong bài viết này, mình sẽ chia sẻ chi tiết lịch trình check-in Nam đảo, đi cáp treo hòn Thơm và thưởng thức bún quậy Kiến Xây...',
      city: 'Phú Quốc'
    },
    {
      title: 'Khám phá Đà Lạt: Những quán cafe view rừng thông cực chill',
      content: 'Đà Lạt không bao giờ làm du khách thất vọng với hàng loạt quán cafe có gu. Mình đã tổng hợp danh sách 10 quán cafe view đồi thông săn mây lý tưởng nhất định bạn phải ghé...',
      city: 'Đà Lạt'
    },
    {
      title: 'Food Tour Hải Phòng: Ăn sập đất Cảng chỉ với 500k',
      content: 'Hải Phòng nổi tiếng với bánh đa cua, bún cá cay, bánh mì que và dừa dầm. Hãy cùng theo chân mình khám phá bản đồ ẩm thực quanh khu chợ Cát Bi và chợ Đổ nhé...',
      city: 'Hải Phòng'
    },
    {
      title: 'Review chi tiết Sapa 4 mùa: Nên đi vào tháng mấy?',
      content: 'Sapa mỗi mùa mang một vẻ đẹp riêng. Mùa xuân hoa đào nở rộ trên bản Tả Phìn, mùa thu lúa chín chói lọi ở thung lũng Mường Hoa, còn mùa đông có thể đón tuyết rơi trên đỉnh Fansipan. Cùng điểm qua những thời điểm vàng du lịch Sapa...',
      city: 'Sapa'
    },
    {
      title: 'Trải nghiệm ngủ đêm trên du thuyền Vịnh Hạ Long',
      content: 'Nếu có dịp đến Hạ Long, đừng bỏ lỡ trải nghiệm ngủ đêm trên du thuyền 5 sao. Bạn sẽ được ngắm hoàng hôn trên boong tàu, chèo kayak lách qua các hang động và tham gia lớp học nấu món Việt.',
      city: 'Hạ Long'
    },
    {
      title: 'Bí kíp săn mây Tà Xùa thành công 100%',
      content: 'Tà Xùa (Sơn La) được mệnh danh là thiên đường săn mây. Nhưng để săn được mây cần xem thời tiết cẩn thận, độ ẩm phải cao và trời không có khối không khí lạnh mạnh. Dưới đây là mẹo bỏ túi cho bạn.',
      city: 'Tà Xùa'
    },
    {
      title: 'Hành trình di sản miền Trung: Huế - Đà Nẵng - Hội An',
      content: 'Chuyến đi 5 ngày 4 đêm đưa bạn đi dọc dải đất di sản miền Trung. Bắt đầu từ Đại Nội Huế, qua đèo Hải Vân ngắm vịnh Lăng Cô, dừng chân tại Đà Nẵng và kết thúc ở phố cổ Hội An lúc lên đèn rực rỡ.',
      city: 'Đà Nẵng'
    },
    {
      title: 'Lang thang phố cổ Hà Nội mùa thu',
      content: 'Mùa thu Hà Nội đẹp đến nao lòng với hương hoa sữa, những gánh cốm xanh và nắng vàng như rót mật trên phố Hoàng Diệu. Gợi ý bạn những góc chụp ảnh hoài cổ đẹp nhất thủ đô.',
      city: 'Hà Nội'
    },
    {
      title: 'Chinh phục cực Bắc Tổ Quốc: Cột cờ Lũng Cú, Đồng Văn',
      content: 'Hà Giang không dành cho những ai thích nghỉ dưỡng, nhưng nó là thiên đường cho dân xê dịch. Điểm nhấn là đèo Mã Pì Lèng vĩ đại và dòng sông Nho Quế xanh ngắt.',
      city: 'Hà Giang'
    },
    {
      title: 'Kinh nghiệm du lịch Băng Cốc (Thái Lan) siêu tiết kiệm',
      content: 'Bạn hoàn toàn có thể vi vu Bangkok chỉ với 5 triệu đồng. Bí quyết là đặt vé sớm, đi tàu điện BTS/MRT và ăn uống thả ga tại các khu chợ đêm như Jodd Fairs...',
      city: 'Bangkok'
    },
    {
      title: 'Những điều cần biết khi lần đầu đi du lịch Singapore',
      content: 'Singapore là quốc gia sạch nhất thế giới với hệ thống giao thông công cộng tuyệt vời. Cần chuẩn bị thẻ EZ-Link và lưu ý các quy định nghiêm ngặt như không nhai kẹo cao su, không xả rác...',
      city: 'Singapore'
    },
    {
      title: 'Mùa vàng Mù Cang Chải: Lịch ngắm lúa chín tuyệt đẹp',
      content: 'Ruộng bậc thang Mù Cang Chải tháng 9 sáng rực rỡ với sắc vàng. Các điểm chụp ảnh đẹp nhất phải kể đến đồi mâm xôi La Pán Tẩn và đồi móng ngựa...',
      city: 'Yên Bái'
    },
    {
      title: 'Cù Lao Chàm: Hòn đảo hoang sơ phải đến khi tới Hội An',
      content: 'Chỉ mất khoảng 20 phút đi cano từ cảng Cửa Đại, bạn sẽ lạc vào biển xanh êm đềm của Cù Lao Chàm. Lặn ngắm san hô là hoạt động được yêu thích nhất tại đây.',
      city: 'Hội An'
    },
    {
      title: 'Khám phá thiên đường hang động Quảng Bình',
      content: 'Quảng Bình là vương quốc hang động. Động Phong Nha hùng vĩ, Động Thiên Đường tuyệt đẹp hay thử thách chinh phục Sơn Đoòng sẽ mang lại cho bạn những cảm xúc khó quên.',
      city: 'Quảng Bình'
    },
    {
      title: 'Bí kíp check-in Cầu Vàng (Đà Nẵng) không bị đông đúc',
      content: 'Cầu Vàng ở Bà Nà Hills rất đông vào buổi trưa. Hãy đi cáp treo chuyến sớm nhất hoặc lưu lại Bà Nà vào buổi tối để có thể chụp những bức ảnh tĩnh lặng không dính người.',
      city: 'Đà Nẵng'
    },
    {
      title: 'Review du lịch Mai Châu: Yên bình và mộc mạc',
      content: 'Cách Hà Nội khoảng 3 tiếng chạy xe, thung lũng Mai Châu hiện ra với những nếp nhà sàn của người Thái. Bạn có thể thuê xe đạp dạo quanh bản Lác và thưởng thức xôi nếp nương thơm lừng.',
      city: 'Hòa Bình'
    },
    {
      title: 'Hướng dẫn xin Visa Hàn Quốc tự túc năm nay',
      content: 'Quy trình xin visa du lịch Hàn Quốc đã được nới lỏng nhưng vẫn cần chuẩn bị hồ sơ tài chính kỹ lưỡng. Bài viết tổng hợp các lỗi thường gặp khiến bạn bị từ chối visa.',
      city: 'Seoul'
    },
    {
      title: 'Kinh nghiệm leo núi Bà Đen (Tây Ninh) trong ngày',
      content: 'Núi Bà Đen mang nhiều vẻ đẹp tâm linh và thiên nhiên. Bạn có thể leo bằng đường cột điện để rèn luyện sức khỏe, hoặc đi cáp treo khứ hồi để vãn cảnh chùa Bà.',
      city: 'Tây Ninh'
    },
    {
      title: 'Vi vu miền Tây mùa nước nổi: An Giang, Đồng Tháp',
      content: 'Từ tháng 9 đến tháng 11, miền Tây vào mùa nước nổi. Trải nghiệm đi xuồng ba lá xuyên rừng tràm Trà Sư hay hái bông súng là những hoạt động vô cùng thú vị.',
      city: 'An Giang'
    },
    {
      title: 'Top 5 bãi biển hoang sơ nhất Nam Trung Bộ',
      content: 'Ngoài Nha Trang hay Mũi Né, dải đất Nam Trung Bộ còn có vịnh Vĩnh Hy, biển Bình Lập, bãi Kỳ Co quyến rũ lòng người nhờ nét hoang sơ, nước trong thấy đáy.',
      city: 'Nam Trung Bộ'
    }
  ];

  for (let i = 0; i < blogData.length; i++) {
    const post = blogData[i];
    
    // Generate 5-7 random image URLs for each post
    const imageCount = Math.floor(Math.random() * 3) + 5; // 5 to 7
    const images = [];
    for (let j = 0; j < imageCount; j++) {
      // Using Picsum random with seed to keep it consistent
      images.push(`https://picsum.photos/seed/blog_${i}_${j}/800/600`);
    }

    await prisma.blog.create({
      data: {
        title: post.title,
        content: post.content + '\\n\\n' + `[Cập nhật chi tiết lịch trình và kinh nghiệm khám phá ${post.city} cùng nhiều hình ảnh. Theo dõi blog của chúng mình để biết thêm!]`,
        author: 'Admin',
        images: images,
      }
    });
  }

  console.log(' - Đã tạo 20 bài blog với 5-7 hình ảnh ngẫu nhiên mỗi bài.');
  console.log('Seed Blog hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
