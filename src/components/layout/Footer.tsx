import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border/40">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/uploads/logo.png" alt="ImageDocProLogo" aria-label="ImageDocProLogo" title="ImageDocProLogo" aria-hidden="true" className="h-[50px] w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Professional AI-powered tools for image processing and file conversion. 
              Transform your files with ease.
            </p>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/background-remover" className="hover:text-primary transition-colors">Background Remover</Link></li>
              <li><Link to="/image-upscaler" className="hover:text-primary transition-colors">Image Upscaler</Link></li>
              <li><Link to="/document-converter" className="hover:text-primary transition-colors">Document Converter</Link></li>
              <li><Link to="/file-compressor" className="hover:text-primary transition-colors">File Compressor</Link></li>
              <li><Link to="/pdf-password-remover" className="hover:text-primary transition-colors">PDF Unlock</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/support" className="hover:text-primary transition-colors">Support</Link></li>
              <li><Link to="/help-center" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/share/17CrJU5TcS/" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/imagedocpro?igsh=MWFjbTZ6MHZ3Zjcx" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://youtube.com/@imagedocpro?si=C_s14Hsk-mqwMe-H" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/company/imagedocpro" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ImageDocPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
