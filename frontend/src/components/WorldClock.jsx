import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const CITIES = [{ label: 'RAK', timeZone: 'Africa/Casablanca' }];

function formatTime(timeZone) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  }).format(new Date());
}

export default function WorldClock({ cities = CITIES, className = '' }) {
  const [times, setTimes] = useState(() => cities.map((c) => formatTime(c.timeZone)));

  useEffect(() => {
    const id = setInterval(() => {
      setTimes(cities.map((c) => formatTime(c.timeZone)));
    }, 30_000);
    return () => clearInterval(id);
  }, [cities]);

  return (
    <div className={`flex items-center gap-4 text-[11px] tracking-[0.15em] ${className}`}>
      {cities.map((c, i) => (
        <span key={c.label} className="flex items-center gap-1.5">
          <Clock size={12} strokeWidth={1.5} className="text-paper/40" />
          <span className="text-paper/40">{c.label}</span>
          <span className="text-paper/80">{times[i]}</span>
        </span>
      ))}
    </div>
  );
}