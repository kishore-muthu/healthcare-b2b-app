import React, { useState, useEffect } from 'react';
import {
  Users, AlertTriangle, BedDouble, CalendarCheck,
  TrendingUp, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import TopBar from '../components/TopBar';
import { mockStats, admissionsData, mockPatients } from '../utils/mockData';

const StatCard: React.FC<{
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: string;
  trend?: { up: boolean; text: string };
  delay?: number;
}> = ({ label, value, sub, icon, color, trend, delay = 0 }) => (
  <div className="card" style={{
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    animation: `fadeIn 0.4s ease ${delay}s both`,
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          padding: '3px 8px',
          borderRadius: 6,
          background: trend.up ? 'var(--green-dim)' : 'var(--red-dim)',
          fontSize: '11px',
          fontWeight: 600,
          color: trend.up ? 'var(--green)' : 'var(--red)',
        }}>
          {trend.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {trend.text}
        </div>
      )}
    </div>
    <div>
      <div style={{ fontSize: '28px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: 3 }}>{label}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const recentPatients = mockPatients.slice(0, 5);

  const statusColor: Record<string, string> = {
    Critical: 'badge-critical',
    Stable: 'badge-stable',
    Improving: 'badge-improving',
    Admitted: 'badge-admitted',
    Discharged: 'badge-discharged',
  };

  return (
    <>
      <TopBar title="Dashboard" subtitle={`${dateStr} · ${timeStr}`} />
      <div className="page-body">
        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--teal) 0%, #0D8870 60%, #0A7A65 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeIn 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -20, top: -30,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />
          <div style={{
            position: 'absolute', right: 80, bottom: -40,
            width: 140, height: 140, borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }} />
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'white', marginBottom: 6 }}>
              Good morning, Dr. Admin
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              You have <strong style={{ color: 'white' }}>{mockStats.criticalCases} critical cases</strong> requiring review today.
              {' '}<strong style={{ color: 'white' }}>{mockStats.appointmentsToday} appointments</strong> are scheduled.
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Bed Availability
            </div>
            <div style={{ fontSize: '36px', fontFamily: 'var(--font-display)', color: 'white', lineHeight: 1 }}>
              {mockStats.bedsAvailable}
              <span style={{ fontSize: '16px', opacity: 0.6 }}> / 331</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>beds available now</div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}>
          <StatCard
            label="Total Patients"
            value={mockStats.totalPatients}
            sub="Currently admitted"
            icon={<Users size={18} color="var(--teal)" />}
            color="var(--teal-dim)"
            trend={{ up: true, text: '+8 today' }}
            delay={0.05}
          />
          <StatCard
            label="Critical Cases"
            value={mockStats.criticalCases}
            sub="Require immediate attention"
            icon={<AlertTriangle size={18} color="var(--red)" />}
            color="var(--red-dim)"
            trend={{ up: false, text: '+2 since 6am' }}
            delay={0.1}
          />
          <StatCard
            label="Recovery Rate"
            value={`${mockStats.recoveryRate}%`}
            sub="30-day rolling average"
            icon={<TrendingUp size={18} color="var(--green)" />}
            color="var(--green-dim)"
            trend={{ up: true, text: '+1.2% vs last month' }}
            delay={0.15}
          />
          <StatCard
            label="Avg. Stay Duration"
            value={`${mockStats.avgStayDays}d`}
            sub="Per patient this month"
            icon={<Clock size={18} color="var(--blue)" />}
            color="var(--blue-dim)"
            trend={{ up: true, text: '-0.4d improved' }}
            delay={0.2}
          />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Admissions trend */}
          <div className="card" style={{ padding: '20px 22px', animation: 'fadeIn 0.5s ease 0.25s both' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Admissions & Discharges
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monthly overview — last 7 months</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={admissionsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A6E5C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0A6E5C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="discGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, boxShadow: 'var(--shadow-md)' }}
                />
                <Area type="monotone" dataKey="admissions" stroke="#0A6E5C" strokeWidth={2} fill="url(#admGrad)" name="Admissions" />
                <Area type="monotone" dataKey="discharges" stroke="#1D4ED8" strokeWidth={2} fill="url(#discGrad)" name="Discharges" />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Appointment stats */}
          <div className="card" style={{ padding: '20px 22px', animation: 'fadeIn 0.5s ease 0.3s both' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Today's Schedule
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Appointments by department</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[
                  { dept: 'Cardio', count: 9 },
                  { dept: 'Pulmo', count: 6 },
                  { dept: 'Onco', count: 5 },
                  { dept: 'General', count: 11 },
                  { dept: 'Ortho', count: 7 },
                ]}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
                <Bar dataKey="count" fill="var(--teal)" radius={[4, 4, 0, 0]} name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent patients */}
        <div className="card" style={{ padding: '20px 22px', animation: 'fadeIn 0.5s ease 0.35s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Recent Admissions</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Latest patients admitted today</div>
            </div>
            <a href="/patients" style={{
              fontSize: '12px',
              color: 'var(--teal)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 500,
            }}>
              View all <ArrowUpRight size={13} />
            </a>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Patient', 'ID', 'Condition', 'Ward', 'Doctor', 'Status'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left',
                    padding: '6px 12px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p, i) => (
                <tr key={p.id} style={{
                  borderBottom: i < recentPatients.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background var(--transition)',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'var(--teal-dim)',
                        color: 'var(--teal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {p.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.age}y · {p.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{p.id}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p.condition}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.ward.split('—')[0].trim()}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p.doctor}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span className={`badge badge-${p.status.toLowerCase()}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
