export interface WelcomeEmailTemplateProps {
  name?: string
  email: string
}

export function WelcomeEmailTemplate({ 
  name, 
  email 
}: WelcomeEmailTemplateProps) {
  return (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#1e293b', fontSize: '28px', marginBottom: '16px' }}>
        Welcome to Feedback Widget! 🎉
      </h1>
      <p style={{ color: '#64748b', fontSize: '16px', margin: '0' }}>
        Start collecting valuable user feedback in minutes
      </p>
    </div>
    
    <div style={{ padding: '40px 20px' }}>
      <p style={{ fontSize: '16px', color: '#334155', marginBottom: '24px' }}>
        Hi {name || 'there'},
      </p>
      
      <p style={{ fontSize: '16px', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
        Thanks for signing up! You're now ready to transform how you collect and manage user feedback. 
        Here's what you can do next:
      </p>
      
      <div style={{ backgroundColor: '#f1f5f9', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
        <h3 style={{ color: '#1e293b', fontSize: '18px', marginBottom: '16px', marginTop: '0' }}>
          Quick Start Guide:
        </h3>
        <ul style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Create your first project</strong> - Set up your feedback collection
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Get your embeddable widget</strong> - Copy the simple script tag
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Start collecting feedback</strong> - Watch insights roll in
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Analyze and act</strong> - Use our dashboard to prioritize improvements
          </li>
        </ul>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <a 
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
          style={{
            display: 'inline-block',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Get Started Now →
        </a>
      </div>
      
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
          Need help getting started? Reply to this email or check out our{' '}
          <a href="#" style={{ color: '#3b82f6' }}>documentation</a>.
        </p>
        
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '16px' }}>
          Happy collecting! 🚀<br/>
          The Feedback Widget Team
        </p>
      </div>
    </div>
    
    <div style={{ backgroundColor: '#f8fafc', padding: '20px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0' }}>
        You're receiving this because you signed up for Feedback Widget.
      </p>
    </div>
  </div>
  )
}