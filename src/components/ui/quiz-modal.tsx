"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, CheckCircle, Download, Mail, Phone } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { Input } from "./input";
import { Textarea } from "./textarea";

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text' | 'textarea' | 'range' | 'select';
  options?: string[];
  required: boolean;
  category: string;
}

// interface QuizResponse {
//   questionId: string;
//   answer: string | string[] | number;
// }

const quizQuestions: QuizQuestion[] = [
  // Business Information
  {
    id: "business-name",
    question: "What's your business name?",
    type: "text",
    required: true,
    category: "business"
  },
  {
    id: "business-type",
    question: "What type of business do you run?",
    type: "select",
    options: ["E-commerce", "Service Business", "SaaS/Software", "Non-profit", "Personal Brand", "Other"],
    required: true,
    category: "business"
  },
  {
    id: "business-stage",
    question: "What stage is your business in?",
    type: "single",
    options: ["Just starting out", "Growing rapidly", "Established", "Looking to expand", "Rebranding"],
    required: true,
    category: "business"
  },
  
  // Current Website
  {
    id: "has-website",
    question: "Do you currently have a website?",
    type: "single",
    options: ["No, I need a new website", "Yes, but it needs a complete redesign", "Yes, but it needs updates/improvements", "Yes, it's working well"],
    required: true,
    category: "current"
  },
  {
    id: "current-website-url",
    question: "What's your current website URL? (if applicable)",
    type: "text",
    required: false,
    category: "current"
  },
  {
    id: "website-issues",
    question: "What are your main website concerns? (Select all that apply)",
    type: "multiple",
    options: ["Slow loading speed", "Not mobile-friendly", "Poor SEO ranking", "Outdated design", "No lead generation", "Security issues", "Hard to update content", "No analytics tracking"],
    required: false,
    category: "current"
  },
  
  // Goals & Requirements
  {
    id: "primary-goal",
    question: "What's your primary goal for the website?",
    type: "single",
    options: ["Generate more leads", "Sell products online", "Build brand awareness", "Provide information", "Book appointments", "Showcase portfolio"],
    required: true,
    category: "goals"
  },
  {
    id: "target-audience",
    question: "Who is your target audience?",
    type: "text",
    required: true,
    category: "goals"
  },
  {
    id: "budget-range",
    question: "What's your budget range for this project?",
    type: "single",
    options: ["Under ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹2,50,000", "Above ₹2,50,000", "Not sure"],
    required: true,
    category: "goals"
  },
  {
    id: "timeline",
    question: "When do you need this completed?",
    type: "single",
    options: ["ASAP (within 2 weeks)", "Within 1 month", "Within 2-3 months", "Within 6 months", "No rush"],
    required: true,
    category: "goals"
  },
  
  // Features & Functionality
  {
    id: "required-features",
    question: "What features do you need? (Select all that apply)",
    type: "multiple",
    options: ["Contact forms", "Online booking", "E-commerce store", "Blog/News section", "User accounts", "Payment integration", "Multi-language", "CMS for easy updates", "SEO optimization", "Analytics tracking"],
    required: false,
    category: "features"
  },
  {
    id: "design-preferences",
    question: "What design style appeals to you?",
    type: "single",
    options: ["Modern & Minimal", "Bold & Creative", "Professional & Corporate", "Friendly & Approachable", "Luxury & Premium", "Let the experts decide"],
    required: true,
    category: "features"
  },
  
  // Contact Information
  {
    id: "contact-name",
    question: "What's your name?",
    type: "text",
    required: true,
    category: "contact"
  },
  {
    id: "contact-email",
    question: "What's your email address?",
    type: "text",
    required: true,
    category: "contact"
  },
  {
    id: "contact-phone",
    question: "What's your phone number?",
    type: "text",
    required: true,
    category: "contact"
  },
  {
    id: "additional-notes",
    question: "Any additional information or specific requirements?",
    type: "text",
    required: false,
    category: "contact"
  }
];

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[] | number>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<{
    businessName: string;
    businessType: string;
    primaryGoal: string;
    budgetRange: string;
    timeline: string;
    recommendedPackage: string;
    estimatedPrice: number;
    recommendations: string[];
    requiredFeatures: string[];
    designPreferences: string;
    websiteIssues: string[];
    generatedAt: string;
  } | null>(null);

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;

  const handleAnswer = (questionId: string, answer: string | string[] | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion.required && !responses[currentQuestion.id]) {
      return;
    }
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateReport();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate personalized report
    const report = generatePersonalizedReport(responses);
    setGeneratedReport(report);
    setIsGenerating(false);
  };

  const generatePersonalizedReport = (responses: Record<string, string | string[] | number>) => {
    const businessName = String(responses["business-name"] || "Your Business");
    const businessType = String(responses["business-type"] || "Business");
    const primaryGoal = String(responses["primary-goal"] || "Generate leads");
    const budgetRange = String(responses["budget-range"] || "₹25,000 - ₹50,000");
    const timeline = String(responses["timeline"] || "Within 1 month");
    const requiredFeatures = Array.isArray(responses["required-features"]) ? responses["required-features"] as string[] : [];
    const designPreferences = String(responses["design-preferences"] || "Modern & Minimal");
    const websiteIssues = Array.isArray(responses["website-issues"]) ? responses["website-issues"] as string[] : [];

    // Calculate recommended package
    let recommendedPackage = "Starter";
    let estimatedPrice = 25000;
    
    if (requiredFeatures.length > 5 || budgetRange.includes("₹1,00,000")) {
      recommendedPackage = "Growth";
      estimatedPrice = 75000;
    } else if (requiredFeatures.length > 3 || budgetRange.includes("₹50,000")) {
      recommendedPackage = "Business";
      estimatedPrice = 50000;
    }

    // Generate recommendations
    const recommendations = [];
    if (websiteIssues.includes("Slow loading speed")) {
      recommendations.push("Performance optimization with CDN and image compression");
    }
    if (websiteIssues.includes("Not mobile-friendly")) {
      recommendations.push("Mobile-first responsive design implementation");
    }
    if (websiteIssues.includes("Poor SEO ranking")) {
      recommendations.push("Comprehensive SEO audit and optimization");
    }
    if (requiredFeatures.includes("E-commerce store")) {
      recommendations.push("E-commerce integration with payment gateway");
    }

    return {
      businessName,
      businessType,
      primaryGoal,
      budgetRange,
      timeline,
      recommendedPackage,
      estimatedPrice,
      recommendations,
      requiredFeatures,
      designPreferences,
      websiteIssues,
      generatedAt: new Date().toISOString()
    };
  };

  const downloadPDF = () => {
    if (!generatedReport) return;
    
    // In a real implementation, this would generate and download a PDF
    const element = document.createElement('a');
    const file = new Blob([`Personalized Report for ${generatedReport.businessName}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `datorque-report-${generatedReport.businessName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sendEmail = () => {
    if (!generatedReport) return;
    
    const subject = `Personalized Website Report - ${generatedReport.businessName}`;
    const body = `Hi ${String(responses["contact-name"] || "there")},\n\nThank you for completing our quiz! Your personalized report is ready.\n\nBest regards,\nDatorque Team`;
    window.open(`mailto:${String(responses["contact-email"] || "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-900 rounded-2xl border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-surface-900/95 backdrop-blur-xl border-b border-white/10 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {generatedReport ? "Your Personalized Report" : "Get Your Free Quote"}
                </h2>
                <p className="text-gray-400">
                  {generatedReport ? "Analysis complete!" : `Step ${currentStep + 1} of ${quizQuestions.length}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            {!generatedReport && (
              <div className="mt-4">
                <div className="w-full bg-surface-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Generating Your Report</h3>
                <p className="text-gray-400">Analyzing your responses and creating personalized recommendations...</p>
              </div>
            ) : generatedReport ? (
              <div className="space-y-6">
                {/* Report Header */}
                <div className="text-center py-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Report for {generatedReport.businessName}
                  </h3>
                  <p className="text-gray-300">
                    {generatedReport.businessType} • {generatedReport.primaryGoal}
                  </p>
                </div>

                {/* Recommendations */}
                <Card className="p-6 bg-surface-800/50">
                  <h4 className="text-lg font-semibold text-white mb-4">Recommended Package</h4>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">{generatedReport.recommendedPackage}</span>
                    <span className="text-xl font-semibold text-white">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(generatedReport.estimatedPrice)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Based on your requirements: {generatedReport.requiredFeatures.length} features, 
                    {generatedReport.designPreferences} design, {generatedReport.timeline} timeline
                  </p>
                </Card>

                {/* Key Recommendations */}
                <Card className="p-6 bg-surface-800/50">
                  <h4 className="text-lg font-semibold text-white mb-4">Key Recommendations</h4>
                  <ul className="space-y-2">
                    {generatedReport.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={downloadPDF}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF Report
                  </Button>
                  <Button
                    onClick={sendEmail}
                    variant="outline"
                    className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email Report
                  </Button>
                  <Button
                    onClick={() => window.open('https://wa.me/919876543210?text=Hi! I completed the quiz and would like to discuss my personalized report.', '_blank')}
                    variant="outline"
                    className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Discuss on WhatsApp
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Question */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {currentQuestion.question}
                  </h3>
                  
                  {/* Answer Input */}
                  {currentQuestion.type === 'text' && (
                    <Input
                      value={responses[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full"
                    />
                  )}
                  
                  {currentQuestion.type === 'textarea' && (
                    <Textarea
                      value={responses[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                      placeholder="Type your answer..."
                      rows={4}
                      className="w-full"
                    />
                  )}
                  
                  {currentQuestion.type === 'single' && (
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(currentQuestion.id, option)}
                          className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                            responses[currentQuestion.id] === option
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-white/10 bg-surface-800/50 text-white hover:border-primary/30'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {currentQuestion.type === 'multiple' && (
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option) => (
                        <label key={option} className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 bg-surface-800/50 hover:border-primary/30 transition-all duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Array.isArray(responses[currentQuestion.id]) ? (responses[currentQuestion.id] as string[]).includes(option) : false}
                            onChange={(e) => {
                              const current = Array.isArray(responses[currentQuestion.id]) ? responses[currentQuestion.id] as string[] : [];
                              const updated = e.target.checked
                                ? [...current, option]
                                : current.filter((item: string) => item !== option);
                              handleAnswer(currentQuestion.id, updated);
                            }}
                            className="w-4 h-4 text-primary bg-surface-800 border-white/20 rounded focus:ring-primary focus:ring-2"
                          />
                          <span className="text-white">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {currentQuestion.type === 'select' && (
                    <select
                      value={responses[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                      className="w-full p-4 bg-surface-800 border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select an option...</option>
                      {currentQuestion.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestion.required && !responses[currentQuestion.id]}
                    className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white"
                  >
                    <span>{currentStep === quizQuestions.length - 1 ? 'Generate Report' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
