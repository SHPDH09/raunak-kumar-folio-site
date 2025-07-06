import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import SoftSkills from '@/components/SoftSkills';
import Achievements from '@/components/Achievements';
import Applications from '@/components/Applications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

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
        <Applications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;