import React, { useState, useRef } from 'react';

import { AnimatedFolderProps, Project } from './types';
import { ProjectCard } from './ProjectCard';
import { ImageLightbox } from './ImageLightbox';
import { cn } from './utils';

export const AnimatedFolder: React.FC<AnimatedFolderProps> = ({ title, projects, className, gradient, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
    const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const previewProjects = projects.slice(0, 5);

    const handleProjectClick = (project: Project, index: number) => {
        const cardEl = cardRefs.current[index];
        if (cardEl) setSourceRect(cardEl.getBoundingClientRect());
        setSelectedIndex(index);
        setHiddenCardId(project.id);
    };

    const handleCloseLightbox = () => { setSelectedIndex(null); setSourceRect(null); };
    const handleCloseComplete = () => { setHiddenCardId(null); };
    const handleNavigate = (newIndex: number) => { setSelectedIndex(newIndex); setHiddenCardId(projects[newIndex]?.id || null); };

    const backBg = gradient || "linear-gradient(135deg, var(--folder-back) 0%, var(--folder-tab) 100%)";
    const tabBg = gradient || "var(--folder-tab)";
    const frontBg = gradient || "linear-gradient(135deg, var(--folder-front) 0%, var(--folder-back) 100%)";

    return (
        <>
            <div
                className={cn("relative flex flex-col items-center justify-center p-8 rounded-3xl cursor-pointer bg-transparent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 group perspective-1000", className)}
                style={{ minWidth: "210px", minHeight: "255px", perspective: "900px" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                {/* Glow effect */}
                <div
                    className="absolute inset-0 rounded-3xl transition-opacity duration-700 pointer-events-none"
                    style={{ width: '100%', height: '100%', background: gradient ? `radial-gradient(circle at 50% 50%, ${gradient.match(/#[a-fA-F0-9]{3,6}/)?.[0] || 'var(--primary)'}20 0%, transparent 60%)` : "radial-gradient(circle at 50% 50%, var(--primary-glow) 0%, transparent 60%)", opacity: isHovered ? 1 : 0 }}
                />

                <div className="relative flex items-center justify-center mb-6" style={{ height: "135px", width: "165px" }}>
                    {/* Back Folder Sheet */}
                    <div className="absolute w-[120px] h-24 rounded-xl shadow-md border border-white/10" style={{ background: backBg, filter: gradient ? "brightness(0.9)" : "none", transformOrigin: "bottom center", transform: isHovered ? "rotateX(-20deg) scaleY(1.05)" : "rotateX(0deg) scaleY(1)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 10 }} />

                    {/* Folder Tab (Top Left) */}
                    <div className="absolute w-12 h-[18px] rounded-t-lg border-t border-x border-white/10" style={{ background: tabBg, filter: gradient ? "brightness(0.85)" : "none", top: "calc(50% - 48px - 10.5px)", left: "calc(50% - 60px + 7.5px)", transformOrigin: "bottom center", transform: isHovered ? "rotateX(-30deg) translateY(-3px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 10 }} />

                    {/* Items inside folder */}
                    <div className="absolute" style={{ top: "45%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}>
                        {previewProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                ref={(el) => { cardRefs.current[index] = el; }}
                                image={project.image}
                                title={project.title}
                                delay={index * 50}
                                isVisible={isHovered}
                                index={index}
                                totalCount={previewProjects.length}
                                onClick={() => handleProjectClick(project, index)}
                                isSelected={hiddenCardId === project.id}
                            />
                        ))}
                    </div>

                    {/* Front Folder Sheet */}
                    <div className="absolute w-[120px] h-24 rounded-xl shadow-lg border border-white/20" style={{ background: frontBg, top: "calc(50% - 48px + 4.5px)", transformOrigin: "bottom center", transform: isHovered ? "rotateX(35deg) translateY(11.25px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 30 }} />

                    {/* Front Gloss/Reflection */}
                    <div className="absolute w-[120px] h-24 rounded-xl overflow-hidden pointer-events-none" style={{ top: "calc(50% - 48px + 4.5px)", background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)", transformOrigin: "bottom center", transform: isHovered ? "rotateX(35deg) translateY(11.25px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 31 }} />
                </div>

                <div className="text-center relative z-40">
                    <h3 className="text-xl font-bold text-foreground mt-2 transition-all duration-500" style={{ transform: isHovered ? "translateY(5px)" : "translateY(0)" }}>{title}</h3>
                    <p className="text-sm font-medium text-muted-foreground transition-all duration-500" style={{ opacity: isHovered ? 0.8 : 1 }}>{projects.length} {projects.length === 1 ? 'project' : 'projects'}</p>
                </div>


            </div>
            <ImageLightbox projects={projects} currentIndex={selectedIndex ?? 0} isOpen={selectedIndex !== null} onClose={handleCloseLightbox} sourceRect={sourceRect} onCloseComplete={handleCloseComplete} onNavigate={handleNavigate} />
        </>
    );
};
