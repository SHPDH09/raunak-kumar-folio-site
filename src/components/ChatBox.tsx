import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Paperclip, FileText, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  file?: { name: string; type: string };
}

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 I'm Raunak's AI Assistant powered by advanced AI. I can tell you about his projects, skills, education, experience, and more. Feel free to ask anything about Raunak!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachedFile) return;

    const userMessageText = attachedFile 
      ? `${inputMessage.trim() || 'Attached file:'} [File: ${attachedFile.name}]`
      : inputMessage.trim();

    const userMessage: Message = {
      id: messages.length + 1,
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
      file: attachedFile ? { name: attachedFile.name, type: attachedFile.type } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter(m => m.id !== 1) // Exclude initial greeting
        .map(m => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.text
        }));

      // Add current message
      conversationHistory.push({
        role: 'user',
        content: currentInput || `User attached a file: ${attachedFile?.name}`
      });

      const { data, error } = await supabase.functions.invoke('raunak-assistant', {
        body: { messages: conversationHistory }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        text: data.message || "I'm sorry, I couldn't generate a response. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback to local response if API fails
      const fallbackResponse = getLocalResponse(currentInput);
      
      const aiResponse: Message = {
        id: messages.length + 2,
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('project')) {
      return "🚀 Raunak has built several impressive projects:\n\n• **AI Startup Idea Validator** - AI-powered app that evaluates startup ideas with market analysis\n• **Data Navigator AI** - GenAI-based SQL assistant using LangChain & OpenAI\n• **Medical Prediction System** - ML-based health predictions\n• **Banking & Railway Systems** - Full-stack Java applications\n• **Workforce Burnout Analyzer** - AI system for productivity analysis\n\nCheck out his live demos at ai-idea-check.vercel.app and data-navigator-ai.vercel.app!";
    } else if (lowerInput.includes('skill') || lowerInput.includes('technology') || lowerInput.includes('tech')) {
      return "💻 Raunak's Technical Arsenal:\n\n**Languages:** Python, Java, C++, SQL, JavaScript, R\n**ML/AI:** TensorFlow, Scikit-learn, LangChain, OpenAI APIs\n**Data:** Pandas, NumPy, Power BI, Matplotlib, Seaborn\n**Web:** Flask, Streamlit, Next.js, Node.js\n**Tools:** Git, VS Code, Jupyter, Selenium, OpenCV";
    } else if (lowerInput.includes('education') || lowerInput.includes('study') || lowerInput.includes('college') || lowerInput.includes('university')) {
      return "🎓 **Education:**\n\nRaunak is pursuing **BCA in Artificial Intelligence & Data Analytics (AIDA)** at **LNCT University, Bhopal**.\n\nHe was born on May 21, 2003, and is passionate about AI/ML, Data Science, and building real-world applications.";
    } else if (lowerInput.includes('experience') || lowerInput.includes('work')) {
      return "💼 Raunak has hands-on experience in:\n\n• AI/ML model development & deployment\n• End-to-end data pipeline creation\n• GenAI/LLM application development\n• Full-stack web development\n• Automation & web scraping\n• Competitive programming (DSA)";
    } else if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('connect') || lowerInput.includes('email')) {
      return "📬 **Contact Raunak:**\n\n• 📧 Email: rk331159@gmail.com\n• 💼 LinkedIn: linkedin.com/in/raunak-kumar-766328248\n• 🐙 GitHub: github.com/SHPDH09\n• 🌐 Portfolio: portfolioraunakprasad.netlify.app";
    } else if (lowerInput.includes('name') || lowerInput.includes('who') || lowerInput.includes('about')) {
      return "👨‍💻 I'm here to help you learn about **Raunak Kumar** - an AI/ML Developer and Data Analyst from India!\n\nHe specializes in building GenAI applications, data analytics solutions, and ML models. Currently pursuing BCA in AIDA at LNCT University.";
    } else if (lowerInput.includes('location') || lowerInput.includes('where')) {
      return "📍 Raunak is based in **India** and is open to remote opportunities in AI/ML, Data Analytics, and Full-stack development.";
    } else if (lowerInput.includes('github')) {
      return "🐙 **GitHub:** github.com/SHPDH09\n\nCheck out Raunak's repositories including AI Startup Idea Validator, Data Navigator AI, and Workforce Burnout Analyzer!";
    } else if (lowerInput.includes('linkedin')) {
      return "💼 **LinkedIn:** linkedin.com/in/raunak-kumar-766328248\n\nConnect with Raunak for professional opportunities!";
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! 👋 Great to meet you! I'm Raunak's AI assistant. How can I help you today? Feel free to ask about his projects, skills, education, or anything else!";
    } else {
      return "I can help you with information about Raunak Kumar's:\n\n• 🚀 **Projects** - AI/ML applications, full-stack systems\n• 💻 **Skills** - Python, Java, ML frameworks, data tools\n• 🎓 **Education** - BCA in AIDA at LNCT University\n• 💼 **Experience** - AI/ML, Data Analytics, GenAI\n• 📬 **Contact** - Email, LinkedIn, GitHub\n\nWhat would you like to know?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What are Raunak's projects?",
    "Tell me about his skills",
    "How can I contact him?"
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-glow hover-lift bg-gradient-to-r from-primary to-accent"
          size="lg"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] card-gradient shadow-card border-primary/20 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Raunak's AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Powered by AI ✨</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 p-0 hover:bg-destructive/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start gap-2`}
                  >
                    {!message.isUser && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        message.isUser
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-br-md'
                          : 'bg-card text-card-foreground border border-border rounded-bl-md'
                      }`}
                    >
                      {message.file && (
                        <div className="flex items-center gap-1 text-xs mb-1 opacity-80">
                          <FileText className="w-3 h-3" />
                          {message.file.name}
                        </div>
                      )}
                      {message.text}
                    </div>
                    {message.isUser && (
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-accent" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-primary-foreground animate-pulse" />
                    </div>
                    <div className="bg-card text-card-foreground border border-border rounded-2xl rounded-bl-md p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Quick question buttons - only show at start */}
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quickQuestions.map((q, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => {
                          setInputMessage(q);
                        }}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            
            {/* File attachment preview */}
            {attachedFile && (
              <div className="px-3 py-2 bg-muted/50 border-t border-border">
                <div className="flex items-center gap-2 text-xs">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="truncate flex-1">{attachedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={removeAttachment}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="p-3 border-t border-border">
              <div className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileAttach}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Raunak..."
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="px-3 bg-gradient-to-r from-primary to-accent"
                  disabled={isLoading || (!inputMessage.trim() && !attachedFile)}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatBox;
