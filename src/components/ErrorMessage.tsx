import { memo } from 'react';

interface ErrorMessageProps {
  message: string;
  stack?: string;
}

export const ErrorMessage = memo<ErrorMessageProps>(({ message, stack }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900 text-red-900 dark:text-red-50 rounded-lg">
    <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
    <p className="text-sm">{message}</p>
    {stack && (
      <pre className="mt-2 text-xs overflow-auto">
        {stack}
      </pre>
    )}
  </div>
));

ErrorMessage.displayName = 'ErrorMessage'; 