import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gift, ArrowRight, Sparkles, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Greetings = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Enter a code",
        description: "Please enter your greeting code to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('greetings')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Invalid Code",
          description: "This greeting code doesn't exist or has expired.",
          variant: "destructive",
        });
        return;
      }

      // Update views count
      await supabase
        .from('greetings')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id);

      navigate(`/greeting/${code.trim().toUpperCase()}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl floating" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Home button */}
      <Link to="/" className="absolute top-4 left-4 z-10">
        <Button variant="outline" size="sm" className="gap-2">
          <Home className="h-4 w-4" />
          Home
        </Button>
      </Link>

      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-xl border-primary/30 shadow-glow">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neon">
            <Gift className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">
            Special Greeting
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Enter your unique code to view your personalized greeting
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your greeting code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center text-2xl tracking-widest font-mono h-14 bg-background/50 border-primary/30 focus:border-primary focus:ring-primary uppercase"
                maxLength={8}
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  View Greeting
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>Don't have a code? Contact the sender for your unique greeting code.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Greetings;
