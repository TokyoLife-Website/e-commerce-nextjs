"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaFacebookMessenger, FaTimes } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { useSelector } from "react-redux";
import styles from "./ChatWidget.module.css";
import AdminChatInterface from "./AdminChatInterface";
import AIChatInterface from "./AIChatInterface";

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
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Get authentication status from Redux store
  const isAuthenticated = !!useSelector((state: any) => state.user.id);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChatClick = useCallback(
    (type: string, url: string) => {
      if (type === "admin") {
        if (!isAuthenticated) {
          alert("Vui lòng đăng nhập để chat với admin");
          return;
        }

        // Mở chat inline
        setIsChatOpen(true);
        setIsExpanded(false);
      } else if (type === "ai") {
        // Mở chat AI inline
        setIsAIChatOpen(true);
        setIsExpanded(false);
      } else {
        // Mở Zalo hoặc Messenger trong tab mới
        window.open(url, "_blank");
        setIsExpanded(false);
      }
    },
    [isAuthenticated]
  );

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
      id: "ai",
      label: "Trợ lý ảo AI",
      icon: FaRobot,
      bgColor: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      url: "#",
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

  return (
    <div
      className={`fixed z-50 ${
        isMobile ? "bottom-2 right-2" : "bottom-10 right-4"
      } ${styles.chatWidget}`}
    >
      {!isChatOpen && !isAIChatOpen ? (
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
      ) : isChatOpen ? (
        /* Admin Chat Interface */
        <AdminChatInterface
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      ) : (
        /* AI Chat Interface */
        <AIChatInterface
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatWidget;
