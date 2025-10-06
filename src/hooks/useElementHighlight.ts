'use client';

import { useState, useCallback, useEffect } from 'react';
import { scrollToElement } from '@/features/playback/utils/scroll-helper';

const HIGHLIGHT_CLASS = 'demo-playback-highlight';
const PULSE_ANIMATION_ID = 'demo-playback-pulse-animation';

export function useElementHighlight() {
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  // Inject CSS for highlight animation on mount
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Check if styles already exist
    if (document.getElementById(PULSE_ANIMATION_ID)) return;

    const style = document.createElement('style');
    style.id = PULSE_ANIMATION_ID;
    style.textContent = `
      @keyframes demo-pulse {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3),
                      0 0 20px rgba(59, 130, 246, 0.5);
        }
        50% {
          transform: scale(1.02);
          box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2),
                      0 0 30px rgba(59, 130, 246, 0.6);
        }
      }

      .${HIGHLIGHT_CLASS} {
        position: fixed !important;
        border: 3px solid #3b82f6 !important;
        border-radius: 8px !important;
        pointer-events: none !important;
        z-index: 999999 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        animation: demo-pulse 2s ease-in-out infinite !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3),
                    0 0 20px rgba(59, 130, 246, 0.5) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(PULSE_ANIMATION_ID);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const highlightElement = useCallback((element: Element | null) => {
    // Remove previous highlights
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => el.remove());

    if (!element) {
      setHighlightedElement(null);
      return;
    }

    // Scroll element into view first
    scrollToElement(element, { behavior: 'smooth', block: 'center' });

    // Wait a bit for scroll to start, then create highlight
    setTimeout(() => {
      const rect = element.getBoundingClientRect();

      // Create highlight overlay
      const highlight = document.createElement('div');
      highlight.className = HIGHLIGHT_CLASS;
      highlight.style.top = `${rect.top - 5}px`;
      highlight.style.left = `${rect.left - 5}px`;
      highlight.style.width = `${rect.width + 10}px`;
      highlight.style.height = `${rect.height + 10}px`;

      document.body.appendChild(highlight);

      // Update position on scroll/resize
      const updatePosition = () => {
        const newRect = element.getBoundingClientRect();
        highlight.style.top = `${newRect.top - 5}px`;
        highlight.style.left = `${newRect.left - 5}px`;
        highlight.style.width = `${newRect.width + 10}px`;
        highlight.style.height = `${newRect.height + 10}px`;
      };

      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });

      // Cleanup listeners when highlight is removed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === highlight) {
              window.removeEventListener('scroll', updatePosition);
              window.removeEventListener('resize', updatePosition);
              observer.disconnect();
            }
          });
        });
      });

      observer.observe(document.body, { childList: true });

      setHighlightedElement(element);
    }, 100);
  }, []);

  const clearHighlight = useCallback(() => {
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => el.remove());
    setHighlightedElement(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearHighlight();
    };
  }, [clearHighlight]);

  return {
    highlightElement,
    clearHighlight,
    highlightedElement
  };
}
