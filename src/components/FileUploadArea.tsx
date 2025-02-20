import { Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadAreaProps {
  isDragging: boolean;
  error: string | null;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  isLoading?: boolean;
}

// Create a custom type for the simulated drag event
type SimulatedDragEvent = Pick<React.DragEvent<HTMLDivElement>, 'preventDefault' | 'dataTransfer'>;

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  isDragging,
  error,
  onDrop,
  onDragOver,
  onDragLeave,
  isLoading = false,
}) => {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-6">
        <div
          className={`rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
            ${isDragging
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500'
              : 'bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }
            ${error ? 'border-red-500 bg-red-50 dark:bg-red-950/50' : ''}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => document.getElementById('file-input')?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drop zone for configuration file"
          onKeyPress={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              document.getElementById('file-input')?.click();
            }
          }}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mx-auto" />
          ) : (
            <input
              type="file"
              id="file-input"
              className="sr-only"
              accept=".gg5"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  const event: SimulatedDragEvent = {
                    preventDefault: () => { },
                    dataTransfer: { files: [file] }
                  };
                  onDrop(event as React.DragEvent<HTMLDivElement>);
                }
              }}
              aria-label="Upload configuration file"
            />
          )}
          <Upload className="w-16 h-16 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <p className="text-lg mb-2 font-medium text-gray-700 dark:text-gray-200">
            Drag and drop your configuration file here
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            (Only supports Green-GO <code>.gg5</code> configuration files)
          </p>
          {error && (
            <p className="text-red-500 dark:text-red-400 mt-4" role="alert">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 