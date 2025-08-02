import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ImageUpscaler } from '@/components/tools/ImageUpscaler';
import Layout from '@/components/layout/Layout';

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
    </div>
    </Layout>
  );
};

export default ImageUpscalerPage;