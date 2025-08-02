import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DocumentConverter } from '@/components/tools/DocumentConverter';
import Layout from '@/components/layout/Layout';

const DocumentConverterPage = () => {
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
              Document Converter
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Convert your documents between different formats with ease. Support for PDF, Word, 
              images, and more with high-quality output.
            </p>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <DocumentConverter />
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default DocumentConverterPage;