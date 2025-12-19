// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import { Upload, Mail, Linkedin, Instagram, FileText, Briefcase, ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = 'https://tungyftcqatetuaqvopx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1bmd5ZnRjcWF0ZXR1YXF2b3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTU4NzYsImV4cCI6MjA4MDc3MTg3Nn0.CQbC641UX2ECQZgNxO9ksDLa_WiIpzhPSlt7kqJ-SOc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Generate random ID for minisite
const generateMinisiteId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export default function PocketProfile() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [profileData, setProfileData] = useState({
    photo: '', 
    name: 'Your Name',
    bio: 'Add a short bio about yourself here',
    email: 'you@example.com',
    linkedin: 'linkedin.com/in/yourprofile',
    instagram: 'instagram.com/yourhandle',
    portfolio: 'yourportfolio.com',
    cv: '',
    minisiteId: generateMinisiteId(),
    theme: 'light'
  });
  const [errors, setErrors] = useState({});

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Please upload an image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Image must be less than 5MB' }));
      return;
    }

    // Use base64
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, photo: e.target.result }));
        setErrors(prev => ({ ...prev, photo: '' }));
        console.log('Photo uploaded successfully (base64)');
      };
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, photo: 'Failed to upload photo. Please try again.' }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrors(prev => ({ ...prev, photo: 'Failed to upload photo. Please try again.' }));
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!profileData.photo) newErrors.photo = 'Profile photo is required';
    if (!profileData.name.trim() || profileData.name === 'Your Name') newErrors.name = 'Name is required';
    if (!profileData.bio.trim() || profileData.bio === 'Add a short bio about yourself here') newErrors.bio = 'Bio is required';
    
    const placeholderValues = ['you@example.com', 'linkedin.com/in/yourprofile', 'instagram.com/yourhandle', 'yourportfolio.com'];
    const hasRealLink = (profileData.email && !placeholderValues.includes(profileData.email)) || 
                        (profileData.linkedin && !placeholderValues.includes(profileData.linkedin)) || 
                        (profileData.instagram && !placeholderValues.includes(profileData.instagram)) || 
                        (profileData.portfolio && !placeholderValues.includes(profileData.portfolio)) || 
                        profileData.cv;
    if (!hasRealLink) {
      newErrors.links = 'At least one contact link is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStep1Valid = () => {
    const placeholderValues = ['you@example.com', 'linkedin.com/in/yourprofile', 'instagram.com/yourhandle', 'yourportfolio.com'];
    const hasRealLink = (profileData.email && !placeholderValues.includes(profileData.email)) || 
                        (profileData.linkedin && !placeholderValues.includes(profileData.linkedin)) || 
                        (profileData.instagram && !placeholderValues.includes(profileData.instagram)) || 
                        (profileData.portfolio && !placeholderValues.includes(profileData.portfolio)) || 
                        profileData.cv;
    return profileData.photo && 
           profileData.name.trim() && 
           profileData.name !== 'Your Name' &&
           profileData.bio.trim() && 
           profileData.bio !== 'Add a short bio about yourself here' &&
           hasRealLink;
  };

  const handleGenerateQRCode = async () => {
  console.log('🎯 Generating profile...');
  
  // Prevent duplicate submissions
  if (isGenerating) return;
  setIsGenerating(true);

  if (!validateStep1()) {
    console.log('❌ Validation failed');
    setIsGenerating(false);
    return;
  }

  try {
    console.log('✅ Validation passed, saving to Supabase...');
    
    // ... rest of your existing code ...
    
  } catch (error) {
    console.error('❌ Error saving profile:', error);
    alert('Failed to save your profile. Please try again.');
    setIsGenerating(false);
  }
};

    try {
      console.log('✅ Validation passed, saving to Supabase...');
      
      // Filter out placeholder values
      const placeholderValues = ['you@example.com', 'linkedin.com/in/yourprofile', 'instagram.com/yourhandle', 'yourportfolio.com'];
      
      // Save to Supabase (public insert)
      const { data, error } = await supabase
        .from('minisites')
        .insert({
          minisite_id: profileData.minisiteId,
          name: profileData.name,
          bio: profileData.bio,
          photo_url: profileData.photo,
          email: (profileData.email && !placeholderValues.includes(profileData.email)) ? profileData.email : null,
          linkedin: (profileData.linkedin && !placeholderValues.includes(profileData.linkedin)) ? profileData.linkedin : null,
          instagram: (profileData.instagram && !placeholderValues.includes(profileData.instagram)) ? profileData.instagram : null,
          portfolio: (profileData.portfolio && !placeholderValues.includes(profileData.portfolio)) ? profileData.portfolio : null,
          cv: profileData.cv || null,
          theme: profileData.theme,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log('✅ Profile saved successfully!');
      setStep(2);
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      alert('Failed to save your profile. Please try again.');
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleStartOver = () => {
    setProfileData({
      photo: '',
      name: '',
      bio: '',
      email: '',
      linkedin: '',
      instagram: '',
      portfolio: '',
      cv: '',
      minisiteId: generateMinisiteId(),
      theme: 'light'
    });
    setErrors({});
    setStep(1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {step === 1 && (
        <Step1 
          profileData={profileData}
          errors={errors}
          handlePhotoUpload={handlePhotoUpload}
          handleInputChange={handleInputChange}
          handleGenerateQRCode={handleGenerateQRCode}
          isFormValid={isStep1Valid()}
        />
      )}

      {step === 2 && (
        <Step2 
          profileData={profileData}
          handleBack={handleBack}
          handleStartOver={handleStartOver}
        />
      )}
    </div>
  );
}

// Step 1: Create Profile
function Step1({ profileData, errors, handlePhotoUpload, handleInputChange, handleGenerateQRCode, isFormValid }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexWrap: 'wrap' }}>
      {/* Left side - Form */}
      <div style={{ 
        flex: '1 1 500px',
        padding: '60px 40px',
        overflowY: 'auto',
        maxWidth: '600px',
        background: 'white'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          marginBottom: '8px',
          color: '#1e1e1e'
        }}>
          Pocket Profile
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#666',
          marginBottom: '40px'
        }}>
          Turn your lock screen into your intro card
        </p>

        {/* Theme Selector */}
        <div style={{ marginBottom: '40px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e1e1e',
            marginBottom: '12px'
          }}>
            Choose Theme
          </label>
          
          <div style={{
            display: 'inline-flex',
            padding: '4px',
            background: '#e5e5e5',
            borderRadius: '12px',
            gap: '0'
          }}>
            <button
              onClick={() => handleInputChange('theme', 'light')}
              style={{
                padding: '12px 28px',
                background: profileData.theme === 'light' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: profileData.theme === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontSize: '20px'
              }}
            >
              ☀️
            </button>
            <button
              onClick={() => handleInputChange('theme', 'dark')}
              style={{
                padding: '12px 28px',
                background: profileData.theme === 'dark' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: profileData.theme === 'dark' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontSize: '20px'
              }}
            >
              🌙
            </button>
            <button
              onClick={() => handleInputChange('theme', 'retro')}
              style={{
                padding: '12px 28px',
                background: profileData.theme === 'retro' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: profileData.theme === 'retro' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontSize: '20px'
              }}
            >
              ⚡
            </button>
          </div>
          
          <p style={{
            fontSize: '13px',
            color: '#666',
            marginTop: '8px'
          }}>
            Preview updates in real-time →
          </p>
        </div>

        {/* Photo Upload */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#1e1e1e'
          }}>
            Profile Photo <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            {profileData.photo ? (
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <img 
                  src={profileData.photo} 
                  alt="Profile" 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '60px',
                    objectFit: 'cover',
                    border: '2px solid #e5e5e5'
                  }}
                />
                <label
                  htmlFor="photo-upload"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '36px',
                    height: '36px',
                    background: '#1e1e1e',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  <Upload size={16} style={{ color: 'white' }} />
                </label>
              </div>
            ) : (
              <label
                htmlFor="photo-upload"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '120px',
                  height: '120px',
                  borderRadius: '60px',
                  border: '2px dashed #d1d5db',
                  cursor: 'pointer',
                  background: '#f9fafb'
                }}
              >
                <Upload size={24} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Upload</span>
              </label>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              id="photo-upload"
            />
          </div>
          {errors.photo && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.photo}</p>}
        </div>

        {/* Name */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1e1e1e'
          }}>
            Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Your name"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: errors.name ? '1px solid #ef4444' : '1px solid #e5e5e5',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1e1e1e'
          }}>
            Bio <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="A short bio about you"
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: errors.bio ? '1px solid #ef4444' : '1px solid #e5e5e5',
              borderRadius: '8px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          {errors.bio && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.bio}</p>}
        </div>

        {/* Contact Links */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1e1e1e'
          }}>
            Contact Links <span style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}>(at least one required)</span>
          </label>
          
          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  fontSize: '14px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Linkedin size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                value={profileData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/yourprofile"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  fontSize: '14px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Instagram */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Instagram size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                value={profileData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="instagram.com/yourhandle"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  fontSize: '14px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Portfolio */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Briefcase size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                value={profileData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                placeholder="yourportfolio.com"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  fontSize: '14px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* CV */}
          <div>
            <div style={{ position: 'relative' }}>
              <FileText size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                value={profileData.cv}
                onChange={(e) => handleInputChange('cv', e.target.value)}
                placeholder="link-to-your-cv.pdf"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  fontSize: '14px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {errors.links && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{errors.links}</p>}
        </div>

        {/* CTA Button */}
        <button
  onClick={handleGenerateQRCode}
  disabled={isGenerating}
  style={{
    // ... existing styles ...
    opacity: isGenerating ? 0.6 : 1,
    cursor: isGenerating ? 'not-allowed' : 'pointer'
  }}
>
  {isGenerating ? 'Generating...' : 'Generate QR Code & Wallpaper'}
</button>
        {!isFormValid && (
          <p style={{ 
            color: '#999', 
            fontSize: '14px', 
            textAlign: 'center',
            marginTop: '12px'
          }}>
            Complete all required fields to continue
          </p>
        )}
      </div>

      {/* Right side - Preview */}
      <div style={{ 
        flex: '1 1 500px',
        background: '#f9fafb',
        padding: '5vh 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        minHeight: '100vh'
      }}>
        <div style={{ 
          marginTop: '5vh',
          marginBottom: '5vh'
        }}>
          <MinisitePreview profileData={profileData} />
        </div>
      </div>
    </div>
  );
}

// Step 2: Download Wallpapers
function Step2({ profileData, handleBack, handleStartOver }) {
  const [selectedDesign, setSelectedDesign] = useState(1); // Default to Ocean Waves
  const [qrCodeData, setQrCodeData] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [customImageLoading, setCustomImageLoading] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    const profileUrl = `${window.location.origin}/${profileData.minisiteId}`;
    
    try {
      const qrDataUrl = await QRCode.toDataURL(profileUrl, {
        width: 565,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      setQrCodeData(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleCustomImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Image is too large (max 10MB)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setCustomImageLoading(true);
    const reader = new FileReader();
    
    reader.onload = () => {
      setCustomImage(reader.result);
      setSelectedDesign(3);
      setCustomImageLoading(false);
    };
    
    reader.onerror = () => {
      alert('Failed to load image');
      setCustomImageLoading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const downloadWallpaper = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1170;
    canvas.height = 2532;
    const ctx = canvas.getContext('2d');

    // Draw background based on selected design
    if (selectedDesign === 1) {
      // Ocean Waves - tan background with wavy lines
      ctx.fillStyle = '#D4C4B0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw wavy lines at bottom
      ctx.strokeStyle = '#A8B8C8';
      ctx.lineWidth = 3;
      
      const waves = [
        { y: 2200, amplitude: 80, frequency: 0.004 },
        { y: 2300, amplitude: 60, frequency: 0.003 },
        { y: 2400, amplitude: 70, frequency: 0.0035 }
      ];
      
      waves.forEach(wave => {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = wave.y + Math.sin(x * wave.frequency) * wave.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      
      drawCard();
      
    } else if (selectedDesign === 2) {
      // Sunset Gradient - purple to pink to blue
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#B8A5D6');
      gradient.addColorStop(0.5, '#D4B5D6');
      gradient.addColorStop(1, '#A5C4D6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawCard();
      
    } else if (selectedDesign === 3 && customImage) {
      // Custom Image - fill width, scale height proportionally
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions to fill width and maintain aspect ratio
        const imgAspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        // Cover the entire canvas
        if (imgAspect > canvasAspect) {
          // Image is wider - fit to height
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgAspect;
          offsetX = -(drawWidth - canvas.width) / 2;
          offsetY = 0;
        } else {
          // Image is taller - fit to width
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgAspect;
          offsetX = 0;
          offsetY = -(drawHeight - canvas.height) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        drawCard();
      };
      img.src = customImage;
      return; // Wait for image to load
    }

    function drawCard() {
      // Draw white card in center
      const cardWidth = 700;
      const cardHeight = 800;
      const cardX = (canvas.width - cardWidth) / 2;
      const cardY = (canvas.height - cardHeight) / 2;
      const cardRadius = 40;

      // Card shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;

      // Draw rounded rectangle with 70% opacity
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Draw profile photo
      if (profileData.photo) {
        const photoImg = new Image();
        photoImg.onload = () => {
          ctx.save();
          const photoSize = 120;
          const photoX = cardX + 50;
          const photoY = cardY + 50;
          
          ctx.beginPath();
          ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
          ctx.restore();

          continueDrawing();
        };
        photoImg.src = profileData.photo;
      } else {
        continueDrawing();
      }

      function continueDrawing() {
        // Draw profile photo (if available) - horizontal layout
        const hasPhoto = !!profileData.photo;
        const photoSize = 120;
        const textStartX = hasPhoto ? cardX + 50 + photoSize + 30 : cardX + 200;
        
        if (hasPhoto && profileData.photo) {
          // Already drawn in the photo loading callback
        }
        
        // Draw text next to photo
        ctx.fillStyle = '#1e1e1e';
        ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('👋 Nice to meet you', textStartX, cardY + 80);
        
        ctx.font = '42px system-ui, -apple-system, sans-serif';
        ctx.fillText("Let's keep in touch!", textStartX, cardY + 135);

        // Draw QR code
        if (qrCodeData) {
          const qrImg = new Image();
          qrImg.onload = () => {
            const qrSize = 565;
            const qrX = cardX + (cardWidth - qrSize) / 2;
            const qrY = cardY + 200;
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

            // Download
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              const designNames = ['ocean-waves', 'sunset-gradient', 'custom'];
              a.download = `${profileData.name.replace(/\s+/g, '-')}-wallpaper-${selectedDesign}.png`;
              a.click();
              URL.revokeObjectURL(url);
            });
          };
          qrImg.src = qrCodeData;
        }
      }
    }
  };

  const profileUrl = `https://pocketprofileapp.com/${profileData.minisiteId}`;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f9fafb',
      padding: '60px 40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            background: 'transparent',
            color: '#6b7280',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '32px'
          }}
        >
          <ArrowLeft size={16} />
          Back to edit
        </button>

        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          marginBottom: '8px',
          color: '#1e1e1e'
        }}>
          Your Profile is Ready! 🎉
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#666',
          marginBottom: '40px'
        }}>
          Choose a wallpaper design and download your custom lock screen
        </p>

        {/* Profile URL */}
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          marginBottom: '48px',
          border: '1px solid #e5e5e5'
        }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>Your profile link:</p>
          <a 
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '16px',
              color: '#667eea',
              fontWeight: '500',
              textDecoration: 'none'
            }}
          >
            {profileUrl}
          </a>
        </div>

        {/* Wallpaper Design Selection */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '24px',
          color: '#1e1e1e'
        }}>
          Choose Your Design
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {/* Ocean Waves */}
          <div
            onClick={() => setSelectedDesign(1)}
            style={{
              border: selectedDesign === 1 ? '3px solid #1e1e1e' : '2px solid #e5e5e5',
              borderRadius: '16px',
              padding: '16px',
              cursor: 'pointer',
              background: 'white',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              width: '100%',
              aspectRatio: '1170/2532',
              background: 'linear-gradient(to bottom, #D4C4B0 0%, #D4C4B0 85%, #B8C8D8 100%)',
              borderRadius: '12px',
              marginBottom: '12px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <WallpaperPreview design="ocean" profileData={profileData} qrCodeData={qrCodeData} />
            </div>
            <p style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#1e1e1e',
              textAlign: 'center'
            }}>
              🌊 Ocean Waves
            </p>
          </div>

          {/* Sunset Gradient */}
          <div
            onClick={() => setSelectedDesign(2)}
            style={{
              border: selectedDesign === 2 ? '3px solid #1e1e1e' : '2px solid #e5e5e5',
              borderRadius: '16px',
              padding: '16px',
              cursor: 'pointer',
              background: 'white',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              width: '100%',
              aspectRatio: '1170/2532',
              background: 'linear-gradient(to bottom, #B8A5D6 0%, #D4B5D6 50%, #A5C4D6 100%)',
              borderRadius: '12px',
              marginBottom: '12px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <WallpaperPreview design="sunset" profileData={profileData} qrCodeData={qrCodeData} />
            </div>
            <p style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#1e1e1e',
              textAlign: 'center'
            }}>
              🌅 Sunset Gradient
            </p>
          </div>

          {/* Custom Image */}
          <div
            style={{
              border: selectedDesign === 3 ? '3px solid #1e1e1e' : '2px solid #e5e5e5',
              borderRadius: '16px',
              padding: '16px',
              background: 'white',
              transition: 'all 0.2s'
            }}
          >
            <div 
              onClick={() => setSelectedDesign(3)}
              style={{
                width: '100%',
                aspectRatio: '1170/2532',
                borderRadius: '12px',
                marginBottom: '12px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {customImage ? (
                <>
                  <img 
                    src={customImage} 
                    alt="Custom background"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <WallpaperPreview design="custom" profileData={profileData} qrCodeData={qrCodeData} />
                  </div>
                </>
              ) : (
                <div 
                  onClick={() => document.getElementById('custom-wallpaper-upload').click()}
                  style={{ 
                    textAlign: 'center', 
                    color: '#9ca3af',
                    background: '#f3f4f6',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={32} style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '12px', margin: 0 }}>
                    {customImageLoading ? 'Loading...' : 'Upload Image'}
                  </p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: '#1e1e1e',
                margin: 0
              }}>
                📸 Custom Image
              </p>
              {customImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('custom-wallpaper-upload').click();
                  }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Change
                </button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomImageUpload}
              style={{ display: 'none' }}
              id="custom-wallpaper-upload"
            />
          </div>
        </div>

        {/* Download Button */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button
            onClick={downloadWallpaper}
            style={{
              padding: '18px 48px',
              fontSize: '18px',
              fontWeight: '600',
              background: '#1e1e1e',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Download Wallpaper
          </button>
        </div>

        {/* Start Over */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleStartOver}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Create Another Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Wallpaper Preview Component
function WallpaperPreview({ design, profileData, qrCodeData }) {
  const scale = 0.25; // Increased scale for better visibility
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* White Card */}
      <div style={{
        width: `${700 * scale}px`,
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: `${40 * scale}px`,
        padding: `${40 * scale}px`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        textAlign: 'center'
      }}>
        {/* Profile Photo and Text - Horizontal Layout */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: `${20 * scale}px`,
          marginBottom: `${30 * scale}px`,
          justifyContent: 'center'
        }}>
          {/* Profile Photo */}
          {profileData.photo && (
            <div style={{
              width: `${80 * scale}px`,
              height: `${80 * scale}px`,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img 
                src={profileData.photo} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          
          {/* Text */}
          <div style={{
            fontSize: `${28 * scale}px`,
            fontWeight: '600',
            color: '#1e1e1e',
            lineHeight: 1.3,
            textAlign: 'left'
          }}>
            👋 Nice to meet you<br/>
            Let's keep in touch!
          </div>
        </div>

        {/* QR Code */}
        {qrCodeData && (
          <div style={{
            width: `${400 * scale}px`,
            height: `${400 * scale}px`,
            margin: '0 auto',
            background: 'white'
          }}>
            <img 
              src={qrCodeData} 
              alt="QR Code" 
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Minisite Preview Component
function MinisitePreview({ profileData, compact = false }) {
  const themes = {
    light: { bg: '#ffffff', text: '#1e1e1e', buttonBg: '#f3f4f6', buttonText: '#1e1e1e' },
    dark: { bg: '#1e1e1e', text: '#ffffff', buttonBg: '#374151', buttonText: '#ffffff' },
    retro: { bg: '#fef3c7', text: '#78350f', buttonBg: '#fcd34d', buttonText: '#78350f' }
  };

  const theme = themes[profileData.theme] || themes.light;
  const scale = compact ? 0.25 : 0.4;

  return (
    <div style={{
      width: `${1170 * scale}px`,
      height: `${2532 * scale}px`,
      background: theme.bg,
      borderRadius: `${40 * scale}px`,
      padding: `${80 * scale}px ${40 * scale}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      margin: '0 auto',
      overflow: 'hidden'
    }}>
      {/* Profile Photo */}
      {profileData.photo ? (
        <div style={{
          width: `${400 * scale}px`,
          height: `${400 * scale}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          marginBottom: `${40 * scale}px`,
          border: `${4 * scale}px solid ${theme.buttonBg}`
        }}>
          <img 
            src={profileData.photo} 
            alt="Profile" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div style={{
          width: `${400 * scale}px`,
          height: `${400 * scale}px`,
          borderRadius: '50%',
          marginBottom: `${40 * scale}px`,
          border: `${4 * scale}px solid ${theme.buttonBg}`,
          background: theme.buttonBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${80 * scale}px`
        }}>
          👤
        </div>
      )}

      {/* Name */}
      <h1 style={{
        fontSize: `${72 * scale}px`,
        fontWeight: '700',
        color: theme.text,
        margin: `0 0 ${20 * scale}px 0`,
        textAlign: 'center'
      }}>
        {profileData.name || 'Your Name'}
      </h1>

      {/* Bio */}
      <p style={{
        fontSize: `${36 * scale}px`,
        color: theme.text,
        opacity: 0.8,
        margin: `0 0 ${60 * scale}px 0`,
        textAlign: 'center',
        padding: `0 ${40 * scale}px`
      }}>
        {profileData.bio || 'Add a short bio about yourself here'}
      </p>

      {/* Contact Buttons */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: `${24 * scale}px`,
        padding: `0 ${60 * scale}px`
      }}>
        {profileData.email && (
          <div style={{
            padding: `${32 * scale}px`,
            background: theme.buttonBg,
            borderRadius: `${16 * scale}px`,
            textAlign: 'center',
            fontSize: `${32 * scale}px`,
            fontWeight: '600',
            color: theme.buttonText
          }}>
            📧 Drop me a line
          </div>
        )}
        {profileData.linkedin && (
          <div style={{
            padding: `${32 * scale}px`,
            background: theme.buttonBg,
            borderRadius: `${16 * scale}px`,
            textAlign: 'center',
            fontSize: `${32 * scale}px`,
            fontWeight: '600',
            color: theme.buttonText
          }}>
            💼 Let's connect
          </div>
        )}
        {profileData.instagram && (
          <div style={{
            padding: `${32 * scale}px`,
            background: theme.buttonBg,
            borderRadius: `${16 * scale}px`,
            textAlign: 'center',
            fontSize: `${32 * scale}px`,
            fontWeight: '600',
            color: theme.buttonText
          }}>
            📸 See my snaps
          </div>
        )}
        {profileData.portfolio && (
          <div style={{
            padding: `${32 * scale}px`,
            background: theme.buttonBg,
            borderRadius: `${16 * scale}px`,
            textAlign: 'center',
            fontSize: `${32 * scale}px`,
            fontWeight: '600',
            color: theme.buttonText
          }}>
            💼 Check out my work
          </div>
        )}
        {profileData.cv && (
          <div style={{
            padding: `${32 * scale}px`,
            background: theme.buttonBg,
            borderRadius: `${16 * scale}px`,
            textAlign: 'center',
            fontSize: `${32 * scale}px`,
            fontWeight: '600',
            color: theme.buttonText
          }}>
            📄 Grab my CV
          </div>
        )}
      </div>
    </div>
  );
}
