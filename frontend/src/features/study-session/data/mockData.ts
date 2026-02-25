import type {
  LearningGoal,
  Summary,
  Flashcard,
  QuizQuestion,
  Feedback,
} from "../types";

// ─── Learning Goals ─────────────────────────────────────────────

export const LEARNING_GOALS: LearningGoal[] = [
  {
    id: "exam-prep",
    icon: "🚀",
    title: "Ôn thi",
    description: "Tóm tắt ngắn gọn, flashcard trọng tâm, quiz mô phỏng đề thi.",
    strategyHint: "Summary ngắn gọn • Flashcard Core only • Quiz Recall + Apply",
  },
  {
    id: "deep-understanding",
    icon: "🧠",
    title: "Hiểu sâu",
    description: "Phân tích chi tiết, giải thích nguyên lý, liên hệ thực tiễn.",
    strategyHint: "Summary chi tiết • Flashcard Core + Support • Quiz Understand",
  },
  {
    id: "quick-review",
    icon: "⚡",
    title: "Lướt nhanh",
    description: "Chỉ ý chính, keyword quan trọng, đọc trong 5 phút.",
    strategyHint: "Summary cực ngắn • Flashcard ít • Quiz nhanh 5 câu",
  },
  {
    id: "eli5",
    icon: "👶",
    title: "ELI5",
    description: "Giải thích như cho trẻ 5 tuổi, ngôn ngữ đơn giản nhất.",
    strategyHint: "Summary dễ hiểu • Flashcard hình ảnh • Quiz cơ bản",
  },
  {
    id: "memorize",
    icon: "📝",
    title: "Ghi nhớ",
    description: "Nhiều flashcard, lặp lại nhiều lần, spaced repetition.",
    strategyHint: "Summary dạng gạch đầu dòng • Flashcard nhiều • Quiz Recall",
  },
];

// ─── Mock Summary ───────────────────────────────────────────────

export const mockSummary: Summary = {
  goalId: "exam-prep",
  wordCount: 320,
  content: `## Chủ nghĩa duy vật biện chứng

### 1. Vật chất
- **Định nghĩa:** Vật chất là phạm trù triết học dùng để chỉ thực tại khách quan, được đem lại cho con người trong cảm giác, tồn tại không lệ thuộc vào cảm giác.
- **Đặc tính:** Tồn tại khách quan, vận động, không gian, thời gian.

### 2. Ý thức
- **Nguồn gốc tự nhiên:** Bộ não người + thế giới khách quan tác động.
- **Nguồn gốc xã hội:** Lao động + ngôn ngữ.
- **Bản chất:** Là sự phản ánh năng động, sáng tạo thế giới khách quan vào bộ não người.

### 3. Mối quan hệ Vật chất – Ý thức
| | Vật chất | Ý thức |
|---|---|---|
| Vai trò | Quyết định | Tác động ngược |
| Tính chất | Khách quan | Chủ quan |

> **Lưu ý ôn thi:** Câu hỏi thường tập trung vào mối quan hệ biện chứng giữa vật chất và ý thức. Cần nắm rõ ví dụ minh họa.

### 4. Ý nghĩa phương pháp luận
- Xuất phát từ thực tế khách quan, tôn trọng quy luật.
- Phát huy tính năng động chủ quan của ý thức.
- Chống chủ quan duy ý chí, bảo thủ trì trệ.`,
};

// ─── Mock Flashcards ────────────────────────────────────────────

export const mockFlashcards: Flashcard[] = [
  {
    id: "fc-1",
    front: "Vật chất là gì theo quan điểm của Lênin?",
    back: "Vật chất là phạm trù triết học dùng để chỉ thực tại khách quan, được đem lại cho con người trong cảm giác, tồn tại không lệ thuộc vào cảm giác.",
    importance: "core",
  },
  {
    id: "fc-2",
    front: "Nguồn gốc tự nhiên của ý thức là gì?",
    back: "Bộ não người (cơ quan vật chất của ý thức) + thế giới khách quan tác động vào bộ não thông qua các giác quan.",
    importance: "core",
  },
  {
    id: "fc-3",
    front: "Nguồn gốc xã hội của ý thức gồm những yếu tố nào?",
    back: "Lao động và ngôn ngữ. Lao động giúp con người cải tạo tự nhiên, ngôn ngữ là công cụ tư duy và giao tiếp.",
    importance: "core",
  },
  {
    id: "fc-4",
    front: "Bản chất của ý thức là gì?",
    back: "Ý thức là sự phản ánh năng động, sáng tạo thế giới khách quan vào bộ não người trên cơ sở thực tiễn xã hội.",
    importance: "support",
  },
  {
    id: "fc-5",
    front: "Vật chất có vai trò gì trong mối quan hệ với ý thức?",
    back: "Vật chất quyết định ý thức: quyết định nội dung, quyết định sự biến đổi, phát triển của ý thức.",
    importance: "core",
  },
  {
    id: "fc-6",
    front: "Ý thức tác động ngược lại vật chất như thế nào?",
    back: "Ý thức có tính năng động, sáng tạo: có thể thúc đẩy hoặc kìm hãm sự phát triển của vật chất thông qua hoạt động thực tiễn.",
    importance: "core",
  },
  {
    id: "fc-7",
    front: "Chủ quan duy ý chí là gì?",
    back: "Là khuynh hướng tuyệt đối hóa vai trò của ý thức, ý chí, áp đặt ý muốn chủ quan lên thực tế khách quan.",
    importance: "support",
  },
  {
    id: "fc-8",
    front: "Phương thức tồn tại của vật chất là gì?",
    back: "Vận động. Vật chất tồn tại bằng cách vận động và thông qua vận động.",
    importance: "support",
  },
  {
    id: "fc-9",
    front: "5 hình thức vận động cơ bản theo Engels?",
    back: "1. Vận động cơ học\n2. Vận động vật lý\n3. Vận động hóa học\n4. Vận động sinh học\n5. Vận động xã hội",
    importance: "advanced",
  },
  {
    id: "fc-10",
    front: "Không gian và thời gian có vai trò gì?",
    back: "Là hình thức tồn tại của vật chất. Không gian: chiều rộng, chiều dài, chiều cao. Thời gian: tính một chiều, không quay lại được.",
    importance: "advanced",
  },
  {
    id: "fc-11",
    front: "Phân biệt phản ánh và ý thức?",
    back: "Phản ánh là thuộc tính chung của mọi dạng vật chất. Ý thức là hình thức phản ánh cao nhất, chỉ có ở con người, mang tính năng động sáng tạo.",
    importance: "advanced",
  },
  {
    id: "fc-12",
    front: "Ý nghĩa phương pháp luận của mối quan hệ vật chất–ý thức?",
    back: "1. Xuất phát từ thực tế khách quan\n2. Phát huy tính năng động chủ quan\n3. Chống chủ quan duy ý chí và bảo thủ trì trệ",
    importance: "core",
  },
];

// ─── Mock Quiz Questions ────────────────────────────────────────

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "q-1",
    question: "Theo Lênin, vật chất là gì?",
    options: [
      { key: "A", text: "Là nguyên tử, phân tử cấu tạo nên mọi vật" },
      { key: "B", text: "Là phạm trù triết học chỉ thực tại khách quan, tồn tại không lệ thuộc vào cảm giác" },
      { key: "C", text: "Là tất cả những gì con người nhìn thấy được" },
      { key: "D", text: "Là dạng vật chất cụ thể như đất, nước, không khí" },
    ],
    correctKey: "B",
    cognitiveLevel: "recall",
    explanation: "Định nghĩa vật chất của Lênin nhấn mạnh tính khách quan, không phụ thuộc vào ý thức chủ quan của con người.",
  },
  {
    id: "q-2",
    question: "Nguồn gốc xã hội của ý thức bao gồm?",
    options: [
      { key: "A", text: "Bộ não người và thế giới khách quan" },
      { key: "B", text: "Lao động và ngôn ngữ" },
      { key: "C", text: "Di truyền và giáo dục" },
      { key: "D", text: "Văn hóa và tôn giáo" },
    ],
    correctKey: "B",
    cognitiveLevel: "recall",
    explanation: "Lao động giúp con người cải tạo tự nhiên, ngôn ngữ là phương tiện tư duy — cả hai là nguồn gốc xã hội của ý thức.",
  },
  {
    id: "q-3",
    question: "Trong mối quan hệ giữa vật chất và ý thức, mệnh đề nào đúng?",
    options: [
      { key: "A", text: "Ý thức quyết định vật chất" },
      { key: "B", text: "Vật chất và ý thức tồn tại độc lập" },
      { key: "C", text: "Vật chất quyết định ý thức, ý thức tác động ngược lại vật chất" },
      { key: "D", text: "Vật chất và ý thức quyết định lẫn nhau ngang bằng" },
    ],
    correctKey: "C",
    cognitiveLevel: "understand",
    explanation: "Đây là nguyên lý cốt lõi: vật chất có trước, quyết định ý thức; nhưng ý thức có tính năng động, tác động ngược.",
  },
  {
    id: "q-4",
    question: "Phương thức tồn tại của vật chất là gì?",
    options: [
      { key: "A", text: "Không gian" },
      { key: "B", text: "Thời gian" },
      { key: "C", text: "Vận động" },
      { key: "D", text: "Phản ánh" },
    ],
    correctKey: "C",
    cognitiveLevel: "recall",
    explanation: "Vận động là phương thức tồn tại của vật chất. Không gian và thời gian là hình thức tồn tại.",
  },
  {
    id: "q-5",
    question: "Một công ty ra quyết định mở rộng thị trường mà không khảo sát nhu cầu thực tế, dẫn đến thất bại. Đây là biểu hiện của?",
    options: [
      { key: "A", text: "Bảo thủ trì trệ" },
      { key: "B", text: "Chủ quan duy ý chí" },
      { key: "C", text: "Duy vật siêu hình" },
      { key: "D", text: "Duy tâm khách quan" },
    ],
    correctKey: "B",
    cognitiveLevel: "apply",
    explanation: "Công ty áp đặt ý muốn chủ quan mà không dựa vào thực tế khách quan — đây chính là chủ quan duy ý chí.",
  },
  {
    id: "q-6",
    question: "Tại sao nói ý thức là sự phản ánh 'năng động, sáng tạo'?",
    options: [
      { key: "A", text: "Vì ý thức phản ánh nguyên xi thực tại" },
      { key: "B", text: "Vì ý thức có thể tưởng tượng, dự báo, sáng tạo cái mới" },
      { key: "C", text: "Vì ý thức chỉ phản ánh bề ngoài sự vật" },
      { key: "D", text: "Vì ý thức không phụ thuộc vào vật chất" },
    ],
    correctKey: "B",
    cognitiveLevel: "understand",
    explanation: "Ý thức không phản ánh thụ động mà có khả năng tư duy trừu tượng, khái quát, tưởng tượng và sáng tạo.",
  },
  {
    id: "q-7",
    question: "Engels chia vận động thành mấy hình thức cơ bản?",
    options: [
      { key: "A", text: "3 hình thức" },
      { key: "B", text: "4 hình thức" },
      { key: "C", text: "5 hình thức" },
      { key: "D", text: "6 hình thức" },
    ],
    correctKey: "C",
    cognitiveLevel: "recall",
    explanation: "5 hình thức: cơ học, vật lý, hóa học, sinh học, xã hội.",
  },
  {
    id: "q-8",
    question: "Trong tình huống: 'Một nông dân áp dụng kỹ thuật canh tác mới dựa trên nghiên cứu khoa học, giúp tăng năng suất'. Ví dụ này thể hiện điều gì?",
    options: [
      { key: "A", text: "Vật chất quyết định ý thức" },
      { key: "B", text: "Ý thức tác động tích cực trở lại vật chất" },
      { key: "C", text: "Chủ quan duy ý chí" },
      { key: "D", text: "Bảo thủ trì trệ" },
    ],
    correctKey: "B",
    cognitiveLevel: "apply",
    explanation: "Nông dân dùng tri thức khoa học (ý thức đúng đắn) để cải tạo thực tiễn — ý thức tác động tích cực ngược lại vật chất.",
  },
  {
    id: "q-9",
    question: "Hình thức phản ánh cao nhất của vật chất là?",
    options: [
      { key: "A", text: "Phản ánh cơ học" },
      { key: "B", text: "Phản ánh sinh học" },
      { key: "C", text: "Ý thức" },
      { key: "D", text: "Phản ánh tâm lý động vật" },
    ],
    correctKey: "C",
    cognitiveLevel: "understand",
    explanation: "Ý thức là hình thức phản ánh cao nhất, chỉ có ở con người với đầy đủ tính năng động, sáng tạo.",
  },
  {
    id: "q-10",
    question: "Thời gian có đặc tính nào sau đây?",
    options: [
      { key: "A", text: "Ba chiều: dài, rộng, cao" },
      { key: "B", text: "Một chiều, không thể đảo ngược" },
      { key: "C", text: "Hai chiều: quá khứ và tương lai" },
      { key: "D", text: "Không có chiều, tồn tại vĩnh viễn" },
    ],
    correctKey: "B",
    cognitiveLevel: "recall",
    explanation: "Thời gian có tính một chiều — chỉ trôi từ quá khứ qua hiện tại đến tương lai, không quay lại.",
  },
];

// ─── Mock Feedback ──────────────────────────────────────────────

export const mockFeedback: Feedback = {
  overallScore: 70,
  aiFeedback:
    "Bạn nắm khá tốt phần kiến thức cơ bản về vật chất và ý thức. Tuy nhiên, phần vận dụng (Apply) còn yếu — cần luyện thêm việc áp dụng lý thuyết vào tình huống thực tế. Gợi ý: đọc lại phần 'Ý nghĩa phương pháp luận' và làm thêm bài tập tình huống.",
  topicBreakdown: [
    { topic: "Định nghĩa vật chất", score: 90, status: "strong" },
    { topic: "Nguồn gốc ý thức", score: 80, status: "strong" },
    { topic: "Mối quan hệ vật chất – ý thức", score: 70, status: "moderate" },
    { topic: "Vận động & hình thức tồn tại", score: 60, status: "moderate" },
    { topic: "Vận dụng phương pháp luận", score: 45, status: "weak" },
  ],
  suggestions: [
    "Ôn lại phần 'Ý nghĩa phương pháp luận' trong giáo trình trang 45-52.",
    "Làm thêm 5 bài tập tình huống về chủ quan duy ý chí.",
    "Xem video giải thích 5 hình thức vận động của Engels.",
    "Luyện flashcard nhóm 'Advanced' thêm 2-3 lần.",
  ],
  hasRemedialQuiz: true,
};
