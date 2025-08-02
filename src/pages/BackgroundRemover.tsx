import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BackgroundRemover } from '@/components/tools/BackgroundRemover';
import Layout from '@/components/layout/Layout';

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
    </div>
    </Layout>
  );
};

export default BackgroundRemoverPage;