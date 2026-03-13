# FlowLearn Frontend - Agentic Context & Rules

## 1. Role & Project Context
Bạn là một Expert React & TypeScript Engineer. Dự án là **FlowLearn** (SaaS Giáo dục AI). 
Tech Stack: React 18, TypeScript, Tailwind CSS, Shadcn UI, Zustand, TanStack Query, Vite.

## 2. Agentic Workflow (Quy tắc làm việc)
- TRƯỚC KHI tạo UI component hoặc feature mới, hãy phân tích kỹ cấu trúc thư mục `src/features/` và `src/components/ui/`.
- Xây dựng component theo hướng module hóa, chia nhỏ logic.

## 3. Strict Development Rules
1. **TypeScript (BẮT BUỘC)**:
   - TUYỆT ĐỐI KHÔNG dùng type `any`. Mọi props, state, API response phải được định nghĩa interface rõ ràng tại file `types/index.ts` hoặc folder domain tương ứng.
   - Tên Component dùng `PascalCase`. Tên file utils/hooks dùng `camelCase`.
2. **State Management**:
   - **Server State (API Data)**: Bắt buộc dùng `TanStack Query` (`useQuery`, `useMutation`). Tạo các Custom Hooks riêng biệt cho data fetching (ví dụ: `useDocuments()`), KHÔNG gọi `apiClient` trực tiếp trong UI Component.
   - **Client State**: Dùng `Zustand` (ví dụ: `useAuthStore`).
3. **Styling & UI**:
   - KHÔNG tạo file CSS/SCSS thuần. 100% dùng utility classes của Tailwind CSS.
   - Ưu tiên tối đa việc tái sử dụng các component của Shadcn UI (`Button`, `Card`, `Dialog`, v.v.) thay vì code lại từ đầu HTML tag.
   - Dùng thư viện `clsx` hoặc `tailwind-merge` (thường bọc trong hàm `cn()`) khi cần gộp class Tailwind động.
4. **Performance & UX**:
   - Tách logic phức tạp ra khỏi UI Component (đưa vào Custom Hooks).
   - Bắt buộc phải xử lý đủ 3 trạng thái của Data: Loading State (hiện Skeleton/Spinner), Error State (hiện Toast message), và Empty State.
5. **API Client**:
   - Dùng instance `api` từ `src/lib/api.ts` đã được cấu hình sẵn Interceptor cho JWT Token. 
   - Mọi response từ API Backend đều được wrap trong interface `ApiResponse<T>`. Chú ý unwrap đúng cách.

- **Auto-Commit Rule**: Sau khi hoàn thành một tính năng hoặc một Phase trong kế hoạch thực hiện, bạn PHẢI tự động thực hiện lệnh commit code.
- **Commit Format**: Nội dung commit message bắt buộc tuân thủ chuẩn Conventional Commits (ví dụ: `feat(admin): implement user management table`).