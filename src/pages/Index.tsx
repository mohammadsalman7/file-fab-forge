import { Scissors, Maximize2, FileText, ArrowRight, Minimize2, Unlock, Lock, QrCode } from 'lucide-react';
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
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-12 shadow-glass border border-white/20 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-white leading-tight">
             ImageDocPro - Free Online Image & PDF Processing Tools
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Free online background remover, image upscaler, file converter, and PDF password tools. Remove background from images online free with AI precision. 
              Professional-grade tools for image processing, document conversion, and PDF security.
            </p>
            <div className="flex justify-center space-x-8 text-white/80 flex-wrap gap-4">
              <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
                <Scissors className="h-6 w-6" />
                <span className="font-medium">AI Background Removal</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
                <Maximize2 className="h-6 w-6" />
                <span className="font-medium">Image Upscaling</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
                <FileText className="h-6 w-6" />
                <span className="font-medium">Document Conversion</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
                <Minimize2 className="h-6 w-6" />
                <span className="font-medium">File Compression</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
                <Unlock className="h-6 w-6" />
                <span className="font-medium">PDF Password Tools</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
                <QrCode className="h-6 w-6" />
                <span className="font-medium">QR & Barcode Generator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Our Professional Tools</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our comprehensive suite of online tools designed to handle all your image and document processing needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4   gap-8 max-w-7xl mx-auto">
          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 hover:bg-card/80 h-full flex flex-col">
            <CardHeader className="pb-6 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors flex-shrink-0">
                  <Scissors className="h-8 w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold leading-tight">Remove Background Online Free</CardTitle>
                  <CardDescription className="text-sm mt-1">AI-powered background removal tool</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-grow flex flex-col">
              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                Remove background from images online free with AI precision. Works with logos, people, products, and text. Free online background remover tool.
              </p>
              <Link to="/background-remover" className="mt-auto">
                <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 h-12 text-base font-medium">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 hover:bg-card/80 h-full flex flex-col">
            <CardHeader className="pb-6 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors flex-shrink-0">
                  <Maximize2 className="h-8 w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold leading-tight">Image Upscaler</CardTitle>
                  <CardDescription className="text-sm mt-1">Enhance image quality with AI</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-grow flex flex-col">
              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                Transform low-resolution images into crystal-clear HD quality with advanced AI technology.
              </p>
              <Link to="/image-upscaler" className="mt-auto">
                <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 h-12 text-base font-medium">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 hover:bg-card/80 h-full flex flex-col">
            <CardHeader className="pb-6 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors flex-shrink-0">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold leading-tight">Document Converter</CardTitle>
                  <CardDescription className="text-sm mt-1">Convert between formats</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-grow flex flex-col">
              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                Convert your documents between different formats with ease and high-quality output.
              </p>
              <Link to="/document-converter" className="mt-auto">
                <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 h-12 text-base font-medium">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 hover:bg-card/80 h-full flex flex-col">
            <CardHeader className="pb-6 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors flex-shrink-0">
                  <Minimize2 className="h-8 w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold leading-tight">File Compressor</CardTitle>
                  <CardDescription className="text-sm mt-1">Reduce file sizes efficiently</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-grow flex flex-col">
              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                Compress images, videos, documents, and audio files while maintaining quality.
              </p>
              <Link to="/file-compressor" className="mt-auto">
                <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 h-12 text-base font-medium">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 hover:bg-card/80 h-full flex flex-col">
            <CardHeader className="pb-6 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors flex-shrink-0">
                  <Unlock className="h-8 w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold leading-tight">PDF Password Remover</CardTitle>
                  <CardDescription className="text-sm mt-1">Remove PDF protection instantly</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-grow flex flex-col">
              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                Remove password protection from PDF files quickly and securely with our advanced tool.
              </p>
              <Link to="/pdf-password-remover" className="mt-auto">
                <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 h-12 text-base font-medium">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 hover:bg-card/80 h-full flex flex-col">
            <CardHeader className="pb-6 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors flex-shrink-0">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold leading-tight">PDF Protector</CardTitle>
                  <CardDescription className="text-sm mt-1">Protect PDF files with a password</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-grow flex flex-col">
              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                Secure your PDF documents by adding a password for access.
              </p>
              <Link to="/pdf-protector" className="mt-auto">
                <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 h-12 text-base font-medium">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:scale-105 hover:bg-card/80 h-full flex flex-col">
            <CardHeader className="pb-6 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-colors flex-shrink-0">
                  <QrCode className="h-8 w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold leading-tight">QR & Barcode Generator</CardTitle>
                  <CardDescription className="text-sm mt-1">Generate QR codes and barcodes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex-grow flex flex-col">
              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                Create professional QR codes and barcodes for names, numbers, links, addresses, and PINs instantly.
              </p>
              <Link to="/code-generator" className="mt-auto">
                <Button className="w-full group-hover:bg-primary/90 transition-all duration-300 h-12 text-base font-medium">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
