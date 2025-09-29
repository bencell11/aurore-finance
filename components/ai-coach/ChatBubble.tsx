'use client';

import { useState } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from './ChatInterface';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <div 
          className={`fixed bottom-20 right-4 z-50 transition-all duration-300 ease-in-out ${
            isMinimized ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
          }`}
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Coach IA Aurore</h3>
                  <p className="text-xs opacity-90">Conseiller financier</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-white hover:bg-white/20"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-white hover:bg-white/20"
                  onClick={closeChat}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full">
                <ChatInterface compact={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen || isMinimized ? (
          <Button
            onClick={toggleChat}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="icon"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        ) : null}
        
        {/* Notification Badge (if needed) */}
        {!isOpen && (
          <div className="absolute -top-2 -right-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">AI</span>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile */}
      {isOpen && !isMinimized && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMinimized(true)}
        />
      )}
    </>
  );
}