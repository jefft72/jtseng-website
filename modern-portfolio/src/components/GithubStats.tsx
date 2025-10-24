import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  variant?: 'section' | 'inline';
};

type EventItem = {
  type: string;
  created_at: string;
};

const GITHUB_USER = 'jefft72';

const GithubStats: React.FC<Props> = ({ variant = 'section' }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public`);
        if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
        const data = await res.json();
        setEvents(data.slice(0, 100)); // latest 100 events
      } catch (e: any) {
        setError(e?.message || 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Aggregate daily counts (30 days) and weekday histogram
  const { dayValues, maxDay, weekdayCounts } = useMemo(() => {
    const today = new Date();
    const days: string[] = [];
    const dayCounts: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(key);
      dayCounts[key] = 0;
    }

    const weekday: number[] = Array(7).fill(0); // 0 Sun .. 6 Sat

    for (const ev of events) {
      const day = ev.created_at?.slice(0, 10);
      if (day in dayCounts) dayCounts[day] += 1;
      const dt = new Date(ev.created_at);
      weekday[dt.getDay()] += 1;
    }

    const vals = days.map((k) => dayCounts[k]);
    return { dayValues: vals, maxDay: Math.max(1, ...vals), weekdayCounts: weekday };
  }, [events]);

  const Chart: React.FC = () => (
    <div className="panel p-6">
      {loading && <div className="text-gray-400">Loading…</div>}
      {error && <div className="text-gray-400">{error}</div>}
      {!loading && !error && (
        <>
          {/* Line chart: last 30 days */}
          <h4 className="text-white font-semibold mb-3">Last 30 days</h4>
          <svg width="100%" height="160" viewBox="0 0 560 160" preserveAspectRatio="none" aria-label="Line chart of daily events">
            {/* grid lines */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="40" x2="560" y1={20 + i * 28} y2={20 + i * 28} stroke="#1f2937" strokeWidth="1" />
            ))}
            {/* y-axis */}
            <line x1="40" y1="20" x2="40" y2="140" stroke="#334155" strokeWidth="1.5" />
            {/* x-axis */}
            <line x1="40" y1="140" x2="560" y2="140" stroke="#334155" strokeWidth="1.5" />
            {/* path */}
            {(() => {
              const w = 520; // right margin 560-40
              const step = w / Math.max(1, dayValues.length - 1);
              const points = dayValues.map((v, i) => {
                const x = 40 + i * step;
                // log-scale to avoid one huge spike
                const y = 140 - (Math.log1p(v) / Math.log1p(maxDay)) * 110;
                return `${x},${y}`;
              });
              const path = `M ${points.join(' L ')}`;
              return <path d={path} fill="none" stroke="#8ecaff" strokeWidth="2.5" />;
            })()}
          </svg>

          {/* Bar chart: by weekday */}
          <h4 className="text-white font-semibold mt-6 mb-3">By weekday</h4>
          <svg width="100%" height="140" viewBox="0 0 560 140" preserveAspectRatio="none" aria-label="Bar chart of events by weekday">
            <line x1="40" y1="120" x2="560" y2="120" stroke="#334155" strokeWidth="1.5" />
            {(() => {
              const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
              const maxW = Math.max(1, ...weekdayCounts);
              const w = 520 / 7;
              return labels.map((lbl, i) => {
                const hLin = (Math.log1p(weekdayCounts[i]) / Math.log1p(maxW)) * 100;
                const h = Math.max(6, hLin); // ensure visibility for small counts
                const x = 40 + i * w + 8;
                const y = 120 - h;
                return (
                  <g key={i}>
                    <rect x={x} y={y} width={w - 16} height={h} rx="4" fill="#8ecaff" />
                    <text x={40 + i * w + w / 2} y={132} textAnchor="middle" fontSize="10" fill="#9ca3af">{lbl}</text>
                  </g>
                );
              });
            })()}
          </svg>
        </>
      )}
    </div>
  );

  if (variant === 'inline') {
    return <Chart />;
  }

  return (
    <section id="github" className="section">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">GitHub Activity</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-md" />
          </div>
          <Chart />
        </motion.div>
      </div>
    </section>
  );
};

export default GithubStats;
