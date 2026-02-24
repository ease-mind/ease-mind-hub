import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log error here if needed
    console.error('Error Boundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div style={{ padding: '20px', backgroundColor: '#fdd', color: '#900' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
