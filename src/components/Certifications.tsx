import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Award } from "lucide-react";

const certifications = [
  {
    title: "Data Engineer",
    issuer: "GeeksforGeeks",
    certificateId: "Not mentioned",
    dateOfIssue: "05/07/2025",
    link: "#"
  },
  {
    title: "R Programming for Data Science",
    issuer: "Samatrix",
    certificateId: "roy8y8ffJy",
    dateOfIssue: "01/04/2025",
    link: "#"
  },
  {
    title: "Data Analysis Using Python",
    issuer: "Samatrix",
    certificateId: "roy8a3a1h2",
    dateOfIssue: "01/04/2025",
    link: "#"
  },
  {
    title: "Probability Modeling Using Python",
    issuer: "Samatrix",
    certificateId: "roy8lz8t5f",
    dateOfIssue: "01/04/2025",
    link: "#"
  },
  {
    title: "Network Support and Security",
    issuer: "CISCO Networking Academy",
    certificateId: "QR (Scanned QR-based)",
    dateOfIssue: "28/01/2025",
    link: "#"
  },
  {
    title: "Data Analytics Essentials",
    issuer: "CISCO Networking Academy",
    certificateId: "QR (Scanned QR-based)",
    dateOfIssue: "28/01/2025",
    link: "#"
  },
  {
    title: "Data Analytics Intern",
    issuer: "CodeC Technologies India (ICAC)",
    certificateId: "QR",
    dateOfIssue: "07/01/2025",
    link: "#"
  },
  {
    title: "Kharagpur Data Science Hackathon 2025",
    issuer: "IIT Kharagpur",
    certificateId: "Not mentioned",
    dateOfIssue: "03/01/2025",
    link: "#"
  },
  {
    title: "Data Analytics Training",
    issuer: "Internship Studio",
    certificateId: "ISDTAI518429",
    dateOfIssue: "18/10/2024",
    link: "#"
  },
  {
    title: "Excel for Data Analytics",
    issuer: "Infosys Springboard",
    certificateId: "QR",
    dateOfIssue: "08/08/2024",
    link: "#"
  },
  {
    title: "TechA Microsoft for Data Analytics",
    issuer: "Infosys Springboard",
    certificateId: "QR",
    dateOfIssue: "08/08/2024",
    link: "#"
  },
  {
    title: "Data Analytics",
    issuer: "LinkedIn Learning",
    certificateId: "Not mentioned",
    dateOfIssue: "24/07/2024",
    link: "#"
  },
  {
    title: "Data Analytics Using Power BI",
    issuer: "TECH Tip 24",
    certificateId: "QR",
    dateOfIssue: "02/06/2024",
    link: "#"
  },
  {
    title: "Introduction to Cloud Computing",
    issuer: "Coursera",
    certificateId: "Not mentioned",
    dateOfIssue: "03/05/2024",
    link: "#"
  }
];

const Certifications = () => {
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

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {certifications.map((cert, index) => (
            <Card key={index} className="certification-card group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 opacity-60"></div>
              {/* Company Logo Background */}
              <div className="absolute top-2 left-2 w-8 h-8 opacity-20 group-hover:opacity-30 transition-smooth">
                {cert.issuer.toLowerCase().includes('geeksforgeeks') && (
                  <div className="w-full h-full bg-green-500 rounded text-white text-xs font-bold flex items-center justify-center">GFG</div>
                )}
                {cert.issuer.toLowerCase().includes('samatrix') && (
                  <div className="w-full h-full bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">SMX</div>
                )}
                {cert.issuer.toLowerCase().includes('cisco') && (
                  <div className="w-full h-full bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">CISCO</div>
                )}
                {cert.issuer.toLowerCase().includes('iit') && (
                  <div className="w-full h-full bg-orange-500 rounded text-white text-xs font-bold flex items-center justify-center">IIT</div>
                )}
                {cert.issuer.toLowerCase().includes('internship') && (
                  <div className="w-full h-full bg-purple-500 rounded text-white text-xs font-bold flex items-center justify-center">IS</div>
                )}
                {cert.issuer.toLowerCase().includes('infosys') && (
                  <div className="w-full h-full bg-blue-700 rounded text-white text-xs font-bold flex items-center justify-center">INFO</div>
                )}
                {cert.issuer.toLowerCase().includes('linkedin') && (
                  <div className="w-full h-full bg-blue-800 rounded text-white text-xs font-bold flex items-center justify-center">LI</div>
                )}
                {cert.issuer.toLowerCase().includes('tech') && !cert.issuer.toLowerCase().includes('codec') && (
                  <div className="w-full h-full bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center">TECH</div>
                )}
                {cert.issuer.toLowerCase().includes('coursera') && (
                  <div className="w-full h-full bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">CRA</div>
                )}
                {cert.issuer.toLowerCase().includes('codec') && (
                  <div className="w-full h-full bg-red-500 rounded text-white text-xs font-bold flex items-center justify-center">CODE</div>
                )}
              </div>
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
        </div>
      </div>
    </section>
  );
};

export default Certifications;