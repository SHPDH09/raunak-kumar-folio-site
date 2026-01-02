import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Paperclip, FileText, Sparkles, Mic, MicOff, Check, CheckCheck, Copy, Download, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  file?: { name: string; type: string; content?: string };
  status?: 'sending' | 'sent' | 'read';
}

// Speech Recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 I'm Raunak's AI Assistant powered by advanced AI. I can tell you about his projects, skills, education, experience, and more. Feel free to ask anything about Raunak!",
      isUser: false,
      timestamp: new Date(),
      status: 'read'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [pdfContent, setPdfContent] = useState<string>('');
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setInputMessage(prev => prev + finalTranscript);
          } else if (interimTranscript) {
            // Show interim results in input
            setInputMessage(interimTranscript);
          }
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen) {
      setMessages(prev => 
        prev.map(msg => ({ ...msg, status: 'read' as const }))
      );
    }
  }, [isOpen]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputMessage('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      
      // If it's a PDF, extract text content
      if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          // Simple PDF text extraction - for complex PDFs, you might need a more robust solution
          const text = await extractTextFromPDF(arrayBuffer);
          setPdfContent(text);
          toast.success('PDF loaded successfully!');
        } catch (error) {
          console.error('Error reading PDF:', error);
          toast.error('Could not read PDF content');
        }
      }
    }
  };

  // Simple PDF text extraction (basic implementation)
  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    // Convert to string and try to extract readable text
    const bytes = new Uint8Array(arrayBuffer);
    let text = '';
    
    // This is a simplified extraction - for production, consider using pdf.js
    for (let i = 0; i < bytes.length; i++) {
      const char = bytes[i];
      if (char >= 32 && char <= 126) {
        text += String.fromCharCode(char);
      } else if (char === 10 || char === 13) {
        text += '\n';
      }
    }
    
    // Clean up the extracted text
    const cleanText = text
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000); // Limit to first 5000 chars
    
    return cleanText || 'PDF content extracted (binary format - please describe what you need from this file)';
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setPdfContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Copy message to clipboard
  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // Export chat to PDF
  const exportChatToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = 20;

    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Raunak's AI Assistant - Chat Export", margin, yPosition);
    yPosition += 15;

    // Date
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Exported on: ${new Date().toLocaleString()}`, margin, yPosition);
    yPosition += 15;

    // Separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Messages
    messages.forEach((message) => {
      // Check if we need a new page
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }

      // Sender label
      pdf.setFontSize(10);
      pdf.setTextColor(message.isUser ? 0 : 100, message.isUser ? 100 : 0, message.isUser ? 200 : 150);
      pdf.text(message.isUser ? 'You' : "Raunak's AI", margin, yPosition);
      yPosition += 5;

      // Timestamp
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(new Date(message.timestamp).toLocaleString(), margin, yPosition);
      yPosition += 7;

      // Message content - clean markdown
      pdf.setFontSize(10);
      pdf.setTextColor(50, 50, 50);
      const cleanText = message.text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/---/g, '');

      const lines = pdf.splitTextToSize(cleanText, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });

      yPosition += 10;
    });

    pdf.save('raunak-ai-chat.pdf');
    toast.success('Chat exported to PDF!');
  };

  // Share chat
  const shareChat = async () => {
    const chatText = messages
      .map(m => `${m.isUser ? 'You' : "Raunak's AI"} (${new Date(m.timestamp).toLocaleTimeString()}):\n${m.text}`)
      .join('\n\n---\n\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Raunak's AI Assistant Chat",
          text: chatText,
        });
        toast.success('Chat shared!');
      } catch (error) {
        // User cancelled or share failed, fallback to copy
        await navigator.clipboard.writeText(chatText);
        toast.success('Chat copied to clipboard!');
      }
    } else {
      // Fallback for browsers without share API
      await navigator.clipboard.writeText(chatText);
      toast.success('Chat copied to clipboard!');
    }
  };

  // Simulate typing effect
  const simulateTyping = async (fullText: string) => {
    setIsTyping(true);
    setTypingText('');
    
    const words = fullText.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      setTypingText(currentText);
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
    }
    
    setIsTyping(false);
    return fullText;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachedFile) return;

    // Stop listening if voice input is active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessageText = attachedFile 
      ? `${inputMessage.trim() || 'Attached file:'} [File: ${attachedFile.name}]`
      : inputMessage.trim();

    const userMessage: Message = {
      id: messages.length + 1,
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
      file: attachedFile ? { name: attachedFile.name, type: attachedFile.type } : undefined,
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Update message status to sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        )
      );
    }, 300);

    // Update message status to read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'read' as const } : msg
        )
      );
    }, 800);

    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter(m => m.id !== 1) // Exclude initial greeting
        .map(m => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.text
        }));

      // Add current message with PDF content if available
      let messageContent = currentInput || '';
      if (attachedFile) {
        messageContent += `\n\n[Attached file: ${attachedFile.name}]`;
        if (pdfContent && attachedFile.type === 'application/pdf') {
          messageContent += `\n\nPDF Content:\n${pdfContent}`;
        }
      }
      
      conversationHistory.push({
        role: 'user',
        content: messageContent
      });

      const { data, error } = await supabase.functions.invoke('raunak-assistant', {
        body: { messages: conversationHistory }
      });

      setIsLoading(false);

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const responseText = data.message || "I'm sorry, I couldn't generate a response. Please try again.";
      
      // Simulate typing effect
      await simulateTyping(responseText);

      const aiResponse: Message = {
        id: messages.length + 2,
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        status: 'read'
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
      
      // Fallback to local response if API fails
      const fallbackResponse = getLocalResponse(currentInput);
      
      await simulateTyping(fallbackResponse);

      const aiResponse: Message = {
        id: messages.length + 2,
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date(),
        status: 'read'
      };
      setMessages(prev => [...prev, aiResponse]);
    }
  };

  const getLocalResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('project')) {
      return `## 🚀 Raunak's Projects

### Featured Projects

1. **AI Startup Idea Validator**
   - AI-powered app that evaluates startup ideas with market analysis
   - **Tech:** Next.js, Node.js, MongoDB, OpenAI
   - **Demo:** [ai-idea-check.vercel.app](https://ai-idea-check.vercel.app/)

2. **Data Navigator AI**
   - GenAI-based SQL assistant using LangChain & OpenAI
   - **Demo:** [data-navigator-ai.vercel.app](https://data-navigator-ai.vercel.app/)

3. **Workforce Burnout Analyzer**
   - AI system for productivity analysis and burnout detection
   - **Demo:** [burnoutai.streamlit.app](https://burnoutai.streamlit.app/)

4. **Medical Prediction System** - ML-based health predictions
5. **Banking & Railway Systems** - Full-stack Java applications

---
💡 **You might also want to know:**
• What technologies does Raunak use?
• Tell me about his AI/ML experience
• What are his live deployed applications?`;
    } else if (lowerInput.includes('skill') || lowerInput.includes('technology') || lowerInput.includes('tech')) {
      return `## 💻 Raunak's Technical Skills

### Programming Languages
- **Python** (Expert) - ML, AI, Data Analysis
- **Java** (Advanced) - OOP, Enterprise Apps
- **SQL** (Advanced) - Database Design & Optimization
- **JavaScript** - Web Development
- **C/C++** - DSA, Competitive Programming

### Frameworks & Libraries
| Category | Technologies |
|----------|-------------|
| **ML/AI** | TensorFlow, Scikit-learn, LangChain, OpenAI |
| **Data** | Pandas, NumPy, Power BI, Matplotlib |
| **Web** | Flask, Streamlit, Next.js, Node.js |
| **Tools** | Git, Selenium, OpenCV, Jupyter |

---
💡 **You might also want to know:**
• What projects has he built with these skills?
• What certifications does he have?
• What are his areas of expertise?`;
    } else if (lowerInput.includes('education') || lowerInput.includes('study') || lowerInput.includes('college') || lowerInput.includes('university')) {
      return `## 🎓 Education

### Current Studies
- **Degree:** BCA in Artificial Intelligence & Data Analytics (AIDA)
- **University:** LNCT University, Bhopal
- **Status:** Currently Pursuing

### Personal Info
- **Born:** May 21, 2003
- **Location:** India

Raunak is passionate about AI/ML, Data Science, and building real-world applications that solve problems.

---
💡 **You might also want to know:**
• What are his technical skills?
• What projects has he worked on?
• What are his career goals?`;
    } else if (lowerInput.includes('experience') || lowerInput.includes('work')) {
      return `## 💼 Experience & Expertise

### Core Competencies
- ✅ AI/ML model development & deployment
- ✅ End-to-end data pipeline creation
- ✅ GenAI/LLM application development
- ✅ Full-stack web development
- ✅ Automation & web scraping
- ✅ Competitive programming (DSA)

### Key Achievements
- Built multiple production-ready AI applications
- Deployed GenAI tools used by real users
- Strong problem-solving skills in competitive programming

---
💡 **You might also want to know:**
• What specific projects demonstrate these skills?
• What certifications has he earned?
• How can I contact him for opportunities?`;
    } else if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('connect') || lowerInput.includes('email')) {
      return `## 📬 Contact Raunak

### Direct Contact
- **📧 Email:** [rk331159@gmail.com](mailto:rk331159@gmail.com)

### Professional Profiles
- **💼 LinkedIn:** [linkedin.com/in/raunak-kumar-766328248](https://www.linkedin.com/in/raunak-kumar-766328248/)
- **🐙 GitHub:** [github.com/SHPDH09](https://github.com/SHPDH09)
- **🌐 Portfolio:** [portfolioraunakprasad.netlify.app](https://portfolioraunakprasad.netlify.app/)

Feel free to reach out for collaborations, opportunities, or just to connect!

---
💡 **You might also want to know:**
• What projects has he built?
• What are his technical skills?
• Is he available for freelance work?`;
    } else if (lowerInput.includes('name') || lowerInput.includes('who') || lowerInput.includes('about')) {
      return `## 👨‍💻 About Raunak Kumar

### Introduction
Raunak Kumar is an **AI/ML Developer and Data Analyst** from India, currently pursuing **BCA in AIDA** at LNCT University.

### What He Does
- 🤖 Builds GenAI/LLM applications
- 📊 Creates data analytics solutions
- 🧠 Develops machine learning models
- 🌐 Full-stack web development

### Focus Areas
- Artificial Intelligence & Machine Learning
- Data Engineering & Analytics
- LangChain & OpenAI integrations

---
💡 **You might also want to know:**
• What projects has he built?
• What are his technical skills?
• How can I contact him?`;
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return `## 👋 Hello there!

Great to meet you! I'm **Raunak's AI assistant**.

I can help you learn about:
- 🚀 His **projects** and live demos
- 💻 His **technical skills** and expertise
- 🎓 His **education** and background
- 💼 His **experience** and achievements
- 📬 How to **contact** him

**What would you like to know?**

---
💡 **Popular questions:**
• What are Raunak's best projects?
• What technologies does he work with?
• How can I hire him?`;
    } else {
      return `## 🤔 How Can I Help?

I can provide information about **Raunak Kumar's**:

| Topic | What I Can Tell You |
|-------|-------------------|
| 🚀 **Projects** | AI/ML apps, full-stack systems, live demos |
| 💻 **Skills** | Python, Java, ML frameworks, data tools |
| 🎓 **Education** | BCA in AIDA at LNCT University |
| 💼 **Experience** | AI/ML, Data Analytics, GenAI |
| 📬 **Contact** | Email, LinkedIn, GitHub |

**Just ask me anything about Raunak!**

---
💡 **Try asking:**
• What are his best projects?
• What technologies does he know?
• How can I reach him?`;
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

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <Check className="w-3 h-3" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

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
                <p className="text-xs text-muted-foreground">
                  {isLoading || isTyping ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Typing...
                    </span>
                  ) : (
                    'Powered by AI ✨'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={shareChat}
                className="h-7 w-7 p-0 hover:bg-primary/20"
                title="Share chat"
              >
                <Share2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportChatToPDF}
                className="h-7 w-7 p-0 hover:bg-primary/20"
                title="Export to PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 p-0 hover:bg-destructive/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
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
                    <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'} gap-0.5 group`}>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed relative ${
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
                        {message.isUser ? (
                          <span className="whitespace-pre-line">{message.text}</span>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-2 prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-strong:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-hr:my-3 prose-hr:border-border">
                            <ReactMarkdown
                              components={{
                                h2: ({ children }) => <h2 className="text-base font-bold text-foreground mt-3 mb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-semibold text-foreground mt-2 mb-1">{children}</h3>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1.5">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 my-1.5">{children}</ol>,
                                li: ({ children }) => <li className="text-sm">{children}</li>,
                                p: ({ children }) => <p className="my-1.5">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                                a: ({ href, children }) => (
                                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                    {children}
                                  </a>
                                ),
                                hr: () => <hr className="my-3 border-border" />,
                                code: ({ children }) => (
                                  <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>
                                ),
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      {/* Copy button for AI messages */}
                      {!message.isUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.text, message.id)}
                          className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        >
                          {copiedMessageId === message.id ? (
                            <>
                              <Check className="w-3 h-3 mr-1 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      )}
                      {message.isUser && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground pr-1">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {getStatusIcon(message.status)}
                        </div>
                      )}
                    </div>
                    {message.isUser && (
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3 text-accent" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing indicator */}
                {(isLoading || isTyping) && (
                  <div className="flex justify-start items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="bg-card text-card-foreground border border-border rounded-2xl rounded-bl-md p-3 max-w-[85%]">
                      {isTyping && typingText ? (
                        <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-strong:text-primary">
                          <ReactMarkdown
                            components={{
                              h2: ({ children }) => <h2 className="text-base font-bold text-foreground mt-3 mb-2">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-semibold text-foreground mt-2 mb-1">{children}</h3>,
                              ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1.5">{children}</ul>,
                              li: ({ children }) => <li className="text-sm">{children}</li>,
                              p: ({ children }) => <p className="my-1.5">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                            }}
                          >
                            {typingText}
                          </ReactMarkdown>
                          <span className="inline-block w-1 h-4 bg-primary ml-0.5 animate-pulse" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground">AI is thinking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Quick question buttons - only show at start */}
                {messages.length === 1 && !isLoading && !isTyping && (
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
            
            {/* Voice input indicator */}
            {isListening && (
              <div className="px-3 py-2 bg-red-500/10 border-t border-red-500/20">
                <div className="flex items-center gap-2 text-xs text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span>Listening... Speak now</span>
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
                  disabled={isLoading || isTyping}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  variant={isListening ? "destructive" : "ghost"}
                  size="sm"
                  className={`px-2 ${isListening ? 'animate-pulse' : ''}`}
                  onClick={toggleVoiceInput}
                  disabled={isLoading || isTyping}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : "Ask about Raunak..."}
                  className="flex-1 text-sm"
                  disabled={isLoading || isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="px-3 bg-gradient-to-r from-primary to-accent"
                  disabled={isLoading || isTyping || (!inputMessage.trim() && !attachedFile)}
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
