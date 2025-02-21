import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Camera, Upload, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/dashboard/image-upload';
import { EmotionChart } from '@/components/dashboard/emotion-chart';



export function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'history'>('upload');

  const handleSignOut = async () => {

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">EmotiSense AI</h1>
          <div className="flex items-center gap-4">

            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            onClick={() => setActiveTab('upload')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button
            variant={activeTab === 'camera' ? 'default' : 'outline'}
            onClick={() => setActiveTab('camera')}
          >
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
              <ImageUpload />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Emotion Analysis</h2>
              <EmotionChart />
            </div>
          </div>
        </div>
      </main>
      

    </div>
  );
}