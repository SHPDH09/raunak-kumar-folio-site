import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Get current count from localStorage
    const currentCount = localStorage.getItem('visitorCount');
    const count = currentCount ? parseInt(currentCount) : 0;
    
    // Increment count
    const newCount = count + 1;
    
    // Save to localStorage
    localStorage.setItem('visitorCount', newCount.toString());
    setVisitorCount(newCount);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2 text-sm">
        <Eye className="h-4 w-4 text-primary" />
        <span className="text-foreground font-medium">
          {visitorCount.toLocaleString()} visitors
        </span>
      </div>
    </div>
  );
};

export default VisitorCounter;