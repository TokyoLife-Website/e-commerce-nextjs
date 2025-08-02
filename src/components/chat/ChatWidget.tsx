"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaFacebookMessenger, FaTimes } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { IoChatbubbleEllipses, IoSend } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import styles from "./ChatWidget.module.css";
import { chatService, Message, ChatSession } from "./chatService";

export interface ChatWidgetProps {
  zaloUrl?: string;
  messengerUrl?: string;
  adminChatUrl?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  zaloUrl = "https://zalo.me/your-zalo-id",
  messengerUrl = "https://m.me/your-page-id",
  adminChatUrl = "/admin-chat",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChatClick = (type: string, url: string) => {
    if (type === "admin") {
      // Mở chat inline
      setIsChatOpen(true);
      setIsExpanded(false);

      // Tạo session mới
      const newSession = chatService.createSession();
      setSession(newSession);
      setMessages(newSession.messages);

      // Focus vào input sau khi render
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      // Mở Zalo hoặc Messenger trong tab mới
      window.open(url, "_blank");
      setIsExpanded(false);
    }
  };

  const chatOptions = [
    {
      id: "admin",
      label: "Chat với Admin",
      icon: IoChatbubbleEllipses,
      bgColor: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      url: adminChatUrl,
    },
    {
      id: "zalo",
      label: "Zalo",
      icon: SiZalo,
      bgColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      url: zaloUrl,
    },
    {
      id: "messenger",
      label: "Messenger",
      icon: FaFacebookMessenger,
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      url: messengerUrl,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !session) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Xử lý tin nhắn thông qua service
      const response = await chatService.processUserMessage(
        session.id,
        userMessage.text
      );
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error processing message:", error);
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: "admin",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`fixed z-50 ${
        isMobile ? "bottom-2 right-2" : "bottom-10 right-4"
      } ${styles.chatWidget}`}
    >
      {!isChatOpen ? (
        <div className="relative">
          {/* Expanded chat options */}
          <div
            className={`absolute transition-all duration-300 ease-in-out ${
              isMobile
                ? "bottom-16 right-0 mb-1 space-y-2"
                : "bottom-16 right-0 mb-2 space-y-3"
            } ${
              isExpanded
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {chatOptions.map((option, index) => (
              <div
                key={option.id}
                className={`flex items-center justify-end ${styles.chatOption}`}
                style={{
                  animationDelay: isExpanded ? `${index * 100}ms` : "0ms",
                }}
              >
                <span
                  className={`mr-2 text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap ${
                    isMobile ? "text-xs" : ""
                  } ${styles.chatLabel}`}
                >
                  {option.label}
                </span>
                <button
                  onClick={() => handleChatClick(option.id, option.url)}
                  className={`${isMobile ? "w-10 h-10" : "w-12 h-12"} ${
                    option.bgColor
                  } ${
                    option.hoverColor
                  } rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95`}
                  title={option.label}
                >
                  <option.icon size={isMobile ? 16 : 20} />
                </button>
              </div>
            ))}
          </div>

          {/* Toggle button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${
              isMobile ? "w-10 h-10" : "w-12 h-12"
            } rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isExpanded
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } ${!isExpanded ? styles.pulse : ""}`}
            title={isExpanded ? "Đóng chat" : "Mở chat"}
          >
            {isExpanded ? (
              <FaTimes size={isMobile ? 20 : 24} />
            ) : (
              <IoChatbubbleEllipses size={isMobile ? 20 : 24} />
            )}
          </button>
        </div>
      ) : (
        /* Chat Interface */
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-blue-500 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <IoPerson size={12} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Chat với Admin</h3>
                <p className="text-xs opacity-90">Phản hồi trong vài phút</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsChatOpen(false);
                if (session) {
                  chatService.closeSession(session.id);
                }
              }}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-2 py-1 text-sm ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-xs">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-2 py-1">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <IoSend size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
