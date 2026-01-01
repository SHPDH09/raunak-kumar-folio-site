import { useState, useMemo } from "react";
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
import { ExternalLink, Calendar, Award, Search, Filter, X } from "lucide-react";

const certifications = [
  {
    title: "Data Visualization",
    issuer: "Samatrix",
    certificateId: "roy8JMnRlB",
    dateOfIssue: "2025",
    link: "https://verify.netcredential.com/roy8JMnRlB",
    isNew: true
  },
  {
    title: "Deep Learning Practical with Python, TensorFlow and Keras",
    issuer: "Samatrix",
    certificateId: "roy85Dey4O",
    dateOfIssue: "2025",
    link: "https://verify.netcredential.com/roy85Dey4O",
    isNew: true
  },
  {
    title: "Neural Networks and Deep Learning",
    issuer: "Samatrix",
    certificateId: "roy8G8FGUM",
    dateOfIssue: "2025",
    link: "https://verify.netcredential.com/roy8G8FGUM",
    isNew: true
  },
  {
    title: "Machine Learning and Pattern Recognition",
    issuer: "Samatrix",
    certificateId: "roy8UTwgob",
    dateOfIssue: "2025",
    link: "https://verify.netcredential.com/roy8UTwgob",
    isNew: true
  },
  {
    title: "R Programming",
    issuer: "Samatrix",
    certificateId: "roy8LGsLi3",
    dateOfIssue: "2025",
    link: "https://verify.netcredential.com/roy8LGsLi3",
    isNew: true
  },
  {
    title: "Probabilistic Modelling and Reasoning with Python",
    issuer: "Samatrix",
    certificateId: "roy86ZOWf0",
    dateOfIssue: "2025",
    link: "https://verify.netcredential.com/roy86ZOWf0",
    isNew: true
  },
  {
    title: "Google Analytics",
    issuer: "Google",
    certificateId: "158243226",
    dateOfIssue: "15/08/2025",
    link: "https://api.accredible.com/v1/frontend/credential_website_embed_image/certificate/158243226",
    isNew: true
  },
  {
    title: "Python Development Internship Completion  Certificate",
    issuer: "CodeClouse PVT. LTD.",
    certificateId: "QR",
    dateOfIssue: "08/08/2024",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_internship-certificate-activity-7225098992253063168-cLsB?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Data Engineer",
    issuer: "GeeksforGeeks",
    certificateId: "Not mentioned",
    dateOfIssue: "05/07/2025",
    link: "#",
    isNew: true
  },
  {
    title: "R Programming for Data Science",
    issuer: "Samatrix",
    certificateId: "roy8y8ffJy",
    dateOfIssue: "01/04/2025",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_certificate-activity-7312783420038823937-B_WK?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Data Analysis Using Python",
    issuer: "Samatrix",
    certificateId: "roy8a3a1h2",
    dateOfIssue: "01/04/2025",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_certificate-activity-7312783420038823937-B_WK?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Probability Modeling Using Python",
    issuer: "Samatrix",
    certificateId: "roy8lz8t5f",
    dateOfIssue: "01/04/2025",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_certificate-activity-7312783420038823937-B_WK?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Network Support and Security",
    issuer: "CISCO Networking Academy",
    certificateId: "QR (Scanned QR-based)",
    dateOfIssue: "28/01/2025",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_certificate-activity-7289998125933481984-loPh?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Data Analytics Essentials",
    issuer: "CISCO Networking Academy",
    certificateId: "QR (Scanned QR-based)",
    dateOfIssue: "28/01/2025",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_certificate-activity-7289998125933481984-loPh?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Data Analytics Intern",
    issuer: "CodeC Technologies India (ICAC)",
    certificateId: "QR",
    dateOfIssue: "07/01/2025",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_internship-complition-certificate-activity-7282332352284966912-tM6c?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Kharagpur Data Science Hackathon 2025",
    issuer: "IIT Kharagpur",
    certificateId: "Not mentioned",
    dateOfIssue: "03/01/2025",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_hackathon-iitkgp-datascience-activity-7280791821469835264-FquR?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Data Analytics Training",
    issuer: "Internship Studio",
    certificateId: "ISDTAI518429",
    dateOfIssue: "18/10/2024",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_internship-certificate-activity-7256246166382661632-uv-x?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Excel for Data Analytics",
    issuer: "Infosys Springboard",
    certificateId: "QR",
    dateOfIssue: "08/08/2024",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_basicabrexcelabrtraining-excel-techaabrmicrosoftabrexcel-activity-7227975580112064512--hai?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
    {
    title: "RBI90Quiz 2024",
    issuer: "Reserve Bank Of India",
    certificateId: "QR",
    dateOfIssue: "08/08/2024",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_rbi90quiz-lnctuniversity-gratitude-activity-7267157900253405184-XR0X?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
 
  {
    title: "TechA Microsoft for Data Analytics",
    issuer: "Infosys Springboard",
    certificateId: "QR",
    dateOfIssue: "08/08/2024",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_dataanalytics-powerbi-datavisualization-activity-7203017914164121602-9GaB?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Data Analytics",
    issuer: "LinkedIn Learning",
    certificateId: "Not mentioned",
    dateOfIssue: "24/07/2024",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_certificate-of-completion-activity-7221859626483372033-4BwW?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Data Analytics Using Power BI",
    issuer: "TECH Tip 24",
    certificateId: "QR",
    dateOfIssue: "02/06/2024",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_dataanalytics-powerbi-datavisualization-activity-7203017914164121602-9GaB?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  },
  {
    title: "Introduction to Cloud Computing",
    issuer: "Coursera",
    certificateId: "Not mentioned",
    dateOfIssue: "03/05/2024",
    link: "https://www.linkedin.com/posts/raunak-kumar-766328248_completion-certificate-for-the-bits-and-bytes-activity-7200222241547075584-MRCU?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1FwD4BwYYr90gtBTKGHH8Yj353myFWYTQ"
  }
];

const Certifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState<string>("all");

  // Get unique issuers for filter dropdown
  const issuers = useMemo(() => {
    const uniqueIssuers = [...new Set(certifications.map((cert) => cert.issuer))];
    return uniqueIssuers.sort();
  }, []);

  // Filter certifications based on search and issuer
  const filteredCertifications = useMemo(() => {
    return certifications.filter((cert) => {
      const matchesSearch =
        searchQuery === "" ||
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIssuer =
        selectedIssuer === "all" || cert.issuer === selectedIssuer;

      return matchesSearch && matchesIssuer;
    });
  }, [searchQuery, selectedIssuer]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIssuer("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedIssuer !== "all";

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
          {filteredCertifications.map((cert, index) => (
            <Card key={index} className="certification-card group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 opacity-60"></div>
              {/* Company Logo Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-15 transition-smooth">
                {cert.issuer.toLowerCase().includes('google') && (
                  <div className="text-6xl font-bold text-blue-500">GOOGLE</div>
                )}
                {cert.issuer.toLowerCase().includes('geeksforgeeks') && (
                  <div className="text-8xl font-bold text-green-500">GFG</div>
                )}
                {cert.issuer.toLowerCase().includes('samatrix') && (
                  <div className="text-8xl font-bold text-blue-500">SMX</div>
                )}
                {cert.issuer.toLowerCase().includes('cisco') && (
                  <div className="text-6xl font-bold text-blue-600">CISCO</div>
                )}
                {cert.issuer.toLowerCase().includes('iit') && (
                  <div className="text-8xl font-bold text-orange-500">IIT</div>
                )}
                {cert.issuer.toLowerCase().includes('internship') && (
                  <div className="text-6xl font-bold text-purple-500">INTERN</div>
                )}
                {cert.issuer.toLowerCase().includes('infosys') && (
                  <div className="text-6xl font-bold text-blue-700">INFOSYS</div>
                )}
                {cert.issuer.toLowerCase().includes('linkedin') && (
                  <div className="text-6xl font-bold text-blue-800">LinkedIn</div>
                )}
                {cert.issuer.toLowerCase().includes('tech') && !cert.issuer.toLowerCase().includes('codec') && (
                  <div className="text-8xl font-bold text-gray-600">TECH</div>
                )}
                {cert.issuer.toLowerCase().includes('coursera') && (
                  <div className="text-6xl font-bold text-blue-500">COURSERA</div>
                )}
                {cert.issuer.toLowerCase().includes('codec') && (
                  <div className="text-6xl font-bold text-red-500">CODEC</div>
                )}
              </div>
              <div className="relative">
                <CardHeader className="pb-2 space-y-2">
                  <div className="flex items-start justify-between">
                    <Award className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex items-center gap-1.5">
                      {(cert as any).isNew && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 animate-pulse font-semibold">
                          NEW
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                        {cert.issuer}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-sm font-semibold leading-tight group-hover:text-primary transition-smooth line-clamp-2">
                    {cert.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {cert.dateOfIssue}
                  </div>
                  
                  {cert.certificateId !== "Not mentioned" && (
                    <div className="text-xs">
                      <span className="font-medium">ID: </span>
                      <span className="text-muted-foreground">{cert.certificateId}</span>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs h-7 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth border-primary/30 hover:border-primary"
                    onClick={() => window.open(cert.link, '_blank')}
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
