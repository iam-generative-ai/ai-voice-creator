
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DesktopNav from "./DesktopNav";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md shadow-sm' : ''}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/1ebffb6b-686a-4a62-b04d-c1b3c61a9245.png" 
                alt="AI Voice Creator Logo" 
                className="h-10 w-auto mr-2" 
              />
              <span className="text-2xl font-bold text-gradient">Voice Creator</span>
            </div>
          </Link>
        </div>

        <DesktopNav />
      </div>
    </header>
  );
};

export default Header;
