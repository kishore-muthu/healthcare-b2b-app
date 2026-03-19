import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import TopBar from '../components/TopBar';
import { admissionsData, wardOccupancyData, conditionDistribution, mockStats } from '../utils/mockData';

const SectionHeader: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</div>
  </div>
);

const KpiPill: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div style={{
    flex: 1,
    padding: '14px 16px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    borderLeft: `4px solid ${color}`,
  }}>
    <div style={{ fontSize: '22px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{value}</div>
    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 3 }}>{label}</div>
  </div>
);

const COLORS = conditionDistribution.map(d => d.color);

const AnalyticsPage: React.FC = () => {
  const radialData = wardOccupancyData.map(w => ({
    ...w,
    fill: '#0A6E5C',
    pct: Math.round((w.occupied / w.capacity) * 100),
  }));

  return (
    <>
      <TopBar title="Analytics" subtitle="Clinical performance insights & operational metrics" />
      <div className="page-body">

        {/* KPI Row */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 24, animation: 'fadeIn 0.3s ease' }}>
          <KpiPill label="Total Patients (MTD)" value={String(mockStats.totalPatients)} color="var(--teal)" />
          <KpiPill label="Critical Cases Active" value={String(mockStats.criticalCases)} color="var(--red)" />
          <KpiPill label="Recovery Rate (30d)" value={`${mockStats.recoveryRate}%`} color="var(--green)" />
          <KpiPill label="Avg. Stay Duration" value={`${mockStats.avgStayDays} days`} color="var(--blue)" />
          <KpiPill label="Appointments Today" value={String(mockStats.appointmentsToday)} color="var(--amber)" />
        </div>

        {/* Row 1: Admissions trend + Condition pie */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 16 }}>
          <div className="card" style={{ padding: '20px 22px', animation: 'fadeIn 0.4s ease 0.05s both' }}>
            <SectionHeader title="Admissions vs Discharges" sub="7-month trend comparison" />
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={admissionsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ga1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A6E5C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0A6E5C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ga2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[150, 310]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#0A6E5C" strokeWidth={2.5} fill="url(#ga1)" dot={{ r: 3, fill: '#0A6E5C' }} />
                <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#1D4ED8" strokeWidth={2.5} fill="url(#ga2)" dot={{ r: 3, fill: '#1D4ED8' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: '20px 22px', animation: 'fadeIn 0.4s ease 0.1s both' }}>
            <SectionHeader title="Patient Condition Mix" sub="Distribution by diagnosis category" />
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={conditionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {conditionDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val}%`, '']}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 8 }}>
              {conditionDistribution.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{d.name} <strong>{d.value}%</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Ward occupancy bar + radial */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="card" style={{ padding: '20px 22px', animation: 'fadeIn 0.4s ease 0.15s both' }}>
            <SectionHeader title="Ward Occupancy" sub="Occupied vs total capacity by department" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={wardOccupancyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="ward" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="capacity" name="Capacity" fill="var(--border)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="occupied" name="Occupied" fill="var(--teal)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: '20px 22px', animation: 'fadeIn 0.4s ease 0.2s both' }}>
            <SectionHeader title="Occupancy Rate by Ward (%)" sub="Percentage of beds currently in use" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              {wardOccupancyData.map((w) => {
                const pct = Math.round((w.occupied / w.capacity) * 100);
                const barColor = pct > 90 ? 'var(--red)' : pct > 75 ? 'var(--amber)' : 'var(--teal)';
                return (
                  <div key={w.ward}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{w.ward}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 7, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: barColor,
                        borderRadius: 4,
                        transition: 'width 1s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
                      {w.occupied} / {w.capacity} beds
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 3: Monthly net flow */}
        <div className="card" style={{ padding: '20px 22px', animation: 'fadeIn 0.4s ease 0.25s both' }}>
          <SectionHeader title="Net Patient Flow (Monthly)" sub="Admissions minus discharges — positive indicates net inflow" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={admissionsData.map(d => ({ ...d, net: d.admissions - d.discharges }))}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="net" name="Net Flow" radius={[4, 4, 0, 0]}>
                {admissionsData.map((_, i) => (
                  <Cell key={i} fill="var(--teal)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
