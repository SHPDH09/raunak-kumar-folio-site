import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy, Loader2, Medal, Star, Crown, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_text: string;
  date_achieved: string;
  display_order: number;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const { data } = await supabase
        .from('portfolio_achievements')
        .select('*')
        .order('display_order');

      if (data) {
        setAchievements(data as Achievement[]);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get different medal styles based on order
  const getMedalStyle = (index: number) => {
    if (index === 0) return { color: 'from-yellow-400 via-amber-500 to-yellow-600', icon: Crown, label: 'Premier' };
    if (index === 1) return { color: 'from-gray-300 via-slate-400 to-gray-500', icon: Medal, label: 'Elite' };
    if (index === 2) return { color: 'from-amber-600 via-orange-600 to-amber-700', icon: Medal, label: 'Honor' };
    return { color: 'from-blue-500 via-indigo-500 to-purple-500', icon: Star, label: 'Achievement' };
  };

  if (loading) {
    return (
      <section className="py-20 bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background via-amber-50/30 to-background dark:via-amber-950/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-amber-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              <span className="text-gradient">Awards & Achievements</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognition and accomplishments that showcase dedication to excellence
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {achievements.map((achievement, index) => {
            const medalStyle = getMedalStyle(index);
            const MedalIcon = medalStyle.icon;
            
            return (
              <div 
                key={achievement.id} 
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Award Plaque Design */}
                <div className="relative bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 dark:from-amber-950/60 dark:via-slate-900 dark:to-amber-950/60 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 border-amber-300/60 dark:border-amber-700/40 hover:border-amber-400 dark:hover:border-amber-600">
                  
                  {/* Wood Grain Texture Overlay */}
                  <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2Q0YTU3NCIvPgo8cGF0aCBkPSJNMCAwTDQwIDQwTTQwIDBMMCA0MCIgc3Ryb2tlPSIjYzQ5NTY0IiBzdHJva2Utd2lkdGg9IjAuNSIvPgo8L3N2Zz4=')]" />
                  
                  {/* Gold Border Inner */}
                  <div className="absolute inset-3 border-2 border-amber-400/40 dark:border-amber-600/30 rounded-lg pointer-events-none" />
                  
                  {/* Medal/Trophy on Left */}
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${medalStyle.color} shadow-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-200 dark:to-amber-300 flex items-center justify-center shadow-inner">
                        <MedalIcon className="w-8 h-8 md:w-12 md:h-12 text-amber-700" />
                      </div>
                    </div>
                    {/* Ribbon */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-8">
                      <div className={`absolute left-0 w-6 h-8 bg-gradient-to-b ${medalStyle.color} transform -skew-x-12`} />
                      <div className={`absolute right-0 w-6 h-8 bg-gradient-to-b ${medalStyle.color} transform skew-x-12`} />
                    </div>
                  </div>
                  
                  <div className="relative p-6 md:p-8 pl-24 md:pl-36">
                    {/* Top Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                        <Badge className={`bg-gradient-to-r ${medalStyle.color} text-white border-0 font-bold text-xs px-3 py-1 shadow-lg`}>
                          {medalStyle.label} Award
                        </Badge>
                      </div>
                      {achievement.badge_text && (
                        <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400 font-semibold">
                          {achievement.badge_text}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {achievement.title}
                    </h3>
                    
                    {/* Decorative Line */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-amber-400 to-transparent" />
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-px bg-gradient-to-l from-amber-400 to-transparent" />
                    </div>
                    
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                      {achievement.description}
                    </p>
                    
                    {/* Date */}
                    {achievement.date_achieved && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-200/50 dark:bg-amber-900/30 rounded-full">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                          Achieved: {formatDate(achievement.date_achieved)}
                        </span>
                      </div>
                    )}
                    
                    {/* Signature Line */}
                    <div className="mt-6 pt-4 border-t border-amber-300/30 flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Verified Achievement</p>
                        <p className="font-script text-lg text-amber-700 dark:text-amber-400 italic">Excellence Recognized</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
