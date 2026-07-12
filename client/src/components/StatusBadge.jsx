const statusColors = {
  applied: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  pending: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  'under-review': { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
  reviewing: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
  shortlisted: { bg: 'rgba(139,92,246,0.15)', text: '#8b5cf6' },
  interview: { bg: 'rgba(6,182,212,0.15)', text: '#06b6d4' },
  accepted: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  hired: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  rejected: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' },
  active: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  inactive: { bg: 'rgba(107,107,123,0.15)', text: '#6b6b7b' },
  closed: { bg: 'rgba(107,107,123,0.15)', text: '#6b6b7b' },
};

const StatusBadge = ({ status }) => {
  const s = (status || 'pending').toLowerCase().replace(/_/g, '-');
  const colors = statusColors[s] || statusColors.pending;

  return (
    <span
      className="status-badge"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')}
    </span>
  );
};

export default StatusBadge;
