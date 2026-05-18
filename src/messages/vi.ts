import type { Messages } from './en'

export const vi: Messages = {
  nav: {
    collection: 'Bộ Sưu Tập',
    care: 'Hướng Dẫn Chăm Sóc',
    visit: 'Tham Quan',
    connect: 'Liên Hệ',
    callNow: 'Gọi Ngay',
    login: 'Đăng Nhập',
    logout: 'Đăng Xuất',
  },
  auth: {
    modalTitle: 'Đăng Nhập Chủ Vườn',
    modalSubtitle: 'Đăng nhập để chuyển trang web sang tiếng Việt.',
    usernamePlaceholder: 'Tên đăng nhập',
    passwordPlaceholder: 'Mật khẩu',
    loginButton: 'Đăng Nhập',
    loggingIn: 'Đang đăng nhập…',
    errorMessage: 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.',
    loggedInLabel: 'Đã đăng nhập',
    loggedInSub: 'Đang hiển thị tiếng Việt',
  },
  hero: {
    location: 'Palm Beach, Florida',
    tagline: 'Bonsai Nhiệt Đới Cho Cuộc Sống Miền Nam Florida',
    description:
      'Bonsai thân thiện với người mới bắt đầu, hướng dẫn địa phương và những buổi tham quan vườn yên bình tại Palm Beach, Florida.',
    callNow: 'Gọi Ngay',
    textUs: 'Nhắn Tin',
    viewTrees: 'Xem Cây Có Sẵn',
    alsoOn: 'Tìm chúng tôi trên',
    cardSpecies: 'Ficus · Liễu · Dạng Nhiệt Đới',
  },
  connect: {
    label: 'Chỉ một chạm',
    heading: 'Chọn Cách Bạn Muốn Kết Nối',
    description:
      'Chọn cách phù hợp nhất với bạn. Mỗi nút ở đây sẽ mở đúng ứng dụng ngay lập tức — không cần tìm kiếm.',
    cards: {
      call: {
        title: 'Gọi Điện',
        description: 'Tốt nhất khi cần hỗ trợ nhanh — nói chuyện trực tiếp với chúng tôi về bất kỳ cây nào.',
        button: 'Gọi Ngay',
      },
      text: {
        title: 'Nhắn Tin',
        description: 'Tốt nhất để gửi ảnh bonsai — chúng tôi rất thích xem cây của bạn!',
        button: 'Gửi Tin Nhắn',
      },
      facebook: {
        title: 'Facebook',
        description: 'Tốt nhất cho sự kiện, cập nhật và theo dõi bộ sưu tập.',
        button: 'Mở Facebook',
      },
      instagram: {
        title: 'Instagram',
        description: 'Tốt nhất cho ảnh cây — xem từng chi tiết của bộ sưu tập.',
        button: 'Mở Instagram',
      },
      tiktok: {
        title: 'TikTok',
        description: 'Tốt nhất cho video bonsai ngắn — mẹo nhanh và giới thiệu cây mới.',
        button: 'Mở TikTok',
      },
      youtube: {
        title: 'YouTube',
        description: 'Tốt nhất cho video hướng dẫn chăm sóc dài hơn — học cách giữ cây khỏe mạnh.',
        button: 'Mở YouTube',
      },
      email: {
        title: 'Email',
        description: 'Tốt nhất cho câu hỏi bằng văn bản — chúng tôi trả lời trong một ngày làm việc.',
        button: 'Gửi Email',
      },
    },
  },
  collection: {
    label: 'Kho hàng hiện tại',
    heading: 'Bonsai Có Sẵn',
    description:
      'Mỗi cây được chọn lọc kỹ càng cho cuộc sống miền Nam Florida. Nhắn tin hoặc gọi để hỏi về bất kỳ cây nào — chúng tôi rất thích nói về bonsai.',
    sunLabel: 'Ánh sáng',
    waterLabel: 'Tưới nước',
    levelLabel: 'Cấp độ',
    askButton: 'Hỏi Về Cây Này',
    footerNote: 'Không thấy cây bạn tìm? Chúng tôi có thể có thêm cây khác.',
    footerCta: 'Gọi Để Hỏi Thêm',
  },
  care: {
    label: 'Hướng dẫn đơn giản',
    heading: 'Hướng Dẫn Chăm Sóc Bonsai Cho Người Mới',
    description:
      'Chăm sóc bonsai không cần phức tạp. Đây là bốn điều quan trọng nhất cần biết khi mới bắt đầu ở Florida.',
    blocks: [
      {
        title: 'Tưới Nước Ở Florida',
        body: [
          'Mùa hè Florida nóng và ẩm, nhưng chậu bonsai mau khô hơn bạn nghĩ.',
          'Hầu hết bonsai nhiệt đới cần tưới nước mỗi 1–3 ngày trong những tháng ấm.',
          'Cắm ngón tay vào đất khoảng 2–3 cm — nếu thấy khô thì tưới từ từ cho đến khi nước chảy ra đáy chậu.',
          'Mùa đông mát hơn, bạn có thể giảm bớt tần suất tưới một chút.',
        ],
      },
      {
        title: 'Nắng Sáng & Bóng Mát Sáng',
        body: [
          'Bonsai nhiệt đới thích ánh sáng sáng, nhưng nắng chiều Florida có thể làm cháy lá.',
          'Nơi lý tưởng là nơi có 2–4 giờ nắng sáng nhẹ, sau đó là bóng mát thoáng đãng.',
          'Hiên có mái, sân sau hoặc góc dưới cây lớn thường phù hợp nhất.',
          'Trong nhà với cửa sổ hướng nam hoặc đông cũng là lựa chọn tốt.',
        ],
      },
      {
        title: 'Sau Khi Mua Cây Về',
        body: [
          'Chọn một chỗ trong nhà và để cây ở đó trong hai tuần đầu.',
          'Bonsai rất nhạy cảm với sự thay đổi — hãy để cây thích nghi trước khi di chuyển.',
          'Tưới đúng lịch và quan sát lá cây kỹ càng.',
          'Lá rụng một chút khi mới mang về là hoàn toàn bình thường — đừng lo lắng!',
        ],
      },
      {
        title: 'Khi Nào Cần Hỏi Thêm',
        body: [
          'Bạn không cần phải tự giải quyết một mình. Hãy gọi hoặc nhắn tin cho chúng tôi bất cứ lúc nào.',
          'Nếu lá vàng, rụng nhiều hoặc đất luôn ẩm ướt — hãy liên hệ ngay với chúng tôi.',
          'Gửi ảnh cây cho chúng tôi qua tin nhắn — thường chúng tôi có thể giúp ngay lập tức.',
          'Chúng tôi muốn cây của bạn phát triển tốt cũng như bạn vậy.',
        ],
      },
    ],
    quote:
      'Chúng tôi luôn ở đây, chỉ một tin nhắn hoặc cuộc gọi là bạn có thể liên hệ. Không có câu hỏi nào là nhỏ khi nói về bonsai của bạn.',
    quoteAuthor: 'Bonsai Florida, Palm Beach',
  },
  visit: {
    label: 'Chào đón khách tham quan vườn',
    locationBadge: 'Palm Beach, Florida',
    heading: 'Tham Quan Bonsai Florida',
    description:
      'Bạn muốn xem cây trực tiếp? Hãy gọi hoặc nhắn tin để sắp xếp một buổi tham quan vườn bonsai thư thái. Chúng tôi rất vui khi được chia sẻ bộ sưu tập với những ai yêu quý cây đẹp.',
    callNow: 'Gọi Ngay',
    textUs: 'Nhắn Tin',
  },
  footer: {
    tagline:
      'Bonsai nhiệt đới thân thiện với người mới tại Palm Beach, Florida. Cây được chọn lọc kỹ, hướng dẫn địa phương và những buổi tham quan vườn yên bình.',
    contactHeading: 'Liên Hệ Trực Tiếp',
    socialHeading: 'Theo Dõi Hành Trình Của Chúng Tôi',
    callLabel: 'Gọi Điện',
    textLabel: 'Nhắn Tin',
    emailLabel: 'Email',
    callNow: 'Gọi Ngay',
    textUs: 'Nhắn Tin',
    copyright: 'Bonsai Florida',
  },
}
