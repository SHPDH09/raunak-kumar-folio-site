import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Home, Volume2, VolumeX, Share2, Heart, Sparkles, PartyPopper, Cake, Gift, Star, Sun, Calendar, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Confetti from '@/components/Confetti';

interface Greeting {
  id: string;
  code: string;
  recipient_name: string;
  sender_name: string | null;
  date_of_birth: string | null;
  phone: string | null;
  email: string | null;
  greeting_type: string;
  custom_message: string | null;
  created_at: string;
  expires_at: string;
}

const greetingConfig: Record<string, { 
  title: string; 
  icon: any; 
  gradient: string; 
  bgGradient: string;
  message: string;
  emoji: string;
}> = {
  birthday: {
    title: 'Happy Birthday',
    icon: Cake,
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    bgGradient: 'from-pink-900/30 via-purple-900/30 to-indigo-900/30',
    message: 'Wishing you a day filled with love, laughter, and all your favorite things!',
    emoji: '🎂',
  },
  new_year: {
    title: 'Happy New Year',
    icon: PartyPopper,
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    bgGradient: 'from-yellow-900/30 via-orange-900/30 to-red-900/30',
    message: 'May this new year bring you joy, success, and endless possibilities!',
    emoji: '🎆',
  },
  anniversary: {
    title: 'Happy Anniversary',
    icon: Heart,
    gradient: 'from-rose-500 via-red-500 to-pink-500',
    bgGradient: 'from-rose-900/30 via-red-900/30 to-pink-900/30',
    message: 'Celebrating the beautiful journey of love and togetherness!',
    emoji: '💕',
  },
  congratulations: {
    title: 'Congratulations',
    icon: Star,
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    bgGradient: 'from-green-900/30 via-emerald-900/30 to-teal-900/30',
    message: 'Your hard work has paid off! Proud of your achievements!',
    emoji: '🎉',
  },
  thank_you: {
    title: 'Thank You',
    icon: Gift,
    gradient: 'from-blue-400 via-cyan-500 to-teal-400',
    bgGradient: 'from-blue-900/30 via-cyan-900/30 to-teal-900/30',
    message: 'Grateful for your kindness and generosity!',
    emoji: '🙏',
  },
  happiness: {
    title: 'Spread Happiness',
    icon: Sun,
    gradient: 'from-amber-400 via-yellow-500 to-orange-400',
    bgGradient: 'from-amber-900/30 via-yellow-900/30 to-orange-900/30',
    message: 'Sending you sunshine and smiles!',
    emoji: '☀️',
  },
  get_well: {
    title: 'Get Well Soon',
    icon: Heart,
    gradient: 'from-sky-400 via-blue-500 to-indigo-400',
    bgGradient: 'from-sky-900/30 via-blue-900/30 to-indigo-900/30',
    message: 'Wishing you a speedy recovery and good health!',
    emoji: '💐',
  },
  wedding: {
    title: 'Happy Wedding',
    icon: Heart,
    gradient: 'from-fuchsia-400 via-pink-500 to-rose-400',
    bgGradient: 'from-fuchsia-900/30 via-pink-900/30 to-rose-900/30',
    message: 'May your love story be forever beautiful!',
    emoji: '💒',
  },
};

const GreetingView = () => {
  const { code } = useParams<{ code: string }>();
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchGreeting();
  }, [code]);

  useEffect(() => {
    if (greeting) {
      setShowConfetti(true);
      setIsAnimating(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [greeting]);

  const fetchGreeting = async () => {
    if (!code) return;

    try {
      const { data, error } = await supabase
        .from('greetings')
        .select('*')
        .eq('code', code.toUpperCase())
        .maybeSingle();

      if (error) throw error;
      setGreeting(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load greeting.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `${config?.title} - ${greeting?.recipient_name}`,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Share this link with others.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your greeting...</p>
        </div>
      </div>
    );
  }

  if (!greeting) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
            <Gift className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Greeting Not Found</h1>
          <p className="text-muted-foreground">This greeting code is invalid or has expired.</p>
          <Link to="/greetings">
            <Button>Try Another Code</Button>
          </Link>
        </div>
      </div>
    );
  }

  const config = greetingConfig[greeting.greeting_type] || greetingConfig.happiness;
  const IconComponent = config.icon;

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${config.bgGradient} bg-background`}>
      {/* Background music */}
      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-4xl floating opacity-60`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          >
            {config.emoji}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMusic}
          className="bg-background/50 backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          className="bg-background/50 backdrop-blur-sm"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className={`max-w-2xl w-full text-center space-y-8 ${isAnimating ? 'animate-in fade-in zoom-in-95 duration-1000' : ''}`}>
          {/* Icon */}
          <div className={`mx-auto w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-2xl pulse-neon`}>
            <IconComponent className="h-16 w-16 text-white" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className={`text-5xl md:text-7xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent animate-pulse`}>
              {config.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>A special greeting for</span>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>

          {/* Recipient name */}
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold text-gradient py-4">
              {greeting.recipient_name}
            </h2>
            <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />
          </div>

          {/* Message */}
          <div className="bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-primary/20 shadow-glow space-y-4">
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed">
              {greeting.custom_message || config.message}
            </p>

            {greeting.sender_name && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-muted-foreground">With love from,</p>
                <p className="text-xl font-semibold text-primary">{greeting.sender_name}</p>
              </div>
            )}
          </div>

          {/* Best wishes */}
          <div className="flex items-center justify-center gap-4 text-3xl">
            <span>{config.emoji}</span>
            <span className="text-lg text-muted-foreground italic">Best Wishes!</span>
            <span>{config.emoji}</span>
          </div>

          {/* Music hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
            <Music className="h-4 w-4" />
            <span>Click the sound button to play celebration music!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingView;
