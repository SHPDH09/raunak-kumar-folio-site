import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, ArrowLeft, MessageCircle, Search } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  userId: string;
  profile: Profile;
  lastMessage: Message;
  unreadCount: number;
}

interface MessengerProps {
  currentUserId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialChatUserId?: string | null;
}

export const Messenger = ({ currentUserId, open, onOpenChange, initialChatUserId }: MessengerProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(initialChatUserId || null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && currentUserId) {
      loadConversations();
      
      // Subscribe to new messages
      const channel = supabase
        .channel('messages-channel')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        }, (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id === currentUserId || newMsg.receiver_id === currentUserId) {
            if (selectedChat && (newMsg.sender_id === selectedChat || newMsg.receiver_id === selectedChat)) {
              setMessages(prev => [...prev, newMsg]);
            }
            loadConversations();
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [open, currentUserId, selectedChat]);

  useEffect(() => {
    if (initialChatUserId && open) {
      openChat(initialChatUserId);
    }
  }, [initialChatUserId, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      // Get all messages involving current user
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (!messagesData || messagesData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Group by conversation partner
      const conversationMap = new Map<string, { messages: Message[], unread: number }>();
      
      messagesData.forEach(msg => {
        const partnerId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, { messages: [], unread: 0 });
        }
        const conv = conversationMap.get(partnerId)!;
        conv.messages.push(msg);
        if (!msg.is_read && msg.receiver_id === currentUserId) {
          conv.unread++;
        }
      });

      // Get profiles
      const partnerIds = Array.from(conversationMap.keys());
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', partnerIds);

      const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const conversationsList: Conversation[] = [];
      conversationMap.forEach((data, partnerId) => {
        const profile = profilesMap.get(partnerId);
        if (profile) {
          conversationsList.push({
            userId: partnerId,
            profile,
            lastMessage: data.messages[0],
            unreadCount: data.unread,
          });
        }
      });

      setConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
    setLoading(false);
  };

  const openChat = async (userId: string) => {
    setSelectedChat(userId);
    
    // Load profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    setSelectedProfile(profile);
    
    // Load messages
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });
    
    setMessages(messagesData || []);

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', userId)
      .eq('receiver_id', currentUserId)
      .eq('is_read', false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: selectedChat,
          content: newMessage.trim(),
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId)
      .ilike('username', `%${query}%`)
      .limit(10);

    setSearchResults(data || []);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {!selectedChat ? (
          <>
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </SheetTitle>
            </SheetHeader>
            
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {searchQuery.length >= 2 ? (
                <div className="p-2">
                  {searchResults.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No users found</p>
                  ) : (
                    searchResults.map(profile => (
                      <div
                        key={profile.id}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
                        onClick={() => {
                          openChat(profile.id);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <Avatar className="h-12 w-12">
                          {profile.avatar_url && <AvatarImage src={profile.avatar_url} />}
                          <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-medium truncate">{profile.username}</span>
                            {profile.is_verified && (
                              <Badge className="h-4 px-1 bg-blue-500 text-white text-xs">✓</Badge>
                            )}
                          </div>
                          {profile.full_name && (
                            <p className="text-sm text-muted-foreground truncate">{profile.full_name}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground">Search for users to start a conversation</p>
                </div>
              ) : (
                <div className="p-2">
                  {conversations.map(conv => (
                    <div
                      key={conv.userId}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
                      onClick={() => openChat(conv.userId)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          {conv.profile.avatar_url && <AvatarImage src={conv.profile.avatar_url} />}
                          <AvatarFallback>{conv.profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="font-medium truncate">{conv.profile.username}</span>
                            {conv.profile.is_verified && (
                              <Badge className="h-4 px-1 bg-blue-500 text-white text-xs">✓</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{formatTime(conv.lastMessage.created_at)}</span>
                        </div>
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {conv.lastMessage.sender_id === currentUserId ? 'You: ' : ''}{conv.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {selectedProfile && (
                <>
                  <Avatar className="h-10 w-10">
                    {selectedProfile.avatar_url && <AvatarImage src={selectedProfile.avatar_url} />}
                    <AvatarFallback>{selectedProfile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{selectedProfile.username}</span>
                      {selectedProfile.is_verified && (
                        <Badge className="h-4 px-1 bg-blue-500 text-white text-xs">✓</Badge>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                        msg.sender_id === currentUserId
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender_id === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};