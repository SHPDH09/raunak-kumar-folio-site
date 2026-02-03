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
                <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/40 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-amber-200/50 dark:border-amber-700/30 hover:scale-[1.02]">
                  
                  {/* Decorative Border Pattern */}
                  <div className="absolute inset-2 border border-amber-300/50 dark:border-amber-600/30 rounded pointer-events-none" />
                  <div className="absolute inset-3 border border-amber-200/30 dark:border-amber-700/20 rounded pointer-events-none" />
                  
                  {/* Corner Decorations */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/60 rounded-tl" />
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/60 rounded-tr" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/60 rounded-bl" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/60 rounded-br" />
                  
                  {/* Gold Seal */}
                  <div className="absolute -top-3 -right-3 w-20 h-20">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${style.color} shadow-lg flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300`}>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                        <Shield className="w-7 h-7 text-amber-800" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative p-6 pt-8">
                    {/* Header */}
                    <div className="text-center mb-4">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400 font-medium mb-2">
                        Certificate of Completion
                      </p>
                      <div className="flex justify-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-center text-lg font-bold text-foreground mb-4 leading-tight min-h-[3rem] flex items-center justify-center">
                      {cert.title}
                    </h3>
                    
                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400" />
                      <Award className={`w-5 h-5 ${style.accent}`} />
                      <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400" />
                    </div>
                    
                    {/* Issuer */}
                    <div className="text-center mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Issued By</p>
                      <Badge className={`bg-gradient-to-r ${style.color} text-white border-0 font-semibold px-4 py-1`}>
                        {cert.issuer}
                      </Badge>
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(cert.issue_date)}
                    </div>
                    
                    {/* Recipient */}
                    <div className="text-center mb-4 py-2 bg-amber-100/50 dark:bg-amber-900/20 rounded border border-amber-200/50 dark:border-amber-700/30">
                      <p className="text-xs text-muted-foreground mb-1">Awarded To</p>
                      <p className="font-semibold text-foreground">Raunak Kumar</p>
                    </div>
                    
                    {/* Verify Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 font-medium shadow-md"
                      onClick={() => cert.credential_url && window.open(cert.credential_url, '_blank')}
                      disabled={!cert.credential_url || cert.credential_url === '#'}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Verify Certificate
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
