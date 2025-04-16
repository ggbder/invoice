
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckSquare, Coffee, Cpu, Zap, Focus, Sparkles, CircuitBoard, Database, Monitor } from 'lucide-react';

const Hero = () => {
  const [activeElement, setActiveElement] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveElement(prev => (prev + 1) % 4);
    }, 3000);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* Form section with enhanced creative design */}
      <div className="relative z-10 max-w-md w-full px-4 fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="bg-white/90 border border-blue-100 p-8 shadow-md backdrop-blur-sm">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold mb-2 tracking-tight font-mono text-blue-800">RapproInvoice</h2>
            <div className="flex items-center justify-center gap-2 mb-1">
              {['Minimal', 'Efficient', 'Precise', 'Powerful'].map((word, i) => (
                <span key={i} className={`text-xs transition-all duration-300 ${activeElement === i ? 'text-blue-600 scale-110' : 'text-gray-400'}`}>
                  {word}
                </span>
              ))}
            </div>
            <div className="inline-flex items-center gap-1 text-sm text-gray-600 font-mono">
              <CircuitBoard size={12} className="text-blue-600" />
              Streamlined invoice management
              <CircuitBoard size={12} className="text-blue-600" />
            </div>
          </div>
          
          <p className="text-center text-gray-600 mb-6">
            Welcome to our invoice management system. Please log in to access the application.
          </p>
            
          <div className="pt-2">
            <Link
              to="/login"
              className="block w-full py-2.5 px-4 text-center relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-blue-500 group-hover:bg-blue-700 group-hover:skew-x-12"></span>
              <span className="absolute inset-0 w-0 h-full transition-all duration-500 ease-out transform skew-x-12 bg-blue-700 group-hover:w-full group-hover:skew-x-0"></span>
              <span className="relative text-white font-mono flex justify-center items-center">
                Login <ArrowRight size={16} className="ml-2" />
              </span>
            </Link>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="mt-6 grid grid-cols-2 gap-3 fade-in" style={{ animationDelay: '0.8s' }}>
          {[
            { icon: <Cpu size={16} />, text: "Engineered Precision" },
            { icon: <Zap size={16} />, text: "Lightning Fast" },
            { icon: <Focus size={16} />, text: "Laser Focused" },
            { icon: <Sparkles size={16} />, text: "Beautiful Design" }
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center p-2 bg-white/80 backdrop-blur-sm border border-blue-50 hover:border-blue-200 transition-all hover:-translate-y-0.5 duration-300 hover:shadow-sm">
              <span className="text-blue-600 mr-2">{feature.icon}</span>
              <span className="text-xs font-mono text-gray-700">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
