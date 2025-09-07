"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { ExternalLink, Eye, Star, TrendingUp, Clock, Users, Play, X, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebsitePreview } from "@/components/ui/website-preview";
import { portfolioItems } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function Portfolio() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = React.useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

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
        {/* Header */}
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

          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto px-4 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Experience our projects in real-time. Every website is a testament to our commitment to excellence, performance, and results that matter.
          </motion.p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {portfolioItems.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <Card
                variant="glass"
                hover
                className="portfolio-card overflow-hidden cursor-pointer touch-manipulation group relative bg-gradient-to-br from-surface-900/50 to-surface-800/30 backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all duration-500"
                onClick={() => openPreview(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPreview(item.id);
                  }
                }}
                aria-label={`View ${item.title} project details`}
              >
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Browser Mockup Header */}
                  <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-gray-700 rounded px-2 sm:px-3 py-0.5 sm:py-1 mx-2 sm:mx-4">
                      <div className="text-xs sm:text-xs text-gray-300 truncate">{item.liveUrl}</div>
                    </div>
                  </div>
                  
                  {/* Live Website Preview */}
                  <div className="h-64 sm:h-72 lg:h-80 flex-1">
                    <WebsitePreview
                      url={item.liveUrl}
                      title={item.title}
                      description={item.description}
                    />
                  </div>

                  {/* Project Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {item.stack.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 group-hover:bg-primary/30 group-hover:border-primary/50 transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {item.stack.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600/20 text-gray-300 border border-gray-600/30">
                            +{item.stack.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Results */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {item.results.slice(0, 3).map((result, resultIndex) => (
                          <div
                            key={resultIndex}
                            className="text-center p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300"
                          >
                            <div className="text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors duration-300">
                              {result.value}
                            </div>
                            <div className="text-xs text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                              {result.metric}
                            </div>
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
                    </div>
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
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl h-[90vh] bg-surface-900 rounded-2xl border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {portfolioItems.find(p => p.id === selectedProject)?.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {portfolioItems.find(p => p.id === selectedProject)?.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-gray-400 hover:text-white"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closePreview}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="h-[calc(100%-5rem)] p-4">
                <WebsitePreview
                  url={portfolioItems.find(p => p.id === selectedProject)?.liveUrl || ''}
                  title={portfolioItems.find(p => p.id === selectedProject)?.title || ''}
                  description={portfolioItems.find(p => p.id === selectedProject)?.description || ''}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
