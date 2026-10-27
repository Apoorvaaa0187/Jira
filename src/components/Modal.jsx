import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = '560px' }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save element that had focus before opening modal
    previousActiveElement.current = document.activeElement;

    // Prevent body background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modalRef.current
      ? modalRef.current.querySelectorAll(focusableSelector)
      : [];

    if (focusableElements.length > 0) {
      // Small timeout to allow element to render cleanly
      setTimeout(() => {
        focusableElements[0].focus();
      }, 30);
    } else if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Trap focus inside modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = Array.from(modalRef.current.querySelectorAll(focusableSelector));
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to trigger element
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex="-1"
        className="modal-dialog"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 id="modal-title">{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
