import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BackgroundRemover } from '@/components/tools/BackgroundRemover';
import { FAQ } from '@/components/FAQ';
import { Testimonials } from '@/components/Testimonials';
import Layout from '@/components/layout/Layout';

const backgroundRemoverFAQs = [
  {
    question: "What is the Background Remover tool?",
    answer: "The Background Remover tool allows you to remove the background from any image automatically using AI."
  },
  {
    question: "What image formats are supported?",
    answer: "We support JPG, PNG, and WEBP formats."
  },
  {
    question: "Is there a size limit for image uploads?",
    answer: "Yes, typically we allow images up to 10MB in size."
  },
  {
    question: "Will the quality of my image be affected?",
    answer: "No, our tool preserves the original image quality after background removal."
  },
  {
    question: "Can I use the output images for commercial use?",
    answer: "Yes, you can use the images commercially as long as you own the rights to the original photo."
  },
  {
    question: "Do you store my uploaded images?",
    answer: "No, we don't store any images. All files are deleted after processing for your privacy."
  }
];

const backgroundRemoverTestimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Manager",
    content: "This tool saved me hours of work! Perfect for product photos.",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Graphic Designer",
    content: "Amazing quality and so easy to use. My go-to tool now.",
    rating: 5
  },
  {
    name: "Lisa Rodriguez",
    role: "Social Media Manager",
    content: "Perfect for creating content. The AI is incredibly accurate.",
    rating: 4
  }
];

const BackgroundRemoverPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <div className="bg-gradient-primary">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 shadow-glass border border-white/20">
            <h1 className="text-4xl font-bold mb-4 text-white">
              AI Background Remover
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Remove backgrounds from any image with AI precision. Works with logos, people, products, and text. 
              Add custom backgrounds, blur effects, and professional shadows.
            </p>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Ad Space Left */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-muted/20 border border-dashed border-muted-foreground/20 rounded-lg p-6 text-center h-96">
              <div className="text-muted-foreground text-sm">Ad Space</div>
              <div className="text-xs text-muted-foreground/60 mt-2">300x250</div>
            </div>
          </div>

          {/* Main Tool */}
          <div className="lg:col-span-2">
            <BackgroundRemover />
          </div>

          {/* Ad Space Right */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-muted/20 border border-dashed border-muted-foreground/20 rounded-lg p-6 text-center h-96">
              <div className="text-muted-foreground text-sm">Ad Space</div>
              <div className="text-xs text-muted-foreground/60 mt-2">300x250</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-6 py-16 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <Testimonials testimonials={backgroundRemoverTestimonials} />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <FAQ title="Background Remover FAQ" items={backgroundRemoverFAQs} />
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default BackgroundRemoverPage;