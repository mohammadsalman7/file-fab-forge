import { PdfPasswordRemover } from '@/components/tools/PdfPasswordRemover';
import Layout from '@/components/layout/Layout';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';

const PdfPasswordRemoverPage = () => {
  const faqItems = [
    {
      question: "Is it safe to upload password-protected PDFs?",
      answer: "Yes, all processing is done locally in your browser. Your files never leave your device, ensuring complete privacy and security."
    },
    {
      question: "What types of PDF passwords can be removed?",
      answer: "Our tool can remove user passwords (open passwords) from PDF files. Owner passwords for editing restrictions may require additional steps."
    },
    {
      question: "Do you store my PDF files or passwords?",
      answer: "No, we don't store any files or passwords. All processing happens in your browser, and files are automatically deleted after processing."
    },
    {
      question: "What if I forgot the PDF password?",
      answer: "Unfortunately, you need to know the password to remove it. We cannot crack or bypass unknown passwords for security reasons."
    },
    {
      question: "Is there a file size limit?",
      answer: "You can process PDF files up to 50MB in size. For larger files, consider splitting them first."
    },
    {
      question: "Can I add password protection to PDFs?",
      answer: "Yes! We have a separate PDF Protector tool that can add password protection to your PDFs. Check out the PDF Protector page for that functionality."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Legal Assistant",
      content: "This tool saved me hours of work when I needed to remove passwords from multiple client documents. Fast and reliable!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Office Manager",
      content: "Perfect for preparing documents for sharing. The password removal is instant and the files remain intact.",
      rating: 5
    },
    {
      name: "Jennifer Park",
      role: "Accountant",
      content: "Exactly what I needed for processing financial documents. Works flawlessly every time.",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "IT Administrator",
      content: "Essential tool for managing PDF security. Removes passwords quickly and securely.",
      rating: 5
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              PDF Password Remover
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Remove password protection from PDF files instantly and securely. Process files locally in your browser for complete privacy.
            </p>
          </div>

          {/* Tool */}
          <div className="max-w-4xl mx-auto mb-16">
            <PdfPasswordRemover />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-muted-foreground">Remove PDF passwords in seconds. No waiting, no delays - just instant results.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Preserved</h3>
              <p className="text-muted-foreground">Your PDF quality remains unchanged. Only the password protection is removed.</p>
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

export default PdfPasswordRemoverPage;