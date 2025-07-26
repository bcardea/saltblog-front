import React, { useState } from 'react';
import './BlogForm.css';

interface BlogFormData {
  title: string;
  primaryKeywords: string;
  angle: string;
  cta: string;
}

interface BlogFormProps {
  onSubmit: (data: BlogFormData) => void;
  isGenerating: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, isGenerating }) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    primaryKeywords: '',
    angle: '',
    cta: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.primaryKeywords || !formData.angle || !formData.cta) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="blog-form">
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Blog Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your blog post title"
            disabled={isGenerating}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="primaryKeywords">Primary Keywords</label>
          <input
            type="text"
            id="primaryKeywords"
            name="primaryKeywords"
            value={formData.primaryKeywords}
            onChange={handleChange}
            placeholder="Enter primary keywords (comma separated)"
            disabled={isGenerating}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="angle">Target Angle</label>
          <textarea
            id="angle"
            name="angle"
            value={formData.angle}
            onChange={handleChange}
            placeholder="Describe the angle or approach for this blog post"
            disabled={isGenerating}
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cta">Call to Action</label>
          <textarea
            id="cta"
            name="cta"
            value={formData.cta}
            onChange={handleChange}
            placeholder="Enter the desired call to action for SALT Creative"
            disabled={isGenerating}
            rows={2}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating Blog...' : 'Generate Blog Post'}
        </button>
      </form>
    </div>
  );
};

export default BlogForm;