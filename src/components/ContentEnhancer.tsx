import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Shield, Download, Image, FileText, Settings, Palette } from 'lucide-react';

interface ContentEnhancerProps {
  toolName: string;
  toolDescription: string;
  features: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
  useCases: Array<{
    title: string;
    description: string;
    examples: string[];
  }>;
  tips: Array<{
    title: string;
    content: string;
  }>;
  technicalDetails: Array<{
    title: string;
    content: string;
  }>;
}

export const ContentEnhancer: React.FC<ContentEnhancerProps> = ({
  toolName,
  toolDescription,
  features,
  useCases,
  tips,
  technicalDetails
}) => {
  return (
    <div className="space-y-12">
      {/* Enhanced Tool Description */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">About {toolName}</h2>
          <p className="text-lg text-muted-foreground text-center mb-8 leading-relaxed">
            {toolDescription}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Common Use Cases</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">{useCase.title}</CardTitle>
                <CardDescription>{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {useCase.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{example}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tips and Best Practices */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Tips & Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold mb-3 text-lg">{tip.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{tip.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Details */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Technical Information</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {technicalDetails.map((detail, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{detail.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{detail.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Our Tool */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our {toolName}?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Process your files in seconds with our optimized algorithms</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">100% Secure</h3>
            <p className="text-sm text-muted-foreground">Your files never leave your device - complete privacy guaranteed</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">High Quality</h3>
            <p className="text-sm text-muted-foreground">Get professional-grade results with our advanced processing</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Easy to Use</h3>
            <p className="text-sm text-muted-foreground">Simple interface designed for users of all skill levels</p>
          </div>
        </div>
      </section>
    </div>
  );
};
