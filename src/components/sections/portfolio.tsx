"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { ExternalLink, Eye, X, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { portfolioItems } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function Portfolio() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [loadedIframes, setLoadedIframes] = React.useState<Set<string>>(new Set());
  const [blockedIframes, setBlockedIframes] = React.useState<Set<string>>(new Set());

  const openPreview = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const closePreview = () => {
    setSelectedProject(null);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleIframeLoad = (projectId: string) => {
    setLoadedIframes(prev => new Set([...prev, projectId]));
  };

  const handleIframeError = (projectId: string) => {
    setBlockedIframes(prev => new Set([...prev, projectId]));
  };

  return (
    <motion.section
      id="portfolio"
      ref={ref}
      className="py-16 sm:py-20 lg:py-24 bg-black relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(45,137,239,0.08)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.05)_0%,transparent_50%)]"></div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,137,239,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(45,137,239,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
      
      {/* Minimal Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400/60 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-accent-400/60 rounded-full animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-primary-300/60 rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
            Live Work Showcase
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            See Our <span className="text-gradient bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">Live Work</span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto px-4 leading-relaxed">
            Experience our projects in real-time. Every website is a testament to our commitment to excellence, performance, and results that matter.
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {portfolioItems.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Card 
                variant="glass" 
                hover 
                className="portfolio-card overflow-hidden cursor-pointer touch-manipulation group relative bg-gradient-to-br from-surface-900/50 to-surface-800/30 backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all duration-500"
                onClick={() => openPreview(item.id)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  openPreview(item.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.title} project details`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPreview(item.id);
                  }
                }}
              >
                {/* Live Website Preview */}
                <div className="relative h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 overflow-hidden">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 animate-pulse"></div>
                  {/* Browser Mockup */}
                  <div className="absolute inset-0 bg-white rounded-t-2xl overflow-hidden browser-mockup shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
                    <div className="h-6 sm:h-8 bg-gray-100 flex items-center px-2 sm:px-4 space-x-1 sm:space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                      <div className="flex-1 bg-gray-200 rounded px-2 sm:px-3 py-0.5 sm:py-1 mx-2 sm:mx-4">
                        <div className="text-xs sm:text-xs text-gray-500 truncate">{item.liveUrl}</div>
                      </div>
                    </div>
                    
                    {/* Live Website Iframe */}
                    <div className={cn(
                      "h-[calc(100%-1.5rem)] sm:h-[calc(100%-2rem)] relative overflow-hidden iframe-container",
                      loadedIframes.has(item.id) && "iframe-loaded"
                    )}>
                      <iframe
                        src={item.liveUrl}
                        className="portfolio-iframe w-full h-full border-0"
                        title={`${item.title} Live Preview`}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                        loading="lazy"
                        onLoad={() => handleIframeLoad(item.id)}
                        onError={() => handleIframeError(item.id)}
                        style={{
                          opacity: loadedIframes.has(item.id) ? '1' : '0',
                          transform: loadedIframes.has(item.id) ? 'translateY(0)' : 'translateY(20px)',
                          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        referrerPolicy="no-referrer-when-downgrade"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                      
                      {/* Loading State */}
                      {!loadedIframes.has(item.id) && !blockedIframes.has(item.id) && (
                        <div className="iframe-loading">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3 mx-auto"></div>
                            <p className="text-sm text-primary font-medium">Loading live site...</p>
                            <div className="mt-2 w-32 h-1 bg-primary/20 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Blocked/CORS Error State */}
                      {blockedIframes.has(item.id) && (
                        <div className="iframe-loading">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                              <ExternalLink className="w-8 h-8 text-warning" />
                            </div>
                            <p className="text-sm text-warning font-medium mb-2">Preview not available</p>
                            <p className="text-xs text-text-muted mb-4">This site blocks iframe embedding</p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.liveUrl, '_blank');
                              }}
                              className="text-xs"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Live Site
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Hover Overlay - Top to Bottom Animation */}
                      {loadedIframes.has(item.id) && (
                        <div className="absolute inset-0 hover-overlay opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-end justify-center pb-6">
                          <div className="text-center hover-content transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Eye className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-white font-semibold text-sm">Click to view fullscreen</p>
                            <p className="text-white/80 text-xs mt-1">Experience the full website</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Tags */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
                    <div className="flex flex-col sm:flex-row items-end space-y-1 sm:space-y-0 sm:space-x-2">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-primary/20 to-primary/30 backdrop-blur-md rounded-full text-xs font-semibold text-primary border border-primary/40 shadow-lg">
                        {item.industry}
                      </div>
                      <div className="px-3 py-1.5 bg-gradient-to-r from-accent/20 to-accent/30 backdrop-blur-md rounded-full text-xs font-semibold text-accent border border-accent/40 shadow-lg">
                        {item.year}
                      </div>
                    </div>
                  </div>

                  {/* Performance Badge */}
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-20">
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-green-500/20 to-green-400/20 backdrop-blur-md rounded-lg px-2 py-1 sm:px-3 sm:py-2 border border-green-400/30 shadow-lg">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-100 font-semibold">
                        {item.lighthouseScore.performance}% Performance
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 sm:p-6 bg-gradient-to-br from-surface-900/30 to-surface-800/20">
                  {/* Project Info */}
                  <div className="mb-4 sm:mb-5">
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-primary/80 font-medium mb-2 sm:mb-3">{item.client}</p>
                    <p className="text-text-muted text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                    {item.stack.slice(0, 2).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gradient-to-r from-surface-700/50 to-surface-600/50 rounded-lg text-xs font-medium text-text-primary hover:from-primary/20 hover:to-primary/30 hover:text-primary transition-all duration-300 border border-surface-600/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {item.stack.length > 2 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-surface-700/30 to-surface-600/30 rounded-lg text-xs font-medium text-text-muted border border-surface-600/20">
                        +{item.stack.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Key Results */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
                    {item.results.slice(0, 2).map((result, resultIndex) => (
                      <div key={resultIndex} className="text-center p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-accent/5 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300">
                        <div className="text-sm sm:text-lg font-bold text-primary mb-1">{result.value}</div>
                        <div className="text-xs text-text-muted line-clamp-1 mb-1">{result.metric}</div>
                        <div className="text-xs text-success font-semibold line-clamp-1">{result.improvement}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 text-xs sm:text-sm font-medium border-surface-600/50 hover:border-primary/50"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      variant="gradient" 
                      size="sm" 
                      className="group-hover:scale-105 transition-all duration-300 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.liveUrl, '_blank');
                      }}
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Live Site
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <Button
            size="lg"
            variant="outline"
            className="group w-full sm:w-auto bg-gradient-to-r from-surface-800/50 to-surface-700/50 border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-500 font-semibold shadow-lg hover:shadow-xl"
            onClick={() => {
              window.open('/portfolio', '_blank');
            }}
          >
            View All Projects
            <ExternalLink className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
          </Button>
        </motion.div>
      </div>

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 modal-backdrop flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={cn(
                "bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl",
                isFullscreen ? "w-full h-full" : "w-full max-w-6xl h-[90vh] sm:h-[80vh]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="h-10 sm:h-12 bg-gray-100 flex items-center justify-between px-2 sm:px-4">
                <div className="flex items-center space-x-1 sm:space-x-2 flex-1 min-w-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-600 truncate">
                    {portfolioItems.find(p => p.id === selectedProject)?.liveUrl}
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  >
                    {isFullscreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closePreview}
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              {/* Live Website Iframe */}
              <div className="h-[calc(100%-2.5rem)] sm:h-[calc(100%-3rem)]">
                <iframe
                  src={portfolioItems.find(p => p.id === selectedProject)?.liveUrl}
                  className="w-full h-full border-0"
                  title={`${portfolioItems.find(p => p.id === selectedProject)?.title} Live Preview`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
