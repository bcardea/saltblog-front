import React, { useState } from 'react';
import './BlogPreview.css';

interface BlogPreviewProps {
  blogData: any;
  onClose: () => void;
  onUpdate: (field: string, value: string) => void;
  onRegenerateImage: (imageField: string, prompt: string) => void;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ 
  blogData, 
  onClose, 
  onUpdate,
  onRegenerateImage 
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [imagePrompts, setImagePrompts] = useState<{[key: string]: string}>({});

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const handleSave = () => {
    if (editingField) {
      onUpdate(editingField, editValue);
      setEditingField(null);
      setEditValue('');
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleImageRegenerate = (imageField: string) => {
    const prompt = imagePrompts[imageField];
    if (prompt?.trim()) {
      onRegenerateImage(imageField, prompt);
      setImagePrompts(prev => ({ ...prev, [imageField]: '' }));
    }
  };

  const renderEditableText = (field: string, value: string, isTextarea: boolean = false) => {
    if (editingField === field) {
      return (
        <div className="edit-container">
          {isTextarea ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="edit-textarea"
              rows={4}
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="edit-input"
            />
          )}
          <div className="edit-actions">
            <button onClick={handleSave} className="btn-save">Save</button>
            <button onClick={handleCancel} className="btn-cancel">Cancel</button>
          </div>
        </div>
      );
    }

    return (
      <div className="editable-text" onClick={() => handleEdit(field, value)}>
        {isTextarea ? (
          <div className="text-content">{value}</div>
        ) : (
          <span>{value}</span>
        )}
        <span className="edit-icon">✏️</span>
      </div>
    );
  };

  const renderImageSection = (imageField: string, imageUrl: string) => (
    <div className="image-section">
      <img src={imageUrl} alt="Blog section" className="blog-image" />
      <div className="image-controls">
        <input
          type="text"
          placeholder="Enter new image prompt..."
          value={imagePrompts[imageField] || ''}
          onChange={(e) => setImagePrompts(prev => ({ ...prev, [imageField]: e.target.value }))}
          className="image-prompt-input"
        />
        <button 
          onClick={() => handleImageRegenerate(imageField)}
          className="btn-regenerate"
          disabled={!imagePrompts[imageField]?.trim()}
        >
          Regenerate
        </button>
      </div>
    </div>
  );

  if (!blogData?.data) return null;

  const blog = blogData.data;

  return (
    <div className="blog-preview-overlay">
      <div className="blog-preview">
        <div className="preview-header">
          <h2>Blog Preview & Editor</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="preview-content">
          {/* Title */}
          <div className="preview-section">
            <h1 className="blog-title">
              {renderEditableText('title', blog.title)}
            </h1>
          </div>

          {/* Subtitle */}
          <div className="preview-section">
            <div className="blog-subtitle">
              {renderEditableText('sub_title', blog.sub_title)}
            </div>
          </div>

          {/* Cover Image */}
          <div className="preview-section">
            <h3>Cover Image</h3>
            {renderImageSection('cover_image', blog.cover_image)}
          </div>

          {/* Section 1 */}
          <div className="preview-section">
            <h2 className="section-heading">
              {renderEditableText('heading1', blog.heading1)}
            </h2>
            <div className="section-body">
              {renderEditableText('body1', blog.body1, true)}
            </div>
            {renderImageSection('image1', blog.image1)}
          </div>

          {/* Section 2 */}
          <div className="preview-section">
            <h2 className="section-heading">
              {renderEditableText('heading2', blog.heading2)}
            </h2>
            <div className="section-body">
              {renderEditableText('body2', blog.body2, true)}
            </div>
            {renderImageSection('image2', blog.image2)}
          </div>

          {/* Section 3 */}
          <div className="preview-section">
            <h2 className="section-heading">
              {renderEditableText('heading3', blog.heading3)}
            </h2>
            <div className="section-body">
              {renderEditableText('body3', blog.body3, true)}
            </div>
            {renderImageSection('image3', blog.image3)}
          </div>

          {/* Section 4 */}
          <div className="preview-section">
            <h2 className="section-heading">
              {renderEditableText('heading4', blog.heading4)}
            </h2>
            <div className="section-body">
              {renderEditableText('body4', blog.body4, true)}
            </div>
            {renderImageSection('image4', blog.image4)}
          </div>

          {/* Conclusion */}
          <div className="preview-section">
            <h3>Conclusion</h3>
            <div className="conclusion">
              {renderEditableText('conclusion', blog.conclusion, true)}
            </div>
          </div>

          {/* Final CTA */}
          <div className="preview-section">
            <h3>Call to Action</h3>
            <div className="final-cta">
              {renderEditableText('final_cta', blog.final_cta, true)}
            </div>
          </div>

          {/* Meta Info */}
          <div className="preview-section meta-section">
            <h3>SEO & Meta Information</h3>
            <div className="meta-item">
              <label>Meta Description:</label>
              {renderEditableText('meta_description', blog.meta_description)}
            </div>
            <div className="meta-item">
              <label>Target Key Phrase:</label>
              {renderEditableText('target_key_phrase', blog.target_key_phrase)}
            </div>
            <div className="meta-item">
              <label>Tags:</label>
              <span>{Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;