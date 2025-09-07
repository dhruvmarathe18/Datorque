"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { Button } from "./button";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleWhatsApp = () => {
    const phoneNumber = "919876543210"; // Replace with actual WhatsApp number
    const text = message || "Hi! I'm interested in your web development services.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const quickMessages = [
    "I need a business website",
    "What's your pricing?",
    "Can you help with SEO?",
    "I want to see your portfolio"
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-surface-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Datorque Support</h3>
                  <p className="text-xs text-gray-400">Usually replies in minutes</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="text-sm text-gray-300">
                Hi! 👋 How can we help you today?
              </div>

              {/* Quick Messages */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Quick options:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(msg)}
                      className="text-left p-2 text-xs bg-surface-800/50 hover:bg-primary/10 rounded-lg border border-white/5 hover:border-primary/20 transition-all duration-200"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-3 bg-surface-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  rows={3}
                />
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send on WhatsApp
                  </Button>
                  
                  <Button
                    onClick={() => window.open("tel:+919876543210", "_self")}
                    variant="outline"
                    size="sm"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Powered by WhatsApp • Free consultation
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
