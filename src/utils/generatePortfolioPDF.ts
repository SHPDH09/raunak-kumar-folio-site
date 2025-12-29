import jsPDF from 'jspdf';

const portfolioData = {
  name: "Raunak Kumar",
  title: "AI & ML Developer | Data Analyst | Data Visualization",
  email: "raunakkumar70091@gmail.com",
  phone: "+91 7903aborar070091",
  location: "India",
  linkedin: "linkedin.com/in/raunak-kumar-766328248",
  github: "github.com/SHPDH09",
  dob: "21-05-2003",
  
  summary: `Passionate technology enthusiast currently pursuing Bachelor's in Computer Applications with specialization in Artificial Intelligence & Data Analytics at LNCT University. Driven by curiosity and a desire to create solutions that make a real impact on people's lives.`,
  
  programmingSkills: [
    'Python', 'Java', 'C', 'C++', 'SQL', 'HTML', 'CSS', 'JavaScript', 'R Programming', 'Flask'
  ],
  
  frameworks: [
    'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'TensorFlow', 
    'NLTK', 'Selenium', 'OpenCV', 'Tkinter', 'Streamlit', 'Power BI', 'SAS'
  ],
  
  interests: [
    'Data Analytics & Visualization', 'Machine Learning & AI', 'Java OOPs Concepts',
    'Competitive Programming (DSA)', 'Automation', 'Data Engineering', 'Google Analytics'
  ],
  
  education: [
    {
      degree: "Bachelor of Computer Applications (AIDA)",
      institution: "LNCT University",
      duration: "2023 - 2026",
      cgpa: "8.84/10",
      details: "Specializing in Artificial Intelligence & Data Analytics"
    },
    {
      degree: "Intermediate (12th Grade)",
      institution: "BSEB PATNA",
      duration: "2019 - 2021",
      percentage: "62%",
      details: "Science Stream"
    },
    {
      degree: "Matriculation (10th Grade)",
      institution: "BSEB PATNA",
      duration: "2018 - 2019",
      percentage: "60%",
      details: "Secondary Education"
    }
  ],
  
  experience: [
    {
      title: "Python Development Intern",
      company: "Code Clouse PVT. LTD. (Remote)",
      duration: "Jun 2024 - Aug 2024",
      achievements: [
        "Built robust Python applications with efficient algorithms",
        "Integrated APIs using Pandas, NumPy, and Flask",
        "Delivered scalable and user-friendly solutions"
      ]
    }
  ],
  
  projects: [
    {
      name: "AI Startup Idea Validator",
      description: "AI-powered web app for evaluating startup ideas with market analysis and profitability scores",
      tech: "Next.js, Node.js, MongoDB, OpenAI"
    },
    {
      name: "Data Navigator AI",
      description: "AI-powered data analysis platform with conversational interface using RAG architecture",
      tech: "Python, LangChain, Streamlit, OpenAI"
    },
    {
      name: "Real-Time Railway Announcement System",
      description: "Digital railway announcements with multilingual support and real-time schedule updates",
      tech: "Python, gTTS, Tkinter, Pandas"
    },
    {
      name: "AI Based Medical Diagnosis System",
      description: "Healthcare diagnostic using ML for disease prediction based on symptoms",
      tech: "Python, Scikit-learn, Streamlit, Pandas"
    },
    {
      name: "FinancialFlow Banking System",
      description: "Secure banking application with transaction management and authentication",
      tech: "Java, OOP, File Handling"
    },
    {
      name: "MCQ Quiz Application",
      description: "Interactive quiz platform with timer and detailed result analysis",
      tech: "Python, Tkinter, SQLite"
    }
  ],
  
  certifications: [
    "Python Development - Code Clouse",
    "Data Analytics - Various Platforms",
    "Machine Learning Fundamentals",
    "Power BI Data Visualization"
  ]
};

export const generatePortfolioPDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = 20;

  // Colors
  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo
  const accentColor: [number, number, number] = [16, 185, 129]; // Emerald
  const textColor: [number, number, number] = [31, 41, 55]; // Dark gray
  const mutedColor: [number, number, number] = [107, 114, 128]; // Gray

  // Helper functions
  const addHeader = () => {
    // Header background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(portfolioData.name, margin, 25);
    
    // Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(portfolioData.title, margin, 35);
    
    // Contact info on right
    doc.setFontSize(9);
    doc.text(portfolioData.email, pageWidth - margin, 20, { align: 'right' });
    doc.text(portfolioData.phone, pageWidth - margin, 27, { align: 'right' });
    doc.text(portfolioData.location, pageWidth - margin, 34, { align: 'right' });
    doc.text(portfolioData.linkedin, pageWidth - margin, 41, { align: 'right' });
    
    y = 60;
  };

  const addSectionTitle = (title: string) => {
    checkNewPage(15);
    doc.setFillColor(...accentColor);
    doc.rect(margin, y - 5, 3, 12, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 8, y + 3);
    y += 12;
  };

  const addText = (text: string, size: number = 10, color: [number, number, number] = textColor) => {
    doc.setTextColor(...color);
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    checkNewPage(lines.length * 5);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
  };

  const addBulletPoint = (text: string) => {
    checkNewPage(8);
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFillColor(...accentColor);
    doc.circle(margin + 2, y - 1.5, 1.5, 'F');
    const lines = doc.splitTextToSize(text, contentWidth - 10);
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 2;
  };

  const checkNewPage = (requiredSpace: number) => {
    if (y + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const addSkillBadges = (skills: string[]) => {
    let x = margin;
    const badgeHeight = 6;
    const padding = 4;
    
    skills.forEach((skill) => {
      const textWidth = doc.getTextWidth(skill) + padding * 2;
      
      if (x + textWidth > pageWidth - margin) {
        x = margin;
        y += badgeHeight + 4;
      }
      
      checkNewPage(badgeHeight + 4);
      
      // Badge background
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(x, y - 4, textWidth, badgeHeight, 2, 2, 'F');
      
      // Badge border
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y - 4, textWidth, badgeHeight, 2, 2, 'S');
      
      // Badge text
      doc.setTextColor(...primaryColor);
      doc.setFontSize(8);
      doc.text(skill, x + padding, y);
      
      x += textWidth + 3;
    });
    
    y += 10;
  };

  // Generate PDF content
  addHeader();

  // Summary
  addSectionTitle('PROFESSIONAL SUMMARY');
  addText(portfolioData.summary);
  y += 5;

  // Programming Skills
  addSectionTitle('PROGRAMMING SKILLS');
  addSkillBadges(portfolioData.programmingSkills);

  // Frameworks & Libraries
  addSectionTitle('FRAMEWORKS & LIBRARIES');
  addSkillBadges(portfolioData.frameworks);

  // Education
  addSectionTitle('EDUCATION');
  portfolioData.education.forEach((edu) => {
    checkNewPage(25);
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(edu.degree, margin, y);
    
    doc.setTextColor(...mutedColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(edu.duration, pageWidth - margin, y, { align: 'right' });
    y += 5;
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.text(edu.institution, margin, y);
    y += 5;
    
    doc.setTextColor(...mutedColor);
    doc.setFontSize(9);
    const grade = edu.cgpa || edu.percentage;
    doc.text(`${edu.details} | ${grade}`, margin, y);
    y += 10;
  });

  // Experience
  addSectionTitle('EXPERIENCE');
  portfolioData.experience.forEach((exp) => {
    checkNewPage(30);
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(exp.title, margin, y);
    
    doc.setTextColor(...mutedColor);
    doc.setFontSize(9);
    doc.text(exp.duration, pageWidth - margin, y, { align: 'right' });
    y += 5;
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(exp.company, margin, y);
    y += 7;
    
    exp.achievements.forEach((achievement) => {
      addBulletPoint(achievement);
    });
    y += 3;
  });

  // Projects
  addSectionTitle('PROJECTS');
  portfolioData.projects.forEach((project) => {
    checkNewPage(20);
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(project.name, margin, y);
    y += 5;
    
    doc.setTextColor(...mutedColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(project.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 4 + 2;
    
    doc.setTextColor(...accentColor);
    doc.setFontSize(8);
    doc.text(`Tech: ${project.tech}`, margin, y);
    y += 8;
  });

  // Interests
  addSectionTitle('LEARNING INTERESTS');
  addSkillBadges(portfolioData.interests);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setTextColor(...mutedColor);
  doc.setFontSize(8);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | ${portfolioData.github}`, pageWidth / 2, footerY, { align: 'center' });

  // Save
  doc.save('Raunak_Kumar_Portfolio.pdf');
};

export default generatePortfolioPDF;
