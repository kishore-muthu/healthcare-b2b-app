import React, { useState, useMemo } from 'react';
import {
  Search, LayoutGrid, List, Filter, ChevronDown,
  Heart, Wind, Thermometer, Activity, Phone, Mail,
  Calendar, User, Droplet, X
} from 'lucide-react';
import TopBar from '../components/TopBar';
import { mockPatients } from '../utils/mockData';
import type { Patient } from '../types';

type View = 'grid' | 'list';
type StatusFilter = 'All' | Patient['status'];

const statusClass: Record<string, string> = {
  Critical: 'badge-critical',
  Stable: 'badge-stable',
  Improving: 'badge-improving',
  Admitted: 'badge-admitted',
  Discharged: 'badge-discharged',
};

const VitalChip: React.FC<{ icon: React.ReactNode; label: string; value: string; alert?: boolean }> = ({ icon, label, value, alert }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 8px',
    background: alert ? 'var(--red-dim)' : 'var(--bg)',
    borderRadius: 7,
    border: `1px solid ${alert ? '#FECACA' : 'var(--border)'}`,
  }}>
    <span style={{ color: alert ? 'var(--red)' : 'var(--text-muted)', display: 'flex' }}>{icon}</span>
    <div>
      <div style={{ fontSize: '10px', color: alert ? 'var(--red)' : 'var(--text-muted)', lineHeight: 1.2 }}>{label}</div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: alert ? 'var(--red)' : 'var(--text-primary)', lineHeight: 1.2 }}>{value}</div>
    </div>
  </div>
);

const GridCard: React.FC<{ patient: Patient; onSelect: (p: Patient) => void }> = ({ patient: p, onSelect }) => {
  const isAlert = p.status === 'Critical';
  return (
    <div
      className="card"
      onClick={() => onSelect(p)}
      style={{
        padding: '20px',
        cursor: 'pointer',
        transition: 'box-shadow var(--transition), transform var(--transition)',
        borderTop: isAlert ? '3px solid var(--red)' : '3px solid var(--teal)',
        animation: 'fadeIn 0.35s ease both',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
        (e.currentTarget as HTMLDivElement).style.transform = 'none';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: isAlert ? 'var(--red-dim)' : 'var(--teal-dim)',
          color: isAlert ? 'var(--red)' : 'var(--teal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {p.avatar}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {p.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 1 }}>
            {p.id} · {p.age}y · {p.gender}
          </div>
        </div>
        <span className={`badge ${statusClass[p.status]}`}>{p.status}</span>
      </div>

      {/* Condition */}
      <div style={{
        padding: '8px 10px',
        background: 'var(--bg)',
        borderRadius: 7,
        marginBottom: 12,
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 2 }}>Diagnosis</div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{p.condition}</div>
      </div>

      {/* Vitals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
        <VitalChip icon={<Heart size={11} />} label="Heart Rate" value={`${p.vitals.heartRate} bpm`} alert={p.vitals.heartRate > 100} />
        <VitalChip icon={<Activity size={11} />} label="BP" value={p.vitals.bloodPressure} alert={parseInt(p.vitals.bloodPressure) > 140} />
        <VitalChip icon={<Thermometer size={11} />} label="Temp" value={`${p.vitals.temperature}°C`} alert={p.vitals.temperature > 38} />
        <VitalChip icon={<Wind size={11} />} label="SpO₂" value={`${p.vitals.oxygen}%`} alert={p.vitals.oxygen < 93} />
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 2 }}>{p.ward}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.doctor}</div>
      </div>
    </div>
  );
};

const ListRow: React.FC<{ patient: Patient; onSelect: (p: Patient) => void }> = ({ patient: p, onSelect }) => {
  const isAlert = p.status === 'Critical';
  return (
    <tr
      onClick={() => onSelect(p)}
      style={{ cursor: 'pointer', transition: 'background var(--transition)', animation: 'fadeIn 0.25s ease both' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: isAlert ? 'var(--red-dim)' : 'var(--teal-dim)',
            color: isAlert ? 'var(--red)' : 'var(--teal)',
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
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.age}y · {p.gender} · {p.bloodType}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px 14px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)', background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>{p.id}</span>
      </td>
      <td style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p.condition}</div>
      </td>
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: '12px', color: p.vitals.heartRate > 100 ? 'var(--red)' : 'var(--text-secondary)' }}>
            ❤ {p.vitals.heartRate}
          </span>
          <span style={{ fontSize: '12px', color: p.vitals.oxygen < 93 ? 'var(--red)' : 'var(--text-secondary)' }}>
            O₂ {p.vitals.oxygen}%
          </span>
          <span style={{ fontSize: '12px', color: p.vitals.temperature > 38 ? 'var(--red)' : 'var(--text-secondary)' }}>
            {p.vitals.temperature}°
          </span>
        </div>
      </td>
      <td style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.ward.split('—')[0].trim()}</div>
      </td>
      <td style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p.doctor}</div>
      </td>
      <td style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.admittedDate}</div>
      </td>
      <td style={{ padding: '12px 14px' }}>
        <span className={`badge ${statusClass[p.status]}`}>{p.status}</span>
      </td>
    </tr>
  );
};

const PatientDrawer: React.FC<{ patient: Patient; onClose: () => void }> = ({ patient: p, onClose }) => {
  const isAlert = p.status === 'Critical';
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ flex: 1, background: 'rgba(13,31,45,0.4)', backdropFilter: 'blur(2px)' }}
      />
      {/* Panel */}
      <div style={{
        width: 420,
        background: 'var(--surface)',
        height: '100%',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideIn 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: isAlert ? 'var(--red-dim)' : 'var(--teal-dim)',
          borderBottom: `1px solid ${isAlert ? '#FECACA' : 'var(--teal-mid)'}`,
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: isAlert ? 'var(--red)' : 'var(--teal)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
              }}>
                {p.avatar}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                  {p.id} · {p.age} years · {p.gender}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(0,0,0,0.08)', borderRadius: 8, padding: 6, display: 'flex', lineHeight: 0 }}
            >
              <X size={16} color="var(--text-secondary)" />
            </button>
          </div>
          <span className={`badge ${statusClass[p.status]}`}>{p.status}</span>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Vitals */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Current Vitals
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <VitalChip icon={<Heart size={13} />} label="Heart Rate" value={`${p.vitals.heartRate} bpm`} alert={p.vitals.heartRate > 100} />
              <VitalChip icon={<Activity size={13} />} label="Blood Pressure" value={p.vitals.bloodPressure} alert={parseInt(p.vitals.bloodPressure) > 140} />
              <VitalChip icon={<Thermometer size={13} />} label="Temperature" value={`${p.vitals.temperature}°C`} alert={p.vitals.temperature > 38} />
              <VitalChip icon={<Wind size={13} />} label="Oxygen Sat." value={`${p.vitals.oxygen}%`} alert={p.vitals.oxygen < 93} />
            </div>
          </div>

          {/* Medical info */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Medical Information
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Diagnosis', value: p.condition, icon: <Activity size={13} /> },
                { label: 'Ward & Bed', value: p.ward, icon: <User size={13} /> },
                { label: 'Attending Physician', value: p.doctor, icon: <User size={13} /> },
                { label: 'Blood Type', value: p.bloodType, icon: <Droplet size={13} /> },
                { label: 'Admitted', value: p.admittedDate, icon: <Calendar size={13} /> },
                { label: 'Last Review', value: p.lastVisit, icon: <Calendar size={13} /> },
              ].map((item) => (
                <div key={item.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 12px',
                  background: 'var(--bg)',
                  borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{item.icon}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Patient Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a href={`tel:${p.phone}`} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', background: 'var(--bg)', borderRadius: 8,
                textDecoration: 'none',
              }}>
                <Phone size={13} color="var(--teal)" />
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p.phone}</span>
              </a>
              <a href={`mailto:${p.email}`} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', background: 'var(--bg)', borderRadius: 8,
                textDecoration: 'none',
              }}>
                <Mail size={13} color="var(--teal)" />
                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p.email}</span>
              </a>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              flex: 1,
              padding: '10px',
              background: 'var(--teal)',
              color: 'white',
              borderRadius: 9,
              fontSize: '13px',
              fontWeight: 600,
            }}>
              Update Record
            </button>
            <button style={{
              flex: 1,
              padding: '10px',
              background: 'var(--bg)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 9,
              fontSize: '13px',
              fontWeight: 500,
            }}>
              Schedule Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PatientsPage: React.FC = () => {
  const [view, setView] = useState<View>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [selected, setSelected] = useState<Patient | null>(null);

  const statuses: StatusFilter[] = ['All', 'Critical', 'Stable', 'Improving', 'Admitted', 'Discharged'];

  const filtered = useMemo(() => {
    return mockPatients.filter((p) => {
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.doctor.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [search, statusFilter]);

  return (
    <>
      <TopBar title="Patient Details" subtitle={`${filtered.length} patients shown · ${mockPatients.filter(p => p.status === 'Critical').length} critical`} />
      <div className="page-body">
        {/* Controls bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          animation: 'fadeIn 0.3s ease',
        }}>
          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 9,
            padding: '9px 14px',
            flex: 1,
            maxWidth: 320,
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, condition, ID, doctor…"
              style={{ background: 'none', border: 'none', fontSize: '13px', color: 'var(--text-primary)', width: '100%' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', display: 'flex' }}>
                <X size={12} color="var(--text-muted)" />
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 8,
                  fontSize: '12px',
                  fontWeight: 500,
                  background: statusFilter === s ? 'var(--teal)' : 'var(--surface)',
                  color: statusFilter === s ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${statusFilter === s ? 'var(--teal)' : 'var(--border)'}`,
                  transition: 'all var(--transition)',
                }}
              >
                {s}
                {s !== 'All' && (
                  <span style={{
                    marginLeft: 5,
                    background: statusFilter === s ? 'rgba(255,255,255,0.2)' : 'var(--bg)',
                    color: statusFilter === s ? 'white' : 'var(--text-muted)',
                    padding: '1px 5px',
                    borderRadius: 4,
                    fontSize: '10px',
                  }}>
                    {mockPatients.filter(p => p.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto' }}>
            {/* View toggle */}
            <div style={{
              display: 'flex',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 9,
              overflow: 'hidden',
            }}>
              {(['grid', 'list'] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  title={`${v.charAt(0).toUpperCase() + v.slice(1)} view`}
                  style={{
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '12px',
                    fontWeight: 500,
                    background: view === v ? 'var(--teal)' : 'transparent',
                    color: view === v ? 'white' : 'var(--text-muted)',
                    borderRight: v === 'grid' ? '1px solid var(--border)' : 'none',
                    transition: 'all var(--transition)',
                  }}
                >
                  {v === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
                  {v === 'grid' ? 'Grid' : 'List'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '32px', marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>No patients match your criteria</div>
            <div style={{ fontSize: '12px', marginTop: 4 }}>Try adjusting your search or filters</div>
          </div>
        )}

        {/* Grid view */}
        {view === 'grid' && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {filtered.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <GridCard patient={p} onSelect={setSelected} />
              </div>
            ))}
          </div>
        )}

        {/* List view */}
        {view === 'list' && filtered.length > 0 && (
          <div className="card" style={{ overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                  {['Patient', 'ID', 'Condition', 'Vitals', 'Ward', 'Doctor', 'Admitted', 'Status'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <React.Fragment key={p.id}>
                    <ListRow patient={p} onSelect={setSelected} />
                    {i < filtered.length - 1 && (
                      <tr><td colSpan={8} style={{ padding: 0, borderBottom: '1px solid var(--border-subtle)' }} /></tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient drawer */}
      {selected && <PatientDrawer patient={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default PatientsPage;
