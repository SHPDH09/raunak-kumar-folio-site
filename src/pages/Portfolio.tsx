import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import SoftSkills from '@/components/SoftSkills';
import Achievements from '@/components/Achievements';
import Certifications from '@/components/Certifications';
import Applications from '@/components/Applications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ChatBox from '@/components/ChatBox';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <About />
        <Projects />
        <Experience />
        <SoftSkills />
        <Achievements />
        <Certifications />
        <Applications />
        <Contact />
      </main>
      <Footer />
      <ChatBox />
    </div>
  );
};

export default Portfolio;