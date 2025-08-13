import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DocumentConverter } from '@/components/tools/DocumentConverter';
import { FAQ } from '@/components/FAQ';
import { Testimonials } from '@/components/Testimonials';
import Layout from '@/components/layout/Layout';

const documentConverterFAQs = [
  {
    question: "What file formats can I convert?",
    answer: "We support conversions between DOC, DOCX, PDF, JPG, PNG, XLSX, and TXT formats."
  },
  {
    question: "Is there a limit on file size?",
    answer: "Most conversions allow files up to 20MB. For larger files, try splitting or compressing."
  },
  {
    question: "Are my documents secure?",
    answer: "Yes, all files are processed securely and deleted automatically after conversion."
  },
  {
    question: "Will the formatting of my document be preserved?",
    answer: "Our converter is designed to retain formatting, fonts, and layout as accurately as possible."
  },
  {
    question: "Can I convert scanned PDFs to editable text?",
    answer: "Yes, our tool uses OCR (Optical Character Recognition) to convert scanned documents to editable formats."
  },
  {
    question: "Can I convert multiple files at once?",
    answer: "Yes, batch conversion is supported depending on the file type."
  }
];

const documentConverterTestimonials = [
  {
    name: "Jennifer Walsh",
    role: "Office Manager",
    content: "Saves me so much time converting documents. Works perfectly!",
    rating: 5
  },
  {
    name: "Robert Garcia",
    role: "Legal Assistant",
    content: "Very reliable for document conversions. Great tool!",
    rating: 4
  },
  {
    name: "Maria Silva",
    role: "Student",
    content: "Perfect for converting my research papers to different formats.",
    rating: 5
  }
];

const DocumentConverterPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <div className="bg-gradient-primary">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 shadow-glass border border-white/20">
            <h1 className="text-4xl font-bold mb-4 text-white">
              Convert Any File to Any Format — Instantly!
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Our document converter supports a wide range of formats, letting you transform your files in seconds. Whether it's Word to PDF, DOC/DOCX to Excel or JPG, Excel to PDF, PDF to Word/Excel/JPG/PNG, or JPG to PDF/Word/PNG/JPEG — we've got you covered. Fast, secure, and easy to use — just upload your file and get your desired format in one click.
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

      {/* Testimonials */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Testimonials testimonials={documentConverterTestimonials} />
        </div>
      </div>

      {/* FAQ */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <FAQ title="Document Converter - FAQ" items={documentConverterFAQs} />
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default DocumentConverterPage;