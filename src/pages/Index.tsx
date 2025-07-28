import { Scissors, Maximize2, FileText } from 'lucide-react';
import { BackgroundRemover } from '@/components/tools/BackgroundRemover';
import { ImageUpscaler } from '@/components/tools/ImageUpscaler';
import { DocumentConverter } from '@/components/tools/DocumentConverter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-primary">
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 shadow-glass border border-white/20">
            <h1 className="text-5xl font-bold mb-4 text-white">
              File Processing Studio
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Professional-grade tools for image processing and document conversion. 
              Remove backgrounds, upscale images, and convert files with AI-powered precision.
            </p>
            <div className="flex justify-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <Scissors className="h-5 w-5" />
                <span>AI Background Removal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Maximize2 className="h-5 w-5" />
                <span>Image Upscaling</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Document Conversion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <BackgroundRemover />
          <ImageUpscaler />
          <DocumentConverter />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-secondary border-t border-border/20">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground">
            Built with cutting-edge AI technology for professional results
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
