import { Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black border-t border-gray-800 py-8 mt-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side - Copyright */}
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} SMDB. All rights reserved.
          </div>
          
          {/* Center - Made with love */}
          <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> by
          </div>
          
          {/* Right side - Creator name */}
          <div className="text-white font-semibold text-lg">
            SHANMUKHA KUMAR KARRA
          </div>
        </div>
        
        {/* Additional info */}
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            Powered by TMDB API • Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
