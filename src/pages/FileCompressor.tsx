import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileCompressor } from '@/components/tools/FileCompressor';
import { FAQ } from '@/components/FAQ';
import { Testimonials } from '@/components/Testimonials';
import Layout from '@/components/layout/Layout';

const fileCompressorFAQs = [
  {
    question: "What file types can I compress?",
    answer: "We support compression for images (JPG, JPEG, PNG), videos (MP4), audio files (MP3), documents (PDF, Word, Excel), and CSV files."
  },
  {
    question: "Is there a limit on file size?",
    answer: "You can compress files up to 100MB. For larger files, try splitting them into smaller parts first."
  },
  {
    question: "Will compression affect quality?",
    answer: "You can control the compression level - higher compression means smaller files but may reduce quality. We provide a slider to balance size vs quality."
  },
  {
    question: "How much can I reduce file size?",
    answer: "Compression rates vary by file type. Images can be reduced by 50-90%, while documents typically see 20-60% reduction."
  },
  {
    question: "Are my files secure during compression?",
    answer: "Yes, all files are processed locally in your browser when possible, and server-processed files are deleted immediately after compression."
  },
  {
    question: "Can I compress multiple files at once?",
    answer: "Currently, we support single file compression. For batch compression, process files one at a time."
  }
];

const fileCompressorTestimonials = [
  {
    name: "Alex Chen",
    role: "Photographer",
    content: "Perfect for reducing image sizes for web use without losing quality. Saves me hours of work!",
    rating: 5
  },
  {
    name: "Sarah Williams",
    role: "Content Creator",
    content: "Great tool for compressing videos before uploading. Really easy to use and effective.",
    rating: 5
  },
  {
    name: "Michael Brown",
    role: "Office Manager",
    content: "Helps us compress large PDF documents for email. Works exactly as expected.",
    rating: 4
  }
];

const FileCompressorPage = () => {
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
              File Compressor
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Reduce file sizes for images, videos, audio, documents, and more. Compress your files 
              while maintaining quality with our advanced compression technology.
            </p>
          </div>
        </div>
      </div>

      {/* Tool */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <FileCompressor />
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Testimonials testimonials={fileCompressorTestimonials} />
        </div>
      </div>

      {/* FAQ */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <FAQ title="File Compressor - FAQ" items={fileCompressorFAQs} />
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default FileCompressorPage;