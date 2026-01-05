import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageLightboxProps } from './types';
import { PLACEHOLDER_IMAGE } from './constants';
import { cn } from './utils';
import { useLightboxAnimation, useLightboxKeyboard, useLightboxNavigation } from './hooks';

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
    projects,
    currentIndex,
    isOpen,
    onClose,
    sourceRect,
    onCloseComplete,
    onNavigate,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        animationPhase,
        isClosing,
        shouldRender,
        handleClose,
    } = useLightboxAnimation({
        isOpen, sourceRect, onCloseComplete: () => {
            onClose(); // Call the prop onClose
            onCloseComplete?.();
        }
    });

    // We need to override the handleClose from the hook to actually call the props.
    // The hook calls setClosing etc.
    // Actually the hook's handleClose takes a callback.
    // Let's adjust usage:
    const onModalClose = () => handleClose(onClose);

    const {
        internalIndex,
        isSliding,
        hasNext,
        hasPrev,
        navigateNext,
        navigatePrev,
        handleDotClick,
    } = useLightboxNavigation({
        currentIndex,
        totalCount: projects.length,
        isOpen,
        onNavigate,
    });

    useLightboxKeyboard({
        isOpen,
        onClose: onModalClose,
        onNext: navigateNext,
        onPrev: navigatePrev,
    });

    const currentProject = projects[internalIndex];

    if (!shouldRender || !currentProject || typeof document === 'undefined') return null;

    const getInitialStyles = (): React.CSSProperties => {
        if (!sourceRect) return {};
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const targetWidth = Math.min(900, viewportWidth - 32);
        const targetHeight = Math.min(viewportHeight * 0.9, 700);

        const targetX = (viewportWidth - targetWidth) / 2;
        const targetY = (viewportHeight - targetHeight) / 2;
        const scaleX = sourceRect.width / targetWidth;
        const scaleY = sourceRect.height / targetHeight;
        const scale = Math.max(scaleX, scaleY);
        const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2) + window.scrollX;
        const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2) + window.scrollY;
        return {
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            opacity: 0.5,
            borderRadius: "12px",
        };
    };

    const getFinalStyles = (): React.CSSProperties => ({
        transform: "translate(0, 0) scale(1)",
        opacity: 1,
        borderRadius: "24px",
    });

    const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles();

    return createPortal(
        <div
            className={cn("fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8")}
            onClick={onModalClose}
            style={{
                opacity: isClosing ? 0 : 1,
                transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            <div
                className="absolute inset-0 bg-background/95 backdrop-blur-3xl"
                style={{
                    opacity: (animationPhase === "initial" && !isClosing) ? 0 : 1,
                    transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            />
            <button
                onClick={(e) => { e.stopPropagation(); onModalClose(); }}
                className={cn(
                    "absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-muted/50 backdrop-blur-xl border border-white/10 shadow-2xl text-foreground hover:bg-muted transition-all duration-300",
                )}
                style={{
                    opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                    transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-30px)",
                    transition: "opacity 400ms ease-out 400ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                }}
            >
                <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Navigation Buttons */}
            <button
                onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
                disabled={!hasPrev || isSliding}
                className={cn(
                    "absolute left-4 md:left-10 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-muted/30 backdrop-blur-xl border border-white/10 text-foreground hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none shadow-2xl",
                )}
                style={{
                    opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
                    transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(-40px)",
                    transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
                }}
            >
                <ChevronLeft className="w-6 h-6" strokeWidth={3} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); navigateNext(); }}
                disabled={!hasNext || isSliding}
                className={cn(
                    "absolute right-4 md:right-10 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-muted/30 backdrop-blur-xl border border-white/10 text-foreground hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none shadow-2xl",
                )}
                style={{
                    opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
                    transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(40px)",
                    transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
                }}
            >
                <ChevronRight className="w-6 h-6" strokeWidth={3} />
            </button>

            {/* Main Content Card */}
            <div
                ref={containerRef}
                className="relative z-10 w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
                style={{
                    ...currentStyles,
                    transform: isClosing ? "translate(0, 0) scale(0.92)" : currentStyles.transform,
                    transition: animationPhase === "initial" && !isClosing ? "none" : "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out, border-radius 700ms ease",
                    transformOrigin: "center center",
                }}
            >
                <div className={cn("relative overflow-hidden rounded-[inherit] bg-card border border-white/10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col h-full md:h-auto")}>
                    <div className="relative overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-black/50">
                        <div
                            className="flex w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            style={{
                                transform: `translateX(-${internalIndex * 100}%)`,
                                transition: isSliding ? "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                            }}
                        >
                            {projects.map((project, idx) => (
                                <div key={project.id} className="min-w-full h-full relative flex items-center justify-center">
                                    <img
                                        src={project.image || PLACEHOLDER_IMAGE}
                                        alt={project.title}
                                        className="w-full h-full object-contain md:object-cover select-none"
                                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className={cn("px-6 py-6 md:px-8 md:py-8 bg-card border-t border-white/5 flex flex-col md:flex-row gap-6 md:items-center justify-between")}
                        style={{
                            opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
                            transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(20px)",
                            transition: "opacity 500ms ease-out 500ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 500ms",
                        }}
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight truncate">{currentProject?.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                                {/* Dots indicator */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full border border-white/5">
                                    {projects.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleDotClick(idx)}
                                            className={cn("w-1.5 h-1.5 rounded-full transition-all duration-500", idx === internalIndex ? "bg-primary scale-150" : "bg-muted-foreground/40 hover:bg-muted-foreground/70")}
                                        />
                                    ))}
                                </div>
                                {currentProject?.tags && (
                                    <div className="flex gap-2">
                                        {currentProject.tags.split(',').slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs font-mono font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {currentProject?.demoUrl && (
                            <a
                                href={currentProject.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn("flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95")}
                            >
                                <span>View Live</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
