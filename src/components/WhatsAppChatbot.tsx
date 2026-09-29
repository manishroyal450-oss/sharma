import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  ShoppingCart, 
  Check, 
  CheckCheck, 
  ArrowUpRight, 
  ExternalLink,
  Phone,
  Video,
  MoreVertical,
  Plus
} from 'lucide-react';
import { CategoryKey, Product } from '../types/confectionery';
import { PRODUCTS } from '../data/confectioneryData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  recommendedCategory?: CategoryKey;
  recommendedProducts?: Product[];
}

interface WhatsAppChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectCategory: (key: CategoryKey) => void;
  onAddToCart: (product: Product, selectedWeight: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
  initialQuery?: string;
}

export const WhatsAppChatbot: React.FC<WhatsAppChatbotProps> = ({
  isOpen,
  onToggle,
  onSelectCategory,
  onAddToCart,
  onQuickView,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Namaste! 🙏 Welcome to Sharma Confectioners WhatsApp Assistant. I can help you find Belgian dark chocolates, pure ghee royal mithai, or sugar-free treats instantly! Select a category below or type what you need.',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick prompt chips
  const quickChips = [
    { label: '🍫 Dark Chocolates', query: 'Show me rich dark chocolates', category: 'dark-chocolates' as CategoryKey },
    { label: '🥮 Royal Kaju Katli', query: 'Pure cashew kaju katli and motichoor laddus', category: 'royal-sweets' as CategoryKey },
    { label: '🌿 Sugar-Free Treats', query: 'Diabetic-friendly sugar free sweets', category: 'sugar-free' as CategoryKey },
    { label: '🎁 Hampers < ₹1000', query: 'Best festive gift boxes under 1000', category: 'gift-hampers' as CategoryKey },
    { label: '🧁 French Macarons', query: 'Assorted macarons and butter cookies', category: 'bakery-cookies' as CategoryKey },
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Handle external trigger with initial query
  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      // Call backend API /api/chat-assistant
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      
      // Match products in catalog based on category or keywords
      let matchingProducts: Product[] = [];
      if (data.suggestedCategory && data.suggestedCategory !== 'all') {
        matchingProducts = PRODUCTS.filter(p => p.category === data.suggestedCategory).slice(0, 3);
      } else if (data.recommendedKeywords && data.recommendedKeywords.length > 0) {
        matchingProducts = PRODUCTS.filter(p => 
          data.recommendedKeywords.some((k: string) => 
            p.name.toLowerCase().includes(k.toLowerCase()) || 
            p.description.toLowerCase().includes(k.toLowerCase())
          )
        ).slice(0, 3);
      }

      if (matchingProducts.length === 0) {
        // Fallback default top picks
        matchingProducts = PRODUCTS.slice(0, 2);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || "Here are our most popular artisan picks for you:",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedCategory: data.suggestedCategory as CategoryKey,
        recommendedProducts: matchingProducts,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      // Offline fallback
      const fallbackProducts = PRODUCTS.slice(0, 2);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "Here are some of our best-selling confectionery delights you can add directly to cart:",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: fallbackProducts,
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddDirectFromChat = (product: Product) => {
    onAddToCart(product, product.defaultWeight, 1);
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const openActualWhatsApp = (productName?: string) => {
    const message = productName
      ? `Hello Sharma Confectioners! I am interested in ordering: ${productName}. Please confirm fresh batch availability.`
      : `Hello Sharma Confectioners! I need assistance with ordering confectionery and gift hampers.`;
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating WhatsApp Action Button */}
      {!isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
          {/* Tooltip badge */}
          <div className="hidden md:flex items-center bg-white text-stone-800 text-xs px-3 py-1.5 rounded-full shadow-lg border border-stone-200 gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold">Chat with AI Sommelier</span>
          </div>

          <button
            onClick={onToggle}
            className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative"
            aria-label="Open WhatsApp Assistant"
          >
            <MessageCircle className="w-7 h-7 fill-white text-white" />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
              AI
            </span>
          </button>
        </div>
      )}

      {/* WhatsApp Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-50 w-full sm:w-[400px] h-[580px] max-h-screen bg-[#efeae2] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-300 animate-in slide-in-from-bottom duration-300">
          {/* WhatsApp Header */}
          <div className="bg-[#075e54] text-white p-3 sm:p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-lg font-serif font-black shadow-inner">
                  S
                </div>
                <div className="w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075e54] absolute bottom-0 right-0" />
              </div>
              <div className="leading-tight">
                <h3 className="font-bold text-sm text-white flex items-center gap-1">
                  <span>Sharma Confectioners AI</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-300 inline" />
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>Online · Official Assistant</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/90">
              <button
                onClick={() => openActualWhatsApp()}
                title="Open in WhatsApp app"
                className="p-1.5 hover:bg-white/10 rounded-full cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 hover:bg-white/10 rounded-full cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body with WhatsApp subtle wallpaper feel */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto chat-scrollbar space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[85%] rounded-lg p-2.5 text-xs shadow-xs relative leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#dcf8c6] text-stone-900 rounded-tr-none'
                      : 'bg-white text-stone-900 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-stone-400">
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                  </div>
                </div>

                {/* Embedded Confectionery Product Cards */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="w-full max-w-[92%] mt-2 space-y-2">
                    {msg.recommendedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white rounded-lg p-2.5 border border-stone-200/90 shadow-sm flex items-center gap-2.5"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-md object-cover bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs text-stone-900 truncate">
                            {prod.name}
                          </h4>
                          <div className="flex items-center justify-between text-[11px] mt-0.5">
                            <span className="font-bold text-stone-900 tabular-nums">
                              ₹{prod.weightOptions[0].price}
                            </span>
                            <span className="text-stone-400 text-[10px]">
                              {prod.defaultWeight}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1.5">
                            <button
                              onClick={() => handleAddDirectFromChat(prod)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                                addedItemMap[prod.id]
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-amber-400 hover:bg-amber-500 text-stone-950'
                              }`}
                            >
                              {addedItemMap[prod.id] ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-3 h-3" />
                                  <span>Add to Cart</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                onQuickView(prod);
                                onToggle();
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1 bg-white text-stone-500 px-3 py-2 rounded-lg text-xs w-28 shadow-xs rounded-tl-none">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-stone-400 ml-1">typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Category Selection Chips (fast search without typing) */}
          <div className="px-3 py-2 bg-[#f0f2f5] border-t border-stone-200 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelectCategory(chip.category);
                  handleSendMessage(chip.query);
                }}
                className="shrink-0 bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 border border-stone-300 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="bg-[#f0f2f5] p-2 sm:p-2.5 border-t border-stone-300 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AI in Hindi or English (e.g. diabetic sweets)..."
              className="flex-1 bg-white border border-stone-300 rounded-full px-4 py-2 text-xs text-stone-900 outline-none focus:border-[#075e54] placeholder:text-stone-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-[#128C7E] hover:bg-[#075e54] disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
