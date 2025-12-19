// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Mail, Linkedin, Instagram, FileText, Briefcase } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = 'https://tungyftcqatetuaqvopx.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1bmd5ZnRjcWF0ZXR1YXF2b3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTU4NzYsImV4cCI6MjA4MDc3MTg3Nn0.CQbC641UX2ECQZgNxO9ksDLa_WiIpzhPSlt7kqJ-SOc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// MINISITE PREVIEW COMPONENT
// ============================================
function MinisitePreview({ profileData }: { profileData: any }) {
type ThemeConfig = {
  light: {
    container: { background: string; color: string; backgroundImage?: string };
    photo: { border: string; borderRadius: string; clipPath: string; boxShadow?: string };
    name: { color: string; fontFamily: string };
    bio: { color: string };
    link: { background: string; color: string; border: string };
  };
  dark: {
    container: { background: string; color: string; backgroundImage?: string };
    photo: { border: string; borderRadius: string; clipPath: string; boxShadow?: string };
    name: { color: string; fontFamily: string };
    bio: { color: string };
    link: { background: string; color: string; border: string };
  };
  retro: {
    container: { background: string; color: string; backgroundImage?: string };
    photo: { border: string; borderRadius: string; clipPath: string; boxShadow?: string };
    name: { color: string; fontFamily: string };
    bio: { color: string };
    link: { background: string; color: string; border: string };
  };
};

const themes: ThemeConfig = {
    light: {
      container: {
        background: 'white',
        color: '#1e1e1e'
      },
      photo: {
        border: '3px solid #f3f4f6',
        borderRadius: '60px',
        clipPath: 'none'
      },
      name: {
        color: '#1e1e1e',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      },
      bio: {
        color: '#666'
      },
      link: {
        background: '#f9fafb',
        color: '#1e1e1e',
        border: 'none'
      }
    },
    dark: {
      container: {
        background: '#0a0a0a',
        color: '#ffffff'
      },
      photo: {
        border: '1px solid #333',
        borderRadius: '60px',
        clipPath: 'none',
        boxShadow: 'none'
      },
      name: {
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      },
      bio: {
        color: '#a0a0a0'
      },
      link: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        color: '#ffffff',
        border: '1px solid #333'
      }
    },
    retro: {
      container: {
        background: '#FFF5E6',
        color: '#6B4423',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(245, 222, 179, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 182, 185, 0.2) 0%, transparent 50%)'
      },
      photo: {
        border: '4px solid #E67E50',
        borderRadius: '0',
        clipPath: 'polygon(50% 0%, 61% 5%, 71% 3%, 79% 10%, 85% 15%, 90% 23%, 93% 32%, 95% 42%, 95% 50%, 95% 58%, 93% 68%, 90% 77%, 85% 85%, 79% 90%, 71% 97%, 61% 95%, 50% 100%, 39% 95%, 29% 97%, 21% 90%, 15% 85%, 10% 77%, 7% 68%, 5% 58%, 5% 50%, 5% 42%, 7% 32%, 10% 23%, 15% 15%, 21% 10%, 29% 3%, 39% 5%)'
      },
      name: {
        color: '#D35D6E',
        fontFamily: '"Comic Neue", "Pangolin", cursive, system-ui'
      },
      bio: {
        color: '#6B4423'
      },
      link: {
        background: 'linear-gradient(135deg, #FFB6B9 0%, #FEC8C9 100%)',
        color: '#6B4423',
        border: '3px solid #E67E50'
      }
    }
  };
  
  const currentTheme = themes[theme];
  
  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      ...(currentTheme.container.backgroundImage 
        ? { backgroundImage: currentTheme.container.backgroundImage, backgroundColor: currentTheme.container.background }
        : { background: currentTheme.container.background }
      ),
      borderRadius: '16px',
      padding: '48px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Retro decorative elements */}
      {theme === 'retro' && (
        <>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            fontSize: '20px',
            opacity: 0.3
          }}>✦</div>
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '16px',
            opacity: 0.3
          }}>❀</div>
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '14px',
            opacity: 0.3,
            display: 'flex',
            gap: '12px'
          }}>
            <span>✦</span>
            <span>•</span>
            <span>❀</span>
            <span>•</span>
            <span>✦</span>
          </div>
        </>
      )}
      
      {/* Profile Photo */}
      {profileData.photo ? (
        <div style={{
          width: '120px',
          height: '120px',
          clipPath: currentTheme.photo.clipPath,
          borderRadius: currentTheme.photo.clipPath === 'none' ? currentTheme.photo.borderRadius : '0',
          overflow: 'hidden',
          marginBottom: '24px',
          border: currentTheme.photo.border,
          boxShadow: currentTheme.photo.boxShadow || 'none'
        }}>
          <img 
            src={profileData.photo} 
            alt="Profile" 
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      ) : (
        <div style={{
          width: '120px',
          height: '120px',
          clipPath: currentTheme.photo.clipPath,
          borderRadius: currentTheme.photo.clipPath === 'none' ? currentTheme.photo.borderRadius : '0',
          background: theme === 'dark' ? '#1a1a1a' : '#f3f4f6',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme === 'dark' ? '#666' : '#9ca3af',
          border: currentTheme.photo.border
        }}>
          <Upload size={32} />
        </div>
      )}

      {/* Name */}
      <h2 style={{ 
        fontSize: theme === 'retro' ? '26px' : '24px',
        fontWeight: '700',
        marginBottom: '12px',
        color: currentTheme.name.color,
        textAlign: 'center',
        fontFamily: currentTheme.name.fontFamily
      }}>
        {theme === 'retro' && '✦ '}
        {profileData.name || 'Your Name'}
        {theme === 'retro' && ' ✦'}
      </h2>

      {/* Bio */}
      <p style={{ 
        fontSize: theme === 'retro' ? '16px' : '15px',
        lineHeight: '1.6',
        color: currentTheme.bio.color,
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        {profileData.bio || 'Your bio will appear here...'}
      </p>

      {/* Links */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        marginBottom: '24px',
        width: '100%'
      }}>
        {profileData.email && (
          <a href={`mailto:${profileData.email}`} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: currentTheme.link.background,
            borderRadius: theme === 'retro' ? '12px' : '8px',
            textDecoration: 'none',
            color: currentTheme.link.color,
            fontSize: '14px',
            fontWeight: theme === 'retro' ? '600' : '400',
            border: currentTheme.link.border,
            transition: 'transform 0.2s'
          }}>
            <Mail size={18} />
            <span>{theme === 'retro' ? 'Drop me a line' : 'Email'}</span>
          </a>
        )}
        {profileData.linkedin && (
          <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: currentTheme.link.background,
            borderRadius: theme === 'retro' ? '12px' : '8px',
            textDecoration: 'none',
            color: currentTheme.link.color,
            fontSize: '14px',
            fontWeight: theme === 'retro' ? '600' : '400',
            border: currentTheme.link.border,
            transition: 'transform 0.2s'
          }}>
            <Linkedin size={18} />
            <span>{theme === 'retro' ? "Let's connect" : 'LinkedIn'}</span>
          </a>
        )}
        {profileData.instagram && (
          <a href={profileData.instagram} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: currentTheme.link.background,
            borderRadius: theme === 'retro' ? '12px' : '8px',
            textDecoration: 'none',
            color: currentTheme.link.color,
            fontSize: '14px',
            fontWeight: theme === 'retro' ? '600' : '400',
            border: currentTheme.link.border,
            transition: 'transform 0.2s'
          }}>
            <Instagram size={18} />
            <span>{theme === 'retro' ? 'See my snaps' : 'Instagram'}</span>
          </a>
        )}
        {profileData.portfolio && (
          <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: currentTheme.link.background,
            borderRadius: theme === 'retro' ? '12px' : '8px',
            textDecoration: 'none',
            color: currentTheme.link.color,
            fontSize: '14px',
            fontWeight: theme === 'retro' ? '600' : '400',
            border: currentTheme.link.border,
            transition: 'transform 0.2s'
          }}>
            <Briefcase size={18} />
            <span>{theme === 'retro' ? 'Check out my work' : 'Portfolio'}</span>
          </a>
        )}
        {profileData.cv && (
          <a href={profileData.cv} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: currentTheme.link.background,
            borderRadius: theme === 'retro' ? '12px' : '8px',
            textDecoration: 'none',
            color: currentTheme.link.color,
            fontSize: '14px',
            fontWeight: theme === 'retro' ? '600' : '400',
            border: currentTheme.link.border,
            transition: 'transform 0.2s'
          }}>
            <FileText size={18} />
            <span>{theme === 'retro' ? 'Grab my CV' : 'CV/Resume'}</span>
          </a>
        )}
      </div>
    </div>
  );
}

// ============================================
// PUBLIC VIEWER PAGE
// ============================================
export default function ViewerPage({ params }: { params: { minisite_id: string } }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMinisite = async () => {
      try {
        const { data, error } = await supabase
          .from('minisites')
          .select('*')
          .eq('minisite_id', params.minisite_id)
          .single();

        if (error) throw error;

        if (data) {
          setProfileData({
            photo: data.photo_url,
            name: data.name,
            bio: data.bio,
            email: data.email || '',
            linkedin: data.linkedin || '',
            instagram: data.instagram || '',
            portfolio: data.portfolio || '',
            cv: data.cv || '',
            theme: data.theme || 'light'
          });
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Error fetching minisite:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchMinisite();
  }, [params.minisite_id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e5e5',
            borderTopColor: '#1e1e1e',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#666' }}>Loading profile...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
          padding: '32px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px',
            color: '#1e1e1e'
          }}>
            Profile Not Found
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '24px'
          }}>
            This profile doesn't exist or has been removed.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#1e1e1e',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Create Your Own Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9fafb',
      padding: '24px'
    }}>
      <MinisitePreview profileData={profileData} />
    </div>
  );
}
