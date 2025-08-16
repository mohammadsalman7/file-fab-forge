import { PdfMerger } from '@/components/tools/PdfMerger';
import Layout from '@/components/layout/Layout';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { SEO } from '@/components/SEO';

const PdfMergerPage = () => {
  const faqItems = [
    {
      question: "How many PDF files can I merge at once?",
      answer: "You can merge up to 20 PDF files at once. Each file can be up to 50MB in size for optimal performance."
    },
    {
      question: "In what order will my PDFs be merged?",
      answer: "PDFs will be merged in the order they appear in the file list. You can drag and drop files to reorder them before merging."
    },
    {
      question: "Is my data safe when merging PDFs?",
      answer: "Yes, all processing is done locally in your browser. Your files never leave your device, ensuring complete privacy and security."
    },
    {
      question: "What happens to the original PDF files?",
      answer: "Your original PDF files remain unchanged. The merger creates a new combined PDF file that you can download."
    },
    {
      question: "Can I merge password-protected PDFs?",
      answer: "No, password-protected PDFs cannot be merged. You'll need to remove the password protection first using our PDF Password Remover tool."
    },
    {
      question: "What if some of my PDFs are corrupted?",
      answer: "The tool will detect corrupted or invalid PDF files and show an error message. Only valid PDF files can be merged."
    },
    {
      question: "Is there a limit on the total size of merged PDFs?",
      answer: "While there's no strict limit, very large merged files may take longer to process. We recommend keeping individual files under 50MB for best performance."
    },
    {
      question: "Can I merge PDFs with different page sizes?",
      answer: "Yes, PDFs with different page sizes can be merged. Each page will maintain its original dimensions in the merged document."
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Project Manager",
      content: "Perfect for combining multiple reports into a single document. Saves me hours of work every week!",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "Administrative Assistant",
      content: "Love how easy it is to merge multiple PDFs. The drag-and-drop interface makes reordering files so simple.",
      rating: 5
    },
    {
      name: "Robert Kim",
      role: "Consultant",
      content: "Essential tool for creating comprehensive client presentations. Merges files quickly and maintains quality.",
      rating: 5
    },
    {
      name: "Lisa Wang",
      role: "Legal Secretary",
      content: "Used this to combine multiple legal documents into one file. Works flawlessly and keeps everything organized.",
      rating: 5
    }
  ];

  return (
    <Layout>
      <SEO
        title="PDF Merger – Combine Multiple PDF Files Online Free | ImageDocPro"
        description="Merge multiple PDF files into a single document instantly. Combine up to 20 PDFs with drag-and-drop ease. Free, secure, and private."
        canonical="https://imagedocpro.com/pdf-merger"
        image="https://imagedocpro.com/uploads/logo2.jpg"
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: 'PDF Merger',
              url: 'https://imagedocpro.com/pdf-merger',
              applicationCategory: 'UtilityApplication',
              operatingSystem: 'Web Browser',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
            },
            {
              '@type': 'FAQPage',
              mainEntity: faqItems.map(f => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer }
              }))
            }
          ]
        }}
      />
      <div className="min-h-screen bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              PDF Merger
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Combine multiple PDF files into a single document with ease. Merge up to 20 PDFs instantly with drag-and-drop functionality.
            </p>
          </div>

          {/* Tool Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <PdfMerger />
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Drag & Drop</h3>
              <p className="text-muted-foreground text-sm">
                Simply drag and drop your PDF files to merge them. Reorder files by dragging them around.
              </p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                All processing happens in your browser. Your files never leave your device, ensuring complete privacy.
              </p>
            </div>

            <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">
                Merge multiple PDFs in seconds. No waiting, no uploads, no server processing delays.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="font-semibold mb-2">Upload PDFs</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or select multiple PDF files (up to 20 files)
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="font-semibold mb-2">Arrange Order</h3>
                <p className="text-sm text-muted-foreground">
                  Reorder files by dragging them to your preferred sequence
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="font-semibold mb-2">Merge Files</h3>
                <p className="text-sm text-muted-foreground">
                  Click merge and watch your PDFs combine instantly
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  4
                </div>
                <h3 className="font-semibold mb-2">Download</h3>
                <p className="text-sm text-muted-foreground">
                  Download your merged PDF file ready to use
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <Testimonials testimonials={testimonials} />
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <FAQ title="Frequently Asked Questions" items={faqItems} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PdfMergerPage;
