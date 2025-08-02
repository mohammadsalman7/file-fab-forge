import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border/40">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="RemoveBackground" className="h-8 w-8" />
              <span className="text-xl font-bold">RemoveBackground</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional AI-powered tools for image processing and document generation. 
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
              <li><Link to="/document-generator" className="hover:text-primary transition-colors">Document Generator</Link></li>
            </ul>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Document Templates</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/document-generator?type=offer-letter" className="hover:text-primary transition-colors">Offer Letter</Link></li>
              <li><Link to="/document-generator?type=nda" className="hover:text-primary transition-colors">NDA</Link></li>
              <li><Link to="/document-generator?type=internship-letter" className="hover:text-primary transition-colors">Internship Letter</Link></li>
              <li><Link to="/document-generator?type=relieving-letter" className="hover:text-primary transition-colors">Relieving Letter</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link to="/imprint" className="hover:text-primary transition-colors">Imprint</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2024 RemoveBackground. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;