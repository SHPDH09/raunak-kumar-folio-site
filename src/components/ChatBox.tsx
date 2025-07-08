import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Key, Settings } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai-api-key') || '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Raunak's AI Assistant. I can help you learn about his technical skills, projects, education, and professional experience. What would you like to know about Raunak?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

const saveApiKey = () => {
  localStorage.setItem('openai-api-key', apiKeyInput);
  setApiKey(apiKeyInput);
  setShowSettings(false);
  setApiKeyInput('');
};


  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      if (apiKey) {
        response = await getOpenAIResponse(currentInput);
      } else {
        response = getLocalResponse(currentInput);
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please check your API key or try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const getOpenAIResponse = async (input: string): Promise<string> => {
    const raunakInfo = `
    You are Raunak Kumar's AI assistant. Here's information about Raunak:
    
    PERSONAL INFO:
    - Name: Raunak Kumar
    - Date of Birth: 21-05-2003
    - Location: India
    - Course: BCA in Artificial Intelligence & Data Analytics (AIDA)
    - University: LNCT University
    
    TECHNICAL SKILLS:
    - Programming Languages: Python, Java, C, C++, SQL, HTML, CSS, JavaScript, R Programming, Flask
    - Frameworks & Libraries: Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn, TensorFlow, NLTK, Selenium, OpenCV, Tkinter, Streamlit
    - Tools & Technologies: Power BI, SAS, Alteryx
    
    INTERESTS & SPECIALIZATIONS:
    - Data Analytics & Visualization
    - Machine Learning & AI
    - Java OOPs Concepts
    - Competitive Programming (DSA)
    - Automation
    - Data Engineering
    
    PROJECTS:
    - Medical Prediction System
    - Banking Management System
    - Railway Reservation System
    - Data Analytics dashboards
    - Quiz Application
    - Expense Tracker
    - Clustering Analysis projects
    
    EXPERIENCE:
    - AI/ML model development
    - Data analytics and visualization
    - Web development with Flask
    - Automation projects
    - Competitive programming with strong DSA knowledge
    
    INSTRUCTIONS:
    - Only answer questions about Raunak Kumar
    - Be helpful and conversational
    - If asked about other topics, politely redirect to Raunak's information
    - Provide detailed and relevant information based on the user's query
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: raunakInfo },
          { role: 'user', content: input }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const getLocalResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('project')) {
      return "Raunak has worked on various AI/ML projects including Medical Prediction System, Banking Management System, Railway Reservation System, and Data Analytics dashboards. He specializes in Python, Machine Learning, and Data Visualization.";
    } else if (lowerInput.includes('skill') || lowerInput.includes('technology')) {
      return "Raunak's technical skills include: Programming Languages - Python, Java, C++, SQL, JavaScript, R; Frameworks - TensorFlow, Pandas, NumPy, Scikit-learn, Flask, Streamlit; Tools - Power BI, SAS, Alteryx, OpenCV.";
    } else if (lowerInput.includes('education') || lowerInput.includes('study') || lowerInput.includes('college') || lowerInput.includes('university')) {
      return "Raunak is pursuing BCA in Artificial Intelligence & Data Analytics (AIDA) from LNCT University. Born on 21-05-2003, currently focused on AI/ML and Data Science.";
    } else if (lowerInput.includes('experience') || lowerInput.includes('work')) {
      return "Raunak has hands-on experience in AI/ML model development, data analytics, web development with Flask, automation projects, and competitive programming with strong DSA knowledge.";
    } else if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('connect')) {
      return "You can connect with Raunak through the contact section on this portfolio or reach out via LinkedIn for professional opportunities.";
    } else if (lowerInput.includes('name') || lowerInput.includes('who')) {
      return "I'm here to help you learn about Raunak Kumar - an AI & ML Developer and Data Analyst currently pursuing BCA in AIDA at LNCT University.";
    } else if (lowerInput.includes('location') || lowerInput.includes('where')) {
      return "Raunak is based in India and available for remote opportunities in AI/ML and Data Analytics domains.";
    } else {
      return "I can only provide information about Raunak Kumar's professional details, projects, skills, education, and contact information. Please ask me something about Raunak's portfolio!";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-glow hover-lift"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] card-gradient shadow-card border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-primary animate-pulse" />
              <CardTitle className="text-sm font-semibold">Raunak's AI Assistant</CardTitle>
              {apiKey && <Key className="w-4 h-4 text-green-500" />}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="h-6 w-6 p-0 hover:bg-accent/20"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 hover:bg-destructive/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 border-b border-border bg-muted/50">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">OpenAI API Key</span>
                  </div>
                  <Input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter your OpenAI API key..."
                    className="text-sm"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={saveApiKey}
                      size="sm"
                      className="text-xs"
                      disabled={!apiKeyInput.trim()}
                    >
                      Save Key
                    </Button>
                    <Button
                      onClick={() => setShowSettings(false)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your API key is stored locally and used to provide intelligent responses about Raunak's information.
                  </p>
                </div>
              </div>
            )}
            
            <ScrollArea className="flex-1 p-4 max-h-[350px]">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start gap-2`}
                  >
                    {!message.isUser && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                        message.isUser
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-card text-card-foreground border border-border rounded-bl-md'
                      }`}
                    >
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
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-primary animate-pulse" />
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
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Raunak..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="px-3"
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
