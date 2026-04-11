
TRƯỜNG ĐẠI HỌC ...
KHOA CÔNG NGHỆ THÔNG TIN



BÁO CÁO ĐỒ ÁN TỐT NGHIỆP

ĐỀ TÀI: XÂY DỰNG NỀN TẢNG DU LỊCH TRỰC TUYẾN TRAVELEASY
Ứng dụng Web và Mobile đặt Tour, Khách sạn và Vé máy bay



Sinh viên thực hiện:      (Điền tên sinh viên)
MSSV:                      (Điền MSSV)
Lớp:                       (Điền lớp)
Giảng viên hướng dẫn:      (Điền tên GVHD)


Năm 2026



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



MỤC LỤC

CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI
   1.1. Lý do chọn đề tài
   1.2. Mục tiêu đề tài
   1.3. Phạm vi đề tài
   1.4. Đối tượng sử dụng
   1.5. Phương pháp nghiên cứu

CHƯƠNG 2: CƠ SỞ LÝ THUYẾT
   2.1. Tổng quan kiến trúc hệ thống
   2.2. Công nghệ Frontend – Web (Next.js)
   2.3. Công nghệ Frontend – Mobile (React Native / Expo)
   2.4. Công nghệ Backend (Express.js)
   2.5. Cơ sở dữ liệu (PostgreSQL + Prisma ORM)
   2.6. Xác thực người dùng (NextAuth.js + Bcrypt)
   2.7. Giao tiếp thời gian thực (Socket.IO)
   2.8. Trí tuệ nhân tạo (Google Gemini AI)
   2.9. Thư viện giao diện (Ant Design + TailwindCSS)

CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
   3.1. Phân tích yêu cầu chức năng
   3.2. Phân tích yêu cầu phi chức năng
   3.3. Biểu đồ Use Case
   3.4. Thiết kế cơ sở dữ liệu
   3.5. Thiết kế API RESTful
   3.6. Biểu đồ tuần tự (Sequence Diagram)

CHƯƠNG 4: XÂY DỰNG ỨNG DỤNG
   4.1. Cấu trúc thư mục dự án
   4.2. Cài đặt và cấu hình môi trường
   4.3. Xây dựng Backend API
   4.4. Xây dựng giao diện Web (Next.js)
   4.5. Xây dựng ứng dụng Mobile (React Native)
   4.6. Tích hợp Chat hỗ trợ thời gian thực
   4.7. Tích hợp AI Chatbot
   4.8. Kết quả demo giao diện

CHƯƠNG 5: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
   5.1. Kết quả đạt được
   5.2. Hạn chế
   5.3. Hướng phát triển

TÀI LIỆU THAM KHẢO
PHỤ LỤC



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



DANH MỤC HÌNH ẢNH

STT       Tên hình                                              Trang
Hình 2.1  Kiến trúc tổng thể hệ thống TravelEasy               ...
Hình 3.1  Biểu đồ Use Case – Khách hàng                        ...
Hình 3.2  Biểu đồ Use Case – Quản trị viên                     ...
Hình 3.3  Sơ đồ quan hệ thực thể (ERD)                         ...
Hình 3.4  Biểu đồ tuần tự – Đặt tour du lịch                   ...
Hình 3.5  Biểu đồ tuần tự – Chat hỗ trợ real-time              ...
Hình 4.1  Giao diện trang chủ                                   ...
Hình 4.2  Giao diện danh sách Tour                              ...
Hình 4.3  Giao diện đặt dịch vụ                                 ...
Hình 4.4  Giao diện Admin Dashboard                             ...
Hình 4.5  Giao diện Mobile App                                  ...



DANH MỤC BẢNG BIỂU

STT       Tên bảng                                              Trang
Bảng 2.1  So sánh công nghệ Frontend                            ...
Bảng 3.1  Danh sách bảng trong CSDL                             ...
Bảng 3.2  Chi tiết bảng User                                    ...
Bảng 3.3  Chi tiết bảng Booking                                 ...
Bảng 3.4  Danh sách API Endpoints                               ...



DANH MỤC TỪ VIẾT TẮT

Ký hiệu         Ý nghĩa
API              Application Programming Interface – Giao diện lập trình ứng dụng
CSDL             Cơ sở dữ liệu
CRUD             Create, Read, Update, Delete – Tạo, Đọc, Cập nhật, Xóa
ERD              Entity-Relationship Diagram – Sơ đồ quan hệ thực thể
GVHD             Giảng viên hướng dẫn
HTTP             HyperText Transfer Protocol – Giao thức truyền siêu văn bản
ORM              Object-Relational Mapping – Ánh xạ đối tượng-quan hệ
OTP              One-Time Password – Mật khẩu dùng một lần
REST             Representational State Transfer – Kiến trúc API RESTful
SSR              Server-Side Rendering – Kết xuất phía máy chủ
UI/UX            User Interface / User Experience – Giao diện / Trải nghiệm người dùng



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI


1.1. Lý do chọn đề tài

Trong bối cảnh công nghệ số phát triển mạnh mẽ, ngành du lịch Việt Nam đang trải qua giai đoạn chuyển đổi số toàn diện. Theo số liệu từ Tổng cục Thống kê, năm 2024-2025 Việt Nam đón hơn 17 triệu lượt khách quốc tế và hơn 110 triệu lượt khách nội địa. Nhu cầu đặt dịch vụ du lịch trực tuyến tăng trưởng mạnh, tuy nhiên phần lớn người dùng Việt Nam vẫn phụ thuộc vào các nền tảng quốc tế như Booking.com, Agoda hay Traveloka.

Các nền tảng quốc tế tuy tiện lợi nhưng tồn tại nhiều hạn chế khi phục vụ thị trường Việt Nam: giao diện chưa được tối ưu cho người dùng Việt, thiếu các dịch vụ tour nội địa đặc thù, chính sách hỗ trợ khách hàng chưa sát với thói quen tiêu dùng trong nước, và chi phí hoa hồng cao đẩy giá dịch vụ lên. Điều này tạo ra khoảng trống lớn cho một nền tảng du lịch nội địa có khả năng tích hợp đa dịch vụ, giao diện thân thiện với người Việt, và chi phí hợp lý hơn.

Nhận thấy tiềm năng lớn của thị trường du lịch trực tuyến nội địa, cùng với mong muốn áp dụng các kiến thức đã học về lập trình Web, lập trình Mobile và thiết kế hệ thống phần mềm, tôi đã quyết định thực hiện đề tài "Xây dựng nền tảng du lịch trực tuyến TravelEasy".

Nền tảng TravelEasy hướng tới mục tiêu cung cấp một giải pháp tích hợp toàn diện, nơi người dùng có thể tìm kiếm, so sánh và đặt mọi dịch vụ du lịch tại một nơi duy nhất, thay vì phải truy cập nhiều website khác nhau cho từng nhu cầu riêng lẻ.


1.2. Mục tiêu đề tài

1.2.1. Mục tiêu tổng quát

Xây dựng một nền tảng du lịch trực tuyến hoàn chỉnh, hoạt động trên cả trình duyệt web và thiết bị di động, cho phép người dùng tìm kiếm, so sánh và đặt các dịch vụ du lịch một cách nhanh chóng, tiện lợi.

1.2.2. Mục tiêu cụ thể

(1) Xây dựng hệ thống máy chủ (server) cung cấp các dịch vụ dữ liệu cho toàn bộ nền tảng, bao gồm quản lý thông tin tour, khách sạn, chuyến bay, đặt chỗ và người dùng.

(2) Phát triển giao diện website với thiết kế hiện đại, tương thích đa thiết bị (máy tính, máy tính bảng, điện thoại), tích hợp hệ thống đăng nhập và phân quyền người dùng.

(3) Phát triển ứng dụng di động hỗ trợ cả Android và iOS, cung cấp trải nghiệm mượt mà trên điện thoại.

(4) Tích hợp tính năng chat hỗ trợ trực tiếp, cho phép khách hàng liên hệ với nhân viên tư vấn ngay trên nền tảng theo thời gian thực.

(5) Tích hợp trợ lý ảo AI có khả năng tư vấn du lịch tự động: gợi ý điểm đến, giải đáp thắc mắc, hướng dẫn sử dụng nền tảng.

(6) Xây dựng trang quản trị cho phép quản lý toàn bộ dịch vụ, đơn hàng, bài viết và hỗ trợ khách hàng.

(7) Xây dựng hệ thống mã giảm giá (voucher) giúp nâng cao trải nghiệm và giữ chân khách hàng.

(8) Xây dựng hệ thống đánh giá và bình luận cho phép khách hàng chia sẻ trải nghiệm sau khi sử dụng dịch vụ.


1.3. Phạm vi đề tài

Đề tài tập trung vào việc xây dựng mẫu thử (prototype) cho nền tảng du lịch trực tuyến với các phạm vi cụ thể:

   Nền tảng:            Ứng dụng Web + Ứng dụng di động (Mobile App)
   Phạm vi dịch vụ:     Tour du lịch, Khách sạn, Vé máy bay
   Phạm vi địa lý:      Du lịch trong nước (Việt Nam) và quốc tế
   Tính năng nâng cao:   Chat hỗ trợ trực tiếp, Trợ lý AI tự động, Hệ thống voucher, Hệ thống đánh giá
   Phạm vi người dùng:   Khách vãng lai (Guest), Khách hàng đã đăng ký (User) và Quản trị viên (Admin)

Lưu ý: Đề tài không bao gồm tính năng thanh toán trực tuyến qua cổng thanh toán và tích hợp bản đồ/GPS do giới hạn thời gian. Các tính năng này được đề xuất ở hướng phát triển tương lai.


1.4. Đối tượng sử dụng

Đối tượng              Mô tả                                    Quyền hạn
Khách (Guest)          Người dùng chưa đăng nhập                Xem thông tin tour, khách sạn, chuyến bay, bài viết
Người dùng (User)      Người dùng đã đăng ký và đăng nhập       Đặt dịch vụ, quản lý đơn hàng, viết đánh giá, chat hỗ trợ, sử dụng voucher, tương tác trợ lý AI
Quản trị viên (Admin)  Người quản lý hệ thống                   Quản lý toàn bộ dịch vụ, đơn hàng, bài viết, voucher, hỗ trợ chat


1.5. Phương pháp nghiên cứu

Phương pháp phân tích và thiết kế hướng đối tượng: Sử dụng UML để mô hình hóa hệ thống thông qua biểu đồ Use Case, biểu đồ tuần tự (Sequence Diagram) và sơ đồ quan hệ thực thể (ERD).

Phương pháp phát triển phần mềm Agile: Xây dựng ứng dụng theo từng module chức năng, lặp đi lặp lại và cải tiến liên tục qua mỗi vòng lặp.

Phương pháp nghiên cứu tài liệu: Tham khảo tài liệu chính thức (Official Documentation) của các công nghệ và thư viện sử dụng trong dự án.

Phương pháp thử nghiệm: Kiểm thử trực tiếp trên trình duyệt web và thiết bị di động (trình giả lập + thiết bị thật) để đánh giá tính năng và trải nghiệm người dùng.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



CHƯƠNG 2: CƠ SỞ LÝ THUYẾT

Chương này trình bày các công nghệ và nền tảng lý thuyết được sử dụng để xây dựng hệ thống TravelEasy. Việc lựa chọn công nghệ dựa trên các tiêu chí: phù hợp với quy mô dự án, có cộng đồng hỗ trợ lớn, tài liệu đầy đủ, và khả năng mở rộng trong tương lai.


2.1. Tổng quan kiến trúc hệ thống

Hệ thống TravelEasy được xây dựng theo kiến trúc Client-Server, là mô hình phổ biến trong phát triển ứng dụng web hiện đại. Trong mô hình này, phía Client (trình duyệt web hoặc ứng dụng di động) chịu trách nhiệm hiển thị giao diện và tương tác với người dùng, còn phía Server xử lý logic nghiệp vụ, truy xuất dữ liệu và trả kết quả về cho Client.

Cụ thể, kiến trúc TravelEasy bao gồm 3 tầng:

   Tầng Client (Client Layer):
      Ứng dụng Web chạy trên trình duyệt, xây dựng bằng Next.js 16 + React 19.
      Ứng dụng Mobile chạy trên điện thoại, xây dựng bằng React Native + Expo 54.

   Tầng Server (Server Layer):
      REST API Server xử lý các yêu cầu từ Client, xây dựng bằng Express.js + TypeScript.
      WebSocket Server xử lý giao tiếp real-time cho tính năng chat, sử dụng Socket.IO.
      AI Service kết nối mô hình ngôn ngữ lớn Google Gemini 2.0 Flash cho tính năng trợ lý ảo.

   Tầng Dữ liệu (Data Layer):
      Cơ sở dữ liệu PostgreSQL lưu trữ toàn bộ dữ liệu hệ thống.
      Prisma ORM làm lớp trung gian giúp thao tác dữ liệu an toàn và tiện lợi.

Luồng dữ liệu hoạt động như sau: Khi người dùng thao tác trên Web hoặc Mobile, Client gửi yêu cầu HTTP tới REST API Server. Server xử lý logic nghiệp vụ, truy xuất dữ liệu qua Prisma ORM đến PostgreSQL, và trả kết quả về cho Client. Riêng tính năng chat, Client kết nối WebSocket tới Socket.IO Server để gửi/nhận tin nhắn theo thời gian thực.

Bảng tóm tắt kiến trúc:

   Tầng               Công nghệ                                      Chức năng
   Client Layer        Next.js 16, React 19, React Native, Expo 54    Giao diện người dùng (Web + Mobile)
   Server Layer        Express.js, Socket.IO, Google Gemini API       Xử lý logic nghiệp vụ, WebSocket, AI
   Data Layer          PostgreSQL, Prisma ORM                         Lưu trữ và quản lý dữ liệu


2.2. Công nghệ Frontend – Web (Next.js)

2.2.1. Next.js là gì?

Next.js là một framework React mã nguồn mở, được phát triển bởi Vercel, hỗ trợ các tính năng nâng cao như:

   Server-Side Rendering (SSR): Kết xuất HTML từ phía server, cải thiện SEO và tốc độ tải trang.

   App Router: Hệ thống routing dựa trên file system, hỗ trợ layouts, loading states, và error boundaries.

   API Routes: Cho phép xây dựng API endpoints ngay bên trong ứng dụng Next.js.

2.2.2. Phiên bản sử dụng

Dự án sử dụng Next.js phiên bản 16.1.1 kết hợp với React 19.2.3, là các phiên bản mới nhất tại thời điểm phát triển.

2.2.3. Lý do chọn Next.js (Bảng 2.1: So sánh công nghệ Frontend)

   Tiêu chí              Next.js              Create React App        Vue.js
   SSR/SSG               Có sẵn               Không                   Có (Nuxt.js)
   SEO                   Tốt                  Kém                     Tốt (Nuxt.js)
   App Router            File-based           Cần cấu hình            File-based
   Hệ sinh thái React    Đầy đủ               Đầy đủ                  Riêng biệt
   Triển khai Vercel      Tích hợp sẵn         Cần cấu hình            Cần cấu hình
   TypeScript            Tốt                  Tốt                     Tốt


2.3. Công nghệ Frontend – Mobile (React Native / Expo)

2.3.1. React Native

React Native là framework do Meta (Facebook) phát triển, cho phép xây dựng ứng dụng di động native cho cả iOS và Android từ một codebase JavaScript/TypeScript duy nhất.

2.3.2. Expo

Expo là một bộ công cụ bổ trợ cho React Native, giúp đơn giản hóa quá trình phát triển và build ứng dụng di động. Dự án sử dụng Expo SDK 54 với React Native 0.81.5.

2.3.3. Các thư viện Mobile chính

   Thư viện                          Phiên bản      Chức năng
   expo                              ~54.0.33       SDK nền tảng
   react-native                      0.81.5         Core framework
   expo-linear-gradient              ~15.0.8        Gradient UI effects
   @expo/vector-icons                ^15.0.3        Icon library
   socket.io-client                  ^4.8.3         Chat real-time
   react-native-safe-area-context    ~5.6.0         Safe area handling


2.4. Công nghệ Backend (Express.js)

2.4.1. Express.js là gì?

Express.js là framework web nhẹ và linh hoạt cho Node.js, cung cấp tập hợp các tính năng mạnh mẽ để xây dựng ứng dụng web và API. Express.js là framework phổ biến nhất trên nền tảng Node.js với hơn 60.000 sao trên GitHub.

2.4.2. Kiến trúc API

Backend được xây dựng theo kiến trúc RESTful API với các đặc điểm:

   Modular Routing: Mỗi nhóm chức năng được tổ chức thành route riêng biệt.

   TypeScript: Sử dụng TypeScript để đảm bảo type-safety và dễ bảo trì.

   Error Handling: Xử lý lỗi tập trung với try/catch và HTTP status codes.

   CORS: Hỗ trợ Cross-Origin Resource Sharing cho phép frontend truy cập API.

2.4.3. Các thư viện Backend chính

   Thư viện            Phiên bản      Chức năng
   express             ^4.21.1        Web framework
   @prisma/client      ^5.22.0        Database ORM client
   bcryptjs            ^3.0.3         Mã hóa mật khẩu
   cors                ^2.8.5         Cross-Origin support
   socket.io           ^4.8.3         WebSocket real-time
   nodemailer          ^8.0.3         Gửi email OTP
   dotenv              ^16.4.5        Biến môi trường
   tsx                 ^4.19.2        TypeScript runner


2.5. Cơ sở dữ liệu (PostgreSQL + Prisma ORM)

2.5.1. PostgreSQL

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở, được đánh giá là RDBMS mạnh mẽ nhất hiện nay. PostgreSQL hỗ trợ đầy đủ ACID compliance, JSON data types, full-text search, và khả năng mở rộng cao.

2.5.2. Prisma ORM

Prisma là một ORM (Object-Relational Mapping) thế hệ mới cho Node.js và TypeScript. Prisma cung cấp:

   Prisma Schema: Định nghĩa model bằng DSL (Domain Specific Language) trực quan.

   Prisma Client: Auto-generated, type-safe database client.

   Prisma Migrate: Quản lý schema migration.

   Prisma Studio: GUI để quản lý dữ liệu.

2.5.3. Ưu điểm của Prisma so với ORM truyền thống

   Tiêu chí              Prisma               Sequelize           TypeORM
   Type Safety            Auto-generated       Partial             Decorators
   Schema Definition      Prisma Schema DSL    JavaScript code     Decorators
   Migration              Tự động              Thủ công            Bán tự động
   Developer Experience   Xuất sắc             Trung bình          Trung bình


2.6. Xác thực người dùng (NextAuth.js + Bcrypt)

2.6.1. NextAuth.js

NextAuth.js là thư viện xác thực mã nguồn mở dành riêng cho Next.js, hỗ trợ:

   Credentials Provider: Xác thực bằng email/password.

   Session Management: Quản lý phiên người dùng (JWT hoặc Database sessions).

   Role-based Access Control: Phân quyền dựa trên vai trò (USER/ADMIN).

2.6.2. Bcrypt.js

Bcrypt.js là thư viện mã hóa mật khẩu sử dụng thuật toán bcrypt. Mật khẩu được băm (hash) với salt factor = 10 trước khi lưu vào database, đảm bảo an toàn ngay cả khi database bị rò rỉ.

2.6.3. Quy trình xác thực

   Bước 1: Người dùng nhập email và password trên giao diện Web/Mobile.
   Bước 2: Client gửi request POST /api/auth/login tới API Server.
   Bước 3: API Server tìm user theo email trong Database.
   Bước 4: Database trả về User data (bao gồm hashed password).
   Bước 5: API Server so sánh mật khẩu bằng Bcrypt.compare(password, hash).
   Bước 6a (Mật khẩu đúng): API Server trả về JWT Token + User info → Client lưu session bằng NextAuth → Hiển thị đăng nhập thành công.
   Bước 6b (Mật khẩu sai): API Server trả về 401 Unauthorized → Hiển thị thông báo lỗi.

2.6.4. Xác thực email bằng OTP

Hệ thống hỗ trợ xác thực email thông qua mã OTP (One-Time Password) 6 chữ số, gửi qua Gmail SMTP (Nodemailer). Mã OTP có thời hạn 10 phút và chỉ sử dụng được một lần.


2.7. Giao tiếp thời gian thực (Socket.IO)

2.7.1. Socket.IO là gì?

Socket.IO là thư viện JavaScript cho phép giao tiếp hai chiều (bidirectional), dựa trên sự kiện (event-based) giữa client và server trong thời gian thực. Socket.IO sử dụng WebSocket protocol với fallback sang HTTP long-polling.

2.7.2. Ứng dụng trong TravelEasy

Socket.IO được tích hợp vào hệ thống chat hỗ trợ khách hàng với các sự kiện:

   Sự kiện                      Hướng              Mô tả
   join_room                    Client → Server    Tham gia phòng chat
   send_message                 Client → Server    Gửi tin nhắn
   receive_message              Server → Client    Nhận tin nhắn mới
   new_message_notification     Server → All       Thông báo tin nhắn mới cho Admin
   new_room                     Server → All       Thông báo phòng chat mới
   room_closed                  Server → Room      Thông báo đóng phòng chat


2.8. Trí tuệ nhân tạo (Google Gemini AI)

2.8.1. Google Gemini

Google Gemini là mô hình AI đa phương thức (multimodal) của Google DeepMind, có khả năng hiểu và tạo ra văn bản, mã, hình ảnh và nhiều loại nội dung khác.

2.8.2. Ứng dụng trong TravelEasy

Hệ thống sử dụng Gemini 2.0 Flash thông qua API để xây dựng TravelEasy AI – trợ lý du lịch thông minh với các khả năng:

   Tư vấn tour, khách sạn, chuyến bay phù hợp.
   Giải đáp thắc mắc về du lịch (thời tiết, văn hóa, kinh nghiệm).
   Dẫn dắt người dùng sử dụng nền tảng TravelEasy.
   Hỗ trợ đa ngôn ngữ (ưu tiên tiếng Việt).

2.8.3. Cấu hình Gemini AI

Hệ thống gọi Gemini API qua HTTP POST request tới endpoint:
   https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

Các tham số cấu hình:
   temperature: 0.7 (Độ sáng tạo)
   topK: 40 (Top-K sampling)
   topP: 0.95 (Top-P sampling)
   maxOutputTokens: 1024 (Giới hạn độ dài phản hồi)


2.9. Thư viện giao diện (Ant Design + TailwindCSS)

2.9.1. Ant Design

Ant Design (antd v6) là thư viện UI React enterprise-grade, cung cấp hơn 60 component được thiết kế sẵn: Button, Table, Modal, Form, Menu, Tabs, Steps, Statistic, Spin, Tag, v.v.

2.9.2. TailwindCSS

TailwindCSS v4 là CSS framework utility-first, cho phép xây dựng giao diện nhanh chóng bằng cách sử dụng các class tiện ích trực tiếp trong HTML/JSX.

2.9.3. Lucide React

Lucide React là thư viện icon hiện đại, nhẹ, cung cấp hơn 1.000+ icon dạng SVG, được sử dụng xuyên suốt giao diện TravelEasy.

2.9.4. Google Fonts

Dự án sử dụng các font chữ từ Google Fonts: Geist (sans-serif), Geist Mono (monospace) và Dancing Script (script) để tạo nên phong cách thiết kế sang trọng và hiện đại.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG


3.1. Phân tích yêu cầu chức năng

3.1.1. Yêu cầu chức năng phía Khách hàng (User)

   STT    Mã      Chức năng                 Mô tả
   1      UC01    Đăng ký tài khoản         Đăng ký bằng email + OTP xác thực
   2      UC02    Đăng nhập/Đăng xuất       Xác thực bằng email/password
   3      UC03    Xem danh sách Tour        Duyệt, tìm kiếm, lọc tour theo danh mục
   4      UC04    Xem danh sách Khách sạn   Duyệt, tìm kiếm khách sạn
   5      UC05    Xem danh sách Chuyến bay  Duyệt, tìm kiếm chuyến bay
   6      UC06    Xem chi tiết dịch vụ      Xem thông tin chi tiết, hình ảnh, đánh giá
   7      UC07    Đặt Tour (Combo)          Đặt tour kết hợp khách sạn + vé máy bay
   8      UC08    Đặt Khách sạn             Đặt phòng đơn/đôi với ngày check-in/out
   9      UC09    Đặt Vé máy bay            Đặt vé phổ thông/thương gia
   10     UC10    Áp dụng Voucher           Nhập mã giảm giá khi đặt dịch vụ
   11     UC11    Quản lý đơn hàng          Xem lịch sử đặt chỗ, trạng thái đơn hàng
   12     UC12    Viết đánh giá             Đánh giá sao + bình luận cho dịch vụ
   13     UC13    Chat hỗ trợ               Chat trực tiếp với Admin
   14     UC14    AI Chatbot                Tương tác với trợ lý AI du lịch
   15     UC15    Xem Blog/Cẩm nang        Đọc bài viết du lịch
   16     UC16    Tìm kiếm toàn cục        Tìm kiếm tour/khách sạn/chuyến bay

3.1.2. Yêu cầu chức năng phía Quản trị viên (Admin)

   STT    Mã      Chức năng                 Mô tả
   1      AC01    Quản lý Tour              CRUD tour du lịch
   2      AC02    Quản lý Khách sạn         CRUD khách sạn
   3      AC03    Quản lý Chuyến bay        CRUD chuyến bay
   4      AC04    Quản lý Đơn hàng          Xem, duyệt, xác nhận, hủy đơn hàng
   5      AC05    Quản lý Blog              CRUD bài viết du lịch
   6      AC06    Hỗ trợ Chat               Phản hồi chat khách hàng, đóng phòng chat
   7      AC07    Phân quyền                Kiểm soát truy cập admin dashboard


3.2. Phân tích yêu cầu phi chức năng

   STT    Yêu cầu         Mô tả
   1      Hiệu năng       Thời gian phản hồi API dưới 500ms, hỗ trợ nhiều người dùng đồng thời
   2      Bảo mật         Mã hóa mật khẩu bcrypt, xác thực JWT, phân quyền role-based
   3      Khả dụng        Hệ thống hoạt động ổn định 24/7, uptime trên 99%
   4      Responsive      Giao diện Web tương thích đa thiết bị (Desktop, Tablet, Mobile)
   5      Trải nghiệm     Giao diện trực quan, dễ sử dụng, animation mượt mà
   6      Mở rộng         Kiến trúc modular, dễ dàng thêm tính năng mới


3.3. Biểu đồ Use Case

3.3.1. Use Case – Khách hàng (User)

Tác nhân: Người dùng (User)

   Người dùng ── Đăng ký tài khoản (UC01)
   Người dùng ── Đăng nhập (UC02)
   Người dùng ── Xem danh sách Tour (UC03)
   Người dùng ── Xem danh sách Khách sạn (UC04)
   Người dùng ── Xem danh sách Chuyến bay (UC05)
   Người dùng ── Xem chi tiết dịch vụ (UC06)
   Người dùng ── Đặt Tour Combo (UC07) ──include──> Áp dụng Voucher (UC10)
   Người dùng ── Đặt Khách sạn (UC08) ──include──> Áp dụng Voucher (UC10)
   Người dùng ── Đặt Vé máy bay (UC09) ──include──> Áp dụng Voucher (UC10)
   Người dùng ── Quản lý đơn hàng (UC11)
   Người dùng ── Viết đánh giá (UC12)
   Người dùng ── Chat hỗ trợ (UC13)
   Người dùng ── AI Chatbot (UC14)
   Người dùng ── Xem Blog (UC15)
   Người dùng ── Tìm kiếm (UC16)

(Hình 3.1: Biểu đồ Use Case – Khách hàng)

3.3.2. Use Case – Quản trị viên (Admin)

Tác nhân: Admin

   Admin ── Quản lý Tour (AC01)
   Admin ── Quản lý Khách sạn (AC02)
   Admin ── Quản lý Chuyến bay (AC03)
   Admin ── Quản lý Đơn hàng (AC04)
   Admin ── Quản lý Blog (AC05)
   Admin ── Hỗ trợ Chat (AC06)
   Admin ── Phân quyền (AC07)

(Hình 3.2: Biểu đồ Use Case – Quản trị viên)


3.4. Thiết kế cơ sở dữ liệu

3.4.1. Danh sách bảng trong CSDL (Bảng 3.1)

   STT    Tên bảng         Mô tả                          Số trường
   1      User             Thông tin người dùng            7
   2      Tour             Thông tin tour du lịch          10
   3      Hotel            Thông tin khách sạn             11
   4      Flight           Thông tin chuyến bay            11
   5      Booking          Thông tin đặt chỗ               20
   6      Review           Đánh giá và bình luận           9
   7      Blog             Bài viết du lịch                6
   8      Voucher          Mã giảm giá                     10
   9      UserVoucher      Voucher của người dùng          6
   10     OTP              Mã xác thực email               5
   11     ChatRoom         Phòng chat hỗ trợ               5
   12     ChatMessage      Tin nhắn chat                   6

3.4.2. Sơ đồ quan hệ thực thể (ERD)

(Hình 3.3: Sơ đồ quan hệ thực thể)

Các mối quan hệ chính:

   User (1) ──── (N) Booking         Một người dùng có nhiều đơn đặt chỗ
   User (1) ──── (N) Review          Một người dùng viết nhiều đánh giá
   User (1) ──── (N) ChatRoom        Một người dùng tạo nhiều phòng chat
   User (1) ──── (N) UserVoucher     Một người dùng thu thập nhiều voucher
   Voucher (1) ── (N) UserVoucher    Một voucher được gán cho nhiều người dùng
   ChatRoom (1) ─ (N) ChatMessage    Một phòng chat chứa nhiều tin nhắn
   Review (1) ──── (N) Review        Một đánh giá có nhiều phản hồi (self-relation)

3.4.3. Chi tiết các bảng chính

Bảng User – Người dùng (Bảng 3.2)

   Trường       Kiểu dữ liệu     Ràng buộc                  Mô tả
   id           Int               PK, Auto Increment         Mã người dùng
   email        String            Unique, Not Null           Địa chỉ email
   name         String            Nullable                   Họ tên
   password     String            Nullable                   Mật khẩu (bcrypt hash)
   role         String            Default: "USER"            Vai trò: USER / ADMIN
   createdAt    DateTime          Default: now()             Thời gian tạo
   updatedAt    DateTime          Auto update                Thời gian cập nhật


Bảng Booking – Đặt chỗ (Bảng 3.3)

   Trường           Kiểu dữ liệu     Ràng buộc              Mô tả
   id               Int               PK, Auto Increment     Mã đơn đặt
   userId           Int               FK → User.id           Người đặt
   type             String            Not Null               Loại: TOUR/HOTEL/FLIGHT
   itemId           Int               Not Null               ID sản phẩm
   itemName         String            Not Null               Tên sản phẩm
   startDate        DateTime          Not Null               Ngày bắt đầu
   endDate          DateTime          Nullable               Ngày kết thúc
   price            Float             Not Null               Giá gốc
   customerName     String            Nullable               Tên khách hàng
   customerPhone    String            Nullable               Số điện thoại
   totalPeople      Int               Default: 1             Tổng số người/vé
   seatClass        String            Nullable               Hạng ghế/phòng
   voucherCode      String            Nullable               Mã voucher áp dụng
   discountAmount   Float             Default: 0             Số tiền giảm
   finalPrice       Float             Nullable               Giá sau giảm
   status           String            Default: "PENDING"     Trạng thái đơn
   flightId         Int               Nullable, FK           Chuyến bay kèm (combo)
   hotelId          Int               Nullable, FK           Khách sạn kèm (combo)
   singleRooms      Int               Nullable               Số phòng đơn (combo)
   doubleRooms      Int               Nullable               Số phòng đôi (combo)


3.5. Thiết kế API RESTful

3.5.1. Danh sách API Endpoints (Bảng 3.4)

AUTHENTICATION (Xác thực)
   STT    Method    Endpoint                         Mô tả
   1      POST      /api/auth/send-otp               Gửi mã OTP xác thực email
   2      POST      /api/auth/register               Đăng ký tài khoản mới
   3      POST      /api/auth/login                  Đăng nhập
   4      POST      /api/auth/forgot-password         Quên mật khẩu

TOURS (Tour du lịch)
   5      GET       /api/tours                       Lấy danh sách tour
   6      GET       /api/tours/:id                   Lấy chi tiết tour
   7      POST      /api/tours                       Tạo tour mới (Admin)
   8      PUT       /api/tours/:id                   Cập nhật tour (Admin)
   9      DELETE    /api/tours/:id                   Xóa tour (Admin)

HOTELS (Khách sạn)
   10     GET       /api/hotels                      Lấy danh sách khách sạn
   11     GET       /api/hotels/:id                  Lấy chi tiết khách sạn
   12     POST      /api/hotels                      Tạo khách sạn mới (Admin)
   13     PUT       /api/hotels/:id                  Cập nhật khách sạn (Admin)
   14     DELETE    /api/hotels/:id                  Xóa khách sạn (Admin)

FLIGHTS (Chuyến bay)
   15     GET       /api/flights                     Lấy danh sách chuyến bay
   16     GET       /api/flights/:id                 Lấy chi tiết chuyến bay
   17     POST      /api/flights                     Tạo chuyến bay mới (Admin)
   18     PUT       /api/flights/:id                 Cập nhật chuyến bay (Admin)
   19     DELETE    /api/flights/:id                 Xóa chuyến bay (Admin)

BOOKINGS (Đặt chỗ)
   20     POST      /api/bookings                    Tạo đơn đặt chỗ mới
   21     GET       /api/bookings                    Lấy tất cả đơn (Admin)
   22     GET       /api/bookings/user/:userId       Lấy đơn của user
   23     PUT       /api/bookings/:id                Cập nhật trạng thái đơn (Admin)

VOUCHERS (Mã giảm giá)
   24     GET       /api/vouchers/available           Lấy voucher đang active
   25     GET       /api/vouchers/user/:userId       Lấy voucher của user
   26     POST      /api/vouchers/check              Kiểm tra và áp dụng voucher

REVIEWS (Đánh giá)
   27     GET       /api/reviews/:type/:itemId       Lấy đánh giá cho dịch vụ
   28     POST      /api/reviews                     Tạo đánh giá mới

BLOGS (Bài viết)
   29     GET       /api/blogs                       Lấy danh sách blog
   30     GET       /api/blogs/:id                   Lấy chi tiết blog
   31     POST      /api/blogs                       Tạo blog mới (Admin)
   32     PUT       /api/blogs/:id                   Cập nhật blog (Admin)
   33     DELETE    /api/blogs/:id                   Xóa blog (Admin)

CHAT (Hỗ trợ trực tuyến)
   34     POST      /api/chat/rooms                  Tạo/lấy phòng chat
   35     GET       /api/chat/rooms                  Lấy tất cả phòng chat (Admin)
   36     GET       /api/chat/rooms/:id/messages     Lấy lịch sử tin nhắn
   37     PATCH     /api/chat/rooms/:id/close        Đóng phòng chat (Admin)

AI (Trí tuệ nhân tạo)
   38     POST      /api/ai/chat                     Gửi tin nhắn cho AI Chatbot


3.6. Biểu đồ tuần tự (Sequence Diagram)

3.6.1. Quy trình đặt Tour (Combo: Tour + Khách sạn + Vé máy bay)

(Hình 3.4: Biểu đồ tuần tự – Đặt Tour Combo)

   Bước 1:  User chọn Tour trên giao diện, nhập thông tin đặt chỗ.
   Bước 2:  User chọn khách sạn và chuyến bay kèm theo.
   Bước 3:  User nhập mã Voucher (nếu có).
   Bước 4:  Web Client gửi POST /api/vouchers/check tới API Server.
   Bước 5:  API Server kiểm tra voucher hợp lệ trong Database.
   Bước 6:  Database trả về Voucher data.
   Bước 7:  API Server trả kết quả kiểm tra + số tiền giảm cho Web Client.
   Bước 8:  Web Client gửi POST /api/bookings (Tour Combo) tới API Server.
   Bước 9:  API Server kiểm tra tồn kho chuyến bay trong Database.
   Bước 10: API Server trừ ghế Economy/Business.
   Bước 11: API Server kiểm tra tồn kho khách sạn trong Database.
   Bước 12: API Server trừ phòng Single/Double.
   Bước 13: API Server xác thực và đánh dấu voucher đã dùng.
   Bước 14: API Server tạo bản ghi Booking trong Database.
   Bước 15: Database trả về Booking record.
   Bước 16: API Server trả Booking thành công + Chi tiết đơn cho Web Client.
   Bước 17: Web Client hiển thị xác nhận đặt chỗ cho User.

3.6.2. Quy trình Chat hỗ trợ Real-time

(Hình 3.5: Biểu đồ tuần tự – Chat hỗ trợ Real-time)

   Bước 1:  User mở cửa sổ Chat trên giao diện.
   Bước 2:  Web Client gửi POST /api/chat/rooms (userId) tới API Server.
   Bước 3:  API Server tạo hoặc lấy ChatRoom đang OPEN từ Database.
   Bước 4:  Database trả về Room data.
   Bước 5:  API Server trả Room info + messages cho Web Client.
   Bước 6:  Web Client emit("join_room", roomId) tới Socket.IO Server.
   Bước 7:  Socket.IO Server emit("new_room", room) tới Admin Panel.
   Bước 8:  User nhập tin nhắn.
   Bước 9:  Web Client emit("send_message", data) tới Socket.IO Server.
   Bước 10: Socket.IO Server lưu tin nhắn vào Database (prisma.chatMessage.create).
   Bước 11: Socket.IO Server cập nhật updatedAt của ChatRoom.
   Bước 12: Socket.IO Server emit("receive_message", message) tới Web Client.
   Bước 13: Socket.IO Server emit("new_message_notification") tới Admin Panel.
   Bước 14: Admin nhập phản hồi.
   Bước 15: Admin Panel emit("send_message", reply) tới Socket.IO Server.
   Bước 16: Socket.IO Server lưu tin nhắn phản hồi vào Database.
   Bước 17: Socket.IO Server emit("receive_message", reply) tới Web Client.
   Bước 18: Web Client hiển thị phản hồi Admin cho User.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



CHƯƠNG 4: XÂY DỰNG ỨNG DỤNG


4.1. Cấu trúc thư mục dự án

TravelEasy/
   backend/                          Backend Server
      prisma/
         schema.prisma               Database schema
         seed.ts                     Dữ liệu mẫu
         seed_blogs.ts               Dữ liệu blog
         migrations/                 Database migrations
      src/
         index.ts                    Entry point (Express + Socket.IO)
         routes/
            auth.ts                  Xác thực (OTP, Login, Register)
            tours.ts                 API Tour
            hotels.ts                API Khách sạn
            flights.ts               API Chuyến bay
            bookings.ts              API Đặt chỗ
            vouchers.ts              API Voucher
            reviews.ts               API Đánh giá
            blogs.ts                 API Blog
            chat.ts                  API Chat (Socket.IO)
            ai.ts                    API AI Chatbot
      public/images/                 Hình ảnh tĩnh
      package.json
      tsconfig.json

   web/                              Web Frontend
      src/
         app/
            layout.tsx               Root layout
            page.tsx                 Trang chủ
            globals.css              Global styles
            tours/                   Trang Tour
            hotels/                  Trang Khách sạn
            flights/                 Trang Chuyến bay
            bookings/                Trang Đơn hàng
            order/                   Trang Đặt dịch vụ
            blogs/                   Trang Blog
            vouchers/                Trang Voucher
            about/                   Trang Giới thiệu
            profile/                 Trang Cá nhân
            auth/                    Trang Đăng nhập/Đăng ký
            admin/                   Trang Quản trị
               layout.tsx            Admin layout (Sidebar)
               bookings/             Quản lý đơn hàng
               tours/                Quản lý tour
               hotels/               Quản lý khách sạn
               flights/              Quản lý chuyến bay
               blogs/                Quản lý blog
               chat/                 Quản lý chat hỗ trợ
            api/                     Next.js API Routes
               auth/                 NextAuth config
               send-email/           Email API
         components/
            Header.tsx               Thanh điều hướng
            Footer.tsx               Chân trang
            ChatBot.tsx              Chatbot AI + Chat hỗ trợ
            GlobalSearch.tsx          Tìm kiếm toàn cục
            ImageGallery.tsx          Bộ sưu tập ảnh
            ReviewSection.tsx         Phần đánh giá
            providers.tsx            NextAuth Provider
         context/
            ThemeContext.tsx          Quản lý theme
         lib/                        Thư viện tiện ích
         types/                      TypeScript types
      public/                        Assets tĩnh
      package.json
      next.config.ts

   app/                              Mobile Application
      App.js                         Entry point (React Native)
      src/                           Source code
      assets/                        Hình ảnh, icon
      app.json                       Expo config
      package.json

   README.md


4.2. Cài đặt và cấu hình môi trường

4.2.1. Yêu cầu hệ thống

   Phần mềm            Phiên bản tối thiểu
   Node.js              >= 18.x
   npm                  >= 9.x
   PostgreSQL           >= 15.x
   Git                  >= 2.x
   VS Code              Mới nhất
   Expo CLI             Mới nhất

4.2.2. Biến môi trường (.env)

Backend (.env):
   DATABASE_URL = "postgresql://user:password@host:5432/traveleasy"
   PORT = 4000
   GMAIL_USER = "your-email@gmail.com"
   GMAIL_PASS = "app-specific-password"
   GEMINI_API_KEY = "your-gemini-api-key"

Web (.env):
   NEXT_PUBLIC_API_URL = "http://localhost:4000"
   NEXTAUTH_URL = "http://localhost:3000"
   NEXTAUTH_SECRET = "your-secret-key"

4.2.3. Cài đặt và khởi chạy

Bước 1: Clone dự án
   git clone https://github.com/vuthaihoa0210/TravelEasy.git

Bước 2: Cài đặt Backend
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   npm run dev                (Chạy tại http://localhost:4000)

Bước 3: Cài đặt Web
   cd ../web
   npm install
   npx prisma generate
   npm run dev                (Chạy tại http://localhost:3000)

Bước 4: Cài đặt Mobile
   cd ../app
   npm install
   npx expo start             (Mở Expo DevTools)


4.3. Xây dựng Backend API

4.3.1. Entry Point (index.ts)

Backend server được xây dựng với Express.js kết hợp Socket.IO, phục vụ đồng thời HTTP REST API và WebSocket.

Cấu trúc chính:
   Khởi tạo Express app và HTTP server.
   Khởi tạo Socket.IO server với CORS cho phép tất cả origin.
   Khởi tạo Prisma Client để kết nối database.
   Cấu hình middleware: CORS và JSON body parser.
   Serve static images từ thư mục public/images.
   Đăng ký 10 nhóm route API.
   Thiết lập Socket.IO events cho chat real-time.
   Lắng nghe trên PORT (mặc định 4000).

4.3.2. Xử lý nghiệp vụ đặt chỗ (Booking)

Logic đặt chỗ là phần phức tạp nhất của hệ thống, xử lý 3 loại dịch vụ:

(1) Đặt vé máy bay (FLIGHT):
   Kiểm tra tồn kho theo hạng ghế (Business/Economy).
   Trừ số ghế available tương ứng.
   Hỗ trợ đặt nhiều vé cùng lúc.

(2) Đặt khách sạn (HOTEL):
   Kiểm tra tồn kho theo loại phòng (Single/Double).
   Trừ số phòng available tương ứng.

(3) Đặt Tour Combo (TOUR):
   Xử lý đồng thời: Tour + Khách sạn kèm + Chuyến bay kèm.
   Kiểm tra và trừ kho independent cho cả Flight và Hotel.
   Lưu chi tiết Combo (singleRooms, doubleRooms, economySeats, businessSeats).

(4) Áp dụng Voucher:
   Validate mã voucher (tồn tại, active, chưa hết hạn, đúng danh mục).
   Tính giảm giá: PERCENT (có maxDiscount) hoặc FIXED.
   Kiểm tra người dùng đã sử dụng voucher chưa.
   Đánh dấu voucher đã dùng trong bảng UserVoucher.

4.3.3. Quản lý tồn kho thông minh

Hệ thống tự động quản lý tồn kho (inventory) cho khách sạn và chuyến bay. Khi đặt dịch vụ, hệ thống sẽ:
   Kiểm tra số lượng available >= số lượng yêu cầu.
   Nếu đủ: trừ kho bằng Prisma decrement operation.
   Nếu không đủ: trả về lỗi 400 với thông báo cụ thể.


4.4. Xây dựng giao diện Web (Next.js)

4.4.1. Trang chủ (Homepage)

Trang chủ được thiết kế với phong cách luxury và modern, bao gồm:

(1) Hero Section: Slideshow 3 ảnh tự động chuyển (5 giây/slide) với tiêu đề và tagline bằng font Dancing Script. Có nút điều hướng trái/phải và indicator dots.

(2) Search Card: Thanh tìm kiếm thông minh dạng floating card, bao gồm dropdown chọn loại dịch vụ (Tour du lịch / Khách sạn / Vé máy bay) và ô nhập từ khóa tìm kiếm.

(3) Featured Hotels: Hiển thị 3 khách sạn nổi bật (2 trong nước + 1 quốc tế) với hình ảnh, giá, vị trí, rating và tag danh mục.

(4) Featured Tours: Hiển thị 3 tour đặc sắc với thông tin combo (khách sạn + hãng bay kèm theo).

(5) Why Us Section: Trình bày 3 điểm USP (Tốc độ, Bảo mật, Tận tâm) với icon và mô tả.

(6) Booking Guide: Quy trình 4 bước đặt dịch vụ (Tìm kiếm → Lựa chọn → Thanh toán → Xác nhận) với step indicator.

(7) Blog Section: Hiển thị 4 bài viết cẩm nang du lịch mới nhất với hình ảnh và ngày đăng.

(8) CTA Section: Banner kêu gọi đăng ký thành viên với background parallax và gradient overlay.

4.4.2. Thiết kế Layout (Header + Footer + ChatBot)

Header: Thanh điều hướng cố định (sticky) bao gồm:
   Logo TravelEasy.
   Menu chính: Tour, Khách sạn, Vé máy bay, Blog, Voucher.
   Nút đăng nhập/đăng ký hoặc menu người dùng (khi đã đăng nhập).
   Tìm kiếm toàn cục (GlobalSearch).

Footer: Chân trang với thông tin liên hệ, liên kết nhanh, chính sách.

ChatBot: Widget chat nổi (floating) ở góc phải dưới, hỗ trợ:
   Tab AI: Chatbot AI tự động (Gemini).
   Tab Hỗ trợ: Chat trực tiếp với Admin (Socket.IO).

4.4.3. Hệ thống phân quyền Admin

Admin Dashboard sử dụng layout riêng với sidebar navigation. Khi truy cập trang admin, hệ thống sẽ kiểm tra:
   Nếu chưa đăng nhập: redirect về trang đăng nhập.
   Nếu đã đăng nhập nhưng role khác ADMIN: redirect về trang chủ + thông báo lỗi.
   Nếu role là ADMIN: hiển thị dashboard.

Admin Dashboard gồm 6 mục quản lý:
   (1) Đơn đặt hàng: Xem, phê duyệt, hủy đơn.
   (2) Quản lý Tour: Thêm, sửa, xóa tour.
   (3) Quản lý Khách sạn: Thêm, sửa, xóa khách sạn.
   (4) Quản lý Chuyến bay: Thêm, sửa, xóa chuyến bay.
   (5) Bài viết – Tin tức: Quản lý blog.
   (6) Hỗ trợ Chat: Phản hồi khách hàng real-time.


4.5. Xây dựng ứng dụng Mobile (React Native)

4.5.1. Kiến trúc ứng dụng Mobile

Ứng dụng mobile được xây dựng bằng React Native + Expo SDK 54, sử dụng:
   Single-file Architecture: Toàn bộ logic trong App.js (~105KB) với navigation state management.
   Stack Navigation: Quản lý các màn hình thông qua state-based navigation.
   Socket.IO Client: Tích hợp chat real-time tương tự web.

4.5.2. Các màn hình chính

   STT    Màn hình     Chức năng
   1      Home         Trang chủ với danh sách tour/khách sạn nổi bật
   2      Tours        Danh sách tour + bộ lọc
   3      Hotels       Danh sách khách sạn + bộ lọc
   4      Flights      Danh sách chuyến bay
   5      Detail       Chi tiết dịch vụ + gallery ảnh
   6      Booking      Form đặt dịch vụ
   7      Profile      Thông tin cá nhân + lịch sử đặt
   8      Chat         Chat hỗ trợ real-time
   9      Auth         Đăng nhập / Đăng ký

4.5.3. Điểm nổi bật giao diện Mobile

   Gradient backgrounds với expo-linear-gradient.
   Smooth animations với React Native Animated API.
   Safe area handling cho các thiết bị có notch.
   Pull-to-refresh cho danh sách.
   Image gallery với zoom và swipe gestures.


4.6. Tích hợp Chat hỗ trợ thời gian thực

4.6.1. Mô hình Chat

   User ←→ Socket.IO Server ←→ Admin
              ↕
      PostgreSQL (ChatRoom + ChatMessage)

4.6.2. Luồng hoạt động

   Bước 1: User mở widget chat → Gọi API POST /api/chat/rooms để tạo hoặc lấy room OPEN.
   Bước 2: Socket.IO join room với socket.emit('join_room', roomId).
   Bước 3: User gửi tin nhắn → socket.emit('send_message', data).
   Bước 4: Server lưu tin nhắn vào DB, broadcast tới room → io.to().emit('receive_message').
   Bước 5: Admin nhận thông báo real-time, phản hồi qua admin chat panel.
   Bước 6: Admin có thể đóng room → API PATCH /api/chat/rooms/:id/close.

4.6.3. Xử lý trạng thái phòng chat

   Trạng thái     Mô tả
   OPEN           Phòng chat đang hoạt động, user có thể gửi/nhận tin nhắn
   CLOSED         Admin đã đóng phòng, user không thể gửi thêm tin nhắn


4.7. Tích hợp AI Chatbot

4.7.1. System Prompt

AI Chatbot được cấu hình với system prompt custom để đóng vai TravelEasy AI – trợ lý du lịch:

   "Bạn là TravelEasy AI, một trợ lý du lịch thông minh, thân thiện và chuyên nghiệp.
   Nhiệm vụ:
   1. Hỗ trợ khách hàng đặt tour, vé máy bay, khách sạn.
   2. Giải đáp thắc mắc về du lịch, thời tiết, văn hóa.
   3. Dẫn dắt khách hàng sử dụng các dịch vụ TravelEasy.
   4. Trả lời bằng tiếng Việt, sử dụng Markdown."

4.7.2. Tích hợp vào UI

ChatBot component (ChatBot.tsx, ~33KB) cung cấp giao diện chat đa năng:
   Tab 1 – AI Assistant: Kết nối Google Gemini, hỗ trợ Markdown rendering, link navigation.
   Tab 2 – Live Support: Chat trực tiếp với Admin qua Socket.IO.
   Floating button design, có thể minimize/maximize.
   Lịch sử chat được lưu theo phiên (session).


4.8. Kết quả demo giao diện

(Lưu ý: Phần này nên bổ sung ảnh chụp màn hình thực tế từ ứng dụng)

4.8.1. Giao diện trang chủ (Web)
   Hero banner slideshow với 3 ảnh du lịch chất lượng cao.
   Thanh tìm kiếm floating với dropdown chọn loại dịch vụ.
   Grid khách sạn và tour nổi bật với hover animations.
   Responsive design tương thích Mobile/Tablet.

4.8.2. Giao diện chi tiết dịch vụ
   Image gallery với chế độ xem mở rộng.
   Thông tin chi tiết: giá, location, rating, description.
   Lịch trình tour (itinerary) với format HTML.
   Section đánh giá + bình luận (có reply).
   Form đặt dịch vụ tích hợp voucher.

4.8.3. Giao diện Admin Dashboard
   Sidebar navigation với 6 mục quản lý.
   Bảng dữ liệu với tìm kiếm, lọc, phân trang.
   Modal thêm/sửa dịch vụ.
   Chat hỗ trợ real-time với danh sách room.

4.8.4. Giao diện Mobile App
   Thiết kế native với gradient backgrounds.
   Bottom tab navigation.
   Card-based layout cho danh sách dịch vụ.
   Full-screen image gallery.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



CHƯƠNG 5: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN


5.1. Kết quả đạt được

Sau quá trình nghiên cứu và phát triển, đề tài đã hoàn thành các mục tiêu đề ra:

5.1.1. Về mặt kỹ thuật

   Backend API Server: Xây dựng thành công hệ thống RESTful API với 38 endpoints, xử lý đầy đủ các nghiệp vụ đặt tour, khách sạn, chuyến bay. [Hoàn thành]

   Web Application: Phát triển giao diện web hiện đại với Next.js 16, hỗ trợ SSR, responsive design, và UI/UX chất lượng cao. [Hoàn thành]

   Mobile Application: Phát triển ứng dụng di động cross-platform với React Native / Expo. [Hoàn thành]

   Real-time Chat: Tích hợp hệ thống chat hỗ trợ khách hàng real-time bằng Socket.IO. [Hoàn thành]

   AI Chatbot: Tích hợp Google Gemini AI làm trợ lý du lịch tự động. [Hoàn thành]

   Hệ thống Voucher: Xây dựng hệ thống mã giảm giá với validation phức tạp (loại voucher, danh mục, hạn sử dụng, giới hạn sử dụng). [Hoàn thành]

   Quản lý tồn kho: Hệ thống tự động trừ kho phòng/ghế khi đặt dịch vụ. [Hoàn thành]

   Hệ thống đánh giá: Review với rating + comment, hỗ trợ reply nested. [Hoàn thành]

   Admin Dashboard: Trang quản trị hoàn chỉnh với CRUD cho tất cả dịch vụ. [Hoàn thành]

5.1.2. Về mặt sản phẩm

   Tính năng                           Trạng thái
   Đặt Tour du lịch (Combo)            Hoàn thành
   Đặt Khách sạn                       Hoàn thành
   Đặt Vé máy bay                      Hoàn thành
   Xác thực OTP Email                  Hoàn thành
   Voucher/Khuyến mãi                  Hoàn thành
   Chat Real-time                      Hoàn thành
   AI Chatbot (Gemini)                 Hoàn thành
   Đánh giá và Bình luận              Hoàn thành
   Blog/Cẩm nang du lịch              Hoàn thành
   Admin Dashboard                     Hoàn thành
   Mobile App (iOS/Android)            Hoàn thành
   Responsive Web Design               Hoàn thành

5.1.3. Về mặt học thuật

   Nắm vững kiến trúc Client-Server với RESTful API.
   Thành thạo các framework hiện đại: Next.js, Express.js, React Native.
   Hiểu và áp dụng Prisma ORM cho quản lý database.
   Triển khai thành công WebSocket (Socket.IO) cho ứng dụng real-time.
   Tích hợp thành công AI/ML (Google Gemini) vào ứng dụng thực tế.
   Áp dụng TypeScript cho type-safety toàn bộ dự án.


5.2. Hạn chế

Bên cạnh những kết quả đạt được, đề tài vẫn còn một số hạn chế:

(1) Chưa tích hợp thanh toán trực tuyến: Hệ thống hiện chỉ có trạng thái PENDING → CONFIRMED, chưa tích hợp cổng thanh toán (VNPay, MoMo, Stripe).

(2) Chưa có middleware xác thực API: Các API endpoint chưa được bảo vệ bằng JWT middleware, dựa vào client-side session check.

(3) Mobile app đơn giản: Ứng dụng mobile sử dụng single-file architecture (App.js), chưa tách module tối ưu.

(4) Chưa có tính năng tìm kiếm nâng cao: Chưa hỗ trợ bộ lọc giá, lọc theo rating, sắp xếp nhiều tiêu chí.

(5) Chưa tối ưu hóa hiệu năng database: Chưa tạo index cho các trường thường xuyên query, chưa implement caching (Redis).

(6) Chưa có unit test / integration test: Dự án chưa có test coverage.


5.3. Hướng phát triển

(1) Tích hợp thanh toán trực tuyến: Kết nối VNPay, MoMo, ZaloPay hoặc Stripe để xử lý thanh toán thực tế.

(2) Bảo mật API nâng cao:
   Thêm JWT middleware cho tất cả API routes.
   Implement rate limiting để chống DDoS.
   Thêm input validation với Zod/Joi.

(3) Cải thiện Mobile App:
   Refactor sang kiến trúc multi-file (screens, components, services).
   Thêm React Navigation cho stack/tab navigation.
   Tích hợp push notification (Expo Notifications).

(4) Tính năng nâng cao:
   Bản đồ và GPS (Google Maps API).
   So sánh giá dịch vụ.
   Wishlist / Danh sách yêu thích.
   Đánh giá với hình ảnh.
   Multi-language support (i18n).

(5) DevOps và Infrastructure:
   Docker containerization.
   CI/CD pipeline (GitHub Actions).
   Redis caching cho API responses.
   CDN cho hình ảnh (Cloudinary, AWS S3).
   Monitoring và Logging (Sentry, Datadog).

(6) AI nâng cao:
   Hệ thống gợi ý (Recommendation System) dựa trên hành vi người dùng.
   Chatbot AI có khả năng truy vấn database (RAG – Retrieval Augmented Generation).
   Phân tích sentiment từ đánh giá khách hàng.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



TÀI LIỆU THAM KHẢO


Tài liệu tiếng Anh

[1]  Next.js Official Documentation, Vercel Inc., https://nextjs.org/docs

[2]  React Official Documentation, Meta Platforms Inc., https://react.dev/

[3]  Express.js Official Documentation, OpenJS Foundation, https://expressjs.com/

[4]  Prisma ORM Documentation, Prisma Data Inc., https://www.prisma.io/docs

[5]  PostgreSQL Official Documentation, The PostgreSQL Global Development Group, https://www.postgresql.org/docs/

[6]  Socket.IO Documentation, Socket.IO, https://socket.io/docs/

[7]  React Native Documentation, Meta Platforms Inc., https://reactnative.dev/

[8]  Expo Documentation, Expo, https://docs.expo.dev/

[9]  NextAuth.js Documentation, NextAuth.js, https://next-auth.js.org/

[10] Ant Design Documentation, Ant Group, https://ant.design/

[11] TailwindCSS Documentation, Tailwind Labs, https://tailwindcss.com/docs

[12] Google Gemini API Documentation, Google DeepMind, https://ai.google.dev/docs

[13] TypeScript Handbook, Microsoft, https://www.typescriptlang.org/docs/handbook/

[14] Lucide React Icons, Lucide Contributors, https://lucide.dev/


Tài liệu tiếng Việt

[15] Phát triển ứng dụng web với Node.js và Express, Nhà xuất bản Bách Khoa.

[16] Cơ sở dữ liệu quan hệ – Lý thuyết và thực hành, Giáo trình đại học.

[17] Phân tích và thiết kế hệ thống thông tin, Giáo trình đại học.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



PHỤ LỤC


Phụ lục A: Prisma Schema hoàn chỉnh

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int           @id @default(autoincrement())
  email     String        @unique
  name      String?
  password  String?
  role      String        @default("USER")
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  bookings  Booking[]
  chatRooms ChatRoom[]
  reviews   Review[]
  vouchers  UserVoucher[]
}

model Voucher {
  id            Int           @id @default(autoincrement())
  code          String        @unique
  type          String
  value         Float
  minOrderValue Float         @default(0)
  maxDiscount   Float?
  startDate     DateTime
  endDate       DateTime
  category      String        @default("ALL")
  isActive      Boolean       @default(true)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  userVouchers  UserVoucher[]
}

model UserVoucher {
  id        Int      @id @default(autoincrement())
  userId    Int
  voucherId Int
  isUsed    Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  voucher   Voucher  @relation(fields: [voucherId], references: [id])
}

model Flight {
  id                Int      @id @default(autoincrement())
  code              String   @unique
  name              String
  description       String?
  location          String?
  price             Float?
  image             String?
  rating            Float?   @default(0)
  category          String   @default("DOMESTIC")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  availableBusiness Int      @default(5)
  availableEconomy  Int      @default(5)
}

model Tour {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  location    String?
  price       Float?
  image       String?
  rating      Float?   @default(0)
  category    String   @default("DOMESTIC")
  itinerary   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  duration    String   @default("3N2Đ")
}

model Hotel {
  id              Int      @id @default(autoincrement())
  name            String
  description     String?
  location        String?
  price           Float?
  image           String?
  rating          Float?   @default(0)
  category        String   @default("DOMESTIC")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  availableDouble Int      @default(5)
  availableSingle Int      @default(5)
}

model Blog {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  author    String   @default("Admin")
  images    String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Booking {
  id             Int       @id @default(autoincrement())
  userId         Int
  type           String
  itemId         Int
  itemName       String
  startDate      DateTime
  endDate        DateTime?
  price          Float
  customerName   String?
  customerPhone  String?
  totalPeople    Int       @default(1)
  seatClass      String?
  voucherCode    String?
  discountAmount Float     @default(0)
  finalPrice     Float?
  status         String    @default("PENDING")
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  flightId       Int?
  hotelId        Int?
  singleRooms    Int?
  doubleRooms    Int?
  economySeats   Int?
  businessSeats  Int?
  user           User      @relation(fields: [userId], references: [id])
}

model Review {
  id        Int      @id @default(autoincrement())
  userId    Int
  type      String
  itemId    Int
  rating    Int      @default(5)
  comment   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  parentId  Int?
  parent    Review?  @relation("ReviewReplies", fields: [parentId], references: [id])
  replies   Review[] @relation("ReviewReplies")
  user      User     @relation(fields: [userId], references: [id])
}

model OTP {
  id        Int      @id @default(autoincrement())
  email     String
  code      String
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model ChatRoom {
  id        Int           @id @default(autoincrement())
  userId    Int
  status    String        @default("OPEN")
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  messages  ChatMessage[]
  user      User          @relation(fields: [userId], references: [id])
}

model ChatMessage {
  id         Int      @id @default(autoincrement())
  roomId     Int
  senderId   Int
  senderRole String
  content    String
  createdAt  DateTime @default(now())
  room       ChatRoom @relation(fields: [roomId], references: [id])
}


Phụ lục B: Thống kê dự án

   Metric                    Giá trị
   Tổng số file source code  ~40+ files
   Backend routes             10 file routes
   Frontend pages             12+ trang (Web)
   Admin pages                6 trang quản trị
   API Endpoints              38 endpoints
   Database tables            12 bảng
   Database fields            ~100+ trường
   Component files            7 shared components
   Công nghệ chính            Next.js 16, Express.js, PostgreSQL, React Native, Socket.IO, Gemini AI
   Ngôn ngữ chính             TypeScript, JavaScript



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



Sinh viên ký tên

(Ký và ghi rõ họ tên)



Giảng viên hướng dẫn ký tên

(Ký và ghi rõ họ tên)

