# File Processing Studio 🚀

A modern, AI-powered web application for professional image processing and document conversion. Built with React, TypeScript, and cutting-edge AI technologies.

## ✨ Features

### 🎨 AI-Powered Image Processing
- **Background Removal**: Remove backgrounds from any image with AI precision
- **Image Upscaling**: Transform low-resolution images into crystal-clear HD quality
- **Manual Editor**: Fine-tune your images with advanced editing tools

### 📄 Document Conversion
- **PDF Converter**: Convert various file formats to PDF and vice versa
- **PDF to PowerPoint**: Convert PDFs to PowerPoint presentations with text extraction or image-based conversion for exact design preservation
- **File Compression**: Reduce file sizes while maintaining quality
- **Multi-format Support**: Handle images, documents, and more

### 🛠️ Advanced Tools
- **Before/After Comparison**: Visual comparison of processed images
- **Background Customizer**: Replace backgrounds with custom images or colors
- **Batch Processing**: Process multiple files efficiently

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **AI/ML**: TensorFlow.js + DeepLab models
- **State Management**: TanStack Query
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives
- **File Processing**: Fabric.js, PDF-lib

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd file-fab-forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   ├── tools/          # Tool-specific components
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── utils/              # Utility functions and AI processing
├── hooks/              # Custom React hooks
└── lib/                # Library configurations
```

## 🎯 Key Features Explained

### AI Background Removal
- Uses TensorFlow.js with DeepLab models
- Processes images client-side for privacy
- Supports various image formats
- Real-time preview and processing

### Image Upscaling
- AI-powered upscaling algorithms
- Multiple quality options
- Batch processing support
- Before/after comparison tools

### Document Conversion
- PDF to image conversion
- Image to PDF conversion
- PDF to PowerPoint conversion with two modes:
  - Text-based: Extracts text and creates structured slides
  - Image-based: Converts each PDF page to an image for exact design preservation
- Multiple format support
- Compression options

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

## 🌟 Features in Detail

### Background Removal
- Drag & drop interface
- Real-time processing
- Multiple export formats
- Quality settings

### Image Upscaling
- AI-powered enhancement
- Multiple scale factors
- Quality preservation
- Batch processing

### Document Tools
- PDF conversion
- File compression
- Format validation
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check the Help Center
- **Issues**: Report bugs via GitHub Issues
- **Contact**: Reach out through the Contact page

## 🔮 Roadmap

- [ ] Video processing capabilities
- [ ] Cloud storage integration
- [ ] Advanced AI models
- [ ] Mobile app development
- [ ] API for developers

---

**Built with ❤️ using modern web technologies**
