import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Calendar, Award, Search, Filter, X, Loader2, Shield, Star } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  credential_url: string;
  issue_date: string;
  display_order: number;
}

const Certifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState<string>("all");

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const { data } = await supabase
        .from('portfolio_certifications')
        .select('*')
        .order('display_order');

      if (data) {
        setCertifications(data as Certification[]);
      }
    } catch (error) {
      console.error('Error loading certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique issuers for filter dropdown
  const issuers = useMemo(() => {
    const uniqueIssuers = [...new Set(certifications.map((cert) => cert.issuer).filter(Boolean))];
    return uniqueIssuers.sort();
  }, [certifications]);

  // Filter certifications based on search and issuer
  const filteredCertifications = useMemo(() => {
    return certifications.filter((cert) => {
      const matchesSearch =
        searchQuery === "" ||
        cert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIssuer =
        selectedIssuer === "all" || cert.issuer === selectedIssuer;

      return matchesSearch && matchesIssuer;
    });
  }, [certifications, searchQuery, selectedIssuer]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIssuer("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedIssuer !== "all";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Get issuer logo/color
  const getIssuerStyle = (issuer: string) => {
    const issuerLower = issuer?.toLowerCase() || '';
    if (issuerLower.includes('google')) return { color: 'from-blue-600 to-green-500', accent: 'text-blue-600' };
    if (issuerLower.includes('microsoft')) return { color: 'from-blue-500 to-cyan-400', accent: 'text-blue-500' };
    if (issuerLower.includes('ibm')) return { color: 'from-blue-700 to-blue-500', accent: 'text-blue-700' };
    if (issuerLower.includes('coursera')) return { color: 'from-blue-500 to-indigo-600', accent: 'text-blue-600' };
    if (issuerLower.includes('udemy')) return { color: 'from-purple-600 to-purple-400', accent: 'text-purple-600' };
    if (issuerLower.includes('linkedin')) return { color: 'from-blue-600 to-blue-400', accent: 'text-blue-600' };
    if (issuerLower.includes('aws')) return { color: 'from-orange-500 to-yellow-500', accent: 'text-orange-600' };
    if (issuerLower.includes('oracle')) return { color: 'from-red-600 to-red-400', accent: 'text-red-600' };
    if (issuerLower.includes('cisco')) return { color: 'from-blue-500 to-teal-400', accent: 'text-blue-600' };
    return { color: 'from-amber-600 to-yellow-500', accent: 'text-amber-700' };
  };

  if (loading) {
    return (
      <section id="certifications" className="py-20 bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section id="certifications" className="py-20 bg-gradient-to-b from-amber-50/50 to-background dark:from-amber-950/20 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Award className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              Professional Certifications
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Official certifications and credentials from renowned institutions and technology leaders
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search certifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedIssuer} onValueChange={setSelectedIssuer}>
              <SelectTrigger className="w-[180px] bg-background/80 backdrop-blur-sm border-border/50">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by issuer" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="all">All Issuers</SelectItem>
                {issuers.map((issuer) => (
                  <SelectItem key={issuer} value={issuer}>
                    {issuer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                className="border-border/50 hover:border-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-center mb-6 text-sm text-muted-foreground">
          Showing {filteredCertifications.length} of {certifications.length} certifications
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((cert, index) => {
            const style = getIssuerStyle(cert.issuer);
            return (
              <div 
                key={cert.id} 
                className="group relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Certificate Card - Realistic Design */}
                <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/40 rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200/50 dark:border-amber-700/30 hover:scale-[1.01]">
                  
                  {/* Decorative Border Pattern */}
                  <div className="absolute inset-1 border border-amber-300/40 dark:border-amber-600/20 rounded-sm pointer-events-none" />
                  
                  {/* Corner Decorations - Smaller */}
                  <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-amber-400/50 rounded-tl-sm" />
                  <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-amber-400/50 rounded-tr-sm" />
                  <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-amber-400/50 rounded-bl-sm" />
                  <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-amber-400/50 rounded-br-sm" />
                  
                  {/* Gold Seal - Smaller */}
                  <div className="absolute -top-2 -right-2 w-12 h-12">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${style.color} shadow-md flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-amber-800" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative p-4">
                    {/* Header - Compact */}
                    <div className="text-center mb-2">
                      <p className="text-[8px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 font-medium">
                        Certificate
                      </p>
                    </div>
                    
                    {/* Title - Smaller */}
                    <h3 className="text-center text-sm font-bold text-foreground mb-2 leading-tight line-clamp-2">
                      {cert.title}
                    </h3>
                    
                    {/* Decorative Line - Smaller */}
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <div className="h-px w-6 bg-gradient-to-r from-transparent to-amber-400" />
                      <Award className={`w-3 h-3 ${style.accent}`} />
                      <div className="h-px w-6 bg-gradient-to-l from-transparent to-amber-400" />
                    </div>
                    
                    {/* Issuer - Compact */}
                    <div className="text-center mb-2">
                      <Badge className={`bg-gradient-to-r ${style.color} text-white border-0 text-xs px-2 py-0.5`}>
                        {cert.issuer}
                      </Badge>
                    </div>
                    
                    {/* Date - Smaller */}
                    <div className="flex items-center justify-center text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(cert.issue_date)}
                    </div>
                    
                    {/* Verify Button - Compact */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-7 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 font-medium shadow-sm"
                      onClick={() => cert.credential_url && window.open(cert.credential_url, '_blank')}
                      disabled={!cert.credential_url || cert.credential_url === '#'}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredCertifications.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Award className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No certifications found matching your criteria.</p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
