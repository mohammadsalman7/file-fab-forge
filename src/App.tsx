import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import { ServiceWorkerStatus } from "@/components/ServiceWorkerStatus";


// Lazy load all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const BackgroundRemoverPage = lazy(() => import("./pages/BackgroundRemover"));
const ImageUpscalerPage = lazy(() => import("./pages/ImageUpscaler"));

const FileCompressorPage = lazy(() => import("./pages/FileCompressor"));
const PdfPasswordRemoverPage = lazy(() => import("./pages/PdfPasswordRemover"));
const PdfProtectorPage = lazy(() => import("./pages/PdfProtector"));
const PdfMergerPage = lazy(() => import("./pages/PdfMerger"));
const ImageMergerPage = lazy(() => import("./pages/ImageMerger"));
const CodeGeneratorPage = lazy(() => import("./pages/CodeGenerator"));
const FAQPage = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Support = lazy(() => import("./pages/Support"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// PWA Test Page
const PWATestPage = lazy(() => import("./components/PWATestPage").then(module => ({ default: module.PWATestPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/background-remover" element={<BackgroundRemoverPage />} />
            <Route path="/image-upscaler" element={<ImageUpscalerPage />} />

            <Route path="/file-compressor" element={<FileCompressorPage />} />
            <Route path="/pdf-password-remover" element={<PdfPasswordRemoverPage />} />
            <Route path="/pdf-protector" element={<PdfProtectorPage />} />
            <Route path="/pdf-merger" element={<PdfMergerPage />} />
            <Route path="/image-merger" element={<ImageMergerPage />} />
            <Route path="/code-generator" element={<CodeGeneratorPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/pwa-test" element={<PWATestPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ServiceWorkerStatus />
       
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
