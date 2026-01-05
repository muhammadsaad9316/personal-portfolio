import React, { forwardRef } from 'react';
import { ProjectCardProps } from './types';
import { PLACEHOLDER_IMAGE, ANIMATION_TIMING } from './constants';
import { cn } from './utils';

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
    ({ image, title, delay, isVisible, index, totalCount, onClick, isSelected }, ref) => {
        const middleIndex = Math.max(0, (totalCount - 1) / 2);
        const factor = middleIndex > 0 ? (index - middleIndex) / middleIndex : 0;

        const rotation = factor * 20;
        const translationX = factor * 70;
        const translationY = Math.abs(factor) * 10;

        return (
            <div
                ref={ref}
                className={cn(
                    "absolute w-24 h-32 cursor-pointer group/card",
                    isSelected && "opacity-0",
                )}
                style={{
                    transform: isVisible
                        ? `translateY(calc(-110px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
                        : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
                    opacity: isSelected ? 0 : isVisible ? 1 : 0,
                    transition: `all ${ANIMATION_TIMING.card} ${delay}ms`,
                    zIndex: 10 + index,
                    left: "calc(50% - 48px)",
                    top: "calc(50% - 64px)",
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            >
                <div className={cn(
                    "w-full h-full rounded-lg overflow-hidden shadow-xl bg-card border border-white/10 relative",
                    "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "group-hover/card:-translate-y-6 group-hover/card:shadow-2xl group-hover/card:shadow-accent/40 group-hover/card:ring-2 group-hover/card:ring-accent group-hover/card:scale-125"
                )}>
                    <img
                        src={image || PLACEHOLDER_IMAGE}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <p className="absolute bottom-2 left-2 right-2 text-[10px] font-black uppercase tracking-tighter text-white truncate drop-shadow-md">
                        {title}
                    </p>
                </div>
            </div>
        );
    }
);
ProjectCard.displayName = "ProjectCard";
