import { FileDown, RotateCcw, Sun, Moon, SunMoon } from 'lucide-react';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ParsedConfig } from '@/types/config';
import Image from 'next/image';

interface HeaderProps {
  parsedData: ParsedConfig | null;
  onExport: () => void;
  onReset: () => void;
  theme: string | undefined;
  onThemeChange: () => void;
  mounted: boolean;
}

const getBasePath = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/ggo-config-parser';
  }
  return '';
};

export const Header: React.FC<HeaderProps> = ({
  parsedData,
  onExport,
  onReset,
  theme,
  onThemeChange,
  mounted
}) => {
  const getThemeIcon = () => {
    if (!mounted) return null;
    if (theme === 'dark') return <Sun className="w-5 h-5" />;
    if (theme === 'light') return <SunMoon className="w-5 h-5" />;
    return <Moon className="w-5 h-5" />;
  };

  const getThemeLabel = () => {
    if (!mounted) return 'Loading theme...';
    if (theme === 'dark') return 'Switch to light mode';
    if (theme === 'light') return 'Switch to system theme';
    return 'Switch to dark mode';
  };

  return (
    <div className="sticky top-0 z-10 bg-emerald-600 dark:bg-emerald-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={`${getBasePath()}/logo-plain.svg`}
            alt="Green-GO Logo"
            width={32}
            height={32}
            className="mr-2 brightness-0 invert"
          />
          <h1 className="text-white text-xl font-semibold">
            Green-GO Config Parser
          </h1>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-3" role="toolbar" aria-label="Main controls">
            {parsedData && (
              <>
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 bg-white dark:bg-gray-200 text-emerald-700 rounded-md hover:bg-emerald-50 dark:hover:bg-gray-300 transition-colors duration-200"
                      onClick={onExport}
                      aria-label="Export to CSV"
                    >
                      <FileDown className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Export to CSV
                  </TooltipContent>
                </TooltipRoot>

                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 bg-emerald-700 dark:bg-emerald-900 text-white rounded-md hover:bg-emerald-800 dark:hover:bg-emerald-950 transition-colors duration-200"
                      onClick={onReset}
                      aria-label="Parse another file"
                    >
                      <RotateCcw className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Parse another file
                  </TooltipContent>
                </TooltipRoot>
              </>
            )}

            <TooltipRoot>
              <TooltipTrigger asChild>
                <button
                  className="p-2 bg-emerald-700 dark:bg-emerald-900 text-white rounded-md hover:bg-emerald-800 dark:hover:bg-emerald-950 transition-colors duration-200"
                  onClick={onThemeChange}
                  aria-label={getThemeLabel()}
                  title={getThemeLabel()}
                >
                  {getThemeIcon()}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {getThemeLabel()}
              </TooltipContent>
            </TooltipRoot>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}; 