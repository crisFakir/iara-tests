import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string) => void;
  emit: (event: string, data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [listeners] = useState(new Map<string, Set<(data: any) => void>>());

  useEffect(() => {
    // In a real app, connect to WebSocket server
    // For now, just mock the connection
    setIsConnected(true);

    return () => {
      setIsConnected(false);
    };
  }, []);

  const subscribe = (event: string, callback: (data: any) => void) => {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event)?.add(callback);
  };

  const unsubscribe = (event: string) => {
    listeners.delete(event);
  };

  const emit = (event: string, data: any) => {
    console.log('WebSocket emit:', event, data);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, unsubscribe, emit }}>
      {children}
    </WebSocketContext.Provider>
  );
};