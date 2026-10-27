import { SupplementaryResource } from "../types";

export const SUPPLEMENTARY_RESOURCES: SupplementaryResource[] = [
  // --- LỚP 1 ---
  {
    id: "nxbgd-g1-01",
    title: "Phép cộng, phép trừ không nhớ trong phạm vi 20",
    grade: 1,
    bookSeries: "Kết nối tri thức",
    category: "Vở bài tập bổ trợ số",
    topic: "Số học & Phép tính cơ bản",
    curriculumStandard: "GDPT 2018 - Mức độ 1 & 2: Thực hiện thành thạo bảng cộng, trừ trong phạm vi 20",
    description: "Bộ phiếu ôn tập và bài tập bổ trợ số hóa giúp học sinh lớp 1 nhận diện bản chất phép cộng (gộp lại) và phép trừ (bớt đi) bằng hình ảnh que tính, chấm tròn và trục số trực quan.",
    summaryPoints: [
      "Phép cộng là gộp hai nhóm đồ vật lại với nhau: Ví dụ có 7 quả táo, thêm 5 quả táo ta có 7 + 5 = 12 quả táo.",
      "Phép trừ là bớt đi từ một nhóm đồ vật: Ví dụ có 14 quả bóng, bay mất 4 quả bóng thì còn 14 - 4 = 10 quả bóng.",
      "Ghi nhớ quy tắc tách số: Muốn cộng qua 10, ta tách số sau để tạo tròn chục rồi cộng với phần còn lại."
    ],
    tipsAndMistakes: [
      "Học sinh hay nhầm lẫn dấu '+' và dấu '-' khi đọc đề bài nhanh.",
      "Khắc phục: Cho học sinh dùng ngón tay hoặc gạch chéo hình vẽ biểu diễn số lượng bớt đi."
    ],
    exercises: [
      {
        id: "ex-g1-01-1",
        question: "Trong rổ có 9 quả cam, mẹ mua thêm 6 quả cam nữa. Hỏi trong rổ có tất cả bao nhiêu quả cam?",
        options: ["14 quả cam", "15 quả cam", "16 quả cam", "13 quả cam"],
        correctAnswer: "15 quả cam",
        hint: "Mẹ mua thêm nghĩa là gộp vào, em hãy thực hiện phép cộng 9 + 6 nhé!",
        method: "Phương pháp: 9 + 6 = 9 + 1 + 5 = 10 + 5 = 15 quả cam."
      },
      {
        id: "ex-g1-01-2",
        question: "Phép tính nào dưới đây có kết quả bằng 12?",
        options: ["7 + 4", "8 + 4", "9 + 4", "6 + 5"],
        correctAnswer: "8 + 4",
        hint: "Em hãy tính nhẩm từng phép tính: 7 + 4 = 11, 8 + 4 = 12...",
        method: "Phương pháp: 8 + 4 = 8 + 2 + 2 = 10 + 2 = 12."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Bộ Sách Kết Nối Tri Thức",
    downloadableTitle: "Phiếu_Bài_Tập_Bổ_Trợ_Toán_1_Cộng_Trừ_20.pdf"
  },
  {
    id: "nxbgd-g1-02",
    title: "Nhận biết hình vuông, hình tròn, hình tam giác, hình chữ nhật",
    grade: 1,
    bookSeries: "Chân trời sáng tạo",
    category: "Video mô phỏng tương tác",
    topic: "Hình học trực quan",
    curriculumStandard: "GDPT 2018 - Nhận biết và gọi đúng tên các hình phẳng qua đồ vật thực tế",
    description: "Học liệu hình học bổ trợ giúp bé nhận biết các hình học phẳng qua đồ dùng quen thuộc: chiếc đồng hồ tròn, bảng đen hình chữ nhật, biển báo hình tam giác, viên gạch hình vuông.",
    summaryPoints: [
      "Hình tròn: Không có góc, cong tròn đều như chiếc đĩa hay chiếc bánh xe.",
      "Hình tam giác: Có đúng 3 cạnh và 3 góc nhọn như mái nhà hoặc cánh buồm.",
      "Hình vuông: Có 4 cạnh dài bằng nhau như chiếc khăn tay.",
      "Hình chữ nhật: Có 2 cạnh dài bằng nhau và 2 cạnh ngắn bằng nhau như trang vở."
    ],
    tipsAndMistakes: [
      "Bé dễ nhầm lẫn giữa hình vuông và hình chữ nhật khi xoay ngang hoặc xoay nghiêng.",
      "Mẹo: Dùng thước đo các cạnh, nếu 4 cạnh bằng nhau là hình vuông!"
    ],
    exercises: [
      {
        id: "ex-g1-02-1",
        question: "Biển báo giao thông hình nào có 3 cạnh và 3 đỉnh?",
        options: ["Hình vuông", "Hình tròn", "Hình tam giác", "Hình chữ nhật"],
        correctAnswer: "Hình tam giác",
        hint: "Hình có 3 cạnh giống mái nhà tam giác em nhé!",
        method: "Đặc điểm hình tam giác là có 3 cạnh và 3 đỉnh."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Chân Trời Sáng Tạo",
    downloadableTitle: "Phieu_Bo_Tro_Hinh_Hoc_Lop_1_NXBGD.pdf"
  },

  // --- LỚP 2 ---
  {
    id: "nxbgd-g2-01",
    title: "Phép cộng, phép trừ có nhớ trong phạm vi 100",
    grade: 2,
    bookSeries: "Kết nối tri thức",
    category: "Vở bài tập bổ trợ số",
    topic: "Số học & Đặt tính rồi tính",
    curriculumStandard: "GDPT 2018 - Mức 2: Thực hiện thành thạo phép tính cộng trừ có nhớ số có hai chữ số",
    description: "Tập hợp các dạng bài đặt tính rồi tính cột dọc, kỹ thuật nhớ 1 sang hàng chục và các bài toán thực tế giúp khắc sâu kiến thức.",
    summaryPoints: [
      "Quy tắc cộng có nhớ: Đặt tính thẳng cột hàng đơn vị và hàng chục. Cộng từ phải sang trái. Nếu hàng đơn vị lớn hơn hoặc bằng 10, viết hàng đơn vị và nhớ 1 sang hàng chục.",
      "Quy tắc trừ có nhớ: Nếu chữ số hàng đơn vị số bị trừ bé hơn số trừ, mượn 1 chục (10 đơn vị) ở hàng chục rồi trừ, sau đó trả 1 vào hàng chục của số trừ."
    ],
    tipsAndMistakes: [
      "Lỗi kinh điển: Quên cộng số nhớ 1 vào hàng chục khi tính phép cộng.",
      "Lỗi quên bớt hoặc quên trả 1 ở hàng chục trong phép trừ có nhớ."
    ],
    exercises: [
      {
        id: "ex-g2-01-1",
        question: "Kết quả của phép tính 47 + 28 là bao nhiêu?",
        options: ["65", "75", "74", "85"],
        correctAnswer: "75",
        hint: "Cộng hàng đơn vị trước: 7 + 8 = 15, viết 5 nhớ 1. Sau đó lấy 4 + 2 = 6, thêm 1 bằng 7.",
        method: "Đặt tính thẳng cột: 7 + 8 = 15 (viết 5 nhớ 1); 4 + 2 = 6, 6 + 1 = 7. Kết quả = 75."
      },
      {
        id: "ex-g2-01-2",
        question: "Một cửa hàng có 62 kg gạo, buổi sáng đã bán được 25 kg gạo. Hỏi cửa hàng còn lại bao nhiêu kg gạo?",
        options: ["37 kg", "47 kg", "35 kg", "38 kg"],
        correctAnswer: "37 kg",
        hint: "Bán đi nghĩa là bớt đi, em lấy 62 - 25 nhé!",
        method: "Phép tính: 62 - 25 = 37 (kg gạo)."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Bộ Sách Kết Nối Tri Thức",
    downloadableTitle: "Bo_Tro_Toan_2_Cong_Tru_Co_Nho_100.pdf"
  },
  {
    id: "nxbgd-g2-02",
    title: "Bảng nhân 2, nhân 5 và bài toán giải một bước tính",
    grade: 2,
    bookSeries: "Cánh diều",
    category: "Phiếu củng cố kiến thức",
    topic: "Khái niệm phép nhân",
    curriculumStandard: "GDPT 2018 - Hình thành bản chất phép nhân là tổng các số hạng bằng nhau",
    description: "Học liệu bổ trợ hình thành tư duy nhân nhẩm 2 và 5 qua bài toán đếm chân gà, bánh xe máy, ngón tay và các đồ vật đối xứng.",
    summaryPoints: [
      "Phép nhân a × b là tổng của b số hạng a: ví dụ 2 × 3 = 2 + 2 + 2 = 6.",
      "Bảng nhân 2: Các kết quả đều là số chẵn liên tiếp cách nhau 2 đơn vị (2, 4, 6, 8, 10, 12, 14, 16, 18, 20).",
      "Bảng nhân 5: Tận cùng luôn là chữ số 0 hoặc 5 (5, 10, 15, 20, 25, 30, 35, 40, 45, 50)."
    ],
    tipsAndMistakes: [
      "Học sinh hay nhầm lẫn thứ tự thừa số trong bài toán lời văn: 'Mỗi con gà có 2 chân, 6 con gà có số chân là...'. Phải viết 2 × 6 = 12 (chân), không viết 6 × 2."
    ],
    exercises: [
      {
        id: "ex-g2-02-1",
        question: "Mỗi bàn học có 2 học sinh ngồi. Hỏi 8 bàn học như thế có tất cả bao nhiêu học sinh?",
        options: ["10 học sinh", "14 học sinh", "16 học sinh", "18 học sinh"],
        correctAnswer: "16 học sinh",
        hint: "2 học sinh được lấy 8 lần, ta có phép tính 2 × 8.",
        method: "Số học sinh là: 2 × 8 = 16 (học sinh)."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Bộ Sách Cánh Diều",
    downloadableTitle: "Phieu_Bang_Nhan_2_Va_5_Lop_2.pdf"
  },

  // --- LỚP 3 ---
  {
    id: "nxbgd-g3-01",
    title: "Bảng nhân và Bảng chia từ 2 đến 9 (Bảng Cửu Chương Toàn Tập)",
    grade: 3,
    bookSeries: "Kết nối tri thức",
    category: "Vở bài tập bổ trợ số",
    topic: "Bảng cửu chương & Phép chia có dư",
    curriculumStandard: "GDPT 2018 - Thuộc lòng bảng cửu chương, vận dụng tính nhẩm nhanh và giải toán",
    description: "Hệ thống mẹo ghi nhớ bảng cửu chương siêu tốc (mẹo ngón tay bảng 9, mẹo số chẵn bảng 6, 8), bài tập điền khuyết và phép chia có dư thực tế.",
    summaryPoints: [
      "Quan hệ nghịch đảo: Nếu a × b = c thì c : a = b và c : b = a.",
      "Trong phép chia có dư: Số dư luôn luôn BÉ HƠN số chia (r < d). Số dư lớn nhất có thể có luôn bằng (số chia - 1).",
      "Số bị chia = Thương × Số chia + Số dư."
    ],
    tipsAndMistakes: [
      "Khi làm phép chia có dư, học sinh thường để số dư lớn hơn hoặc bằng số chia vì ước lượng thương quá nhỏ.",
      "Cần kiểm tra ngay: số dư đã bé hơn số chia chưa?"
    ],
    exercises: [
      {
        id: "ex-g3-01-1",
        question: "Trong một phép chia có số chia là 7, số dư lớn nhất có thể có của phép chia đó là bao nhiêu?",
        options: ["7", "6", "8", "5"],
        correctAnswer: "6",
        hint: "Số dư luôn phải nhỏ hơn số chia. Vậy số dư lớn nhất kém số chia 1 đơn vị.",
        method: "Vì số dư luôn bé hơn số chia (r < 7), nên số dư lớn nhất có thể có là 7 - 1 = 6."
      },
      {
        id: "ex-g3-01-2",
        question: "Một lớp học có 35 bạn, chia đều thành 5 tổ. Hỏi mỗi tổ có bao nhiêu bạn?",
        options: ["6 bạn", "7 bạn", "8 bạn", "5 bạn"],
        correctAnswer: "7 bạn",
        hint: "Chia đều 35 cho 5, em nhớ lại bảng chia 5 nhé: 35 : 5 = ?",
        method: "Mỗi tổ có số bạn là: 35 : 5 = 7 (bạn)."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Bộ Sách Kết Nối Tri Thức",
    downloadableTitle: "Cuu_Chuong_Va_Chia_Co_Du_Lop_3_NXBGD.pdf"
  },
  {
    id: "nxbgd-g3-02",
    title: "Bài toán giải bằng hai bước tính (Rút về đơn vị & Gấp giảm số lần)",
    grade: 3,
    bookSeries: "Chân trời sáng tạo",
    category: "Chuyên đề ôn luyện",
    topic: "Giải toán có lời văn 2 bước tính",
    curriculumStandard: "GDPT 2018 - Vận dụng kiến thức tổng hợp giải quyết vấn đề toán học thực tiễn",
    description: "Cẩm nang hướng dẫn phương pháp 'Rút về đơn vị': Bước 1 tìm giá trị 1 đơn vị bằng phép chia, Bước 2 tìm giá trị nhiều đơn vị bằng phép nhân.",
    summaryPoints: [
      "Dạng 1: Rút về đơn vị (Biết giá trị n phần, tìm giá trị m phần).",
      "Bước 1: Tìm giá trị của 1 phần (Rút về đơn vị) bằng phép chia (:).",
      "Bước 2: Tìm giá trị của số phần cần tìm bằng phép nhân (×).",
      "Dạng 2: Gấp lên một số lần (nhân với số lần), Giảm đi một số lần (chia cho số lần)."
    ],
    tipsAndMistakes: [
      "Học sinh hay nhầm lẫn giữa 'gấp 3 lần' (nhân 3) với 'nhiều hơn 3 đơn vị' (cộng 3).",
      "Nhầm lẫn giữa 'giảm 4 lần' (chia 4) với 'ít hơn 4 đơn vị' (trừ 4)."
    ],
    exercises: [
      {
        id: "ex-g3-02-1",
        question: "Có 24 lít dầu đựng đều vào 4 can. Hỏi 6 can như thế đựng được bao nhiêu lít dầu?",
        options: ["30 lít", "36 lít", "42 lít", "28 lít"],
        correctAnswer: "36 lít",
        hint: "Bước 1: Tìm 1 can đựng bao nhiêu lít dầu (24 : 4). Bước 2: Lấy số đó nhân với 6.",
        method: "Bước 1: 1 can đựng số lít dầu là: 24 : 4 = 6 (lít). Bước 2: 6 can đựng số lít dầu là: 6 × 6 = 36 (lít)."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Chân Trời Sáng Tạo",
    downloadableTitle: "Toan_Rut_Ve_Don_Vi_Lop_3_Bo_Tro.pdf"
  },

  // --- LỚP 4 ---
  {
    id: "nxbgd-g4-01",
    title: "Phân số: Khái niệm, Rút gọn, Quy đồng và Bốn phép tính phân số",
    grade: 4,
    bookSeries: "Kết nối tri thức",
    category: "Vở bài tập bổ trợ số",
    topic: "Phân số & Tính toán",
    curriculumStandard: "GDPT 2018 - Trọng tâm số học lớp 4: Nắm vững bản chất và các phép tính phân số",
    description: "Bộ học liệu chuyên sâu về phân số: Tử số chỉ số phần lấy đi, mẫu số chỉ tổng số phần bằng nhau được chia ra. Các phương pháp quy đồng mẫu số thông minh bằng MSC nhỏ nhất.",
    summaryPoints: [
      "Cộng/Trừ hai phân số cùng mẫu: Cộng hoặc trừ tử số với nhau, giữ nguyên mẫu số.",
      "Cộng/Trừ hai phân số khác mẫu: Quy đồng mẫu số hai phân số rồi cộng/trừ như cùng mẫu.",
      "Nhân hai phân số: Lấy tử số nhân với tử số, mẫu số nhân với mẫu số.",
      "Chia hai phân số: Lấy phân số thứ nhất nhân với phân số thứ hai đảo ngược."
    ],
    tipsAndMistakes: [
      "Lỗi rất phổ biến: Lấy tử cộng tử, mẫu cộng mẫu khi cộng phân số khác mẫu số (sai nghiêm trọng!).",
      "Quên rút gọn phân số về dạng tối giản sau khi thực hiện phép tính."
    ],
    exercises: [
      {
        id: "ex-g4-01-1",
        question: "Tính kết quả phép tính: 2/5 + 3/10 = ?",
        options: ["5/15", "7/10", "1/2", "4/10"],
        correctAnswer: "7/10",
        hint: "Quy đồng mẫu số chung là 10: 2/5 = 4/10. Sau đó cộng tử số: 4/10 + 3/10 = ?",
        method: "Quy đồng: 2/5 = (2 × 2) / (5 × 2) = 4/10. Vậy 4/10 + 3/10 = 7/10."
      },
      {
        id: "ex-g4-01-2",
        question: "Phân số nào dưới đây là phân số tối giản?",
        options: ["6/9", "8/12", "5/7", "10/15"],
        correctAnswer: "5/7",
        hint: "Phân số tối giản là phân số mà cả tử và mẫu không cùng chia hết cho số tự nhiên nào lớn hơn 1.",
        method: "5 và 7 là hai số nguyên tố cùng nhau, không cùng chia hết cho số nào khác ngoài 1 nên 5/7 là tối giản."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Bộ Sách Kết Nối Tri Thức",
    downloadableTitle: "Chuyen_De_Phan_So_Toan_4_NXBGD.pdf"
  },
  {
    id: "nxbgd-g4-02",
    title: "Tìm hai số khi biết Tổng và Hiệu - Tổng và Tỉ số của hai số đó",
    grade: 4,
    bookSeries: "Cánh diều",
    category: "Toán tư duy thực tế",
    topic: "Toán giải phương pháp sơ đồ đoạn thẳng",
    curriculumStandard: "GDPT 2018 - Vận dụng sơ đồ đoạn thẳng giải quyết các bài toán điển hình",
    description: "Cẩm nang phương pháp giải toán điển hình tiểu học bằng sơ đồ đoạn thẳng trực quan. Đưa các bài toán thực tế về dạng số lớn và số bé quen thuộc.",
    summaryPoints: [
      "Công thức Tổng - Hiệu: Số lớn = (Tổng + Hiệu) : 2 ; Số bé = (Tổng - Hiệu) : 2 (hoặc lấy Tổng - Số lớn).",
      "Công thức Tổng - Tỉ: Bước 1: Vẽ sơ đồ đoạn thẳng. Bước 2: Tìm tổng số phần bằng nhau. Bước 3: Tìm giá trị một phần = Tổng : Tổng số phần. Bước 4: Tìm số bé và số lớn."
    ],
    tipsAndMistakes: [
      "Xác định nhầm đâu là số lớn, đâu là số bé dẫn đến tính ra số âm hoặc kết quả sai thực tế.",
      "Luôn thử lại: lấy số lớn + số bé xem có bằng Tổng ban đầu không, lấy số lớn - số bé xem có bằng Hiệu không!"
    ],
    exercises: [
      {
        id: "ex-g4-02-1",
        question: "Hai anh em có tất cả 48 viên bi. Anh có nhiều hơn em 12 viên bi. Hỏi anh có bao nhiêu viên bi?",
        options: ["24 viên bi", "30 viên bi", "36 viên bi", "18 viên bi"],
        correctAnswer: "30 viên bi",
        hint: "Áp dụng công thức tìm số lớn (anh nhiều hơn em): Số viên bi của anh = (Tổng + Hiệu) : 2.",
        method: "Số viên bi của anh là: (48 + 12) : 2 = 60 : 2 = 30 (viên bi)."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Bộ Sách Cánh Diều",
    downloadableTitle: "Phuong_Phap_Tong_Hieu_Tong_Ti_Lop_4.pdf"
  },

  // --- LỚP 5 ---
  {
    id: "nxbgd-g5-01",
    title: "Số thập phân, bốn phép tính số thập phân và Tỉ số phần trăm",
    grade: 5,
    bookSeries: "Kết nối tri thức",
    category: "Vở bài tập bổ trợ số",
    topic: "Số thập phân & Tỉ số phần trăm",
    curriculumStandard: "GDPT 2018 - Nắm vững số thập phân, nhân chia dời dấu phẩy và ứng dụng tỉ số phần trăm",
    description: "Tài liệu học tập toàn diện về số thập phân: cấu tạo phần nguyên và phần thập phân, quy tắc dời dấu phẩy khi nhân chia với 10, 100, 1000 và tính lãi suất, giảm giá phần trăm đời sống.",
    summaryPoints: [
      "Nhân với 10, 100, 1000: Dời dấu phẩy sang bên PHẢI lần lượt 1, 2, 3 chữ số.",
      "Chia cho 10, 100, 1000 (hoặc nhân với 0,1; 0,01; 0,001): Dời dấu phẩy sang bên TRÁI lần lượt 1, 2, 3 chữ số.",
      "Tìm a% của số B: Lấy B : 100 × a (hoặc B × a : 100).",
      "Tìm tỉ số phần trăm của A và B: Lấy A : B rồi nhân nhẩm với 100 và viết thêm kí hiệu %."
    ],
    tipsAndMistakes: [
      "Lỗi đặt tính cộng trừ số thập phân: Không đặt dấu phẩy thẳng cột với dấu phẩy.",
      "Lỗi chia số tự nhiên cho số thập phân: Quên đếm chữ số phần thập phân của số chia để viết thêm số 0 vào số bị chia."
    ],
    exercises: [
      {
        id: "ex-g5-01-1",
        question: "Một cửa hàng niêm yết giá một chiếc cặp sách là 250 000 đồng. Nhân dịp năm học mới, cửa hàng giảm giá 20%. Hỏi người mua phải trả bao nhiêu tiền?",
        options: ["200 000 đồng", "220 000 đồng", "230 000 đồng", "50 000 đồng"],
        correctAnswer: "200 000 đồng",
        hint: "Số tiền được giảm là 20% của 250 000 đồng. Lấy giá ban đầu trừ đi số tiền được giảm.",
        method: "Số tiền được giảm: 250 000 × 20 : 100 = 50 000 đồng. Số tiền phải trả: 250 000 - 50 000 = 200 000 đồng."
      },
      {
        id: "ex-g5-01-2",
        question: "Kết quả của phép tính 14,25 × 0,1 là bao nhiêu?",
        options: ["142,5", "1,425", "0,1425", "14,250"],
        correctAnswer: "1,425",
        hint: "Nhân một số với 0,1 tương đương với chia số đó cho 10, ta dời dấu phẩy sang trái 1 chữ số.",
        method: "14,25 × 0,1 = 14,25 : 10 = 1,425."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Bộ Sách Kết Nối Tri Thức",
    downloadableTitle: "Chuyen_De_So_Thap_Phan_Va_Phan_Tram_Toan_5.pdf"
  },
  {
    id: "nxbgd-g5-02",
    title: "Toán Chuyển Động Đều: Quãng đường (s), Vận tốc (v), Thời gian (t)",
    grade: 5,
    bookSeries: "Chân trời sáng tạo",
    category: "Chuyên đề ôn luyện",
    topic: "Toán chuyển động đều",
    curriculumStandard: "GDPT 2018 - Vận dụng cao: Giải bài toán chuyển động cùng chiều, ngược chiều",
    description: "Bí quyết giải toán chuyển động đều lớp 5: Bộ 3 công thức vàng s = v × t, v = s : t, t = s : v và kỹ thuật đổi đơn vị thời gian (giờ sang phút, giây), toán hai xe đi ngược chiều gặp nhau.",
    summaryPoints: [
      "Bộ 3 công thức nền tảng: Quãng đường = Vận tốc × Thời gian (s = v × t); Vận tốc = s : t; Thời gian = s : v.",
      "Quy tắc đổi đơn vị: Đơn vị vận tốc (km/giờ) phải đi cùng quãng đường (km) và thời gian (giờ). Ví dụ: 1 giờ 30 phút = 1,5 giờ.",
      "Chuyển động ngược chiều gặp nhau: Thời gian gặp nhau = Quãng đường : Tổng hai vận tốc [t = s : (v1 + v2)].",
      "Chuyển động cùng chiều đuổi nhau: Thời gian đuổi kịp = Khoảng cách ban đầu : Hiệu hai vận tốc [t = s : (v1 - v2)]."
    ],
    tipsAndMistakes: [
      "Lỗi không đồng nhất đơn vị: Đề bài cho thời gian là phút nhưng vận tốc lại là km/giờ mà học sinh không đổi ra giờ trước khi tính toán.",
      "Lỗi viết 1 giờ 15 phút = 1,15 giờ (sai! 15 phút = 15/60 giờ = 0,25 giờ nên 1 giờ 15 phút = 1,25 giờ)."
    ],
    exercises: [
      {
        id: "ex-g5-02-1",
        question: "Một người đi xe máy với vận tốc 42 km/giờ trong 2 giờ 30 phút. Hỏi người đó đi được quãng đường dài bao nhiêu km?",
        options: ["84 km", "105 km", "95 km", "100 km"],
        correctAnswer: "105 km",
        hint: "Trước hết đổi 2 giờ 30 phút = 2,5 giờ. Sau đó lấy s = v × t = 42 × 2,5.",
        method: "Đổi 2 giờ 30 phút = 2,5 giờ. Quãng đường đi được: 42 × 2,5 = 105 (km)."
      },
      {
        id: "ex-g5-02-2",
        question: "Hai ô tô xuất phát cùng một lúc từ hai tỉnh A và B cách nhau 180 km đi ngược chiều nhau. Vận tốc xe thứ nhất là 50 km/h, xe thứ hai là 40 km/h. Hỏi sau bao lâu hai xe gặp nhau?",
        options: ["1,5 giờ", "2 giờ", "2,5 giờ", "3 giờ"],
        correctAnswer: "2 giờ",
        hint: "Hai xe đi ngược chiều thì mỗi giờ hai xe đi được quãng đường là tổng vận tốc: 50 + 40 = 90 km/h.",
        method: "Tổng vận tốc hai xe: 50 + 40 = 90 (km/giờ). Thời gian để hai xe gặp nhau: 180 : 90 = 2 (giờ)."
      }
    ],
    externalUrl: "https://hoclieubotro.nxbgd.vn/",
    officialSource: "Nhà xuất bản Giáo dục Việt Nam - Chân Trời Sáng Tạo",
    downloadableTitle: "Chuyen_De_Toan_Chuyen_Dong_Deu_Lop_5_NXBGD.pdf"
  }
];

export const NXBGD_PLATFORMS = [
  {
    name: "Học Liệu Bổ Trợ (Chính Thức)",
    domain: "hoclieubotro.nxbgd.vn",
    url: "https://hoclieubotro.nxbgd.vn/",
    tag: "Trọng tâm",
    color: "from-blue-600 to-indigo-600",
    description: "Nền tảng sách bài tập điện tử, vở bài tập tương tác bổ trợ bám sát từng tiết học GDPT 2018."
  },
  {
    name: "Hành Trang Số NXBGD",
    domain: "hanhtrangso.nxbgd.vn",
    url: "https://hanhtrangso.nxbgd.vn/",
    tag: "SGK Điện tử",
    color: "from-emerald-600 to-teal-600",
    description: "Toàn bộ Sách giáo khoa, Sách bài tập và Sách giáo viên điện tử có âm thanh, hình ảnh tương tác."
  },
  {
    name: "Tập Huấn NXBGD",
    domain: "taphuan.nxbgd.vn",
    url: "https://taphuan.nxbgd.vn/",
    tag: "Dành cho Giáo viên",
    color: "from-purple-600 to-pink-600",
    description: "Kho giáo án điện tử, bài giảng mẫu, video tiết dạy minh họa chuẩn GDPT 2018 của NXBGD."
  }
];
