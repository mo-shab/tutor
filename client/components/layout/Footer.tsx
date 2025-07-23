// client/components/layout/Footer.tsx
import { Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-300">&copy; {new Date().getFullYear()} TutorPlatform. All Rights Reserved.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connecting Students and Tutors Worldwide</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
