import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Cross, AlertCircle, Stethoscope } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login, user, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // error handled by context
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--text-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(10,110,92,0.12) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(10,110,92,0.08) 0%, transparent 40%),
          radial-gradient(circle at 60% 80%, rgba(10,110,92,0.06) 0%, transparent 35%)`,
      }} />

      {/* Left panel — branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'none' : 'translateX(-20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 60 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: 'var(--teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Cross size={22} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'white' }}>
            MediFlow
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '48px',
          color: 'white',
          lineHeight: 1.15,
          marginBottom: 20,
          maxWidth: 480,
        }}>
          Intelligent Care, <em>Connected</em> Workflows
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: 400, lineHeight: 1.7, marginBottom: 48 }}>
          A modern clinical operations platform built for hospitals, clinics, and healthcare networks.
        </p>

        {/* Feature bullets */}
        {[
          { icon: Stethoscope, text: 'Real-time patient monitoring & vitals tracking' },
          { icon: Stethoscope, text: 'Unified dashboard for clinical decision support' },
          { icon: Stethoscope, text: 'Analytics across departments and care pathways' },
        ].map((f, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 14,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'none' : 'translateY(10px)',
            transition: `opacity 0.5s ease ${0.2 + i * 0.1}s, transform 0.5s ease ${0.2 + i * 0.1}s`,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'rgba(10,110,92,0.2)',
              border: '1px solid rgba(10,110,92,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Cross size={14} color="#34D399" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{f.text}</span>
          </div>
        ))}

        {/* Bottom badge */}
        <div style={{
          position: 'absolute',
          bottom: 30,
          left: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            HIPAA Compliant · SOC 2 Type II · ISO 27001
          </span>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        width: 460,
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'none' : 'translateX(20px)',
        transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
      }}>
        <div style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-primary)', marginBottom: 8 }}>
            Sign in to MediFlow
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Enter your credentials to access the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'var(--bg)',
                border: '1.5px solid var(--border)',
                borderRadius: 9,
                fontSize: '14px',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--teal)'; e.target.style.background = 'white'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)'; }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '11px 42px 11px 14px',
                  background: 'var(--bg)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 9,
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--teal)'; e.target.style.background = 'white'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  display: 'flex',
                }}
              >
                {showPassword ? <EyeOff size={15} color="var(--text-muted)" /> : <Eye size={15} color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {displayError && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '10px 12px',
              background: 'var(--red-dim)',
              border: '1px solid #FECACA',
              borderRadius: 8,
              animation: 'fadeIn 0.2s ease',
            }}>
              <AlertCircle size={14} color="var(--red)" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'var(--red)' }}>{displayError}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '13px',
              background: loading ? 'rgba(10,110,92,0.6)' : 'var(--teal)',
              color: 'white',
              borderRadius: 9,
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget).style.background = 'var(--teal-light)'; }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget).style.background = 'var(--teal)'; }}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
          <button
  type="button"
  onClick={() => {
    setEmail('demo@mediflow.com');
    setPassword('Demo@123');
  }}
  style={{
    width: '100%',
    padding: '13px',
    background: 'transparent',
    color: 'var(--teal)',
    border: '1.5px solid var(--teal)',
    borderRadius: 9,
    fontSize: '14px',
    fontWeight: 600,
    marginTop: 8,
    cursor: 'pointer',
  }}
>
  👁 Try Demo Account
</button>
        </form>

        {/* Demo notice
        <div style={{
          marginTop: 28,
          padding: '12px 14px',
          background: 'var(--teal-dim)',
          border: '1px solid var(--teal-mid)',
          borderRadius: 9,
        }}>
          <p style={{ fontSize: '12px', color: 'var(--teal)', lineHeight: 1.6 }}>
            <strong>Demo:</strong> Create a Firebase project, add your config to <code>.env</code>, and sign up a user to log in. Or configure an email/password user in Firebase Console.
          </p>
        </div> */}

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 28 }}>
          © 2026 MediFlow Inc. · HIPAA Compliant Platform
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
