"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, RefreshCw, Eye, AlertCircle, CheckCircle, Globe, Smartphone, Monitor } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface WebsitePreviewProps {
  url: string;
  title: string;
  description: string;
  fallbackImage?: string;
  isLive?: boolean;
}

export function WebsitePreview({ url, title, description, fallbackImage, isLive = true }: WebsitePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate screenshot URL using a screenshot API
  const getScreenshotUrl = (url: string) => {
    // Using a free screenshot API service
    const encodedUrl = encodeURIComponent(url);
    return `https://api.screenshotone.com/take?access_key=demo&url=${encodedUrl}&viewport_width=1200&viewport_height=800&device_scale_factor=1&format=png&image_quality=80&block_ads=true&block_cookie_banners=true&block_banners_by_heuristics=true&block_trackers=true&delay=2&timeout=10`;
  };

  // Alternative screenshot services
  const getAlternativeScreenshot = (url: string, service: 'screenshotapi' | 'htmlcsstoimage' | 'urlbox') => {
    const encodedUrl = encodeURIComponent(url);
    switch (service) {
      case 'screenshotapi':
        return `https://shot.screenshotapi.net/screenshot?token=demo&url=${encodedUrl}&width=1200&height=800&fresh=true&output=image&file_type=png`;
      case 'htmlcsstoimage':
        return `https://hcti.io/v1/image?url=${encodedUrl}&width=1200&height=800`;
      case 'urlbox':
        return `https://api.urlbox.io/v1/demo/png?url=${encodedUrl}&width=1200&height=800&device=desktop`;
      default:
        return getScreenshotUrl(url);
    }
  };

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
    setShowScreenshot(true);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLoading(true);
    setError(false);
    setShowScreenshot(false);
    
    // Force iframe reload
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleScreenshotClick = () => {
    setShowScreenshot(true);
  };

  // Generate mock website content based on title
  const generateMockContent = () => {
    const mockTitles = {
      'E-commerce Store': 'Shop Now - Premium Products',
      'Business Website': 'Welcome to Our Business',
      'SaaS Platform': 'Streamline Your Workflow',
      'Portfolio Site': 'Creative Portfolio',
      'Landing Page': 'Convert More Visitors'
    };
    
    const mockTitle = mockTitles[title as keyof typeof mockTitles] || title;
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${mockTitle}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            overflow-x: hidden;
          }
          .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          .header { padding: 20px 0; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
          .nav { display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 24px; font-weight: bold; }
          .nav-links { display: flex; gap: 30px; }
          .nav-links a { color: white; text-decoration: none; transition: opacity 0.3s; }
          .nav-links a:hover { opacity: 0.8; }
          .hero { text-align: center; padding: 100px 0; }
          .hero h1 { font-size: 48px; margin-bottom: 20px; font-weight: 700; }
          .hero p { font-size: 20px; margin-bottom: 30px; opacity: 0.9; }
          .cta-button { 
            background: #ff6b6b; 
            color: white; 
            padding: 15px 30px; 
            border: none; 
            border-radius: 50px; 
            font-size: 18px; 
            cursor: pointer;
            transition: transform 0.3s;
          }
          .cta-button:hover { transform: translateY(-2px); }
          .features { padding: 80px 0; background: rgba(255,255,255,0.05); }
          .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 40px; }
          .feature { text-align: center; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 15px; }
          .feature h3 { font-size: 24px; margin-bottom: 15px; }
          .feature p { opacity: 0.8; line-height: 1.6; }
          .footer { text-align: center; padding: 40px 0; background: rgba(0,0,0,0.2); }
          @media (max-width: 768px) {
            .hero h1 { font-size: 32px; }
            .hero p { font-size: 16px; }
            .nav-links { display: none; }
          }
        </style>
      </head>
      <body>
        <header class="header">
          <div class="container">
            <nav class="nav">
              <div class="logo">${title.split(' ')[0]}</div>
              <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#contact">Contact</a>
              </div>
            </nav>
          </div>
        </header>
        
        <main>
          <section class="hero">
            <div class="container">
              <h1>${mockTitle}</h1>
              <p>${description}</p>
              <button class="cta-button">Get Started</button>
            </div>
          </section>
          
          <section class="features">
            <div class="container">
              <h2 style="text-align: center; font-size: 36px; margin-bottom: 20px;">Why Choose Us?</h2>
              <div class="features-grid">
                <div class="feature">
                  <h3>Fast & Reliable</h3>
                  <p>Lightning-fast performance with 99.9% uptime guarantee</p>
                </div>
                <div class="feature">
                  <h3>Modern Design</h3>
                  <p>Beautiful, responsive design that works on all devices</p>
                </div>
                <div class="feature">
                  <h3>24/7 Support</h3>
                  <p>Round-the-clock support to help you succeed</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <footer class="footer">
          <div class="container">
            <p>&copy; 2024 ${title}. All rights reserved.</p>
          </div>
        </footer>
      </body>
      </html>
    `;
  };

  const mockWebsiteDataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(generateMockContent())}`;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-surface-900/50 to-surface-800/30 backdrop-blur-xl border border-white/10 hover:border-primary/30 transition-all duration-500 group">
      <div className="relative">
        {/* Device Frame */}
        <div className={`relative mx-auto ${deviceView === 'desktop' ? 'w-full' : 'w-80'} ${deviceView === 'mobile' ? 'max-w-sm' : ''}`}>
          {/* Browser Header */}
          <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-xs text-gray-300 ml-4">
              {url}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setDeviceView(deviceView === 'desktop' ? 'mobile' : 'desktop')}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                {deviceView === 'desktop' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className={`bg-white ${deviceView === 'mobile' ? 'h-96' : 'h-80'} relative overflow-hidden`}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading website...</p>
                </div>
              </div>
            )}

            {error && !showScreenshot && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center p-6">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview Unavailable</h3>
                  <p className="text-sm text-gray-600 mb-4">This website cannot be displayed in preview mode.</p>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      onClick={handleRetry}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry ({retryCount}/3)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleScreenshotClick}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Screenshot
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showScreenshot && (
              <div className="absolute inset-0 bg-gray-100">
                <img
                  src={getScreenshotUrl(url)}
                  alt={`Screenshot of ${title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to mock website
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const iframe = document.createElement('iframe');
                    iframe.src = mockWebsiteDataUrl;
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.style.border = 'none';
                    target.parentNode?.appendChild(iframe);
                  }}
                />
              </div>
            )}

            {!error && !showScreenshot && (
              <iframe
                ref={iframeRef}
                src={url}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => window.open(url, '_blank')}
                  className="bg-white/90 hover:bg-white text-black"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live
                </Button>
                {!showScreenshot && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleScreenshotClick}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Screenshot
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-4 right-4">
          {loading && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1 text-xs text-blue-400 flex items-center space-x-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Loading</span>
            </div>
          )}
          {error && !showScreenshot && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1 text-xs text-red-400 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Error</span>
            </div>
          )}
          {showScreenshot && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 text-xs text-green-400 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Screenshot</span>
            </div>
          )}
          {!loading && !error && !showScreenshot && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 text-xs text-green-400 flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>Live</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
