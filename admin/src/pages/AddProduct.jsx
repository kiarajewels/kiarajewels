import React, { useState } from 'react';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [media, setMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: 'Rings',
    price: '',
    originalPrice: '',
    countInStock: '',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (media.length + files.length > 7) {
      toast.error("You can only upload up to 7 media items (images/videos) per product.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(prev => [...prev, {
          file,
          url: reader.result, // Base64 string
          type: file.type.startsWith('video/') ? 'video' : 'image'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    const newMedia = [...media];
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'v2tzrcrm');

    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/a6qehync/${resourceType}/upload`,
      formData
    );
    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const uploadedMedia = await Promise.all(
        media.map(async (m) => {
          if (m.file) {
            const url = await uploadToCloudinary(m.file);
            return { url, type: m.type };
          }
          return { url: m.url, type: m.type };
        })
      );

      const mediaArray = uploadedMedia.length > 0 
        ? uploadedMedia
        : [{ url: '/images/placeholder.png', type: 'image' }];

      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
        countInStock: Number(formData.countInStock),
        description: formData.description,
        media: mediaArray
      });

      toast.success('Product saved successfully!');
      navigate('/products');
    } catch (error) {
      console.error('Failed to add product', error);
      toast.error('Failed to add product.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link to="/products" style={{ color: '#4b5563', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', margin: 0 }}>Add New Product</h2>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Enter product details and upload media.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Basic Info */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Basic Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Product Title</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Diamond Eternity Ring" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                <option>Rings</option>
                <option>Earrings</option>
                <option>Pendants</option>
                <option>Bracelets</option>
                <option>Sets</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Price (Rs)</label>
              <input required type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" placeholder="0.00" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Original Price (Rs) - Crossed</label>
              <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} min="0" step="0.01" placeholder="0.00" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Initial Stock Quantity</label>
              <input required type="number" name="countInStock" value={formData.countInStock} onChange={handleInputChange} min="0" placeholder="0" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Description</label>
            <textarea required rows="4" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the product..." style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }}></textarea>
          </div>
        </div>

        {/* Media Upload */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', margin: 0 }}>Media (Images & Videos)</h3>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{media.length} / 7 uploaded</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
            {media.map((item, idx) => (
              <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                {item.type === 'image' ? (
                  <img src={item.url} alt={`Upload ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <button 
                  type="button"
                  onClick={() => removeMedia(idx)}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {media.length < 7 && (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', aspectRatio: '1', borderRadius: '8px', border: '2px dashed #d1d5db', backgroundColor: '#f9fafb', cursor: 'pointer', color: '#6b7280' }}>
                <Upload size={24} style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Upload</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,video/*" 
                  onChange={handleMediaUpload}
                  style={{ display: 'none' }} 
                />
              </label>
            )}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '16px' }}>Upload up to 7 high-resolution images or videos.</p>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <Link to="/products" style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>
            Cancel
          </Link>
          <button type="submit" disabled={isUploading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: 'none', borderRadius: '6px', backgroundColor: isUploading ? '#6b7280' : '#000000', color: 'white', fontWeight: '500', cursor: isUploading ? 'not-allowed' : 'pointer' }}>
            <Save size={20} />
            {isUploading ? 'Uploading...' : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;
