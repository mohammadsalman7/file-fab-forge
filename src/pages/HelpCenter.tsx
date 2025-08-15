import { ArrowLeft, Search, Book, Video, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';

const HelpCenter = () => {
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
                  Back to Home
                </Button>
              </Link>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 shadow-glass border border-white/20">
              <h1 className="text-4xl font-bold mb-4 text-white">
                Help Center
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mb-6">
                Learn how to use our tools effectively with our comprehensive guides and tutorials.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input 
                  placeholder="Search for help..." 
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
            
            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <Card className="bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Book className="h-6 w-6 text-primary" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Learn the basics of using our tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-primary hover:underline">How to upload images</a></li>
                    <li><a href="#" className="text-primary hover:underline">Understanding file formats</a></li>
                    <li><a href="#" className="text-primary hover:underline">Basic troubleshooting</a></li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Video className="h-6 w-6 text-primary" />
                    Video Tutorials
                  </CardTitle>
                  <CardDescription>
                    Step-by-step video guides
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-primary hover:underline">Background Remover Tutorial</a></li>
                    <li><a href="#" className="text-primary hover:underline">Image Upscaler Guide</a></li>
                    <li><a href="#" className="text-primary hover:underline">Document Converter Tips</a></li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    Advanced Features
                  </CardTitle>
                  <CardDescription>
                    Make the most of our tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-primary hover:underline">Batch processing</a></li>
                    <li><a href="#" className="text-primary hover:underline">Quality optimization</a></li>
                    <li><a href="#" className="text-primary hover:underline">API integration</a></li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Popular Articles */}
            <div className="bg-gradient-glass backdrop-blur-sm border-border/50 rounded-2xl p-8 shadow-glass">
              <h3 className="text-xl font-bold mb-6">Popular Articles</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">How to get the best results from Background Remover</h4>
                    <p className="text-sm text-muted-foreground">Tips for optimal background removal results</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Troubleshooting upload issues</h4>
                    <p className="text-sm text-muted-foreground">Common solutions for file upload problems</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Understanding image quality and formats</h4>
                    <p className="text-sm text-muted-foreground">Guide to choosing the right format</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Using our tools on mobile devices</h4>
                    <p className="text-sm text-muted-foreground">Mobile optimization tips and tricks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;