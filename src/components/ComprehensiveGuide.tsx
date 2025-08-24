import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ComprehensiveGuideProps {
  toolName: string;
  toolCategory: string;
}

export const ComprehensiveGuide: React.FC<ComprehensiveGuideProps> = ({
  toolName,
  toolCategory
}) => {
  const guides = {
    'Image Merger': {
      title: "Complete Guide to Image Merging",
      sections: [
        {
          title: "Understanding Image Merging",
          content: `Image merging is the process of combining multiple images into a single composition. This technique is widely used in various industries including photography, graphic design, social media marketing, and digital art. The process involves selecting multiple images and arranging them in a specific layout to create a cohesive visual narrative.

When merging images, several factors come into play:
- **Composition**: How images are arranged and positioned relative to each other
- **Color Harmony**: Ensuring colors work well together across all images
- **Visual Hierarchy**: Creating a clear focal point and flow
- **Technical Quality**: Maintaining resolution and clarity in the final output

Modern image merging tools use advanced algorithms to handle different image formats, sizes, and color profiles automatically, making the process accessible to users of all skill levels.`
        },
        {
          title: "Professional Applications",
          content: `Image merging has become essential in today's digital landscape:

**Marketing and Advertising:**
- Creating product catalogs with multiple views
- Designing social media campaigns with before/after comparisons
- Developing promotional materials with multiple product images

**Photography and Art:**
- Creating photo montages and collages
- Building portfolio showcases
- Developing artistic compositions

**Business and Education:**
- Creating training materials with step-by-step visuals
- Developing presentation slides with multiple charts/graphs
- Building comparison charts for analysis

**Social Media:**
- Instagram carousel posts
- Facebook album covers
- Twitter header images
- LinkedIn professional posts

The versatility of image merging makes it a valuable skill for professionals across many industries.`
        },
        {
          title: "Technical Considerations",
          content: `When working with image merging, several technical factors should be considered:

**File Formats:**
- PNG: Best for images with transparency
- JPEG: Good for photographs, smaller file sizes
- WebP: Modern format with excellent compression
- GIF: Suitable for simple graphics and animations

**Resolution and Quality:**
- Higher resolution images provide better quality but larger file sizes
- Consider the final output size and intended use
- Balance quality with file size for web use

**Color Management:**
- Ensure consistent color profiles across images
- Consider how colors will look when combined
- Test on different devices and screens

**Performance:**
- Large images may slow down processing
- Consider using optimized images for web
- Batch processing can save time for multiple projects`
        }
      ]
    },
    'Background Remover': {
      title: "Complete Guide to Background Removal",
      sections: [
        {
          title: "The Science Behind Background Removal",
          content: `Background removal is a complex computer vision task that involves separating the main subject from its background. Modern AI-powered tools use sophisticated algorithms to achieve this:

**Machine Learning Approach:**
- Deep learning models trained on millions of images
- Semantic segmentation to identify object boundaries
- Edge detection algorithms for precise masking
- Color and texture analysis for accurate separation

**Traditional Methods vs AI:**
- Manual selection tools (magic wand, lasso)
- Chroma key techniques for video
- AI-powered automatic detection
- Hybrid approaches combining multiple techniques

The accuracy of background removal depends on several factors:
- Image quality and resolution
- Subject-background contrast
- Complexity of the background
- Edge detail and fine structures (hair, fur, etc.)`
        },
        {
          title: "Best Practices for Professional Results",
          content: `Achieving professional-quality background removal requires attention to detail:

**Image Preparation:**
- Use high-resolution images (minimum 1000px width)
- Ensure good lighting and contrast
- Avoid complex backgrounds when possible
- Clean the subject before shooting

**Tool Selection:**
- Choose AI tools for automatic processing
- Use manual tools for fine-tuning
- Consider specialized tools for specific subjects (people, products, etc.)
- Test multiple tools for best results

**Post-Processing:**
- Refine edges manually if needed
- Add shadows for realistic integration
- Adjust color balance for new backgrounds
- Consider adding depth of field effects

**Quality Control:**
- Zoom in to check edge quality
- Test on different background colors
- Verify consistency across multiple images
- Get feedback from others before finalizing`
        }
      ]
    }
  };

  const currentGuide = guides[toolName as keyof typeof guides] || guides['Image Merger'];

  return (
    <div className="space-y-12">
      {/* Main Guide Header */}
      <section className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-2xl p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold">{currentGuide.title}</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master the art of {toolName.toLowerCase()} with our comprehensive guide covering techniques, best practices, and professional applications.
          </p>
        </div>
      </section>

      {/* Guide Sections */}
      <section>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {currentGuide.sections.map((section, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg">
                <AccordionTrigger className="px-6 py-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <span className="text-lg font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Industry Statistics */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-center mb-8">Industry Impact</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <p className="text-sm text-muted-foreground">Increase in productivity for content creators</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">2.5M+</div>
            <p className="text-sm text-muted-foreground">Active users worldwide</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">90%</div>
            <p className="text-sm text-muted-foreground">Time saved compared to traditional methods</p>
          </div>
        </div>
      </section>

      {/* Tips and Warnings */}
      <section>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Pro Tips & Common Mistakes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Always work with high-resolution source images for best results</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Use consistent lighting and color profiles across your project</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Save your work in multiple formats for different use cases</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Test your final output on different devices and platforms</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  Common Mistakes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Using low-resolution images that limit output quality</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Ignoring color management and profile mismatches</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Not considering the final output size and format requirements</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Skipping quality checks and testing on target platforms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Trends */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-center mb-8">Future of {toolCategory}</h3>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Emerging Technologies</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• AI-powered automatic enhancement</li>
                <li>• Real-time processing capabilities</li>
                <li>• Cloud-based collaborative workflows</li>
                <li>• Mobile-first optimization</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Industry Evolution</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Integration with design systems</li>
                <li>• Automated workflow optimization</li>
                <li>• Enhanced accessibility features</li>
                <li>• Cross-platform compatibility</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
