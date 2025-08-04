import { ArrowLeft, MessageCircle, Book, Mail, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';

const Support = () => {
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
                Support Center
              </h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Get help and support for all our tools. We're here to assist you with any questions or issues.
              </p>
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <HelpCircle className="h-6 w-6 text-primary" />
                    FAQ
                  </CardTitle>
                  <CardDescription>
                    Find answers to frequently asked questions about our tools and services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/faq">
                    <Button className="w-full">
                      Browse FAQ
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Book className="h-6 w-6 text-primary" />
                    Help Center
                  </CardTitle>
                  <CardDescription>
                    Comprehensive guides and tutorials for using our tools effectively.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/help-center">
                    <Button className="w-full">
                      View Guides
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-primary" />
                    Contact Us
                  </CardTitle>
                  <CardDescription>
                    Send us a message directly for personalized support and assistance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/contact">
                    <Button className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    Live Chat
                  </CardTitle>
                  <CardDescription>
                    Get instant help through our live chat support (coming soon).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;