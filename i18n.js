// UI language is independent from each speaker's recognition/translation language.
const translations = new Map(Object.entries({
'我的':'Cá nhân','关于越聊':'Về YueLiao','好友与聊天记录保存在当前浏览器，请勿随意清除网站数据。':'Bạn bè và lịch sử trò chuyện lưu trong trình duyệt này. Đừng xóa dữ liệu trang nếu chưa sao lưu.',

"01 · 游客极速体验":"01 · Trải nghiệm nhanh với tư cách khách","智能助手与部分在线能力暂未向游客开放。":"Trợ lý thông minh và một số tính năng trực tuyến hiện chưa mở cho khách.","首次连接时双方需打开页面。好友资料和聊天记录保存在当前浏览器，不会随账号登录自动同步到其他设备。":"Cả hai cần mở trang khi kết nối lần đầu. Danh bạ và lịch sử trò chuyện lưu trong trình duyệt hiện tại, không tự đồng bộ sang thiết bị khác.","公共网络可能限制连接；实际能否通话取决于双方网络、设备权限和中继服务状态。":"Mạng công cộng có thể hạn chế kết nối. Cuộc gọi phụ thuộc vào mạng, quyền thiết bị và dịch vụ chuyển tiếp.","昵称只是本机聊天资料，不代表已经登录账号。本站目前不支持独立邮箱或手机号注册，换设备不会自动恢复本机好友和聊天记录。":"Biệt danh chỉ là hồ sơ trên thiết bị, không phải tài khoản đã đăng nhập. Trang chưa hỗ trợ đăng ký riêng bằng email hoặc số điện thoại; đổi thiết bị không tự khôi phục bạn bè và tin nhắn.","锁屏推送暂不可用：本站通知服务尚未配置。网页打开时的来电铃声不等于锁屏推送。":"Thông báo màn hình khóa chưa khả dụng vì dịch vụ chưa được cấu hình. Chuông khi trang đang mở không phải thông báo đẩy màn hình khóa.",
  '首次添加时双方打开新版并连接，之后可以离线留言。':'Khi thêm bạn lần đầu, cả hai hãy mở bản mới và kết nối. Sau đó có thể gửi tin nhắn ngoại tuyến.',
  '连接通过公共 PeerJS 服务建立。好友需获得本站访问权限；双方用新版连接一次后支持离线留言，通话仍需双方在线。':'Kết nối dùng dịch vụ PeerJS công cộng. Bạn bè cần quyền truy cập trang; sau khi cả hai kết nối bằng bản mới, có thể gửi tin nhắn ngoại tuyến. Cuộc gọi cần cả hai trực tuyến.',
  '语音识别':'Nhận dạng giọng nói','浏览器':'Trình duyệt','Groq 免费云端':'Đám mây Groq miễn phí','主屏幕无法识别时，选择云端（音频发送至 Groq）':'Nếu nhận dạng trên màn hình chính không hoạt động, chọn đám mây (âm thanh gửi đến Groq)','登录后使用云端字幕':'Đăng nhập để dùng phụ đề đám mây','⇄ 中文':'⇄ Tiếng Trung','声音':'Âm thanh',
  '输入对方的数字越聊号':'Nhập mã số YueLiao của bạn bè','切换人物头像':'Đổi ảnh đại diện','朋友会看到你的3D 卡通头像、昵称与语言偏好。':'Bạn bè sẽ thấy ảnh đại diện 3D, biệt danh và ngôn ngữ của bạn.',
  '消息通知与来电提醒':'Thông báo tin nhắn và cuộc gọi','通知与来电':'Thông báo và cuộc gọi',
  '开启消息与来电通知':'Bật thông báo tin nhắn và cuộc gọi','关闭此设备通知':'Tắt thông báo trên thiết bị này',
  'AI 助手 · 聊天 / 翻译 / 问答':'Trợ lý AI · Trò chuyện / Dịch / Hỏi đáp',
  'Trợ lý AI · 聊天 / 翻译 / 问答':'Trợ lý AI · Trò chuyện / Dịch / Hỏi đáp',
  'AI 对话与翻译可能由在线服务处理 · 查看隐私说明':'Hội thoại AI và bản dịch có thể dùng dịch vụ trực tuyến · Xem chính sách quyền riêng tư',
  '使用 ChatGPT 登录':'Đăng nhập bằng ChatGPT',
  '登录后可使用智能助手。':'Đăng nhập để sử dụng trợ lý AI.',
  '登录后使用智能助手':'Đăng nhập để dùng trợ lý AI',
  '智能助手共用当前越聊登录会话。':'Trợ lý AI dùng chung phiên đăng nhập YueLiao.',
  '结束通话并登录':'Kết thúc cuộc gọi và đăng nhập',
  '请登录后使用云端字幕。':'Đăng nhập để dùng phụ đề đám mây.',
  '云端通话字幕：服务未配置':'Phụ đề cuộc gọi đám mây: Chưa cấu hình dịch vụ',
  '云端通话字幕：账号已开通':'Phụ đề cuộc gọi đám mây: Tài khoản đã được cấp quyền',
  '云端通话字幕：当前账号未开通':'Phụ đề cuộc gọi đám mây: Tài khoản chưa được cấp quyền',
  '云端字幕服务未配置。':'Dịch vụ phụ đề đám mây chưa được cấu hình.',
  '正在检查配置…':'Đang kiểm tra cấu hình…','未接来电':'Cuộc gọi nhỡ','已拒绝':'Đã từ chối','已取消':'Đã hủy','已结束':'Đã kết thúc',
  '已接听，等待对方连接…':'Đã nhận, đang chờ kết nối…',
  '网页打开且已点按过页面时，来电会播放铃声。锁屏通知的声音由 iPhone 系统控制。':'Khi trang đang mở và đã được chạm, cuộc gọi sẽ đổ chuông. Âm thanh thông báo màn hình khóa do iPhone quản lý.',
  '尚未接入 Supabase 和推送密钥，锁屏推送暂不可用':'Chưa cấu hình Supabase và khóa đẩy. Thông báo màn hình khóa chưa khả dụng.',

  '越聊':'YueLiao', '越聊首页':'Trang chủ YueLiao', '越聊对话框':'Hộp thoại YueLiao',
  '让每一句，都被听懂。':'Để từng lời đều được thấu hiểu.', '限量公测':'Thử nghiệm công khai giới hạn',
  '我的资料':'Hồ sơ của tôi','主导航':'Điều hướng chính','消息':'Tin nhắn','好友':'Bạn bè','通话':'Cuộc gọi','设置':'Cài đặt',
  '使用帮助':'Hướng dẫn sử dụng','添加好友':'Thêm bạn','搜索好友或聊天记录':'Tìm bạn hoặc tin nhắn','全部':'Tất cả','我的好友':'Bạn của tôi','未读':'Chưa đọc',
  '世界很大，聊天很近。':'Thế giới rộng, kết nối gần.','跨过语言的距离':'Vượt qua khoảng cách ngôn ngữ','遇见另一种日常。':'Khám phá một cuộc sống khác.',
  '体验中越翻译':'Thử dịch Trung – Việt','连接好友，开启双语聊天':'Kết nối bạn bè, bắt đầu trò chuyện song ngữ',
  '已上线':'Trực tuyến','点击连接':'Nhấn để kết nối','已上线 · 点击查看好友号':'Đã trực tuyến · Xem mã kết bạn',
  '正在连接聊天服务…':'Đang kết nối dịch vụ trò chuyện…','连接不可用 · 点击重试':'Không thể kết nối · Nhấn để thử lại',
  '演示好友':'Bạn minh họa','已连接':'Đã kết nối','双语聊天':'Trò chuyện song ngữ','好友离线':'Bạn đang ngoại tuyến','在线':'Trực tuyến','离线':'Ngoại tuyến',
  '暂时没有未读消息':'Chưa có tin nhắn chưa đọc','还没有添加好友':'Bạn chưa thêm bạn bè','用好友号，开始一段新对话':'Dùng mã kết bạn để bắt đầu trò chuyện',
  '没有找到相关好友':'Không tìm thấy bạn bè phù hợp','返回消息':'Quay lại tin nhắn','演示会话':'Hội thoại minh họa','自动回复':'Trả lời tự động',
  '在线 · 可以开始聊天':'Trực tuyến · Sẵn sàng trò chuyện','离线 · 等待好友连接':'Ngoại tuyến · Đang chờ kết nối',
  '可以开始聊天':'Sẵn sàng trò chuyện','等待好友连接':'Đang chờ bạn kết nối','语音通话':'Cuộc gọi thoại','视频通话':'Cuộc gọi video','好友资料':'Hồ sơ bạn bè',
  '中越翻译，让对话自然发生':'Dịch Trung – Việt, trò chuyện tự nhiên','中文':'Tiếng Trung','越南语':'Tiếng Việt','简体中文':'Tiếng Trung giản thể',
  'Tiếng Việt · 越南语':'Tiếng Việt','中 中文':'ZH Tiếng Trung','VI 越南语':'VI Tiếng Việt','🇨🇳 中文':'🇨🇳 Tiếng Trung','🇻🇳 越南语':'🇻🇳 Tiếng Việt',
  '🇨🇳 中文 → 🇻🇳 越南语':'🇨🇳 Tiếng Trung → 🇻🇳 Tiếng Việt','🇻🇳 越南语 → 🇨🇳 中文':'🇻🇳 Tiếng Việt → 🇨🇳 Tiếng Trung',
  '自动翻译':'Tự động dịch','自动翻译消息':'Tự động dịch tin nhắn','聊天消息':'Tin nhắn trò chuyện','用你的语言，聊聊今天吧…':'Kể về hôm nay bằng ngôn ngữ của bạn…',
  '添加表情':'Thêm biểu tượng cảm xúc','发送图片':'Gửi ảnh','录制语音消息':'Ghi tin nhắn thoại','切换输入语言':'Đổi ngôn ngữ nhập','Enter 发送':'Enter để gửi','发送':'Gửi',
  '正在录音，再次点击麦克风结束并发送':'Đang ghi âm, nhấn mic lần nữa để kết thúc và gửi',

  '双方需保持网页打开 · 聊天记录仅保存在本机':'Cả hai cần mở trang web · Lịch sử chỉ lưu trên thiết bị',
  '聊天信息':'Thông tin trò chuyện','在世界的另一边':'Ở một nơi khác trên thế giới','越南语母语':'Tiếng mẹ đẻ: Việt','中文母语':'Tiếng mẹ đẻ: Trung',
  '对话语言':'Ngôn ngữ trò chuyện','我的语言':'Ngôn ngữ của tôi','好友语言':'Ngôn ngữ của bạn','听见声音，也听懂心意。':'Nghe giọng nói, hiểu cả tấm lòng.',
  '语音和视频通话中，开启双语字幕':'Bật phụ đề song ngữ khi gọi thoại hoặc video','让每一次交流，都更靠近一点。':'Để mỗi cuộc trò chuyện kéo chúng ta gần hơn.',
  '了解通话翻译':'Tìm hiểu dịch cuộc gọi','共享的瞬间':'Khoảnh khắc đã chia sẻ','查看共享图片':'Xem ảnh đã chia sẻ','查看咖啡店照片':'Xem ảnh quán cà phê',
  '查看城市照片':'Xem ảnh thành phố','查看湖泊照片':'Xem ảnh bên hồ','不同的语言，相同的心情。':'Khác ngôn ngữ, chung cảm xúc.',
  '咖啡店的日常':'Một ngày ở quán cà phê','城市风景':'Phong cảnh thành phố','水边风景':'Phong cảnh bên nước',
  '今天 · 演示对话':'Hôm nay · Hội thoại minh họa','聊天记录保存在本设备':'Lịch sử trò chuyện được lưu trên thiết bị này',
  '故事，就从一句你好开始。':'Câu chuyện bắt đầu bằng một lời chào.','发送第一条消息，认识新朋友。':'Gửi tin nhắn đầu tiên để làm quen.',
  '查看图片':'Xem ảnh','好友分享的照片':'Ảnh do bạn chia sẻ','分享的照片':'Ảnh đã chia sẻ','语音消息 · 未转写':'Tin nhắn thoại · Chưa có bản chép lời',
  '中文翻译':'Bản dịch tiếng Trung','翻译暂不可用':'Tạm thời chưa thể dịch','重试':'Thử lại','朗读消息':'Đọc tin nhắn','保存在本机':'Đã lưu trên thiết bị',
  '已发送':'Đã gửi','演示已读':'Đã đọc (minh họa)','每一次相遇，都值得。':'Mỗi cuộc gặp đều đáng quý.',
  '用一个好友号，连接另一种生活。':'Dùng mã kết bạn để kết nối một cuộc sống khác.','同时在线，即可开始私密的双语对话。':'Cùng trực tuyến để bắt đầu trò chuyện song ngữ riêng tư.',
  '开始聊天':'Bắt đầu trò chuyện','让想念，有声音。':'Để nỗi nhớ có tiếng nói.','语音或视频，都能更靠近彼此。':'Gọi thoại hay video, cùng gần nhau hơn.',
  '通话时可开启中文与越南语双语字幕。':'Có thể bật phụ đề Trung – Việt trong cuộc gọi.','演示':'Minh họa','再次通话':'Gọi lại','还没有通话记录':'Chưa có lịch sử cuộc gọi',
  '去聊天，给朋友拨个电话吧。':'Hãy chọn một người bạn và gọi nhé.','选择好友':'Chọn bạn','我的越聊':'YueLiao của tôi',
  '你的语言，连接世界的方式。':'Ngôn ngữ của bạn, cách bạn kết nối thế giới.','我的好友号':'Mã kết bạn của tôi','复制':'Sao chép','昵称':'Tên hiển thị','好友连接':'Kết nối bạn bè',
  '公测说明':'Thông tin thử nghiệm công khai',

  '输入语言已切换为越南语':'Đã đổi ngôn ngữ nhập sang tiếng Việt','输入语言已切换为中文':'Đã đổi ngôn ngữ nhập sang tiếng Trung',
  '好友暂未连接，请让对方打开网页并添加好友号。':'Bạn chưa kết nối. Hãy nhờ đối phương mở trang web và thêm mã kết bạn.','翻译中':'Đang dịch','关闭':'Đóng',
  '你好，新朋友。':'Xin chào, người bạn mới.','输入对方的越聊号，跨过语言的距离。':'Nhập mã YueLiao của bạn để vượt qua khoảng cách ngôn ngữ.',
  '双方都需打开此网页并连接聊天服务。':'Cả hai cần mở trang này và kết nối dịch vụ trò chuyện.','我的越聊号':'Mã YueLiao của tôi','好友的越聊号':'Mã YueLiao của bạn',
  '例如 yueliao-a1b2c3d4':'Ví dụ yueliao-a1b2c3d4','取消':'Hủy','添加并连接':'Thêm và kết nối',
  '好友需获得本站访问权限；首次连接时双方同时打开越聊，之后即可聊天。通话仍需双方在线。':'Bạn bè cần quyền truy cập trang web; lần đầu cả hai cần mở YueLiao cùng lúc. Cuộc gọi cần cả hai trực tuyến.',
  '这是你自己的好友号，输入对方的好友号试试。':'Đây là mã của bạn. Hãy nhập mã của đối phương.','正在连接…':'Đang kết nối…','好友已连接，打个招呼吧！':'Đã kết nối với bạn, hãy chào nhau nhé!',
  '好友号已复制，发给朋友吧！':'Đã sao chép mã kết bạn, hãy gửi cho bạn bè!','很高兴，认识你。':'Rất vui được làm quen với bạn.',
  '朋友会看到你的昵称与语言偏好。':'Bạn bè sẽ thấy tên hiển thị và ngôn ngữ bạn chọn.','我的昵称':'Tên hiển thị của tôi','保存资料':'Lưu hồ sơ',
  '资料已保存，下次连接时会更新给好友。':'Đã lưu hồ sơ; thông tin sẽ được cập nhật cho bạn bè khi kết nối lại.',
  '这是用于体验产品的演示好友，消息为预设自动回复。':'Đây là bạn minh họa để trải nghiệm sản phẩm; tin nhắn được trả lời tự động theo nội dung đặt sẵn.',
  '好友号':'Mã kết bạn','状态':'Trạng thái','语音':'Thoại','视频':'Video','让交流，简单一点。':'Để giao tiếp đơn giản hơn.',
  '越聊 1.0 现已开放限量公测，手机和电脑都可使用。':'YueLiao 1.0 hiện mở thử nghiệm công khai giới hạn, dùng được trên điện thoại và máy tính.',
  '01 · 先和 Linh 聊一聊':'01 · Trò chuyện thử với Linh','演示好友会自动回复，可以体验双语消息、图片和语音消息。':'Bạn minh họa sẽ tự động trả lời để bạn thử tin nhắn song ngữ, ảnh và tin nhắn thoại.',
  '02 · 连接真实朋友':'02 · Kết nối bạn bè thật','在“添加好友”里交换好友号。双方需有本站访问权限、同时打开页面，聊天记录保存在当前浏览器。':'Trao đổi mã trong mục “Thêm bạn”. Cả hai cần có quyền truy cập và cùng mở trang. Lịch sử trò chuyện lưu trong trình duyệt hiện tại.',
  '03 · 开启语音与视频':'03 · Gọi thoại và video','允许麦克风／摄像头后即可通话。网络可能影响连接质量，通话需要双方在线。':'Cho phép mic/camera để gọi. Mạng có thể ảnh hưởng chất lượng kết nối; cả hai cần trực tuyến.',
  '04 · 开启中越双语字幕':'04 · Bật phụ đề Trung – Việt','通话页点击“开启字幕”。语音识别由浏览器提供，部分 iPhone 浏览器不支持，可改用文字聊天。':'Nhấn “Bật phụ đề” trên trang cuộc gọi. Nhận dạng giọng nói phụ thuộc vào trình duyệt; một số trình duyệt iPhone không hỗ trợ. Bạn vẫn có thể trò chuyện bằng văn bản.',

  '听见，也听懂。':'Lắng nghe và thấu hiểu.','通话时点击“开启字幕”，网页会把你说的话识别为文字，再翻译成对方的语言。双方分别开启自己的字幕，即可进行双向交流。':'Nhấn “Bật phụ đề” trong cuộc gọi để chuyển lời nói thành văn bản rồi dịch sang ngôn ngữ của bạn. Mỗi bên bật phụ đề của mình để trò chuyện hai chiều.',

  '知道了':'Đã hiểu','一句话，连接你我。':'Một câu nói, kết nối chúng ta.','写下想说的话，看看另一种语言里的它。':'Viết điều bạn muốn nói và xem bản dịch.',
  '翻译方向':'Hướng dịch','待翻译文字':'Văn bản cần dịch','翻译一下':'Dịch thử','正在翻译…':'Đang dịch…',

  '用表情，说心情。':'Dùng biểu cảm để nói tâm tình.','分享生活的小美好。':'Chia sẻ những điều nhỏ xinh.','演示分享 · 越聊':'Nội dung chia sẻ minh họa · YueLiao',
  '好友离线，暂时无法发送图片。':'Bạn đang ngoại tuyến, chưa thể gửi ảnh.','请使用 JPG、PNG 或 WebP 图片。':'Vui lòng dùng ảnh JPG, PNG hoặc WebP.','图片请小于 5MB。':'Ảnh cần nhỏ hơn 5 MB.',
  '图片读取失败，请换一张试试。':'Không đọc được ảnh. Vui lòng thử ảnh khác.','图片较复杂，请选择更小的图片。':'Ảnh quá lớn sau khi xử lý. Vui lòng chọn ảnh nhỏ hơn.',
  '请先结束通话。':'Vui lòng kết thúc cuộc gọi trước.','好友离线，暂时无法发送语音。':'Bạn đang ngoại tuyến, chưa thể gửi tin nhắn thoại.',
  '此浏览器不支持网页录音，请使用新版 Safari 或 Chrome。':'Trình duyệt không hỗ trợ ghi âm trên web. Vui lòng dùng Safari hoặc Chrome mới nhất.',
  '语音消息太长，请录制更短的内容。':'Tin nhắn thoại quá dài. Vui lòng ghi đoạn ngắn hơn.','语音发送失败。':'Gửi tin nhắn thoại thất bại.',
  '正在录音 · 再次点击麦克风结束并发送（最长 45 秒）':'Đang ghi âm · Nhấn mic lần nữa để gửi (tối đa 45 giây)',
  '正在录音，再次点击麦克风发送语音。':'Đang ghi âm; nhấn mic lần nữa để gửi.','请在浏览器设置中允许麦克风权限。':'Vui lòng cho phép mic trong cài đặt trình duyệt.',
  '无法启动录音。':'Không thể bắt đầu ghi âm.',
  '已上线，可以交换好友号开始聊天。':'Đã trực tuyến; trao đổi mã kết bạn để bắt đầu trò chuyện.','对方已挂断通话':'Đối phương đã kết thúc cuộc gọi',
  '通话未接通，请稍后重试。':'Chưa kết nối được cuộc gọi. Vui lòng thử lại sau.','好友离线，先连接好友再通话吧。':'Bạn đang ngoại tuyến. Hãy kết nối trước khi gọi.',
  '开启字幕':'Bật phụ đề','关闭字幕':'Tắt phụ đề','重新开启字幕':'Bật lại phụ đề','重试字幕':'Thử lại phụ đề','好友邀请你通话':'Bạn đang mời bạn vào cuộc gọi',
  '越聊通话':'Cuộc gọi YueLiao','正在呼叫…':'Đang gọi…','声音，让距离更近。':'Giọng nói kéo chúng ta gần hơn.','来聊聊今天吧':'Cùng kể về hôm nay nhé',
  '等待好友接听':'Đang chờ bạn trả lời','这是本机演示，没有远程好友接听。':'Đây là minh họa trên thiết bị, không có người ở xa trả lời.',
  '可预览麦克风／摄像头，或开启语音翻译字幕。':'Bạn có thể thử mic/camera hoặc bật phụ đề dịch giọng nói.','开启本机预览':'Bật xem trước trên thiết bị',
  '点击“开启字幕”，体验中越语音翻译':'Nhấn “Bật phụ đề” để thử dịch giọng nói Trung – Việt','开启后，你的语音文字及译文会发送给好友':'Khi bật, văn bản lời nói và bản dịch sẽ được gửi cho bạn',
  '麦克风':'Mic','摄像头':'Camera','静音':'Tắt mic','取消静音':'Bật mic','关闭摄像头':'Tắt camera','挂断':'Kết thúc cuộc gọi','拒绝':'Từ chối','结束通话':'Kết thúc','接听':'Trả lời',
  '已静音，字幕识别已停止。':'Đã tắt mic và dừng nhận dạng phụ đề.','本机预览 · 无远程好友':'Xem trước trên thiết bị · Không có người ở xa',
  '此浏览器无法访问媒体设备。':'Trình duyệt không thể truy cập thiết bị âm thanh/video.','等待设备权限…':'Đang chờ quyền thiết bị…','本机设备已开启':'Đã bật thiết bị',
  '重新开启本机预览':'Bật lại xem trước trên thiết bị','请在浏览器设置中允许麦克风／摄像头权限。':'Vui lòng cho phép mic/camera trong cài đặt trình duyệt.',
  '未找到可用设备，请检查麦克风或摄像头。':'Không tìm thấy thiết bị. Vui lòng kiểm tra mic hoặc camera.','双语字幕已关闭':'Đã tắt phụ đề song ngữ',
  '请先取消静音，再开启字幕。':'Vui lòng bật mic trước khi bật phụ đề.','正在听你说…':'Đang lắng nghe bạn…',
  '语音识别开启 · 文字会用于翻译':'Đã bật nhận dạng · Văn bản sẽ dùng để dịch','本机字幕演示 · 无远程好友':'Phụ đề minh họa trên thiết bị · Không có người ở xa',
  '我的字幕 · 已翻译':'Phụ đề của tôi · Đã dịch','对方正在说话':'Đối phương đang nói','正在聆听 · 说一句中文或越南语吧':'Đang lắng nghe · Hãy nói tiếng Trung hoặc tiếng Việt',
  '此浏览器不支持语音识别。可继续通话，或使用 Chrome 体验字幕。':'Trình duyệt không hỗ trợ nhận dạng giọng nói. Bạn vẫn có thể gọi; phụ đề cần trình duyệt hỗ trợ.',
  '当前浏览器不支持语音识别，仍可使用语音／视频通话。':'Trình duyệt không hỗ trợ nhận dạng giọng nói; vẫn có thể gọi thoại/video.',

  '点击画面以播放通话声音。':'Nhấn vào màn hình để phát âm thanh cuộc gọi.','点按通话界面开启声音。':'Nhấn vào giao diện cuộc gọi để bật âm thanh.',
  '双向字幕':'Phụ đề hai chiều','我的字幕':'Phụ đề của tôi','对方字幕':'Phụ đề của bạn','等待我说话…':'Đang chờ tôi nói…','等待对方说话…':'Đang chờ bạn nói…',
  '我说':'Tôi nói','字幕方式':'Cách tạo phụ đề','云端识别（适合 iPhone）':'Nhận dạng đám mây (cho iPhone)','浏览器识别':'Nhận dạng của trình duyệt',
  '云端语音识别尚未配置，暂时无法用于 iPhone 双向字幕。':'Chưa cấu hình nhận dạng đám mây nên chưa thể dùng phụ đề giọng nói hai chiều trên iPhone.',
  '使用文字字幕':'Dùng phụ đề văn bản','输入要说的话…':'Nhập điều bạn muốn nói…','发送字幕':'Gửi phụ đề','对方尚未开启字幕':'Đối phương chưa bật phụ đề','本机演示':'Minh họa trên thiết bị',
  '设备存储空间不足，部分记录可能无法保存。':'Bộ nhớ thiết bị không đủ; một số nội dung có thể không được lưu.',
  '翻译额度暂时用完，请稍后重试。':'Đã hết hạn mức dịch tạm thời. Vui lòng thử lại sau.','翻译服务暂时不可用，请稍后重试。':'Dịch vụ dịch tạm thời không khả dụng. Vui lòng thử lại sau.',
  '翻译失败，请稍后重试或发送原文。':'Dịch thất bại. Vui lòng thử lại hoặc gửi bản gốc.','翻译超时，请检查网络后重试。':'Dịch quá thời gian chờ. Vui lòng kiểm tra mạng rồi thử lại.',
  '无法连接翻译服务，请检查网络。':'Không thể kết nối dịch vụ dịch. Vui lòng kiểm tra mạng.','请输入需要翻译的内容。':'Vui lòng nhập nội dung cần dịch.',
  '每条翻译最多支持 450 个字，请分段发送。':'Mỗi lượt dịch tối đa 450 ký tự. Vui lòng chia thành nhiều đoạn.','请选择中文与越南语之间的互译方向。':'Vui lòng chọn hướng dịch giữa tiếng Trung và tiếng Việt.',
  '当前浏览器不支持朗读，请使用 Safari 或 Chrome。':'Trình duyệt không hỗ trợ đọc văn bản. Vui lòng dùng Safari hoặc Chrome.','没有可朗读的内容。':'Không có nội dung để đọc.',
  '已停止上一段朗读。':'Đã dừng đoạn đọc trước.','朗读已停止。':'Đã dừng đọc.','朗读不可用，请检查设备语音或音量设置。':'Không thể đọc; vui lòng kiểm tra giọng đọc hoặc âm lượng thiết bị.',
  '麦克风或语音识别权限被拒绝，请在浏览器设置中允许。':'Quyền mic hoặc nhận dạng giọng nói bị từ chối. Vui lòng cho phép trong cài đặt trình duyệt.',
  '浏览器未允许语音识别服务，请改用文字输入。':'Trình duyệt chưa cho phép nhận dạng giọng nói. Vui lòng dùng văn bản.','没有找到可用的麦克风。':'Không tìm thấy mic khả dụng.',
  '语音识别需要联网，请检查网络。':'Nhận dạng giọng nói cần kết nối mạng. Vui lòng kiểm tra mạng.','设备暂不支持该语言的识别，请改用文字输入。':'Thiết bị chưa hỗ trợ nhận dạng ngôn ngữ này. Vui lòng dùng văn bản.',
  '语音识别暂时不可用，请改用文字输入。':'Nhận dạng giọng nói tạm thời không khả dụng. Vui lòng dùng văn bản.',
  '当前浏览器不支持实时语音字幕，请尝试最新版 Chrome；iPhone 可继续使用文字翻译。':'Trình duyệt không hỗ trợ phụ đề giọng nói trực tiếp. Trên iPhone bạn vẫn có thể dùng dịch văn bản.',
  '语音识别启动失败，请稍后再试。':'Không thể bắt đầu nhận dạng giọng nói. Vui lòng thử lại sau.',
  '没有获得麦克风或摄像头权限，请在浏览器设置中允许后重试。':'Chưa được phép dùng mic/camera. Vui lòng cho phép trong cài đặt trình duyệt rồi thử lại.',
  '没有找到可用的麦克风或摄像头。':'Không tìm thấy mic hoặc camera khả dụng.','麦克风或摄像头正被其他应用使用，请关闭后重试。':'Mic hoặc camera đang được ứng dụng khác sử dụng. Vui lòng đóng ứng dụng đó rồi thử lại.',
  '好友暂未上线，请确认好友 ID，并让对方保持页面打开。':'Bạn chưa trực tuyến. Vui lòng kiểm tra ID và nhờ đối phương giữ trang mở.',
  '此聊天 ID 已在另一个页面使用，请关闭重复页面后重试。':'ID trò chuyện đang được dùng ở trang khác. Vui lòng đóng trang trùng rồi thử lại.',
  '此浏览器暂不支持网页通话，请使用新版 Safari 或 Chrome。':'Trình duyệt chưa hỗ trợ gọi trên web. Vui lòng dùng Safari hoặc Chrome mới nhất.',
  '暂时无法连接聊天服务，请检查网络后重试。':'Tạm thời không thể kết nối trò chuyện. Vui lòng kiểm tra mạng rồi thử lại.','连接失败，请稍后重试。':'Kết nối thất bại. Vui lòng thử lại sau.',
  '对方未接听或通话连接超时，请稍后重试。':'Đối phương chưa trả lời hoặc kết nối quá thời gian chờ. Vui lòng thử lại sau.',
  '通话已连接':'Đã kết nối cuộc gọi','此浏览器无法访问麦克风或摄像头，请使用 HTTPS 页面和新版 Safari 或 Chrome。':'Trình duyệt không thể truy cập mic/camera. Vui lòng dùng trang HTTPS và trình duyệt mới nhất.',
  '聊天 ID 格式不正确。':'Định dạng ID trò chuyện không hợp lệ.','聊天服务加载超时，请检查网络后重试。':'Tải dịch vụ trò chuyện quá thời gian chờ. Vui lòng kiểm tra mạng rồi thử lại.',
  '连接已取消。':'Đã hủy kết nối.','聊天服务连接超时，请检查网络后重试。':'Kết nối dịch vụ trò chuyện quá thời gian chờ. Vui lòng kiểm tra mạng rồi thử lại.',
  '聊天连接已关闭。':'Đã đóng kết nối trò chuyện.','聊天服务已连接':'Đã kết nối dịch vụ trò chuyện','收到好友来电':'Có cuộc gọi từ bạn',
  '聊天服务已断开，正在重连…':'Đã ngắt kết nối, đang kết nối lại…','聊天服务已断开，请重新连接。':'Đã ngắt kết nối trò chuyện. Vui lòng kết nối lại.',
  '请输入有效的好友聊天 ID。':'Vui lòng nhập ID trò chuyện hợp lệ của bạn.','请先连接聊天服务，再添加好友。':'Vui lòng kết nối dịch vụ trò chuyện trước khi thêm bạn.',
  '这是你自己的聊天 ID，请输入好友的 ID。':'Đây là ID của bạn. Vui lòng nhập ID của đối phương.','好友已断开连接，请让对方重新打开页面。':'Bạn đã ngắt kết nối. Vui lòng nhờ đối phương mở lại trang.',
  '好友连接超时，请确认好友 ID，并让对方保持页面打开。':'Kết nối với bạn quá thời gian chờ. Vui lòng kiểm tra ID và nhờ đối phương giữ trang mở.',
  '消息内容过长，请缩短后发送。':'Tin nhắn quá dài. Vui lòng rút ngắn rồi gửi.','好友已离线，请重新连接后发送。':'Bạn đã ngoại tuyến. Vui lòng kết nối lại trước khi gửi.',
  '请先连接聊天服务。':'Vui lòng kết nối dịch vụ trò chuyện trước.','请选择有效的好友。':'Vui lòng chọn một người bạn hợp lệ.','请先结束当前通话。':'Vui lòng kết thúc cuộc gọi hiện tại trước.',
  '正在请求设备权限…':'Đang yêu cầu quyền thiết bị…','通话已取消。':'Đã hủy cuộc gọi.','无法发起通话，请确认好友在线后重试。':'Không thể gọi. Vui lòng xác nhận bạn đang trực tuyến rồi thử lại.',
  '等待好友接听…':'Đang chờ bạn trả lời…','此来电已结束。':'Cuộc gọi đến đã kết thúc.','正在连接通话…':'Đang kết nối cuộc gọi…','聊天服务已断开。':'Đã ngắt kết nối dịch vụ trò chuyện.',
  '河内，越南':'Hà Nội, Việt Nam','胡志明市，越南':'TP. Hồ Chí Minh, Việt Nam','岘港，越南':'Đà Nẵng, Việt Nam','南宁，中国':'Nam Ninh, Trung Quốc',
  '昨天':'Hôm qua','今天':'Hôm nay','中':'ZH','界面语言':'Ngôn ngữ giao diện','语言设置':'Cài đặt ngôn ngữ',
}));

const controllers = new WeakMap();
const protectedText = 'script,style,textarea,code,pre,[data-no-i18n],[data-user-content],.avatar,.tiny-avatar,.me,.contact-name,.contact-last,.message-label,.person h2,.profile h2,.profile h3,.my-profile-name,.meeting-captions,.meeting-grid article p,.native-name,.call-person h2,.view-card h3,.call-info h3,.setting-row[data-action="profile"] span,[data-caption-original],[data-caption-translation],.subtitle-original,.subtitle-translation';
for (const [source, translated] of Object.entries({
  "视频通话取得麦克风权限后自动开启字幕":"Phụ đề tự bật khi cuộc gọi video được cấp quyền mic",
  "选择我说的语言，再开启字幕":"Chọn ngôn ngữ tôi nói rồi bật phụ đề",

  "当前浏览器不支持实时语音识别，请使用文字字幕。":"Trình duyệt không hỗ trợ nhận dạng giọng nói trực tiếp. Vui lòng dùng phụ đề văn bản.",
  "语音识别不可用":"Không thể nhận dạng giọng nói",
  "正在启动实时字幕…":"Đang bật phụ đề trực tiếp…",
  "语音识别启动失败，请使用文字字幕。":"Không thể bật nhận dạng giọng nói. Vui lòng dùng phụ đề văn bản.",
  "浏览器识别与通话麦克风冲突，已停止识别。可继续通话或使用文字字幕。":"Nhận dạng giọng nói xung đột với mic cuộc gọi nên đã dừng. Bạn có thể tiếp tục gọi hoặc dùng phụ đề văn bản.",
  "视频通话会在允许麦克风后自动开启字幕。选择“我说”的语言，双方的原文和译文分别显示；也可随时关闭字幕。":"Phụ đề tự bật khi cho phép dùng mic trong cuộc gọi video. Chọn ngôn ngữ trong mục “Tôi nói”; nguyên văn và bản dịch của mỗi bên hiển thị riêng. Bạn có thể tắt phụ đề bất cứ lúc nào.",

  "视频通话会在允许麦克风后自动开启字幕，将你说的话识别为文字并翻译。语音通话可点击“开启字幕”，双方各自识别自己的声音。":"Phụ đề tự bật khi cho phép dùng mic trong cuộc gọi video, nhận dạng và dịch lời nói của bạn. Khi gọi thoại, nhấn “Bật phụ đề”; mỗi bên nhận dạng giọng nói của mình.",

  '我说的':'Lời tôi nói','她说的':'Lời cô ấy nói','等待她说话…':'Đang chờ cô ấy nói…','对方说的':'Lời đối phương','原文':'Nguyên văn','译文':'Bản dịch',
  '我说的语言':'Ngôn ngữ tôi nói','字幕识别方式':'Cách nhận dạng phụ đề','文字字幕':'Phụ đề văn bản',
  '双方分别选择自己说的语言并开启字幕':'Mỗi bên chọn ngôn ngữ mình nói rồi bật phụ đề',
  '登录以开启云端字幕':'Đăng nhập để bật phụ đề đám mây','语言已更新，请用所选语言说话':'Đã đổi ngôn ngữ; hãy nói bằng ngôn ngữ đã chọn',
  '云端识别复用通话麦克风，双方可分别开启。':'Nhận dạng đám mây dùng mic của cuộc gọi; mỗi bên có thể bật độc lập.',


  '浏览器识别与通话麦克风冲突，已停止识别。请使用云端或文字字幕。':'Nhận dạng trình duyệt xung đột với mic cuộc gọi nên đã dừng. Vui lòng dùng đám mây hoặc phụ đề văn bản.',
  '正在检查云端字幕服务…':'Đang kiểm tra dịch vụ phụ đề đám mây…',
  '云端语音识别尚未配置，暂时无法用于 iPhone 双向字幕。可先使用文字字幕。':'Chưa cấu hình nhận dạng đám mây nên chưa thể dùng phụ đề giọng nói hai chiều trên iPhone. Bạn có thể dùng phụ đề văn bản trước.',
  '请先登录，再开启云端字幕。':'Vui lòng đăng nhập trước khi bật phụ đề đám mây.',
  '当前账号尚未开通云端字幕，请联系站点所有者。':'Tài khoản chưa được cấp quyền phụ đề đám mây. Vui lòng liên hệ chủ trang web.',
  '请先接通通话，再开启云端字幕。':'Vui lòng kết nối cuộc gọi trước khi bật phụ đề đám mây.',
  '云端字幕服务暂不可用，可先使用文字字幕。':'Phụ đề đám mây tạm thời không khả dụng. Bạn có thể dùng phụ đề văn bản trước.',
  '当前浏览器不支持语音识别，可使用云端或文字字幕。':'Trình duyệt không hỗ trợ nhận dạng giọng nói. Bạn có thể dùng đám mây hoặc phụ đề văn bản.',
  '此浏览器不支持语音识别，可使用云端或文字字幕。':'Trình duyệt không hỗ trợ nhận dạng giọng nói. Bạn có thể dùng đám mây hoặc phụ đề văn bản.',
  '正在聆听，每段语音约 4 秒后识别翻译':'Đang lắng nghe; mỗi đoạn được nhận dạng và dịch sau khoảng 4 giây',
  '正在识别语音…':'Đang nhận dạng giọng nói…','等待语音识别结果…':'Đang chờ kết quả nhận dạng…','正在听…':'Đang lắng nghe…',
  '对方已开启字幕':'Đối phương đã bật phụ đề','VI → 中':'VI → ZH','中 → VI':'ZH → VI',
  '语音识别服务返回无效结果，请稍后重试。':'Dịch vụ nhận dạng trả về kết quả không hợp lệ. Vui lòng thử lại sau.',
  '尚未配置云端语音识别服务。':'Chưa cấu hình dịch vụ nhận dạng giọng nói đám mây.',
  '语音识别额度暂时不足，请稍后重试。':'Tạm thời không đủ hạn mức nhận dạng giọng nói. Vui lòng thử lại sau.',
  '语音识别服务暂时不可用，请稍后重试。':'Dịch vụ nhận dạng giọng nói tạm thời không khả dụng. Vui lòng thử lại sau.',
  '语音识别服务未返回文字。':'Dịch vụ nhận dạng chưa trả về văn bản.',
  '语音识别超时，请检查网络后重试。':'Nhận dạng giọng nói quá thời gian chờ. Vui lòng kiểm tra mạng rồi thử lại.',
  '无法连接语音识别服务，请检查网络。':'Không thể kết nối dịch vụ nhận dạng giọng nói. Vui lòng kiểm tra mạng.',
  '语音识别处理较慢，已跳过较早的等待片段。':'Nhận dạng đang xử lý chậm; đã bỏ qua đoạn chờ cũ hơn.',
  '无法录制通话音频。':'Không thể ghi âm thanh cuộc gọi.','音频分段失败，请重新开启字幕。':'Không thể chia đoạn âm thanh. Vui lòng bật lại phụ đề.',
  '此浏览器无法录制通话音频。':'Trình duyệt không thể ghi âm thanh cuộc gọi.',
  '此浏览器不支持通话音频转写，请使用新版 Safari。':'Trình duyệt không hỗ trợ chép lời âm thanh cuộc gọi. Vui lòng dùng Safari mới nhất.',
  '通话麦克风尚未开启，请先接通通话。':'Mic cuộc gọi chưa được bật. Vui lòng kết nối cuộc gọi trước.',
  '不支持此请求方式。':'Phương thức yêu cầu không được hỗ trợ.','请求来源不受支持。':'Nguồn yêu cầu không được hỗ trợ.',
  '云端语音识别尚未配置。':'Chưa cấu hình nhận dạng giọng nói đám mây.',
  '此账号尚未获得云端字幕使用权限。':'Tài khoản chưa được cấp quyền sử dụng phụ đề đám mây.',
  '请提交音频文件。':'Vui lòng gửi tệp âm thanh.','音频片段过大，请缩短后重试。':'Đoạn âm thanh quá lớn. Vui lòng rút ngắn rồi thử lại.',
  '无法读取音频文件。':'Không thể đọc tệp âm thanh.','请选择中文或越南语。':'Vui lòng chọn tiếng Trung hoặc tiếng Việt.',
  '请提交有效的音频文件。':'Vui lòng gửi tệp âm thanh hợp lệ.',
  '暂不支持此音频格式，请使用 MP4、WebM、Ogg 或 MP3。':'Chưa hỗ trợ định dạng âm thanh này. Vui lòng dùng MP4, WebM, Ogg hoặc MP3.',
  '语音识别请求过于频繁，请稍后重试。':'Yêu cầu nhận dạng giọng nói quá thường xuyên. Vui lòng thử lại sau.',
  '语音识别服务额度不足，请稍后重试。':'Dịch vụ nhận dạng giọng nói đã hết hạn mức. Vui lòng thử lại sau.',
  '语音识别服务暂时不可用。':'Dịch vụ nhận dạng giọng nói tạm thời không khả dụng.',
  '语音识别服务未返回有效文字。':'Dịch vụ nhận dạng không trả về văn bản hợp lệ.',
  '语音识别超时，请稍后重试。':'Nhận dạng giọng nói quá thời gian chờ. Vui lòng thử lại sau.',
  '演示预览':'Xem trước minh họa',



  '通话页先选择“我说”的语言，再开启字幕。双方字幕分别显示。iPhone 优先选择云端识别，未开通云端服务时可使用文字字幕。':'Trên trang cuộc gọi, chọn ngôn ngữ trong mục “Tôi nói” rồi bật phụ đề. Phụ đề của mỗi bên được hiển thị riêng. Trên iPhone, ưu tiên nhận dạng đám mây; nếu chưa bật dịch vụ đám mây, bạn có thể dùng phụ đề văn bản.',


  '请在使用对应功能前了解这些数据流向。':'Hãy lưu ý cách dữ liệu được xử lý trước khi dùng.',
})) translations.set(source,translated);

for(const [source,translated] of Object.entries({"我": "Tôi", "账号": "Tài khoản", "已登录": "Đã đăng nhập", "登录 / 账号": "Đăng nhập / Tài khoản", "已登录 · 账号": "Đã đăng nhập · Tài khoản", "账号已连接": "Đã kết nối tài khoản", "账号…": "Tài khoản…", "账号状态": "Trạng thái tài khoản", "正在检查登录状态…": "Đang kiểm tra đăng nhập…", "暂时无法读取登录状态": "Chưa thể đọc trạng thái đăng nhập", "未登录 · 当前为访客": "Chưa đăng nhập · Khách", "账号与登录": "Tài khoản và đăng nhập", "游客极速体验": "Trải nghiệm nhanh với tư cách khách", "退出账号": "Đăng xuất tài khoản", "昵称只是本机聊天资料，不代表已经登录账号。": "Tên hiển thị chỉ là hồ sơ trên thiết bị, không có nghĩa là đã đăng nhập.", "无需注册即可添加好友、聊天和使用文字翻译。好友号与聊天记录保存在当前设备。": "Không cần đăng ký để thêm bạn, trò chuyện và dịch văn bản. Mã bạn bè và lịch sử trò chuyện được lưu trên thiết bị này.", "此账号未提供邮箱": "Tài khoản này chưa cung cấp email", "服务尚未配置": "Dịch vụ chưa được cấu hình", "可直接使用": "Sẵn sàng sử dụng", "游客模式 · 即开即聊": "Chế độ khách · Trò chuyện ngay", "账号已连接": "Đã kết nối tài khoản", "暂未开放购买": "Chưa mở bán", "继续使用越聊": "Tiếp tục dùng YueLiao", "账号与登录": "Tài khoản", "智能助手：": "Trợ lý thông minh: ", "越聊现已开放限量公测。好友连接、双语聊天与文字翻译可直接体验。": "YueLiao hiện mở thử nghiệm công khai giới hạn. Có thể kết nối bạn bè, trò chuyện song ngữ và dịch văn bản.", "会员权益与价格确认后开放购买。": "Quyền lợi và giá thành viên sẽ được xác nhận trước khi mở bán.", "通话与专属服务以实际开放内容为准。": "Dịch vụ cuộc gọi và quyền lợi riêng sẽ theo nội dung thực tế khi mở.", "当前不收取会员费用，也不收集预约或支付信息。购买功能开放后会在页面内明确展示权益、价格与可用支付方式。": "Hiện chưa thu phí thành viên và không thu thập thông tin đặt trước hoặc thanh toán. Khi mở bán, quyền lợi, giá và phương thức thanh toán sẽ được hiển thị rõ.", "知道了": "Đã hiểu", "游客极速体验": "Trải nghiệm nhanh với tư cách khách", "智能助手与部分在线能力暂未向游客开放。": "Trợ lý thông minh và một số tính năng trực tuyến hiện chưa mở cho khách.", "智能助手暂不可用": "Trợ lý thông minh hiện chưa khả dụng", "你可以继续使用好友聊天、通话和文字翻译。": "Bạn vẫn có thể trò chuyện với bạn bè, gọi điện và dịch văn bản.", "越聊 1.0 · 限量公测": "YueLiao 1.0 · Thử nghiệm công khai giới hạn", "退出当前网站登录后，可重新选择账号。好友和本机聊天记录不会自动清除。": "Sau khi đăng xuất, bạn có thể chọn tài khoản khác. Bạn bè và lịch sử trên thiết bị không tự bị xóa.", "越聊助手": "Trợ lý YueLiao", "越聊 AI 助手": "Trợ lý AI YueLiao", "AI 助手": "Trợ lý AI", "聊天、问答、中越翻译": "Trò chuyện, hỏi đáp, dịch Trung – Việt", "聊天 · 问答 · 中越翻译": "Trò chuyện · Hỏi đáp · Dịch Trung – Việt", "聊天": "Trò chuyện", "问答": "Hỏi đáp", "翻译": "Dịch", "中越翻译": "Dịch Trung – Việt", "一个助手，就够了": "Một trợ lý là đủ", "直接用中文或越南语提问。助手会参考最近的对话回答。": "Hỏi bằng tiếng Trung hoặc tiếng Việt. Trợ lý sẽ tham khảo các tin nhắn gần đây để trả lời.", "AI 内容可能有误，请核实重要信息。": "Nội dung AI có thể sai. Hãy kiểm tra thông tin quan trọng.", "AI 内容可能有误 · 对话发送至 Groq": "AI có thể sai · Hội thoại được gửi đến Groq", "今天 · AI 对话": "Hôm nay · Trò chuyện với AI", "已提交": "Đã gửi", "思考中…": "Đang suy nghĩ…", "正在翻译…": "Đang dịch…", "离线 · 可留言": "Ngoại tuyến · Có thể nhắn tin", "离线 · 可发送留言": "Ngoại tuyến · Có thể nhắn tin", "可留言": "Có thể nhắn tin", "登录后使用 AI 助手": "Đăng nhập để dùng trợ lý AI", "登录越聊即可使用，无需单独开通。": "Khách có thể dùng chat và bản dịch văn bản trực tiếp.", "游客极速体验": "Trải nghiệm nhanh với tư cách khách", "创建群聊": "Tạo nhóm", "加入群聊": "Tham gia nhóm", "群聊": "Nhóm chat", "群号": "Mã nhóm", "群名称": "Tên nhóm", "创建": "Tạo", "加入": "Tham gia", "群成员": "Thành viên nhóm", "群成员与邀请": "Thành viên và lời mời", "群主": "Trưởng nhóm", "· 群主": "· Trưởng nhóm", "群聊 · 中越翻译": "Nhóm · Dịch Trung – Việt", "文字群聊 · 中越双语": "Nhóm văn bản · Song ngữ Trung – Việt", "中越双语文字群聊": "Nhóm văn bản song ngữ Trung – Việt", "中越双语": "Song ngữ Trung – Việt", "文字群聊": "Nhóm văn bản", "群号：": "Mã nhóm:", "请输入群号": "Nhập mã nhóm", "复制群号邀请朋友": "Sao chép mã nhóm để mời bạn", "群号已复制": "Đã sao chép mã nhóm", "欢迎加入群聊": "Chào mừng bạn vào nhóm", "输入朋友分享的群号。": "Nhập mã nhóm do bạn bè chia sẻ.", "最多 50 人，支持中越文字自动翻译。": "Tối đa 50 người, hỗ trợ tự động dịch văn bản Trung – Việt.", "群号是入群凭证，请只发给想邀请的人。群资料保存在当前设备身份下，换设备不会自动同步。": "Mã nhóm cho phép tham gia nhóm; chỉ chia sẻ với người bạn muốn mời. Nhóm gắn với danh tính thiết bị hiện tại, không tự đồng bộ khi đổi thiết bị.", "加入后可查看新消息；云端消息保留 30 天。本版暂不推送群消息，打开网页后自动收取。": "Có thể xem tin nhắn mới sau khi tham gia; tin nhắn đám mây được giữ 30 ngày. Bản này chưa có thông báo đẩy cho nhóm; mở trang để nhận tin.", "已发送到群聊": "Đã gửi vào nhóm", "发送中…": "Đang gửi…", "正在加载…": "Đang tải…", "解散群聊": "Giải tán nhóm", "退出群聊": "Rời nhóm", "解散群聊？": "Giải tán nhóm?", "退出群聊？": "Rời nhóm?", "群成员将无法再发消息，云端群记录会被删除。": "Thành viên sẽ không thể gửi tin; lịch sử nhóm trên đám mây sẽ bị xóa.", "退出后将停止收到群消息。": "Bạn sẽ ngừng nhận tin nhắn nhóm sau khi rời nhóm.", "确认": "Xác nhận", "会议": "Cuộc họp", "进入视频会议": "Vào cuộc họp video", "退出会议": "Rời cuộc họp", "关闭麦克风": "Tắt mic", "开启麦克风": "Bật mic", "关闭摄像头": "Tắt camera", "开启摄像头": "Bật camera", "开启翻译字幕": "Bật phụ đề dịch", "关闭翻译字幕": "Tắt phụ đề dịch", "重试翻译字幕": "Thử lại phụ đề dịch", "播放声音": "Phát âm thanh", "正在检查字幕服务…": "Đang kiểm tra dịch vụ phụ đề…", "会议文字字幕": "Phụ đề văn bản cuộc họp", "识别不可用时，可输入文字翻译": "Có thể nhập văn bản để dịch khi nhận dạng không khả dụng", "发送字幕": "Gửi phụ đề", "翻译字幕已关闭": "Đã tắt phụ đề dịch", "群视频会议": "Cuộc họp video nhóm", "请戴耳机。语音将发送给识别与翻译服务；使用个人资料中的语言。离开页面可能中断会议。": "Hãy đeo tai nghe. Giọng nói được gửi đến dịch vụ nhận dạng và dịch, theo ngôn ngữ trong hồ sơ. Rời trang có thể ngắt cuộc họp.", "正在申请摄像头和麦克风…": "Đang yêu cầu camera và mic…", "群聊目前支持文字，视频通话请使用会议入口。": "Nhóm hỗ trợ văn bản; hãy dùng mục Cuộc họp để gọi video.", "个人资料": "Hồ sơ cá nhân", "从相册选择": "Chọn từ thư viện ảnh", "越聊号": "Mã YueLiao", "邮箱与密码": "Email và mật khẩu", "保存资料": "Lưu hồ sơ", "账号已连接": "Đã kết nối tài khoản", "修改号码后，好友需要用新号码重新连接，才能继续接收离线消息。已有聊天记录保留。": "Sau khi đổi mã, bạn bè cần kết nối lại bằng mã mới để tiếp tục nhận tin ngoại tuyến. Lịch sử hiện có được giữ lại.", "编辑个人资料": "Chỉnh sửa hồ sơ", "修改头像": "Đổi ảnh đại diện", "删除好友": "Xóa bạn", "删除好友？": "Xóa bạn?", "确认删除": "Xác nhận xóa", "同时删除本机与此好友的聊天记录": "Đồng thời xóa lịch sử trò chuyện với người này trên thiết bị", "连接好友": "Kết nối bạn bè", "+ 连接好友": "+ Kết nối bạn bè", "更多功能": "Thêm chức năng", "图片": "Ảnh", "切换语言": "Đổi ngôn ngữ", "离线消息暂存30天 · 重新打开自动收取": "Tin ngoại tuyến được giữ 30 ngày · Mở lại để nhận tin"}))translations.set(source,translated);

for(const [a,b] of Object.entries({"中越语音、视频通话实时翻译，字幕同步显示": "Dịch trực tiếp cuộc gọi thoại và video Trung – Việt, hiển thị phụ đề đồng bộ", "限量公测 · 识别效果取决于设备、权限和网络。": "Thử nghiệm giới hạn · Nhận dạng phụ thuộc vào thiết bị, quyền và mạng.", "开始实时翻译": "Bắt đầu dịch trực tiếp", "隐私与数据处理": "Quyền riêng tư và xử lý dữ liệu", "尚未连接聊天服务 · 点击连接": "Chưa kết nối dịch vụ chat · Nhấn để kết nối", "正在连接聊天信令服务，请稍候…": "Đang kết nối dịch vụ báo hiệu, vui lòng chờ…", "聊天信令已连接 · 通话仍需好友在线": "Đã kết nối báo hiệu · Gọi cần bạn bè trực tuyến", "聊天服务连接失败 · 点击重试": "Kết nối chat thất bại · Nhấn thử lại", "聊天服务已断开 · 点击重试": "Chat đã ngắt kết nối · Nhấn thử lại", "好友通话与普通文字翻译可直接使用。智能助手与部分在线能力暂未向游客开放。": "Có thể gọi bạn bè và dịch văn bản mà không cần đăng nhập. Trợ lý thông minh và một số tính năng trực tuyến hiện chưa mở cho khách.", "先连接好友，再发起语音或视频通话。通话时自动尝试开启字幕；无法识别时可输入文字字幕。": "Kết nối bạn bè rồi gọi thoại hoặc video. Phụ đề tự được thử bật; nếu không nhận dạng được, có thể nhập văn bản.",  "添加好友并连接": "Thêm bạn và kết nối", "先试文字翻译": "Thử dịch văn bản trước", "打开聊天": "Mở trò chuyện",  "录音／通话会使用麦克风；识别与翻译可能发送给外部服务。": "Ghi âm/cuộc gọi dùng mic; nhận dạng và dịch có thể gửi dữ liệu đến dịch vụ bên ngoài.", }))translations.set(a,b);
for (const [source, translated] of Object.entries({
  '中文与越南语，聊天和通话更顺畅':'Trò chuyện và gọi song ngữ Trung – Việt dễ dàng hơn',
  '限量公测 · 通话字幕效果受设备、权限和网络影响。':'Thử nghiệm giới hạn · Phụ đề cuộc gọi phụ thuộc thiết bị, quyền và mạng.',
  '翻译与通话':'Dịch và gọi',
  '安装越聊':'Cài đặt YueLiao','会员权益':'Quyền lợi thành viên','游客模式':'Chế độ khách','使用状态':'Trạng thái sử dụng','1.0 · 限量公测':'1.0 · Thử nghiệm công khai giới hạn','查看会员方案':'Xem gói thành viên',
  '越聊会员方案':'Gói thành viên YueLiao','会员权益':'Quyền lợi thành viên','游客模式':'Chế độ khách','使用状态':'Trạng thái sử dụng','1.0 · 限量公测':'1.0 · Thử nghiệm công khai giới hạn',
  '越聊现已开放限量公测。会员购买暂未开放。':'YueLiao hiện mở thử nghiệm công khai giới hạn. Thành viên chưa mở bán.',
  '方案预览':'Xem trước gói','黄金 VIP':'VIP Vàng','钻石黑卡':'Thẻ Đen Kim Cương',
  '更多翻译额度（规划中）':'Thêm hạn mức dịch (đang lên kế hoạch)',
  '通话字幕增强（规划中）':'Cải thiện phụ đề cuộc gọi (đang lên kế hoạch)',
  '会员专属外观（规划中）':'Giao diện riêng cho thành viên (đang lên kế hoạch)',
  '越南本地支付通道尚未接入，当前页面不会收款。':'Chưa tích hợp thanh toán tại Việt Nam; trang hiện không nhận tiền.',
  '继续体验越聊':'Tiếp tục dùng YueLiao','安装到手机':'Cài vào điện thoại',
  '添加到主屏幕':'Thêm vào màn hình chính','Safari 安装步骤':'Cách cài trên Safari',
  '在 Safari 点分享按钮，再选“添加到主屏幕”。':'Trong Safari, nhấn nút Chia sẻ rồi chọn “Thêm vào màn hình chính”.',
  '浏览器暂不支持自动安装，请从菜单选择“安装应用”或“添加到主屏幕”。':'Trình duyệt chưa hỗ trợ cài tự động. Hãy mở menu và chọn “Cài ứng dụng” hoặc “Thêm vào màn hình chính”.',
  '语音字幕暂不可用，可继续通话或使用文字字幕。':'Phụ đề giọng nói tạm thời không khả dụng. Bạn có thể tiếp tục gọi hoặc dùng phụ đề văn bản.',
  '正在处理语音字幕…':'Đang xử lý phụ đề giọng nói…','在线识别':'Nhận dạng trực tuyến',
  '浏览器识别':'Nhận dạng của trình duyệt',
  '在线识别需账号授权；语音数据处理方式见隐私说明。':'Nhận dạng trực tuyến cần tài khoản được cấp quyền; xem cách xử lý dữ liệu giọng nói trong chính sách riêng tư.',
  '越聊 YueLiao｜中越双语聊天与通话':'YueLiao｜Trò chuyện và gọi song ngữ Trung – Việt',
  '本机预览':'Xem trước trên thiết bị','仅显示本机画面，不会接通好友。':'Chỉ hiển thị hình ảnh trên thiết bị này, không kết nối với bạn bè.',
  '登录后可使用越聊助手。':'Đăng nhập để dùng Trợ lý YueLiao.',
  '在线翻译服务处理中，详情见隐私说明。':'Dịch vụ dịch trực tuyến đang xử lý; xem chi tiết trong chính sách riêng tư.',
  '语音识别与翻译会使用在线服务，详情见隐私说明。':'Nhận dạng giọng nói và dịch dùng dịch vụ trực tuyến; xem chi tiết trong chính sách riêng tư.',
  '锁屏通知暂未开放。网页打开时仍可接收来电提示。':'Thông báo màn hình khóa chưa mở. Bạn vẫn có thể nhận báo cuộc gọi khi trang đang mở.'
})) translations.set(source, translated);

for (const [source, translated] of Object.entries({
  '切换翻译方向':'Đổi chiều dịch','翻译方向已切换':'Đã đổi chiều dịch','自动翻译':'Tự động dịch',
  '发现':'Khám phá','我的':'Cá nhân','你的越聊圈':'Vòng kết nối YueLiao','用熟悉的语言，和越南朋友自然聊天。':'Trò chuyện tự nhiên với bạn bè Việt Nam bằng ngôn ngữ quen thuộc.','添加一位朋友，开始你的第一段双语对话。':'Thêm một người bạn và bắt đầu cuộc trò chuyện song ngữ đầu tiên.','朋友':'Bạn bè','发消息':'Nhắn tin','这里只展示你已连接的好友，不编造附近用户或动态。':'Chỉ hiển thị bạn bè bạn đã kết nối; không tạo hồ sơ hay bài đăng giả.','中文 ⇄ Tiếng Việt':'Tiếng Trung ⇄ Tiếng Việt','字幕语言':'Ngôn ngữ phụ đề','键盘输入':'Nhập bằng bàn phím','说点什么…':'Nhập tin nhắn…','隐私说明':'Quyền riêng tư','帮助与信息':'Trợ giúp và thông tin','请允许麦克风访问，再开启语音字幕。':'Hãy cho phép truy cập micrô rồi bật phụ đề giọng nói.','当前浏览器无法识别语音，通话仍可继续，也可以输入文字。':'Trình duyệt hiện không nhận dạng được giọng nói. Bạn vẫn có thể tiếp tục cuộc gọi hoặc nhập văn bản.','语音识别暂时没有启动，通话仍可继续，也可以输入文字。':'Nhận dạng giọng nói chưa khởi động. Bạn vẫn có thể tiếp tục cuộc gọi hoặc nhập văn bản.',
  '关闭聊天详情':'Đóng thông tin trò chuyện','越聊现已开放限量公测。':'YueLiao hiện mở thử nghiệm công khai giới hạn.',
  '越聊 1.0 · 限量公测':'YueLiao 1.0 · Thử nghiệm công khai giới hạn','会员服务':'Dịch vụ thành viên','尊享方案':'Gói cao cấp','更充足的翻译体验':'Trải nghiệm dịch phong phú hơn','专属会员标识与主题':'Huy hiệu và giao diện dành riêng cho thành viên','进阶通话字幕体验':'Trải nghiệm phụ đề cuộc gọi nâng cao','专属会员服务':'Dịch vụ thành viên riêng','暂未开放购买':'Chưa mở bán','当前不收取会员费用，也不收集预约或支付信息。购买功能开放后会在页面内明确展示权益、价格与可用支付方式。':'Hiện chưa thu phí thành viên và không thu thập thông tin đặt trước hoặc thanh toán. Khi mở bán, quyền lợi, giá và phương thức thanh toán sẽ được hiển thị rõ.',
  '开启中越通话':'Bắt đầu cuộc gọi Trung – Việt','需要开启设备权限':'Cần bật quyền thiết bị','请在系统浏览器中打开':'Hãy mở bằng trình duyệt hệ thống','点击继续后，浏览器会请求麦克风权限。请选择“允许”以开始通话和中越字幕。':'Sau khi tiếp tục, trình duyệt sẽ yêu cầu quyền micrô. Hãy chọn “Cho phép” để bắt đầu cuộc gọi và phụ đề Trung – Việt.','点击继续后，浏览器会请求麦克风权限，视频通话还会请求摄像头。请选择“允许”以开始通话和中越字幕。':'Sau khi tiếp tục, trình duyệt sẽ yêu cầu quyền micrô và camera cho cuộc gọi video. Hãy chọn “Cho phép” để bắt đầu cuộc gọi và phụ đề Trung – Việt.','当前似乎在微信或 Telegram 内打开，若权限弹窗不出现，请从菜单选择“在浏览器打开”。':'Có vẻ bạn đang mở trong WeChat hoặc Telegram. Nếu không thấy yêu cầu quyền, hãy chọn “Mở bằng trình duyệt” trong menu.','刚才没有取得麦克风或摄像头权限。请到浏览器的网站设置中允许麦克风，再回来重试。':'Chưa có quyền micrô hoặc camera. Hãy cho phép micrô trong cài đặt trang của trình duyệt rồi thử lại.','刚才没有取得麦克风或摄像头权限。请到浏览器的网站设置中允许麦克风和摄像头，再回来重试。':'Chưa có quyền micrô hoặc camera. Hãy cho phép micrô và camera trong cài đặt trang của trình duyệt rồi thử lại.','当前浏览器无法申请麦克风权限。请复制越聊链接，在 iPhone Safari 或 Android Chrome 中打开。':'Trình duyệt này không thể yêu cầu quyền micrô. Hãy sao chép liên kết YueLiao và mở bằng Safari trên iPhone hoặc Chrome trên Android.','当前浏览器无法申请麦克风和摄像头权限。请复制越聊链接，在 iPhone Safari 或 Android Chrome 中打开。':'Trình duyệt này không thể yêu cầu quyền micrô và camera. Hãy sao chép liên kết YueLiao và mở bằng Safari trên iPhone hoặc Chrome trên Android.','麦克风用于通话和语音识别；拒绝权限时，仍可稍后在网页设置中开启。':'Micrô được dùng cho cuộc gọi và nhận dạng giọng nói. Nếu từ chối, bạn có thể bật lại trong cài đặt trang sau.','稍后再说':'Để sau','允许权限并继续':'Cho phép và tiếp tục','再试一次':'Thử lại','知道了':'Đã hiểu','关闭':'Đóng'
})) translations.set(source, translated);

function translateUI(source) {
  const match = source.match(/^(\s*)([\s\S]*?)(\s*)$/u);
  if (!match) return source;
  const [, before, core, after] = match;
  if (translations.has(core)) return before + translations.get(core) + after;
  if (/^\d+ 位好友$/.test(core))return before+core.replace(' 位好友',' bạn bè')+after;
  if (core.startsWith('我的好友号：')) return before+'Mã kết bạn của tôi: '+core.slice('我的好友号：'.length)+after;
  if (core.endsWith(' 原文仍可发送。')) return translateUI(core.slice(0,-' 原文仍可发送。'.length))+' Bạn vẫn có thể gửi bản gốc.';
  const sentences=core.match(/[^。]+。?/gu);
  if(sentences?.length>1)return before+sentences.map(part=>translateUI(part)).join(' ')+after;
  const segments = core.split(/( · | → |：)/u);
  if (segments.length > 1) return before + segments.map(part => part === '：' ? ': ' : (translations.get(part) || part)).join('') + after;
  return source;
}

function shouldProtect(node) {
  const parent = node.parentElement;
  if (parent?.closest('[data-ui-text]')) return false;
  if (parent?.closest('.demo-badge')) return false;
  if (!parent || parent.closest(protectedText)) return true;
  if (parent.closest('.bubble') && !parent.closest('.translation-label,[data-retry],.translated[style]')) return true;
  if (parent.closest('.translated') && !parent.closest('.translation-label,[data-retry],.translated[style]')) return true;
  // Machine translations and typed text must never become interface strings.
  if (parent.closest('#translate-result,.translation-result') && ![
    '让每一句，都被听懂。','翻译额度暂时用完，请稍后重试。','翻译服务暂时不可用，请稍后重试。',
    '翻译失败，请稍后重试或发送原文。','翻译超时，请检查网络后重试。','无法连接翻译服务，请检查网络。',
    '请输入需要翻译的内容。','每条翻译最多支持 450 个字，请分段发送。','请选择中文与越南语之间的互译方向。',
  ].includes(textRecordsSource(node))) return true;
  return false;
}

// Translated text in a result panel is protected on subsequent refreshes too.
function textRecordsSource(node) {
  const value=node.nodeValue.trim();
  for (const key of ['让每一句，都被听懂。','翻译额度暂时用完，请稍后重试。','翻译服务暂时不可用，请稍后重试。',
    '翻译失败，请稍后重试或发送原文。','翻译超时，请检查网络后重试。','无法连接翻译服务，请检查网络。',
    '请输入需要翻译的内容。','每条翻译最多支持 450 个字，请分段发送。','请选择中文与越南语之间的互译方向。']) {
    if (value===key||value===translations.get(key)) return key;
  }
  return value;
}

/** One controller per document. Returns {language,setLanguage,refresh,dispose}. */
export function setupInterfaceLanguage({document: doc = globalThis.document} = {}) {
  if (!doc) return null;
  if (controllers.has(doc)) return controllers.get(doc);
  const view = doc.defaultView || globalThis;
  let language;
  try { language = view.localStorage.getItem('yueliao-interface-language'); } catch {}
  if (!['zh','vi'].includes(language)) language = /^vi(?:-|$)/i.test(view.navigator?.language || '') ? 'vi' : 'zh';
  const textRecords = new WeakMap(), attributeRecords = new WeakMap();
  let queued = false, disposed = false;
  const observer = new view.MutationObserver(() => {
    if (queued || disposed) return;
    queued = true;
    view.queueMicrotask(() => { queued = false; if (!disposed) refresh(); });
  });
  const observerOptions = {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title','alt']};

  function createSwitch(inCall) {
    const wrap = doc.createElement('label');
    wrap.className = inCall ? 'control interface-language-control in-call' : 'interface-language-control';
    wrap.dataset.noI18n = '';
    wrap.style.cssText = inCall
      ? 'display:flex;flex-direction:column;align-items:center;gap:9px;color:#c8d6bd;font-size:9px;'
      : 'display:flex;align-items:center;gap:5px;color:#7e8f72;font-size:11px;';
    const select = doc.createElement('select');
    select.dataset.interfaceLanguage = '';
    select.style.cssText = `max-width:${inCall?'108px':'128px'};height:${inCall?'55px':'auto'};border:1px solid ${inCall?'#ffffff30':'#e5ebdd'};border-radius:8px;padding:7px 9px;background:${inCall?'#334e3f':'#f8faf4'};color:inherit;font:inherit;font-size:16px;cursor:pointer;`;
    for (const [value, label] of [['zh','🇨🇳 中文'],['vi','🇻🇳 Tiếng Việt']]) {
      const option = doc.createElement('option');option.value=value;option.textContent=label;select.append(option);
    }
    select.value=language;
    select.onchange = () => setLanguage(select.value);
    wrap.append(select);
    if(inCall){const hint=doc.createElement('span');hint.dataset.interfaceLanguageHint='';hint.textContent=language==='vi'?'Giao diện':'界面语言';wrap.append(hint);}
    return wrap;
  }
  function ensureSwitches() {
    const top = doc.querySelector('.top-right');
    if (top && !top.querySelector('[data-interface-language]')) {
      const control = createSwitch(false), chip = top.querySelector('.language-chip');
      if (chip) chip.replaceWith(control); else top.prepend(control);
    }
    const call = doc.querySelector('.call-overlay');
    if (call && !call.querySelector('#call-answer') && !call.querySelector('[data-interface-language]')) {
      const control=createSwitch(true), controls=call.querySelector('.call-controls');
      if(controls)controls.append(control);
      else {control.style.cssText+='position:absolute;right:16px;bottom:18px;z-index:8;';call.append(control);}
    }
    for (const select of doc.querySelectorAll('[data-interface-language]')) {
      select.value=language;
      select.setAttribute('aria-label',language==='vi'?'Ngôn ngữ giao diện':'界面语言');
      select.title=language==='vi'?'Chỉ đổi giao diện; ngôn ngữ lời nói được chọn riêng.':'仅切换界面语言；说话语言请在通话页单独选择。';
    }
    for(const hint of doc.querySelectorAll('[data-interface-language-hint]'))hint.textContent=language==='vi'?'Giao diện':'界面语言';
  }
  function refresh() {
    observer.disconnect();
    ensureSwitches();
    const walker = doc.createTreeWalker(doc.body, view.NodeFilter.SHOW_TEXT);
    let node;
    while ((node=walker.nextNode())) {
      if (!node.nodeValue.trim() || shouldProtect(node)) continue;
      const previous = textRecords.get(node);
      const source = previous && node.nodeValue===previous.last ? previous.source : node.nodeValue;
      const translated = language==='vi' ? translateUI(source) : source;
      textRecords.set(node,{source,last:translated});
      if (node.nodeValue!==translated) node.nodeValue=translated;
    }
    for (const element of doc.querySelectorAll('[placeholder],[aria-label],[title],[alt]')) {
      if (element.closest('[data-no-i18n]')) continue;
      let entries = attributeRecords.get(element);
      if (!entries) { entries=new Map();attributeRecords.set(element,entries); }
      for (const attr of ['placeholder','aria-label','title','alt']) {
        if (!element.hasAttribute(attr)) continue;
        // Avatar alt text is a person's name, not a product label.
        if (attr==='alt' && element.matches('.avatar')) continue;
        const current=element.getAttribute(attr),previous=entries.get(attr);
        const source=previous && current===previous.last ? previous.source : current;
        const translated=language==='vi' ? translateUI(source) : source;
        entries.set(attr,{source,last:translated});
        if (current!==translated) element.setAttribute(attr,translated);
      }
    }
    doc.documentElement.lang=language==='vi'?'vi':'zh-CN';
    doc.title=language==='vi'?'YueLiao｜Trò chuyện và gọi Trung – Việt':'越聊 YueLiao｜中越双语聊天与通话';
    observer.observe(doc.body,observerOptions);
  }
  function setLanguage(value) {
    if (!['zh','vi'].includes(value)) return;
    language=value;
    try { view.localStorage.setItem('yueliao-interface-language',value); } catch {}
    refresh();
    doc.dispatchEvent(new view.CustomEvent('interface-language-change',{detail:{language:value}}));
  }
  const controller={get language(){return language;},setLanguage,refresh,dispose(){disposed=true;observer.disconnect();controllers.delete(doc);}};
  controllers.set(doc,controller);
  refresh();
  return controller;
}
