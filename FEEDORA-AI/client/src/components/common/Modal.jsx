import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  const scrollRef = useRef(null);
  const modalBoxRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    previouslyFocusedRef.current = document.activeElement;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollY = window.scrollY;

    // Lock body scrolling cleanly
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    // Focus the modal content container or close button for keyboard accessibility
    const timer = setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      } else if (scrollRef.current) {
        scrollRef.current.focus();
      }
    }, 50);

    // Reset scroll to top
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap within modal
      if (e.key === 'Tab' && modalBoxRef.current) {
        const focusableElements = modalBoxRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);

      // Restore scroll position
      window.scrollTo(0, scrollY);

      // Restore focus to opener
      if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === 'function') {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={modalBoxRef}
        className={`relative w-full ${maxWidth} flex flex-col bg-white dark:bg-[#16161D] rounded-2xl shadow-elevated border border-stone-200 dark:border-[#262633] overflow-hidden my-auto animate-scaleIn`}
        style={{
          maxHeight: 'min(90dvh, 780px)',
          height: 'auto'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Sticky Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200 dark:border-[#262633] bg-white/95 dark:bg-[#16161D]/95 backdrop-blur-sm z-10">
          <h3
            id="modal-title"
            className="text-sm sm:text-base font-bold text-text-primary dark:text-[#F4F2ED] tracking-tight truncate pr-4"
          >
            {title}
          </h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#232330] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-5 text-stone-700 dark:text-[#E2DFD8] focus:outline-none"
          tabIndex={0}
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
