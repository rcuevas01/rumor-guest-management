"use client";

import React, { useEffect } from 'react';
import { useGuestStore } from '@/store/useGuestStore';

export function ThemeProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const darkMode = useGuestStore(state => state.darkMode);
  
  // Use an effect to update the class on the document element
  useEffect(() => {
    // Update the class on the document element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // We don't need to wrap the children, just return them
  return <>{children}</>;
}