'use client';

import { useState, useEffect } from 'react';
import { WebinarPopup } from './webinar-popup';

export function PopupWrapper() {
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('hasSeenWebinarPopup');
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    // Mark as seen for this session
    localStorage.setItem('hasSeenWebinarPopup', 'true');
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return <WebinarPopup isOpen={showPopup} onClose={handleClose} />;
}
