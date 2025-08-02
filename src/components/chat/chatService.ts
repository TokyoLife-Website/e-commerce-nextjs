export interface Message {
  id: string;
  text: string;
  sender: "user" | "admin" | "ai";
  timestamp: Date;
  metadata?: {
    type?: "text" | "image" | "file";
    aiModel?: string;
    confidence?: number;
  };
}

export interface ChatSession {
  id: string;
  userId?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "closed";
}

export class ChatService {
  private static instance: ChatService;
  private sessions: Map<string, ChatSession> = new Map();

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Tạo session chat mới
  createSession(userId?: string): ChatSession {
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const session: ChatSession = {
      id: sessionId,
      userId,
      messages: [
        {
          id: "welcome",
          text: "Xin chào! Tôi có thể giúp gì cho bạn?",
          sender: "admin",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  // Lấy session theo ID
  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Thêm tin nhắn vào session
  async addMessage(
    sessionId: string,
    text: string,
    sender: "user" | "admin" | "ai" = "user"
  ): Promise<Message> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date(),
    };

    session.messages.push(message);
    session.updatedAt = new Date();

    return message;
  }

  // Xử lý tin nhắn từ user và trả về phản hồi
  async processUserMessage(sessionId: string, text: string): Promise<Message> {
    // Thêm tin nhắn của user
    await this.addMessage(sessionId, text, "user");

    // TODO: Trong tương lai, đây sẽ là nơi tích hợp với AI
    // const aiResponse = await this.getAIResponse(text);
    // return await this.addMessage(sessionId, aiResponse, "ai");

    // Hiện tại, trả về phản hồi mặc định
    const responses = [
      "Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.",
      "Tôi đã nhận được tin nhắn của bạn. Đội ngũ hỗ trợ sẽ liên hệ lại trong thời gian sớm nhất.",
      "Cảm ơn bạn! Chúng tôi sẽ xử lý yêu cầu của bạn ngay.",
      "Tôi hiểu vấn đề của bạn. Hãy để tôi kiểm tra và phản hồi sớm nhất có thể.",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return await this.addMessage(sessionId, randomResponse, "admin");
  }

  // TODO: Tích hợp với AI (DeepSeek hoặc AI khác)
  private async getAIResponse(userMessage: string): Promise<string> {
    // Đây sẽ là nơi tích hợp với AI API
    // Ví dụ với DeepSeek API:
    /*
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Bạn là một trợ lý AI thân thiện, giúp khách hàng với các vấn đề về sản phẩm và dịch vụ.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
    */

    return "Đây là phản hồi từ AI (sẽ được tích hợp trong tương lai)";
  }

  // Lưu session vào localStorage (tạm thời)
  saveSessionToStorage(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      localStorage.setItem(
        `chat_session_${sessionId}`,
        JSON.stringify(session)
      );
    }
  }

  // Load session từ localStorage
  loadSessionFromStorage(sessionId: string): ChatSession | null {
    const stored = localStorage.getItem(`chat_session_${sessionId}`);
    if (stored) {
      const session = JSON.parse(stored);
      // Convert string dates back to Date objects
      session.createdAt = new Date(session.createdAt);
      session.updatedAt = new Date(session.updatedAt);
      session.messages = session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));

      this.sessions.set(sessionId, session);
      return session;
    }
    return null;
  }

  // Đóng session
  closeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = "closed";
      session.updatedAt = new Date();
      this.saveSessionToStorage(sessionId);
    }
  }
}

export const chatService = ChatService.getInstance();
