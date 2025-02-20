import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console in production
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900 text-red-900 dark:text-red-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm">{this.state.error?.message}</p>
          <pre className="mt-2 text-xs overflow-auto">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
} 