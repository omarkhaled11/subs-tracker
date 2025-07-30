interface ErrorReport {
  error: string;
  stack?: string;
  componentStack?: string | null;
  timestamp: string;
  userAgent?: string;
  appVersion: string;
}

class ErrorLogger {
  private errors: ErrorReport[] = [];
  private maxErrors = 50;

  logError(error: Error, errorInfo?: React.ErrorInfo) {
    const errorReport: ErrorReport = {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack || null,
      timestamp: new Date().toISOString(),
      appVersion: '1.0.0',
    };

    this.errors.unshift(errorReport);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (__DEV__) {
      console.error('🔴 Application Error:', errorReport);
    }

    // In production, you might want to send to a crash reporting service
    // this.sendToAnalytics(errorReport);
  }

  getRecentErrors(count: number = 10): ErrorReport[] {
    return this.errors.slice(0, count);
  }

  clearErrors() {
    this.errors = [];
  }

  // Placeholder for analytics integration
  private sendToAnalytics(errorReport: ErrorReport) {
    // TODO: Integrate with crash reporting service like Sentry, Bugsnag, etc.
    // Example:
    // Sentry.captureException(new Error(errorReport.error), {
    //   extra: errorReport
    // });
  }
}

export const errorLogger = new ErrorLogger();