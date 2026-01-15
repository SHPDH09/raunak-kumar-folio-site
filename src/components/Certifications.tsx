import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ExternalLink, Calendar, Award, Search, Filter, X, Loader2 } from "lucide-react";
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
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <section id="certifications" className="py-20 bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section id="certifications" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Certifications & Learning Path
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My continuous journey of learning and professional development through various certifications and courses.
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

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredCertifications.map((cert) => (
            <Card key={cert.id} className="certification-card group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 opacity-60"></div>
              <div className="relative">
                <CardHeader className="pb-2 space-y-2">
                  <div className="flex items-start justify-between">
                    <Award className="h-4 w-4 text-primary flex-shrink-0" />
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                      {cert.issuer}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold leading-tight group-hover:text-primary transition-smooth line-clamp-2">
                    {cert.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(cert.issue_date)}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs h-7 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth border-primary/30 hover:border-primary"
                    onClick={() => cert.credential_url && window.open(cert.credential_url, '_blank')}
                    disabled={!cert.credential_url || cert.credential_url === '#'}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
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