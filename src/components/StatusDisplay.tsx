import React from 'react';
import './StatusDisplay.css';

interface StatusUpdate {
  status: string;
  message: string;
}

interface StatusDisplayProps {
  statusUpdates: StatusUpdate[];
  currentStatus: string;
  isGenerating: boolean;
  blogData?: any;
  onPreviewClick?: () => void;
  onEditClick?: () => void;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ 
  statusUpdates, 
  currentStatus, 
  isGenerating,
  blogData,
  onPreviewClick,
  onEditClick
}) => {
  const steps = [
    { key: 'started', label: 'Starting', description: 'Initializing blog generation...' },
    { key: 'outline', label: 'Outline', description: 'Creating blog structure...' },
    { key: 'article', label: 'Writing', description: 'Generating article content...' },
    { key: 'parsing', label: 'Processing', description: 'Organizing content sections...' },
    { key: 'image-prompts', label: 'Planning', description: 'Creating image concepts...' },
    { key: 'cover-image', label: 'Cover Image', description: 'Generating cover image...' },
    { key: 'section-images', label: 'Section Images', description: 'Creating section images...' },
    { key: 'saving', label: 'Saving', description: 'Storing to database...' },
    { key: 'completed', label: 'Complete', description: 'Blog post ready!' }
  ];

  const getCurrentStep = () => {
    const stepIndex = steps.findIndex(step => step.key === currentStatus);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const currentStep = getCurrentStep();
  const latestUpdate = statusUpdates[statusUpdates.length - 1];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="status-display">
      <h3>Generation Progress</h3>
      
      {isGenerating && (
        <div className="modern-status">
          <div className="current-step">
            <div className="step-icon">
              <div className="spinner"></div>
            </div>
            <div className="step-content">
              <h4>{steps[currentStep]?.label || 'Processing'}</h4>
              <p>{latestUpdate?.message || steps[currentStep]?.description}</p>
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="step-counter">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      )}

      {currentStatus === 'completed' && blogData && (
        <div className="completion-section">
          <div className="completion-header">
            <div className="success-icon">🎉</div>
            <h4>Blog Post Generated Successfully!</h4>
          </div>
          
          <div className="blog-actions">
            <div className="blog-link">
              <h5>🔗 Live Blog URL:</h5>
              <a 
                href={`https://usesaltcreative.com/blog/${blogData.blogId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="preview-link"
              >
                https://usesaltcreative.com/blog/{blogData.blogId}
              </a>
            </div>
            
            <div className="action-buttons">
              <button className="btn-preview" onClick={onPreviewClick}>Preview Content</button>
              <button className="btn-edit" onClick={onEditClick}>Edit & Regenerate</button>
            </div>
          </div>
        </div>
      )}

      {currentStatus === 'error' && (
        <div className="error-section">
          <div className="error-icon">❌</div>
          <h4>Generation Failed</h4>
          <p>{latestUpdate?.message || 'An error occurred during generation.'}</p>
          <button className="btn-retry">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default StatusDisplay;