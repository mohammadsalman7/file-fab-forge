import Layout from '@/components/layout/Layout';
import { CodeGenerator } from '@/components/tools/CodeGenerator';
import { QrCode, Barcode, Smartphone, Link, MapPin } from 'lucide-react';

const CodeGeneratorPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* SEO Optimized Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            QR Code & Barcode Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Create professional QR codes and barcodes instantly. Generate scannable codes for names, numbers, 
            links, addresses, and PINs. Download in PNG or JPG format for free.
          </p>
        </header>

        {/* Features Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 rounded-lg bg-card border">
              <QrCode className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">QR Codes</h3>
              <p className="text-sm text-muted-foreground">
                Generate high-quality QR codes for any data
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-card border">
              <Barcode className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Barcodes</h3>
              <p className="text-sm text-muted-foreground">
                Create standard barcodes in multiple formats
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-card border">
              <Link className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Multiple Data Types</h3>
              <p className="text-sm text-muted-foreground">
                Support for text, URLs, numbers, and more
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-card border">
              <Smartphone className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Instant Download</h3>
              <p className="text-sm text-muted-foreground">
                Download in PNG or JPG format immediately
              </p>
            </div>
          </div>
        </section>

        {/* Main Tool */}
        <main>
          <CodeGenerator />
        </main>

        {/* SEO Content Section */}
        <section className="mt-12 space-y-8">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">About QR Code & Barcode Generator</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p className="mb-4">
                Our free QR code and barcode generator tool allows you to create professional-quality codes 
                for various purposes. Whether you need to generate codes for business cards, inventory management, 
                event tickets, or personal use, our tool provides high-resolution output in multiple formats.
              </p>
              <p className="mb-4">
                The generator supports multiple data types including names, numbers, website links, addresses, 
                and PIN codes. All codes are generated locally in your browser, ensuring your data remains 
                private and secure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                QR Code Features
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• High-resolution output (512x512 pixels)</li>
                <li>• Customizable margin and color settings</li>
                <li>• Support for text, URLs, and contact information</li>
                <li>• Optimal error correction for reliable scanning</li>
                <li>• Mobile-friendly scannable codes</li>
              </ul>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Barcode className="h-5 w-5 text-primary" />
                Barcode Features
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• CODE128 and CODE39 format support</li>
                <li>• Automatic format optimization</li>
                <li>• Clear text display below barcode</li>
                <li>• Industry-standard compliance</li>
                <li>• Perfect for inventory and retail use</li>
              </ul>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Common Use Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Business & Marketing
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Business card QR codes</li>
                  <li>• Website link sharing</li>
                  <li>• Event check-in codes</li>
                  <li>• Product information codes</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Barcode className="h-4 w-4 text-primary" />
                  Inventory & Retail
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Product barcodes</li>
                  <li>• Inventory tracking</li>
                  <li>• Asset management</li>
                  <li>• Serial number codes</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  Personal Use
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• WiFi password sharing</li>
                  <li>• Contact information</li>
                  <li>• Address codes</li>
                  <li>• Personal identification</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CodeGeneratorPage;