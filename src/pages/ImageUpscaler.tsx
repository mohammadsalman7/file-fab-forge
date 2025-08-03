import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ImageUpscaler } from '@/components/tools/ImageUpscaler';
import { FAQ } from '@/components/FAQ';
import { Testimonials } from '@/components/Testimonials';
import Layout from '@/components/layout/Layout';

const imageUpscalerFAQs = [
  {
    question: "What does the Image Upscaler do?",
    answer: "The tool enhances and increases the resolution of your images using AI, making them sharper and more detailed."
  },
  {
    question: "How much can I upscale an image?",
    answer: "You can upscale an image by 2x, 4x, or even 8x depending on the tool's capability."
  },
  {
    question: "Can I upscale low-quality images?",
    answer: "Yes, our AI model is trained to improve low-resolution images, making them look significantly better."
  },
  {
    question: "Does it support face enhancement?",
    answer: "Yes, if your image contains faces, the tool improves clarity while maintaining natural features."
  },
  {
    question: "What formats are supported?",
    answer: "JPG, PNG, and WEBP formats are supported."
  },
  {
    question: "Will the upscaled image be watermarked?",
    answer: "No, all downloads are watermark-free."
  }
];

const imageUpscalerTestimonials = [
  {
    name: "David Kim",
    role: "Photographer",
    content: "Incredible results! My old photos look brand new in HD quality.",
    rating: 5
  },
  {
    name: "Emma Thompson",
    role: "Digital Artist",
    content: "Perfect for upscaling artwork. The quality is amazing!",
    rating: 5
  },
  {
    name: "Carlos Martinez",
    role: "Print Shop Owner",
    content: "Great for preparing images for large format printing.",
    rating: 4
  }
];

const ImageUpscalerPage = () => {
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
              AI Image Upscaler
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Enhance your images with AI-powered upscaling. Transform low-resolution images into 
              crystal-clear HD quality with advanced Real-ESRGAN technology.
            </p>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <ImageUpscaler />
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Testimonials testimonials={imageUpscalerTestimonials} />
        </div>
      </div>

      {/* FAQ */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <FAQ title="Image Upscaler - FAQ" items={imageUpscalerFAQs} />
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ImageUpscalerPage;