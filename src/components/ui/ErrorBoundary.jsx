import React from 'react';
import ErrorScreen from './ErrorScreen';

/**
 * ErrorBoundary — Block 4 / P4
 * Top-level React error boundary. Renders ErrorScreen on failure
 * and offers a "try again" that re-mounts the subtree. Never
 * leaks technical details to the user; logs to the console in
 * development for debugging.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorKey: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log to console for devs; never displayed to the user.
    if (typeof console !== 'undefined' && console.error) {
      console.error('[GreenTrack ErrorBoundary]', error, info?.componentStack);
    }
  }

  handleRetry = () => {
    // Bump the key to re-mount the children subtree.
    this.setState((prev) => ({ hasError: false, errorKey: prev.errorKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return <ErrorScreen onRetry={this.handleRetry} />;
    }
    return (
      <React.Fragment key={this.state.errorKey}>
        {this.props.children}
      </React.Fragment>
    );
  }
}