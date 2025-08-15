import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DocumentConverter } from '@/components/tools/DocumentConverter';
import { FAQ } from '@/components/FAQ';
import { Testimonials } from '@/components/Testimonials';
import Layout from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';

const documentConverterFAQs = [
  {
    question: "What file formats can I convert?",
    answer: "We support conversions between DOC, DOCX, PDF, JPG, PNG, XLSX, and TXT formats. Word documents can be converted to high-quality images with proper formatting preserved."
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
    answer: "Our converter is designed to retain formatting, fonts, and layout as accurately as possible. For PDF to PowerPoint conversion, we offer an image-based option that preserves the exact design by converting each PDF page to an image."
  },
  {
    question: "Can I convert scanned PDFs to editable text?",
    answer: "Yes, our tool uses OCR (Optical Character Recognition) to convert scanned documents to editable formats."
  },
  {
    question: "Can I convert multiple files at once?",
    answer: "Yes, batch conversion is supported depending on the file type."
  },
  {
    question: "What is image-based PDF to PowerPoint conversion?",
    answer: "This feature converts each PDF page to a high-quality image and creates PowerPoint slides with those images. This preserves the exact design, fonts, colors, and layout of your original PDF, making it perfect for presentations that need to maintain the original appearance."
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
      <SEO
        title="Document Converter – Convert PDF, DOCX, JPG, PNG, XLSX Online | ImageDocPro"
        description="Convert between PDF, DOC, DOCX, JPG, PNG, XLSX, CSV and more online. Fast, secure conversions directly in your browser. Free to use."
        canonical="https://imagedocpro.com/document-converter"
        image="https://imagedocpro.com/uploads/logo2.jpg"
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: 'Document Converter',
              url: 'https://imagedocpro.com/document-converter',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web Browser',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
            },
            {
              '@type': 'FAQPage',
              mainEntity: documentConverterFAQs.map(f => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer }
              }))
            }
          ]
        }}
      />
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
              Our document converter supports a wide range of formats, letting you transform your files in seconds. Whether it's Word to PDF, DOC/DOCX to JPG/PNG, Excel to PDF, PDF to Word/Excel/JPG/PNG, or JPG to PDF/Word/PNG/JPEG — we've got you covered. For PDF to PowerPoint conversion, we offer image-based conversion that preserves exact design and layout. Fast, secure, and easy to use — just upload your file and get your desired format in one click.
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