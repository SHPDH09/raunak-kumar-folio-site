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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <Card key={index} className="hover:shadow-elegant transition-smooth group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Award className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <Badge variant="secondary" className="text-xs">
                    {cert.issuer}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-smooth">
                  {cert.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {cert.dateOfIssue}
                </div>
                
                {cert.certificateId !== "Not mentioned" && (
                  <div className="text-sm">
                    <span className="font-medium">Certificate ID: </span>
                    <span className="text-muted-foreground">{cert.certificateId}</span>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth"
                  onClick={() => window.open(cert.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Certificate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;