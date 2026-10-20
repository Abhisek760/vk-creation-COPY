'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 bg-stone-950 border border-stone-800 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 text-xl font-bold">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-stone-100">
            {this.props.fallbackTitle || 'Kuch galat ho gaya'}
          </h2>
          <p className="text-xs text-stone-400 max-w-md leading-relaxed">
            Module render karte waqt ek unexpected error aayi hai. Aap page refresh karke try kar sakte hain.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition"
            >
              Try Again
            </button>
            <Link
              href="/admin"
              className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-300 text-xs font-bold rounded-xl hover:bg-stone-800 transition"
            >
              Dashboard Par Jayein
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}