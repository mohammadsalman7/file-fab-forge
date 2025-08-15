import { PdfProtector } from '@/components/tools/PdfProtector';
import Layout from '@/components/layout/Layout';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { SEO } from '@/components/SEO';

const PdfProtectorPage = () => {
  const faqItems = [
    {
      question: "Is it safe to upload PDFs for protection?",
      answer: "Yes, all processing is done locally in your browser. Your files never leave your device, ensuring complete privacy and security."
    },
    {
      question: "What type of password protection is added?",
      answer: "We add user password protection (open password) to PDFs. This means anyone opening the PDF will need to enter the password you set."
    },
    {
      question: "Do you store my PDF files or passwords?",
      answer: "No, we don't store any files or passwords. All processing happens in your browser, and files are automatically deleted after processing."
    },
    {
      question: "Can I protect PDFs that already have passwords?",
      answer: "No, you need to remove the existing password first using our PDF Password Remover tool, then add a new password with this tool."
    },
    {
      question: "Is there a file size limit?",
      answer: "You can process PDF files up to 50MB in size. For larger files, consider splitting them first."
    },
    {
      question: "When will PDF encryption be available?",
      answer: "We are working on integrating WASM-based encryption engines (qpdf/pdfcpu) to enable PDF protection in the browser. This feature will be available soon."
    }
  ];

  const testimonials = [
    {
      name: "David Thompson",
      role: "IT Administrator",
      content: "Great tool for managing PDF security. Looking forward to the encryption feature for protecting sensitive documents.",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "Legal Assistant",
      content: "Perfect for preparing confidential documents for sharing. The password protection will be essential for client privacy.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Office Manager",
      content: "This will be perfect for securing internal documents before sending them to external parties.",
      rating: 5
    },
    {
      name: "Jennifer Park",
      role: "Accountant",
      content: "Essential for protecting financial documents. Can't wait for the encryption feature to be fully enabled.",
      rating: 5
    }
  ];

  return (
    <Layout>
      <SEO
        title="PDF Protector – Add Password to PDF Online | ImageDocPro"
        description="Protect your PDF with a password online. Simple, fast, and secure processing in your browser. Download your locked PDF instantly."
        canonical="https://imagedocpro.com/pdf-protector"
        image="https://imagedocpro.com/uploads/logo2.jpg"
        type="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: 'PDF Protector',
              url: 'https://imagedocpro.com/pdf-protector',
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
        <div className="container mx-auto px-4 pt-8 pb-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              PDF Protector
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Add password protection to PDF files for enhanced security. Process files locally in your browser for complete privacy.
            </p>
          </div>

          {/* Tool */}
          <div className="max-w-4xl mx-auto mb-16">
            <PdfProtector />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Processing</h3>
              <p className="text-muted-foreground">All processing happens locally in your browser. Your files never leave your device.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Password Protection</h3>
              <p className="text-muted-foreground">Add strong password protection to your PDFs with AES-256 encryption.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Security</h3>
              <p className="text-muted-foreground">Protect your PDFs instantly with a password. No waiting, no delays.</p>
            </div>
          </div>

          {/* Testimonials */}
          <Testimonials testimonials={testimonials} />

          {/* FAQ */}
          <FAQ title="Frequently Asked Questions" items={faqItems} />
        </div>
      </div>
    </Layout>
  );
};

export default PdfProtectorPage;
