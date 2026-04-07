import React from "react";

type AppErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || "Something went wrong while loading this page.",
    };
  }

  componentDidCatch(error: Error) {
    console.error("App render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 text-center">
          <div>
            <h1 className="text-2xl font-serif text-revive-black mb-3">
              This page could not load
            </h1>
            <p className="text-gray-600 max-w-xl">
              {this.state.message}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
