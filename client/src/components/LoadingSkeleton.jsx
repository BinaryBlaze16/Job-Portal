const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <div className="skeleton-grid">
        {items.map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-row">
              <div className="skeleton-circle" />
              <div className="skeleton-lines">
                <div className="skeleton-line w-60" />
                <div className="skeleton-line w-40" />
              </div>
            </div>
            <div className="skeleton-line w-80" />
            <div className="skeleton-line w-50" />
            <div className="skeleton-row mt">
              <div className="skeleton-badge" />
              <div className="skeleton-badge" />
              <div className="skeleton-badge" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className="skeleton-text-group">
        {items.map((i) => (
          <div key={i} className="skeleton-text-block">
            <div className="skeleton-line w-100" />
            <div className="skeleton-line w-80" />
            <div className="skeleton-line w-60" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <>
        {items.map((i) => (
          <tr key={i} className="skeleton-table-row">
            <td><div className="skeleton-line w-60" /></td>
            <td><div className="skeleton-line w-40" /></td>
            <td><div className="skeleton-badge" /></td>
            <td><div className="skeleton-line w-50" /></td>
            <td><div className="skeleton-line w-30" /></td>
          </tr>
        ))}
      </>
    );
  }

  return null;
};

export default LoadingSkeleton;
