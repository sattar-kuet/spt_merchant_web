"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

type SidebarContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
);

export const SidebarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const open = () => {
    if (mountedRef.current) setIsOpen(true);
  };
  const close = () => {
    if (mountedRef.current) setIsOpen(false);
  };
  const toggle = () => {
    if (mountedRef.current) setIsOpen((s) => !s);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export default SidebarContext;
