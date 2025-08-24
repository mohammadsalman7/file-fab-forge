import { ImageMerger } from '@/components/tools/ImageMerger';
import Layout from '@/components/layout/Layout';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { SEO } from '@/components/SEO';
import { ContentEnhancer } from '@/components/ContentEnhancer';
import { SmartAd } from '@/components/SmartAd';
import { ComprehensiveGuide } from '@/components/ComprehensiveGuide';
import { Image, Grid, Palette, Download, Settings, Layers, Sparkles, Zap } from 'lucide-react';

const ImageMergerPage = () => {
  const faqItems = [
    {
      question: "How many images can I merge at once?",
      answer: "You can merge up to 20 images at once. Each image can be up to 50MB in size for optimal performance."
    },
    {
      question: "What image formats are supported?",
      answer: "We support PNG, JPG, JPEG, GIF, WebP, and BMP formats. All processing is done locally in your browser."
    },
    {
      question: "What layout options are available?",
      answer: "You can choose from 4 layouts: Horizontal (side by side), Vertical (stacked), Grid (organized grid), and Collage (organic arrangement)."
    },
    {
      question: "Can I customize the spacing between images?",
      answer: "Yes, you can adjust the spacing between images from 0 to 100 pixels using the settings panel."
    },
    {
      question: "What background colors can I use?",
      answer: "You can choose any background color using the color picker or enter a hex color code (e.g., #ffffff for white)."
    },
    {
      question: "Is there a limit on the output image size?",
      answer: "The maximum output size is 4000x4000 pixels. Images are automatically scaled to fit within these limits while maintaining aspect ratios."
    },
    {
      question: "Can I adjust the quality of the merged image?",
      answer: "Yes, you can adjust the quality from 10% to 100% using the quality slider in the settings panel."
    },
    {
      question: "What happens to my original images?",
      answer: "Your original images remain unchanged. The merger creates a new combined image that you can download."
    },
    {
      question: "Is my data safe when merging images?",
      answer: "Yes, all processing is done locally in your browser. Your images never leave your device, ensuring complete privacy and security."
    },
    {
      question: "Can I merge images with different dimensions?",
      answer: "Yes, images with different dimensions can be merged. The tool will automatically scale and arrange them according to your chosen layout."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Social Media Manager",
      content: "Perfect for creating Instagram carousels and Facebook albums. The grid layout makes it so easy to organize multiple photos!",
      rating: 5
    },
    {
      name: "David Rodriguez",
      role: "Photographer",
      content: "Love the collage feature for creating photo montages. The quality settings help me maintain professional standards.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Content Creator",
      content: "Essential tool for my blog posts. I can quickly combine multiple screenshots into one image for better presentation.",
      rating: 5
    },
    {
      name: "Michael Kim",
      role: "Designer",
      content: "The horizontal layout is perfect for creating before/after comparisons. Saves me so much time in my workflow.",
      rating: 5
    }
  ];

  // Content for the ContentEnhancer component
  const contentData = {
    toolName: "Image Merger",
    toolDescription: "Our advanced image merger tool allows you to combine multiple images into a single, cohesive composition. Whether you're creating social media collages, professional presentations, or artistic compositions, our tool provides the flexibility and precision you need.",
    features: [
      {
        title: "Multiple Layouts",
        description: "Choose from horizontal, vertical, grid, or collage arrangements",
        icon: <Grid className="h-6 w-6 text-blue-600" />
      },
      {
        title: "Custom Spacing",
        description: "Adjust spacing between images for perfect composition",
        icon: <Settings className="h-6 w-6 text-green-600" />
      },
      {
        title: "Background Control",
        description: "Set custom background colors or transparency",
        icon: <Palette className="h-6 w-6 text-purple-600" />
      },
      {
        title: "Quality Settings",
        description: "Control output quality from 10% to 100%",
        icon: <Sparkles className="h-6 w-6 text-orange-600" />
      }
    ],
    useCases: [
      {
        title: "Social Media Content",
        description: "Create engaging posts for various platforms",
        examples: [
          "Instagram carousel posts",
          "Facebook album covers",
          "Twitter header images",
          "LinkedIn professional posts"
        ]
      },
      {
        title: "Professional Presentations",
        description: "Combine images for business and educational materials",
        examples: [
          "Before/after comparisons",
          "Product catalogs",
          "Training materials",
          "Marketing collateral"
        ]
      },
      {
        title: "Creative Projects",
        description: "Express your artistic vision through image composition",
        examples: [
          "Photo montages",
          "Digital art pieces",
          "Portfolio showcases",
          "Personal projects"
        ]
      }
    ],
    tips: [
      {
        title: "Choose the Right Layout",
        content: "Select horizontal layout for side-by-side comparisons, vertical for storytelling sequences, grid for organized presentations, and collage for artistic arrangements."
      },
      {
        title: "Optimize Image Quality",
        content: "Use higher quality settings (80-100%) for professional work and lower settings (60-80%) for web use to balance quality and file size."
      },
      {
        title: "Consider Background Colors",
        content: "Choose background colors that complement your images. White backgrounds work well for professional content, while colored backgrounds can add visual interest."
      },
      {
        title: "Plan Your Composition",
        content: "Think about the visual hierarchy and flow of your merged image. Arrange images in a way that guides the viewer's eye naturally through the composition."
      }
    ],
    technicalDetails: [
      {
        title: "Supported Formats",
        content: "Our tool supports PNG, JPG, JPEG, GIF, WebP, and BMP formats. All processing is done locally in your browser for maximum privacy and security."
      },
      {
        title: "File Size Limits",
        content: "You can merge up to 20 images at once, with each image up to 50MB. The maximum output size is 4000x4000 pixels, ensuring compatibility across all platforms."
      },
      {
        title: "Processing Technology",
        content: "We use advanced HTML5 Canvas technology for image processing, ensuring high-quality results while maintaining fast processing speeds and complete privacy."
      },
      {
        title: "Browser Compatibility",
        content: "Our tool works on all modern browsers including Chrome, Firefox, Safari, and Edge. No plugins or downloads required - everything runs in your browser."
      }
    ]
  };

  return (
    <Layout>
      <SEO
        title="Image Merger – Combine Multiple Images Online Free | ImageDocPro"
        description="Merge multiple images into a single image with various layouts. Combine up to 20 images with horizontal, vertical, grid, or collage arrangements. Free, secure, and private."
        canonical="https://imagedocpro.com/image-merger"
        image="https://imagedocpro.com/uploads/logo2.jpg"
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: 'Image Merger',
              url: 'https://imagedocpro.com/image-merger',
              applicationCategory: 'UtilityApplication',
              operatingSystem: 'Web Browser',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
            },
            {
              '@type': 'FAQPage',
              mainEntity: faqItems.map(f => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer }
              }))
            }
          ]
        }}
      />
      <div className="min-h-screen bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              Image Merger
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Combine multiple images into a single image with ease. Merge up to 20 images with horizontal, vertical, grid, or collage layouts.
            </p>
          </div>

          {/* Tool Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <ImageMerger />
          </div>

          {/* Enhanced Content Section */}
          <div className="mb-16">
            <ContentEnhancer {...contentData} />
          </div>

          {/* Comprehensive Guide Section */}
          <div className="mb-16">
            <ComprehensiveGuide toolName="Image Merger" toolCategory="Image Processing" />
          </div>

          {/* Smart Ad Section - Only shows when there's sufficient content */}
          <div className="mb-16">
            <SmartAd 
              adSlot="image-merger-content-ad"
              adFormat="rectangle"
              className="max-w-4xl mx-auto"
              fallbackContent={
                <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl">
                  <h3 className="text-xl font-semibold mb-2">Learn More About Image Merging</h3>
                  <p className="text-muted-foreground">
                    Discover advanced techniques and tips for creating stunning image compositions.
                  </p>
                </div>
              }
            />
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="font-semibold mb-2">Upload Images</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or select multiple image files (up to 20 images)
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="font-semibold mb-2">Choose Layout</h3>
                <p className="text-sm text-muted-foreground">
                  Select from horizontal, vertical, grid, or collage layouts
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="font-semibold mb-2">Customize Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust spacing, background color, and quality settings
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  4
                </div>
                <h3 className="font-semibold mb-2">Download</h3>
                <p className="text-sm text-muted-foreground">
                  Download your merged image ready to use
                </p>
              </div>
            </div>
          </div>

          {/* Layout Examples */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Layout Options</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Horizontal</h3>
                <p className="text-sm text-muted-foreground">
                  Arrange images side by side in a row
                </p>
              </div>

              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Vertical</h3>
                <p className="text-sm text-muted-foreground">
                  Stack images vertically in a column
                </p>
              </div>

              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Grid</h3>
                <p className="text-sm text-muted-foreground">
                  Organize images in a customizable grid
                </p>
              </div>

              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Collage</h3>
                <p className="text-sm text-muted-foreground">
                  Create organic, artistic arrangements
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <Testimonials testimonials={testimonials} />
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <FAQ title="Frequently Asked Questions" items={faqItems} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ImageMergerPage;
