import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FAQ } from '@/components/FAQ';
import Layout from '@/components/layout/Layout';

const generalFAQs = [
  {
    question: "Is your service free?",
    answer: "Yes, most of our tools are free to use. We may offer premium features in the future."
  },
  {
    question: "Do I need to sign up to use the tools?",
    answer: "No registration is required to use our basic tools."
  },
  {
    question: "Are there any usage limits?",
    answer: "There may be fair usage limits to prevent abuse. Frequent users can opt for premium access (if available)."
  },
  {
    question: "Is there customer support available?",
    answer: "Yes, you can contact us via our support page or email for any queries or feedback."
  },
  {
    question: "Can I use these tools on mobile?",
    answer: "Yes, all our tools are mobile-friendly and work on Android and iOS browsers."
  }
];

const FAQPage = () => {
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
                  Back to Home
                </Button>
              </Link>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 shadow-glass border border-white/20">
              <h1 className="text-4xl font-bold mb-4 text-white">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-white/90 max-w-2xl">
                Find answers to common questions about our tools and services. 
                Can't find what you're looking for? Contact our support team.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <FAQ title="General Questions" items={generalFAQs} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;