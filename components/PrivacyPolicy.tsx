import React from 'react';

const PrivacyPolicy = () => {
  const settings = {
    appName: "Connecting Dots",
    email: "nabin31bogati@gmail.com",
    lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  };

  const colors = {
    background: '#2D3250',
    cardBackground: '#424769',
    accent: '#7077A1',
    highlight: '#F6B17A',
    surface: '#363B5E',
    textPrimary: '#F5F5F5',
    textSecondary: '#B8BFD8',
    success: '#A8D8B9',
    warning: '#E8A87C'
  };

  return (
    <main style={{ 
      padding: '40px 20px', 
      maxWidth: '100%', 
      margin: '0', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: colors.textPrimary,
      backgroundColor: colors.background,
      minHeight: '100vh',
      lineHeight: '1.6',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          borderBottom: `2px solid ${colors.accent}`, 
          paddingBottom: '10px',
          color: colors.highlight,
          marginBottom: '10px'
        }}>
          Privacy Policy
        </h1>
        <p style={{ color: colors.textSecondary, marginBottom: '30px' }}>
          Last updated: {settings.lastUpdated}
        </p>

        <section style={{ 
          backgroundColor: colors.cardBackground, 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: `1px solid ${colors.surface}`
        }}>
          <p>
            <strong style={{ color: colors.highlight }}>{settings.appName}</strong> does not collect, store, or share any personal information or user data. We are committed to protecting your privacy.
          </p>
        </section>

        <section style={{ 
          backgroundColor: colors.cardBackground, 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: `1px solid ${colors.surface}`
        }}>
          <h3 style={{ color: colors.highlight, marginTop: '0' }}>Information Collection</h3>
          <p>
            We do not collect any personally identifiable information, usage data, or any other form of user data through this app.
          </p>
        </section>

        <section style={{ 
          backgroundColor: colors.cardBackground, 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: `1px solid ${colors.surface}`
        }}>
          <h3 style={{ color: colors.highlight, marginTop: '0' }}>Third Party Services</h3>
          <p>
            The app uses Google Play Services for distribution. Please refer to Google's privacy policy for information on how they handle data:
          </p>
          <ul style={{ color: colors.textSecondary }}>
            <li>
              <a 
                href="https://www.google.com/policies/privacy/" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: colors.accent, textDecoration: 'none' }}
                onMouseOver={(e) => e.target.style.color = colors.highlight}
                onMouseOut={(e) => e.target.style.color = colors.accent}
              >
                Google Play Services Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        <section style={{ 
          backgroundColor: colors.cardBackground, 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: `1px solid ${colors.surface}`
        }}>
          <h3 style={{ color: colors.highlight, marginTop: '0' }}>Cookies</h3>
          <p>
            This app does not use cookies or any tracking technologies.
          </p>
        </section>

        <section style={{ 
          backgroundColor: colors.cardBackground, 
          padding: '20px', 
          borderRadius: '8px',
          border: `1px solid ${colors.surface}`
        }}>
          <h3 style={{ color: colors.highlight, marginTop: '0' }}>Contact Us</h3>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at:
            <br />
            <a 
              href={`mailto:${settings.email}`}
              style={{ color: colors.accent, textDecoration: 'none' }}
              onMouseOver={(e) => e.target.style.color = colors.highlight}
              onMouseOut={(e) => e.target.style.color = colors.accent}
            >
              {settings.email}
            </a>
          </p>
        </section>
      </div>
    </main>
  );
};

export default PrivacyPolicy;