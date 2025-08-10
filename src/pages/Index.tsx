import { Scissors, Maximize2, FileText, ArrowRight, Minimize2, Unlock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-primary">
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 shadow-glass border border-white/20">
            <h1 className="text-5xl font-bold mb-4 text-white">
            ImageDocPro - Remove Background Online Free
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Free online background remover, image upscaler, and file converter. Remove background from images online free with AI precision. 
              Professional-grade tools for image processing and document conversion.
            </p>
            <div className="flex justify-center space-x-6 text-white/80 flex-wrap">
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
              <div className="flex items-center space-x-2">
                <Minimize2 className="h-5 w-5" />
                <span>File Compression</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Remove Background Online Free</CardTitle>
                  <CardDescription>AI-powered background removal tool</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Remove background from images online free with AI precision. Works with logos, people, products, and text. Free online background remover tool.
              </p>
              <Link to="/background-remover">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Maximize2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Image Upscaler</CardTitle>
                  <CardDescription>Enhance image quality with AI</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Transform low-resolution images into crystal-clear HD quality with advanced AI technology.
              </p>
              <Link to="/image-upscaler">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Document Converter</CardTitle>
                  <CardDescription>Convert between formats</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Convert your documents between different formats with ease and high-quality output.
              </p>
              <Link to="/document-converter">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Minimize2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">File Compressor</CardTitle>
                  <CardDescription>Reduce file sizes efficiently</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Compress images, videos, documents, and audio files while maintaining quality.
              </p>
              <Link to="/file-compressor">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Unlock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">PDF Password Remover</CardTitle>
                  <CardDescription>Remove PDF protection instantly</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Remove password protection from PDF files quickly and securely with our advanced tool.
              </p>
              <Link to="/pdf-password-remover">
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Index;
