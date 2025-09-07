"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, AlertTriangle, Clock, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizModal } from "@/components/ui/quiz-modal";

interface AuditResult {
  score: number;
  issues: {
    critical: number;
    warning: number;
    info: number;
  };
  metrics: {
    performance: number;
    accessibility: number;
    seo: number;
    bestPractices: number;
  };
  recommendations: string[];
}

export function WebsiteAudit() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const mockAudit = async (url: string): Promise<AuditResult> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results based on URL
    const isGoodSite = url.includes("google") || url.includes("vercel") || url.includes("github");
    
    return {
      score: isGoodSite ? 85 : Math.floor(Math.random() * 40) + 30,
      issues: {
        critical: isGoodSite ? 0 : Math.floor(Math.random() * 5) + 1,
        warning: isGoodSite ? 2 : Math.floor(Math.random() * 8) + 3,
        info: isGoodSite ? 5 : Math.floor(Math.random() * 12) + 8
      },
      metrics: {
        performance: isGoodSite ? 92 : Math.floor(Math.random() * 40) + 30,
        accessibility: isGoodSite ? 88 : Math.floor(Math.random() * 30) + 40,
        seo: isGoodSite ? 90 : Math.floor(Math.random() * 35) + 35,
        bestPractices: isGoodSite ? 85 : Math.floor(Math.random() * 25) + 45
      },
      recommendations: isGoodSite ? [
        "Consider implementing lazy loading for images",
        "Add more structured data markup",
        "Optimize font loading strategy"
      ] : [
        "Optimize images and enable compression",
        "Minify CSS and JavaScript files",
        "Implement proper caching headers",
        "Fix mobile responsiveness issues",
        "Add meta descriptions and alt tags",
        "Improve page loading speed",
        "Fix accessibility issues",
        "Add SSL certificate"
      ]
    };
  };

  const handleAudit = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      const auditResult = await mockAudit(url);
      setResult(auditResult);
    } catch (error) {
      console.error("Audit failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500/20 border-green-500/30";
    if (score >= 70) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Free Website Analysis
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Get Your <span className="text-gradient bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">Free Website Audit</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover what's holding your website back. Get instant insights on performance, SEO, accessibility, and more.
          </p>
        </motion.div>

        {/* Audit Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12"
        >
          <Card className="p-8 bg-surface-900/50 backdrop-blur-xl border border-white/10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter your website URL
                </label>
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full pl-10 pr-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                    />
                  </div>
                  <Button
                    onClick={handleAudit}
                    disabled={!url || isLoading}
                    className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white px-8"
                  >
                    {isLoading ? (
                      <Clock className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    {isLoading ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-400 text-center">
                Analysis takes 30-60 seconds • No registration required
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <Card className="p-8 bg-surface-900/50 backdrop-blur-xl border border-white/10">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Overall Score</h3>
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-2 ${getScoreBg(result.score)} mb-6`}>
                  <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </span>
                </div>
                <p className="text-lg text-gray-300 mb-6">
                  {result.score >= 90 ? "Excellent! Your website is performing great." :
                   result.score >= 70 ? "Good! There's room for improvement." :
                   "Needs work. Let's optimize your website."}
                </p>
              </div>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(result.metrics).map(([key, value]) => (
                <Card key={key} className="p-6 bg-surface-900/50 backdrop-blur-xl border border-white/10">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-2 ${getScoreBg(value)} mb-4`}>
                      <span className={`text-xl font-bold ${getScoreColor(value)}`}>
                        {value}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {value >= 90 ? "Excellent" : value >= 70 ? "Good" : "Needs Improvement"}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Issues Summary */}
            <Card className="p-8 bg-surface-900/50 backdrop-blur-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Issues Found</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-full mb-3 mx-auto">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-red-400 mb-1">{result.issues.critical}</div>
                  <div className="text-sm text-gray-400">Critical Issues</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-3 mx-auto">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{result.issues.warning}</div>
                  <div className="text-sm text-gray-400">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full mb-3 mx-auto">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">{result.issues.info}</div>
                  <div className="text-sm text-gray-400">Suggestions</div>
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-8 bg-surface-900/50 backdrop-blur-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Recommendations</h3>
              <div className="space-y-4">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">{rec}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-center">
                  <p className="text-gray-300 mb-4">
                    Ready to fix these issues and boost your website's performance?
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white px-8"
                    onClick={() => setIsQuizOpen(true)}
                  >
                    Get Professional Help
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
      
      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </section>
  );
}
