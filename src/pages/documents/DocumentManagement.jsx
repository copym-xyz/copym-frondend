import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { 
  Search, Filter, Folder, File, 
  Download, Eye, Trash2, Upload 
} from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const DocumentManagement = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Document fetching
  const { data: documents } = useQuery(['documents', search, category], 
    () => api.get('/documents', { params: { search, category } })
  );

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (files) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });
      return api.post('/documents/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Update progress state
        }
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (docId) => api.delete(`/documents/${docId}`)
  });

  // Dropzone setup
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
      uploadMutation.mutate(acceptedFiles);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    }
  });

  // Document preview component
  const DocumentPreview = ({ document }) => {
    if (!document) return null;

    return (
      <Dialog>
        <div className="p-4">
          {document.type.startsWith('image/') ? (
            <img 
              src={document.url} 
              alt={document.name}
              className="max-w-full h-auto" 
            />
          ) : (
            <iframe
              src={document.url}
              className="w-full h-[600px]"
              title={document.name}
            />
          )}
        </div>
      </Dialog>
    );
  };

  // Document categories
  const categories = [
    { id: 'ownership', label: 'Ownership' },
    { id: 'certification', label: 'Certification' },
    { id: 'quality', label: 'Quality Reports' },
    { id: 'legal', label: 'Legal Documents' }
  ];

  // Bulk actions
  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        // Handle bulk delete
        break;
      case 'download':
        // Handle bulk download
        break;
      case 'move':
        // Handle bulk move
        break;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleBulkAction('delete')}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
            <Button variant="outline" onClick={() => handleBulkAction('download')}>
              <Download className="h-4 w-4 mr-2" />
              Download Selected
            </Button>
          </div>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-lg p-6 text-center mb-6"
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supported formats: PDF, JPG, PNG (max 10MB)
          </p>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents?.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {doc.category} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewDoc(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.url)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {uploadMutation.isLoading && doc.progress < 100 && (
                <Progress value={doc.progress} className="mt-2" />
              )}
            </Card>
          ))}
        </div>
      </Card>

      {/* Preview Dialog */}
      <DocumentPreview document={previewDoc} />
    </div>
  );
};

export default DocumentManagement;