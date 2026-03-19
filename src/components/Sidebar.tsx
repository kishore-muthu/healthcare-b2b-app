import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  LogOut,
  Cross,
  Activity,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/patients', icon: Users, label: 'Patient Details' },
];

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'AD';

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Cross size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              color: 'white',
              lineHeight: 1.2,
            }}>MediFlow</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Healthcare Platform
            </div>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div style={{
        margin: '16px 16px 8px',
        padding: '8px 12px',
        background: 'rgba(10,110,92,0.15)',
        border: '1px solid rgba(10,110,92,0.3)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#34D399',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 500 }}>
          System Online
        </div>
        <Activity size={12} color="#34D399" style={{ marginLeft: 'auto' }} />
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 12px', overflow: 'hidden' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 8px 4px' }}>
          Navigation
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 9,
              textDecoration: 'none',
              marginBottom: 2,
              background: isActive ? 'var(--teal)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
              fontWeight: isActive ? 500 : 400,
              fontSize: '14px',
              transition: 'all var(--transition)',
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains('active')) {
                el.style.background = 'rgba(255,255,255,0.07)';
                el.style.color = 'rgba(255,255,255,0.85)';
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (!el.classList.contains('active')) {
                el.style.background = 'transparent';
                el.style.color = 'rgba(255,255,255,0.55)';
              }
            }}
          >
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div style={{
        padding: '12px 12px 20px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderRadius: 9,
          marginBottom: 4,
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: 'white',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.displayName || 'Admin User'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '9px 12px',
            borderRadius: 9,
            background: 'transparent',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '13px',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = '#FCA5A5';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)';
          }}
        >
          <LogOut size={15} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
