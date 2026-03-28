'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealOnScrollProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    delay?: number;
    duration?: number;
    threshold?: number;
    blur?: boolean;
}

export function RevealOnScroll({
    children,
    className,
    direction = 'up',
    delay = 0,
    duration = 700,
    threshold = 0.1,
    blur = true
}: RevealOnScrollProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const getTransform = () => {
        switch (direction) {
            case 'up': return 'perspective(1000px) rotateX(20deg) translate-y-32 scale-90';
            case 'down': return 'perspective(1000px) rotateX(-20deg) -translate-y-32 scale-90';
            case 'left': return 'perspective(1000px) rotateY(10deg) translate-x-32 scale-90';
            case 'right': return 'perspective(1000px) rotateY(-10deg) -translate-x-32 scale-90';
            case 'none': return 'scale-95';
            default: return 'perspective(1000px) rotateX(10deg) translate-y-20 scale-95';
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                "transform-gpu will-change-transform backface-visibility-hidden", // Hardware acceleration hints
                className
            )}
            style={{
                transitionProperty: 'opacity, transform, filter',
                transitionDuration: `${duration}ms`,
                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // Premium "Soft Spring" feel
                transitionDelay: `${delay}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate(0, 0) scale(1)' : getTransform(),
                filter: blur ? (isVisible ? 'blur(0)' : 'blur(12px)') : 'none'
            }}
        >
            {children}
        </div>
    );
}
