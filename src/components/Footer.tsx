import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 text-center text-gray-600">
      <div className="flex items-center justify-center gap-2">
        <p>Built by Your Name for Internshala Assignment</p>
        <a
          href="https://github.com/yourusername/feedback-collector"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
      <p className="mt-2 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
    </footer>
  );
};

export default Footer;