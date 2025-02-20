import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              Built by{' '}
              <a
                href="https://github.com/lampensau"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Timo Toups (@lampensau)
              </a>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/lampensau/ggo-config-parser"
              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              Released under the{' '}
              <a
                href="https://github.com/lampensau/ggo-config-parser/blob/master/LICENSE"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                MIT License
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}; 