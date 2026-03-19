import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, X, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, requestPermission, permission } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const typeColors: Record<string, { bg: string; dot: string }> = {
    critical: { bg: 'var(--red-dim)', dot: 'var(--red)' },
    info: { bg: 'var(--blue-dim)', dot: 'var(--blue)' },
    success: { bg: 'var(--green-dim)', dot: 'var(--green)' },
    warning: { bg: 'var(--amber-dim)', dot: 'var(--amber)' },
  };

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</p>
        )}
      </div>

      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '7px 12px',
        width: 220,
      }}>
        <Search size={14} color="var(--text-muted)" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            color: 'var(--text-primary)',
            width: '100%',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ background: 'none', display: 'flex' }}>
            <X size={12} color="var(--text-muted)" />
          </button>
        )}
      </div>

      {/* Notification bell */}
      <div ref={panelRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setShowNotifs((s) => !s)}
          style={{
            position: 'relative',
            width: 38,
            height: 38,
            borderRadius: 9,
            background: showNotifs ? 'var(--teal-dim)' : 'var(--bg)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bell size={16} color={showNotifs ? 'var(--teal)' : 'var(--text-secondary)'} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'var(--red)',
              color: 'white',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--surface)',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification panel */}
        {showNotifs && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 340,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Notifications
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {unreadCount} unread
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: 'var(--teal-dim)',
                    color: 'var(--teal)',
                    fontSize: '11px',
                    fontWeight: 500,
                  }}
                >
                  <CheckCheck size={11} />
                  Mark all read
                </button>
              )}
            </div>

            {permission !== 'granted' && (
              <div style={{
                padding: '10px 16px',
                background: 'var(--amber-dim)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '12px', color: 'var(--amber)' }}>
                  Enable push notifications
                </span>
                <button
                  onClick={requestPermission}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 5,
                    background: 'var(--amber)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 500,
                  }}
                >
                  Enable
                </button>
              </div>
            )}

            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: n.read ? 'transparent' : typeColors[n.type]?.bg || 'var(--teal-dim)',
                    transition: 'background var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: n.read ? 'var(--border)' : typeColors[n.type]?.dot || 'var(--teal)',
                      marginTop: 5,
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: n.read ? 400 : 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {n.body}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                        {n.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
