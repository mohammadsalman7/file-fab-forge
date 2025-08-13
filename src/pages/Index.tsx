import { Scissors, Maximize2, FileText, ArrowRight, Minimize2, Unlock, Lock, QrCode, CheckCircle, Star, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';

const Index = () => {
  return (
    <Layout>
      <SEO
        title="ImageDocPro – Free Online Background Remover, AI Image Upscaler, PDF & File Tools"
        description="Free online tools: AI background remover, image upscaler, document converter, file compressor, PDF password remover/protector, and QR/Barcode generator. Fast, secure, and free."
        canonical="https://imagedocpro.com/"
        image="https://imagedocpro.com/uploads/logo2.jpg"
        type="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ImageDocPro',
          url: 'https://imagedocpro.com/',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://imagedocpro.com/?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <div className="min-h-screen bg-gradient-secondary">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-primary">
          <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-12 shadow-glass border border-white/20 max-w-5xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-white leading-tight">
                ImageDocPro
              </h1>
              <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                Free online background remover, image upscaler, file converter, and PDF password tools. Remove background from images online free with AI precision. 
                Professional-grade tools for image processing, document conversion, and PDF security.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-white/80 justify-center max-w-2xl mx-auto">
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
        <div id="tools" className="container max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-foreground">Our Professional Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our comprehensive suite of online tools designed to handle all your image and document processing needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
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

        {/* SEO Content Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Why Choose ImageDocPro?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Process your files instantly with our optimized algorithms and cloud infrastructure.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Free</h3>
                <p className="text-muted-foreground">All our tools are completely free to use with no hidden costs or limitations.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trusted by Millions</h3>
                <p className="text-muted-foreground">Join millions of users who trust ImageDocPro for their file processing needs.</p>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">About Our Free Online Tools</h3>
              <p className="text-muted-foreground mb-4">
                ImageDocPro provides a comprehensive suite of <strong>free online tools</strong> for image and document processing. 
                Our <Link to="/background-remover" className="text-primary hover:underline">AI background remover</Link> uses advanced 
                machine learning to remove backgrounds from images with precision. The <Link to="/image-upscaler" className="text-primary hover:underline">image upscaler</Link> 
                enhances low-resolution images to HD quality using sophisticated AI algorithms.
              </p>
              <p className="text-muted-foreground mb-4">
                For document management, our <Link to="/document-converter" className="text-primary hover:underline">document converter</Link> 
                supports multiple formats including PDF, Word, Excel, and more. The <Link to="/file-compressor" className="text-primary hover:underline">file compressor</Link> 
                reduces file sizes while maintaining quality. Our PDF tools include a <Link to="/pdf-password-remover" className="text-primary hover:underline">password remover</Link> 
                and <Link to="/pdf-protector" className="text-primary hover:underline">protector</Link> for secure document management.
              </p>
              <p className="text-muted-foreground">
                Additionally, our <Link to="/code-generator" className="text-primary hover:underline">QR & barcode generator</Link> creates 
                professional codes for various applications. All tools are designed to work seamlessly in your browser without requiring 
                any software installation.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Popular Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    E-commerce & Marketing
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Remove backgrounds from product photos</li>
                    <li>• Create professional QR codes for campaigns</li>
                    <li>• Compress images for faster website loading</li>
                    <li>• Convert documents for different platforms</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Personal & Professional
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Enhance old photos with AI upscaling</li>
                    <li>• Secure PDF documents with passwords</li>
                    <li>• Generate barcodes for inventory management</li>
                    <li>• Convert files for different devices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* External Links Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Resources & Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Help & Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link to="/faq" className="text-primary hover:underline">Frequently Asked Questions</Link></li>
                  <li><Link to="/help-center" className="text-primary hover:underline">Help Center</Link></li>
                  <li><Link to="/contact" className="text-primary hover:underline">Contact Us</Link></li>
                  <li><Link to="/support" className="text-primary hover:underline">Technical Support</Link></li>
                </ul>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Legal Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-primary hover:underline">Terms of Service</Link></li>
                  <li><Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link></li>
                </ul>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">External Resources</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Web Accessibility Guidelines</a></li>
                  <li><a href="https://developers.google.com/web/fundamentals" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Web Development Best Practices</a></li>
                  <li><a href="https://www.tensorflow.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TensorFlow AI Framework</a></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
