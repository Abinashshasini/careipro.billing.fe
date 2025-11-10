'use client';
import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  showOnHover?: boolean;
  showOnFocus?: boolean;
  offset?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200,
  disabled = false,
  className = '',
  contentClassName = '',
  showOnHover = true,
  showOnFocus = true,
  offset = 8,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Auto-adjust position if tooltip would go off-screen
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newPosition = position;

      // Check if tooltip goes off-screen and adjust
      if (position === 'top' && rect.top - tooltipRect.height - offset < 0) {
        newPosition = 'bottom';
      } else if (
        position === 'bottom' &&
        rect.bottom + tooltipRect.height + offset > viewportHeight
      ) {
        newPosition = 'top';
      } else if (
        position === 'left' &&
        rect.left - tooltipRect.width - offset < 0
      ) {
        newPosition = 'right';
      } else if (
        position === 'right' &&
        rect.right + tooltipRect.width + offset > viewportWidth
      ) {
        newPosition = 'left';
      }

      setActualPosition(newPosition);
    }
  }, [isVisible, position, offset]);

  // Get position classes
  const getPositionClasses = () => {
    const baseClasses = 'absolute z-50';

    switch (actualPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-${
          offset === 8 ? '2' : '1'
        }`;
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-${
          offset === 8 ? '2' : '1'
        }`;
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-${
          offset === 8 ? '2' : '1'
        }`;
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-${
          offset === 8 ? '2' : '1'
        }`;
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
    }
  };

  // Get arrow classes
  const getArrowClasses = () => {
    const arrowSize = 'w-0 h-0 absolute';

    switch (actualPosition) {
      case 'top':
        return `${arrowSize} top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800`;
      case 'bottom':
        return `${arrowSize} bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800`;
      case 'left':
        return `${arrowSize} left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800`;
      case 'right':
        return `${arrowSize} right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800`;
      default:
        return `${arrowSize} top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800`;
    }
  };

  const handleMouseEnter = () => {
    if (showOnHover) showTooltip();
  };

  const handleMouseLeave = () => {
    if (showOnHover) hideTooltip();
  };

  const handleFocus = () => {
    if (showOnFocus) showTooltip();
  };

  const handleBlur = () => {
    if (showOnFocus) hideTooltip();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`relative inline-block ${className}`}
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}

      {isVisible && !disabled && (
        <div ref={tooltipRef} className={getPositionClasses()}>
          <div
            className={`px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap transition-opacity duration-200 ${contentClassName}`}
          >
            {content}
          </div>
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
