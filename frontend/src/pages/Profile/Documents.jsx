import React, { useState } from 'react';

// SVG Icons
const EyeIcon = ({ size = 20, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DownloadIcon = ({ size = 20, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const FileTextIcon = ({ size = 20, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const ImageIcon = ({ size = 20, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const DocumentVerificationPage = ({ documents }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Function to determine file type
  const getFileType = (url) => {
    if (!url) return null;
    const extension = url.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const pdfExtensions = ['pdf'];
    
    if (imageExtensions.includes(extension)) return 'image';
    if (pdfExtensions.includes(extension)) return 'pdf';
    return 'unknown';
  };

  // Render document preview component
  const DocumentPreview = ({ label, url }) => {
    const fileType = getFileType(url);

    const renderPreview = () => {
      switch(fileType) {
        case 'image':
          return (
            <img 
              src={url} 
              alt={`${label} preview`} 
              className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
            />
          );
        case 'pdf':
          return (
            <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
              <FileTextIcon size={64} className="text-red-500 mb-4" />
              <p className="text-gray-700">PDF Document</p>
            </div>
          );
        default:
          return (
            <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">Unsupported File Type</p>
            </div>
          );
      }
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {fileType === 'image' && <ImageIcon size={20} />}
            {fileType === 'pdf' && <FileTextIcon size={20} />}
            <span className="text-sm text-gray-600 truncate max-w-[200px]">
              Document
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedDocument({ url, label, fileType })}
              className="ml-3 text-blue-600 hover:text-blue-800 transition-colors"
              title="View Document"
            >
              <EyeIcon />
            </button>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 transition-colors"
              title="Download Document"
            >
              <DownloadIcon />
            </a>
          </div>
        </div>
        {selectedDocument?.label === label && renderPreview()}
      </div>
    );
  };

  // Modal for full document preview
  const DocumentModal = () => {
    if (!selectedDocument) return null;

    const renderModalContent = () => {
      switch(selectedDocument.fileType) {
        case 'image':
          return (
            <img 
              src={selectedDocument.url} 
              alt={`${selectedDocument.label} full preview`} 
              className="max-w-full max-h-[80vh] object-contain"
            />
          );
        case 'pdf':
          return (
            <iframe 
              src={selectedDocument.url} 
              width="100%" 
              height="100%" 
              title={`${selectedDocument.label} PDF`}
            />
          );
        default:
          return <p>Unable to preview this document</p>;
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setSelectedDocument(null)}
      >
        <div 
          className="bg-white rounded-lg p-8 overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{selectedDocument.label}</h2>
            <button 
              onClick={() => setSelectedDocument(null)}
              className="text-red-500 hover:text-red-700"
            >
              Close
            </button>
          </div>
          {renderModalContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="pmax-w-4xl mx-auto">
        <div className="pl-10 flex gap-10 justify-center">
          <DocumentPreview 
            label="Profile Image" 
            url={documents.profile.url}
          />
          <DocumentPreview 
            label="Government ID" 
            url={documents.govId.url} 
          />
          <DocumentPreview 
            label="Business License" 
            url={documents.businessLicense.url} 
          />
          <DocumentPreview 
            label="Tax Document" 
            url={documents.taxDocument.url}  
          />
        </div>
      </div>

      {selectedDocument && <DocumentModal />}
    </div>
  );
};

export default DocumentVerificationPage;