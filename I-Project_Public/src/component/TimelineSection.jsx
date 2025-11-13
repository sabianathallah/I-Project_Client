import { useState, useEffect } from 'react';
import { timelineBackground } from '../assets/timelineImages';

/**
 * Timeline Section Component dengan Multiple Display Options
 * 
 * Props:
 * - displayMode: 'contain' | 'cover' | 'blur' | 'frame' | 'split'
 * - overlayStrength: 'none' | 'subtle' | 'medium' | 'strong'
 * - children: Timeline content
 */

export default function TimelineSection({ 
  displayMode = 'contain',
  overlayStrength = 'medium',
  children 
}) {

  // Gradient options
  const overlayStyles = {
    none: 'transparent',
    subtle: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
    medium: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.8) 100%)',
    strong: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.85) 100%)'
  };

  // Display mode styles
  const getBackgroundStyle = () => {
    switch(displayMode) {
      case 'cover':
        return {
          backgroundImage: `url(${timelineBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          position: 'relative',
          minHeight: '100vh'
        };
      
      case 'contain':
        return {
          backgroundImage: `url(${timelineBackground})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
          backgroundColor: '#1a1a1a',
          position: 'relative',
          minHeight: '100vh'
        };
      
      case 'blur':
        // Handled separately with multiple divs
        return {
          position: 'relative',
          backgroundColor: '#000',
          minHeight: '100vh'
        };
      
      case 'frame':
        return {
          backgroundColor: '#0a0a0a',
          padding: '4rem 0',
          minHeight: '100vh'
        };
      
      case 'split':
        // Handled separately with flex layout
        return {
          backgroundColor: '#0a0a0a',
          minHeight: '100vh'
        };
      
      default:
        return getBackgroundStyle('contain');
    }
  };

  // Render based on display mode
  if (displayMode === 'blur') {
    return (
      <section className="timeline-section" id="timeline">
        {/* Blur Background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${timelineBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px)',
          opacity: 0.4,
          zIndex: 0
        }}></div>
        
        {/* Main Photo */}
        <div style={{
          position: 'relative',
          backgroundImage: `url(${timelineBackground})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          zIndex: 1
        }}>
          {/* Overlay */}
          {overlayStrength !== 'none' && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: overlayStyles[overlayStrength],
              zIndex: 2
            }}></div>
          )}
          
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 3 }}>
            {children}
          </div>
        </div>
      </section>
    );
  }

  if (displayMode === 'frame') {
    return (
      <section className="timeline-section" id="timeline" style={getBackgroundStyle()}>
        {/* Photo Frame */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto 3rem',
          padding: '0 2rem'
        }}>
          <div style={{
            border: '12px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            background: '#1a1a1a'
          }}>
            <img 
              src={timelineBackground} 
              alt="Timeline Background"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        </div>
        
        {/* Content */}
        {children}
      </section>
    );
  }

  if (displayMode === 'split') {
    return (
      <section className="timeline-section" id="timeline" style={getBackgroundStyle()}>
        <div style={{ 
          display: 'flex',
          minHeight: '100vh',
          flexWrap: 'wrap'
        }}>
          {/* Left: Photo */}
          <div style={{
            flex: '0 0 45%',
            backgroundImage: `url(${timelineBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'sticky',
            top: 0,
            height: '100vh',
            minWidth: '400px'
          }}></div>
          
          {/* Right: Content */}
          <div style={{
            flex: '1',
            padding: '4rem',
            backgroundColor: '#0f0f0f',
            minWidth: '400px'
          }}>
            {children}
          </div>
        </div>
      </section>
    );
  }

  // Default: cover or contain
  return (
    <section 
      className="timeline-section" 
      id="timeline"
      style={getBackgroundStyle()}
    >
      {/* Overlay */}
      {overlayStrength !== 'none' && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: overlayStyles[overlayStrength],
          zIndex: 1
        }}></div>
      )}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </section>
  );
}

/* 
CARA PAKAI DI landingPage.jsx:

import TimelineSection from '../component/TimelineSection';

// Di dalam return():
<TimelineSection displayMode="contain" overlayStrength="medium">
  <div className="container">
    <h2 className="section-title" style={{ textAlign: 'center', color: 'white' }}>
      Garis Waktu Sejarah
    </h2>
    <p className="section-subtitle" style={{ textAlign: 'center', color: 'white' }}>
      Perjalanan penting dalam kehidupan dan kepemimpinan Presiden Soeharto
    </p>
  </div>
  
  <div className="timeline">
    {periods.map((period) => (
      <TimelineItem key={period.id} {...period} />
    ))}
  </div>
</TimelineSection>

OPTIONS:
- displayMode: 'contain', 'cover', 'blur', 'frame', 'split'
- overlayStrength: 'none', 'subtle', 'medium', 'strong'
*/
