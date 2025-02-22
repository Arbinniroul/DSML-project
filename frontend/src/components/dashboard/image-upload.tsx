import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  loading: boolean;
}

export function ImageUpload({ onUpload, loading }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('File size too large (max 5MB)');
          return;
        }
        setSelectedFile(file);
      }
    },
    []
  );

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  }, [selectedFile, onUpload]);

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <Button variant="outline" asChild>
          <div>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Select Image
          </div>
        </Button>
      </label>
      
      {selectedFile && !loading && (
        <Button onClick={handleUpload}>
          Analyze Image
        </Button>
      )}
    </div>
  );
}