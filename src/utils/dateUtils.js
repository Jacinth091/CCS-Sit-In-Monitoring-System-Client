export const formatDate = (val) => {
  if (!val) return "—";
  try {
    const d = new Date(val);
    if (d.toString() === 'Invalid Date') return val;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return val;
  }
};

export const formatTime = (val) => {
  if (!val) return "—";
  try {
    if (typeof val === 'string' && /^\d{1,2}:\d{2}/.test(val)) {
      const d = new Date(`1970-01-01T${val}`);
      if (d.toString() !== 'Invalid Date') {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    const d = new Date(val);
    if (d.toString() === 'Invalid Date') return val;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return val;
  }
};

export const formatDuration = (minutes) => {
  const mins = parseInt(minutes) || 0;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

export const calcDuration = (timeIn, timeOut) => {
  if (!timeIn || !timeOut) return null;
  const diff = Math.floor((new Date(timeOut) - new Date(timeIn)) / 60000);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};
