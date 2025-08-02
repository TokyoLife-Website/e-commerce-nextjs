# Chat System Components

Hệ thống chat với 3 tùy chọn: Admin Chat, Zalo và Messenger.

## Components

### 1. ChatWidget

Component chính hiển thị 3 bong bóng chat ở góc phải dưới màn hình.

**Tính năng:**

- 3 bong bóng chat: Admin (đỏ), Zalo (xanh), Messenger (xanh đậm)
- Responsive design
- Animation mượt mà
- Click vào Admin → Mở ChatModal
- Click vào Zalo/Messenger → Mở link trong tab mới

### 2. ChatModal

Modal chat để chat với admin hoặc AI.

**Tính năng:**

- Giao diện chat đẹp mắt
- Real-time messaging
- Typing indicators
- Auto-scroll to bottom
- Session management
- Chuẩn bị cho AI integration

### 3. ChatService

Service xử lý logic chat và quản lý session.

**Tính năng:**

- Session management
- Message handling
- Local storage persistence
- AI integration ready (DeepSeek, etc.)

## Cách sử dụng

### Import và sử dụng cơ bản

```tsx
import { ChatWidget } from "@/components/chat";

// Trong layout hoặc component
<ChatWidget
  zaloUrl="https://zalo.me/your-zalo-id"
  messengerUrl="https://m.me/your-page-id"
  adminChatUrl="/admin-chat"
/>;
```

### Sử dụng ChatModal riêng lẻ

```tsx
import { ChatModal } from "@/components/chat";

const [isModalOpen, setIsModalOpen] = useState(false);

<ChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />;
```

### Sử dụng ChatService

```tsx
import { chatService } from "@/components/chat";

// Tạo session mới
const session = chatService.createSession(userId);

// Gửi tin nhắn
const response = await chatService.processUserMessage(sessionId, "Hello!");

// Lấy session
const session = chatService.getSession(sessionId);
```

## AI Integration (Tương lai)

### DeepSeek Integration

```tsx
// Trong chatService.ts, uncomment và cấu hình:
const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: "Bạn là một trợ lý AI thân thiện...",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  }),
});
```

### Các AI khác

Có thể dễ dàng tích hợp với:

- OpenAI GPT
- Claude
- Gemini
- Local AI models

## Props

### ChatWidget Props

| Prop           | Type     | Default                          | Description        |
| -------------- | -------- | -------------------------------- | ------------------ |
| `zaloUrl`      | `string` | `'https://zalo.me/your-zalo-id'` | URL Zalo chat      |
| `messengerUrl` | `string` | `'https://m.me/your-page-id'`    | URL Messenger chat |
| `adminChatUrl` | `string` | `'/admin-chat'`                  | URL chat với admin |

### ChatModal Props

| Prop      | Type         | Description              |
| --------- | ------------ | ------------------------ |
| `isOpen`  | `boolean`    | Trạng thái mở/đóng modal |
| `onClose` | `() => void` | Callback khi đóng modal  |

## Styling

- Sử dụng Tailwind CSS
- CSS Modules cho animations
- Responsive design
- Dark mode support
- Mobile-friendly

## Features

### ✅ Đã hoàn thành

- [x] ChatWidget với 3 bong bóng
- [x] ChatModal với giao diện đẹp
- [x] ChatService với session management
- [x] Responsive design
- [x] Animations và transitions
- [x] Local storage persistence
- [x] Typing indicators
- [x] Auto-scroll

### 🚧 Đang phát triển

- [ ] AI integration (DeepSeek)
- [ ] Real-time messaging (WebSocket)
- [ ] File/image upload
- [ ] Chat history
- [ ] User authentication
- [ ] Admin dashboard

### 📋 Roadmap

- [ ] Multi-language support
- [ ] Voice messages
- [ ] Video calls
- [ ] Chat analytics
- [ ] Automated responses
- [ ] Integration với CRM

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅
