import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import BlogForm from './components/BlogForm';
import StatusDisplay from './components/StatusDisplay';
import BlogPreview from './components/BlogPreview';
import './App.css';

interface BlogFormData {
  title: string;
  primaryKeywords: string;
  angle: string;
  cta: string;
}

interface StatusUpdate {
  status: string;
  message: string;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [blogData, setBlogData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5001');
    setSocket(newSocket);

    newSocket.on('status', (data: StatusUpdate) => {
      setStatusUpdates(prev => [...prev, data]);
      setCurrentStatus(data.status);
      
      if (data.status === 'completed' || data.status === 'error') {
        setIsGenerating(false);
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSubmit = async (formData: BlogFormData) => {
    if (!socket) return;

    setIsGenerating(true);
    setStatusUpdates([]);
    setCurrentStatus('');
    setBlogData(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5001'}/api/blog/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-socket-id': socket.id || ''
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate blog');
      }

      // Store the blog data for display
      setBlogData(result);
    } catch (error) {
      console.error('Error generating blog:', error);
      setStatusUpdates(prev => [...prev, { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      }]);
      setIsGenerating(false);
    }
  };

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handleEditClick = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleUpdateField = async (field: string, value: string) => {
    if (!blogData?.data?.id) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5001'}/api/blog/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: blogData.data.id,
          field,
          value
        })
      });

      if (response.ok) {
        // Update local state
        setBlogData((prev: any) => ({
          ...prev,
          data: {
            ...prev.data,
            [field]: value
          }
        }));
      }
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const handleRegenerateImage = async (imageField: string, prompt: string) => {
    if (!blogData?.data?.id) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5001'}/api/blog/regenerate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: blogData.data.id,
          imageField,
          prompt
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state with new image URL
        setBlogData((prev: any) => ({
          ...prev,
          data: {
            ...prev.data,
            [imageField]: result.imageUrl
          }
        }));
      }
    } catch (error) {
      console.error('Error regenerating image:', error);
    }
  };

  return (
    <div className="App">
      <video 
        className="background-video"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source 
          src="https://salt-videos.b-cdn.net/social_bcardea_httpss.mj.run_KZ4fswCQ30_The_little_cartoon_salt_shak_ab0333c1-48d8-429a-922f-94dba5f7c245_2.mov" 
          type="video/mp4" 
        />
      </video>
      <div className="container">
        <header className="header">
          <div className="header-logo">
            <img 
              src="https://salt-videos.b-cdn.net/Salt%20Logos/Icon_Hand_BW.png" 
              alt="Salt Creative Logo" 
            />
            <h1>Salt Creative Blog Generator</h1>
          </div>
          <p>Generate complete blog posts with AI-powered content and images</p>
        </header>

        <main className="main">
          <div className="form-section">
            <BlogForm onSubmit={handleSubmit} isGenerating={isGenerating} />
          </div>

          {statusUpdates.length > 0 && (
            <div className="status-section">
              <StatusDisplay 
                statusUpdates={statusUpdates}
                currentStatus={currentStatus}
                isGenerating={isGenerating}
                blogData={blogData}
                onPreviewClick={handlePreviewClick}
                onEditClick={handleEditClick}
              />
            </div>
          )}
        </main>

        {showPreview && blogData && (
          <BlogPreview
            blogData={blogData}
            onClose={handleClosePreview}
            onUpdate={handleUpdateField}
            onRegenerateImage={handleRegenerateImage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
