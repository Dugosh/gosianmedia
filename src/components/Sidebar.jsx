import React from 'react';
import GMLogo from './GMLogo';
import { TEAM_CONFIG, TEAM_ORDER } from '../data/defaultStaff';

export default function Sidebar({ activeView, onNavigate, staffList, collapsed, onToggleCollapse }) {
  const teamCounts = {};
  TEAM_ORDER.forEach(tk => {
    teamCounts[tk] = staffList.filter(s => s.team === tk).length;
  });

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>

      {/* ── Brand ─────────────────────────────────────── */}
      <div className="sidebar-brand">
        {collapsed ? (
          /* Collapsed: show small logomark only */
          <GMLogo width={36} className="sidebar-logo-mark" />
        ) : (
          /* Expanded: full logo + wordmark + slogan */
          <div className="sidebar-brand-full">
            <GMLogo width={96} glow className="sidebar-logo-mark-full" />
            <div className="sidebar-wordmark">
              <span className="brand-name">GOSIAN MEDIA</span>
              <span className="brand-slogan">Tactical Growth for the Creator Economy</span>
            </div>
          </div>
        )}
        <button
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* ── Nav ───────────────────────────────────────── */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{!collapsed && 'MENU'}</div>

        <button
          className={`nav-item ${activeView === 'dashboard' ? 'nav-active' : ''}`}
          onClick={() => onNavigate('dashboard')}
          title="Dashboard"
        >
          <span className="nav-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </span>
          {!collapsed && <span className="nav-label">Dashboard</span>}
        </button>

        <div className="nav-section-label">{!collapsed && 'TEAMS'}</div>

        {TEAM_ORDER.map(tk => {
          const cfg = TEAM_CONFIG[tk];
          return (
            <button
              key={tk}
              className={`nav-item ${activeView === `team-${tk}` ? 'nav-active' : ''}`}
              onClick={() => onNavigate(`team-${tk}`)}
              title={cfg.label}
            >
              <span className="nav-icon">
                <span
                  className="nav-team-dot"
                  style={{ background: cfg.color }}
                >
                  {collapsed ? cfg.icon.charAt(0) : ''}
                </span>
              </span>
              {!collapsed && (
                <>
                  <span className="nav-label">{cfg.label}</span>
                  <span className="nav-badge">{teamCounts[tk]}</span>
                </>
              )}
            </button>
          );
        })}

        <div className="nav-section-label">{!collapsed && 'REPORTS'}</div>

        <button
          className={`nav-item ${activeView === 'summary' ? 'nav-active' : ''}`}
          onClick={() => onNavigate('summary')}
          title="Pay Summary"
        >
          <span className="nav-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </span>
          {!collapsed && <span className="nav-label">Pay Summary</span>}
        </button>

        <button
          className={`nav-item ${activeView === 'manage' ? 'nav-active' : ''}`}
          onClick={() => onNavigate('manage')}
          title="Manage Staff"
        >
          <span className="nav-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          {!collapsed && <span className="nav-label">Manage Staff</span>}
        </button>
      </nav>

      {/* ── Footer ────────────────────────────────────── */}
      {!collapsed && (
        <div className="sidebar-footer">
          <span className="sidebar-footer-copy">© {new Date().getFullYear()} Gosian Media</span>
        </div>
      )}
    </aside>
  );
}
