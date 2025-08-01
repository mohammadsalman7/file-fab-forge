import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BackgroundRemoverPage from "./pages/BackgroundRemover";
import ImageUpscalerPage from "./pages/ImageUpscaler";
import DocumentConverterPage from "./pages/DocumentConverter";
import DocumentGeneratorPage from "./pages/DocumentGeneratorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/background-remover" element={<BackgroundRemoverPage />} />
          <Route path="/image-upscaler" element={<ImageUpscalerPage />} />
          <Route path="/document-converter" element={<DocumentConverterPage />} />
          <Route path="/document-generator" element={<DocumentGeneratorPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
