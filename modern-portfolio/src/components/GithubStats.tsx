import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Props = {
  variant?: 'section' | 'inline';
};

type EventItem = {
  type: string;
  created_at: string;
  repo?: { name?: string };
  payload?: any;
};

type CommitInfo = {
  message: string;
  timestamp: string;
  isPrivate: boolean;
};

const GITHUB_USER = 'jefft72';

const GithubStats: React.FC<Props> = ({ variant = 'section' }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [latestCommit, setLatestCommit] = useState<CommitInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // If we can fetch the real contribution calendar via GraphQL, store it here
  const [calendarWeeks, setCalendarWeeks] = useState<Array<Array<{ date: string; count: number }>> | null>(null);
  // Removed calendarMax usage (was for full-year scaling). We'll derive max from filtered counts instead.
  // If reintroducing a full-year view, re-add this state.

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = (import.meta as any).env?.VITE_GITHUB_TOKEN as string | undefined;

        // If token exists, try GraphQL for accurate daily history + latest commit
        if (token) {
          try {
            const gql = `
              query($login: String!) {
                user(login: $login) {
                  contributionsCollection {
                    contributionCalendar {
                      totalContributions
                      weeks {
                        contributionDays { date contributionCount }
                      }
                    }
                  }
                  repositories(first: 10, orderBy: {field: PUSHED_AT, direction: DESC}, privacy: PUBLIC) {
                    nodes {
                      nameWithOwner
                      pushedAt
                      defaultBranchRef {
                        target {
                          ... on Commit {
                            history(first: 1) {
                              nodes {
                                message
                                committedDate
                                author {
                                  name
                                  email
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `;
            
            const res = await fetch('https://api.github.com/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ query: gql, variables: { login: GITHUB_USER } }),
            });
            if (res.ok) {
              const json = await res.json();
              console.log('GraphQL Response:', json);
              
              if (json.errors) {
                console.error('GraphQL Errors:', json.errors);
                json.errors.forEach((err: any) => {
                  console.error('Error details:', err.message, err.type, err.path);
                });
              }
              
              console.log('Calendar weeks:', json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks);
              
              const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks as Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }> | undefined;
              if (weeks && Array.isArray(weeks)) {
                const parsed: Array<Array<{ date: string; count: number }>> = weeks.map(w =>
                  w.contributionDays.map(d => ({ date: d.date, count: d.contributionCount }))
                );
                setCalendarWeeks(parsed);
              }
              
              // Find most recent commit across repos
              const repos = json?.data?.user?.repositories?.nodes as Array<any> | undefined;
              console.log('Repositories found:', repos?.length);
              if (repos && Array.isArray(repos)) {
                let mostRecent: { message: string; committedDate: string } | null = null;
                for (const repo of repos) {
                  const commits = repo?.defaultBranchRef?.target?.history?.nodes;
                  if (commits && commits.length > 0) {
                    const commit = commits[0];
                    console.log('Found commit in', repo.nameWithOwner, ':', commit.committedDate, commit.message.substring(0, 50));
                    if (!mostRecent || new Date(commit.committedDate) > new Date(mostRecent.committedDate)) {
                      mostRecent = { message: commit.message, committedDate: commit.committedDate };
                    }
                  }
                }
                console.log('Most recent commit:', mostRecent);
                if (mostRecent) {
                  setLatestCommit({
                    message: mostRecent.message,
                    timestamp: mostRecent.committedDate,
                    isPrivate: false
                  });
                }
              }
            }
          } catch (err) {
            // fall back silently to events below
          }
        }
        // Fetch multiple pages of events for latest commit + fallback activity
        let allEvents: EventItem[] = [];
        for (let page = 1; page <= 3; page++) {
          const url = token
            ? `https://api.github.com/user/events?per_page=100&page=${page}`
            : `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100&page=${page}`;
          const res = await fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined as any);
          if (!res.ok) break;
          const data = await res.json();
          if (!Array.isArray(data) || data.length === 0) break;
          allEvents = [...allEvents, ...data];
        }
        
  setEvents(allEvents);
        
        // Fallback: use events if GraphQL didn't populate latestCommit
        if (!latestCommit) {
          const pushEvent = allEvents.find((e: EventItem) => e.type === 'PushEvent');
          if (pushEvent && pushEvent.payload?.commits?.length > 0) {
            const commit = pushEvent.payload.commits[0];
            setLatestCommit({
              message: commit.message || 'Recent commit',
              timestamp: pushEvent.created_at,
              isPrivate: false
            });
          } else {
            // No public push events; infer last activity time from most recent event
            const fallbackTs = allEvents[0]?.created_at || new Date().toISOString();
            setLatestCommit({
              message: 'Recent activity is private',
              timestamp: fallbackTs,
              isPrivate: true
            });
          }
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Build GitHub-style contribution heatmap (from July 1 onward)
  const { contributionWeeks, maxContributions, sinceLabel } = useMemo(() => {
    const today = new Date();
    // Determine start: July 1 of current year if we're in/after July, else July 1 of previous year
    const startYear = today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1; // month is 0-based; 6 => July
    const julyFirst = new Date(startYear, 6, 1);
    const sinceLabel = `Since Jul 1, ${startYear}`;

    // Align to the previous Sunday for column alignment
    const startDate = new Date(julyFirst);
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    // Build a map of date -> count using GraphQL calendar when available; otherwise from events
    const counts: Record<string, number> = {};
    if (calendarWeeks && calendarWeeks.length) {
      for (const week of calendarWeeks) {
        for (const day of week) {
          if (day.date >= julyFirst.toISOString().slice(0, 10)) {
            counts[day.date] = (counts[day.date] || 0) + day.count;
          }
        }
      }
    } else {
      for (const ev of events) {
        const day = ev.created_at?.slice(0, 10);
        if (day && day >= julyFirst.toISOString().slice(0, 10)) {
          counts[day] = (counts[day] || 0) + 1;
        }
      }
    }

    // Construct weeks from aligned start to today
    const weeks: Array<Array<{ date: string; count: number }>> = [];
    let currentWeek: Array<{ date: string; count: number }> = [];
    let currentDate = new Date(startDate);
    const todayDateKey = today.toISOString().slice(0, 10);
    while (currentDate.toISOString().slice(0, 10) <= todayDateKey) {
      const dateKey = currentDate.toISOString().slice(0, 10);
      currentWeek.push({ date: dateKey, count: counts[dateKey] || 0 });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const max = Math.max(1, ...Object.keys(counts).map(k => counts[k]));
    return { contributionWeeks: weeks, maxContributions: max, sinceLabel };
  }, [events, calendarWeeks]);

  // Blue color scale (cornflower to navy)
  const getColor = (count: number): string => {
    if (count === 0) return '#0d1117'; // very dark (GitHub-style empty)
    const intensity = Math.min(count / Math.max(1, maxContributions * 0.6), 1); // cap at 60% of max for better visibility
    if (intensity < 0.25) return '#1e3a5f'; // dark navy
    if (intensity < 0.5) return '#2d5a8e'; // medium blue
    if (intensity < 0.75) return '#5b8fd9'; // cornflower
    return '#6fa8dc'; // bright cornflower
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  const totalContrib = useMemo(() => contributionWeeks.flat().reduce((a, d) => a + d.count, 0), [contributionWeeks]);
  
  // Weekly aggregated trend for sparkline graph
  const weeklyTrend = useMemo(() => {
    return contributionWeeks.map(week => week.reduce((sum, day) => sum + day.count, 0));
  }, [contributionWeeks]);

  const gridRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState<number>(14);

  // Tooltip state
  const [hovered, setHovered] = useState<{ date: string; count: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  // Fit 52-53 weeks into available width without overflow
  useEffect(() => {
    const recalc = () => {
      const el = gridRef.current;
      if (!el) return;
      const weeks = Math.max(1, contributionWeeks.length || 52);
      const gap = 6; // px
      const width = el.clientWidth || 640;
      const size = Math.floor((width - (weeks - 1) * gap) / weeks);
      const clamped = Math.max(10, Math.min(16, size));
      setCellSize(clamped);
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [contributionWeeks]);

  // Month labels aligned to weeks (label when a week contains the first of a month)
  const monthLabels = useMemo(() => {
    const labels: string[] = [];
    let lastMonth = '';
    for (const week of contributionWeeks) {
      let label = '';
      for (const day of week) {
        if (day.date.slice(8, 10) === '01') {
          const d = new Date(day.date);
          const month = d.toLocaleDateString(undefined, { month: 'short' });
          if (month !== lastMonth) {
            label = month;
            lastMonth = month;
          }
          break;
        }
      }
      labels.push(label);
    }
    return labels;
  }, [contributionWeeks]);

  const Chart: React.FC = () => {
    console.log('GithubStats - Events loaded:', events.length);
    console.log('GithubStats - Contribution weeks:', contributionWeeks.length);
    console.log('GithubStats - Max contributions:', maxContributions);
    
    return (
    <div className="panel p-4">
      {loading && <div className="text-gray-400">Loading…</div>}
      {error && <div className="text-gray-400">Error: {error}</div>}
      {!loading && !error && contributionWeeks.length === 0 && (
        <div className="text-gray-400 text-sm">
          No contribution data found. Token status: {(import.meta as any).env?.VITE_GITHUB_TOKEN ? '✓ Present' : '✗ Missing'}
        </div>
      )}
      {!loading && !error && contributionWeeks.length > 0 && (
        <>
          {/* Header row: title left, latest commit right */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-6">
              <div>
                <h4 className="text-white font-semibold text-sm">GitHub contributions</h4>
                <div className="text-xs text-gray-400">{sinceLabel}</div>
              </div>
              {latestCommit && latestCommit.message && (
                <div className="text-right">
                  <div className="text-[11px] text-gray-400">Latest commit</div>
                  <div className="text-[13px] text-white font-medium truncate max-w-[20rem]">
                    {latestCommit.isPrivate ? (
                      <span className="text-gray-300">{latestCommit.message}</span>
                    ) : (
                      <span className="text-baby">{latestCommit.message}</span>
                    )}
                  </div>
                  {latestCommit.timestamp && (
                    <div className="text-[10px] text-gray-500">{formatDateTime(latestCommit.timestamp)} · {formatTimeAgo(latestCommit.timestamp)}</div>
                  )}
                </div>
              )}
            </div>
            {/* Mini trend sparkline */}
            {weeklyTrend.length > 0 && (
              <svg width="280" height="110" className="flex-shrink-0" style={{ paddingTop: '10px', paddingBottom: '5px' }}>
                {/* Draw piecewise line graph */}
                <polyline
                  points={weeklyTrend.map((count, i) => {
                    const maxWeek = Math.max(1, ...weeklyTrend);
                    const x = (i / (weeklyTrend.length - 1)) * 280;
                    const y = 95 - (count / maxWeek) * 80;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#5b8fd9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Draw points at each week */}
                {weeklyTrend.map((count, i) => {
                  const maxWeek = Math.max(1, ...weeklyTrend);
                  const x = (i / (weeklyTrend.length - 1)) * 280;
                  const y = 95 - (count / maxWeek) * 80;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#6fa8dc"
                      opacity={0.9}
                    />
                  );
                })}
              </svg>
            )}
          </div>

          {/* GitHub-style contribution heatmap */}
          <div className="pb-2 relative mt-4" ref={gridRef} style={{ overflow: 'visible' }}>
            {/* Month labels row */}
            {contributionWeeks.length > 0 && (
              <div className="inline-flex mb-2" style={{ gap: '6px' }}>
                {monthLabels.map((m, i) => (
                  <div key={i} style={{ width: cellSize, height: 10 }} className="text-xs text-gray-400 whitespace-nowrap">
                    {m}
                  </div>
                ))}
              </div>
            )}

            <div className="inline-flex" style={{ gap: '6px' }}>
              {totalContrib > 0 ? contributionWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col" style={{ gap: '6px', width: cellSize }}>
                  {week.map((day) => {
                    return (
                      <div
                        key={day.date}
                        className="relative"
                        onMouseEnter={(e) => {
                          const grid = gridRef.current;
                          if (!grid) return;
                          const gridRect = grid.getBoundingClientRect();
                          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                          const x = rect.left - gridRect.left + rect.width / 2;
                          const maxX = grid.clientWidth - 8;
                          const minX = 8;
                          setTooltipPos({ x: Math.max(minX, Math.min(maxX, x)), y: rect.top - gridRect.top - 8 });
                          setHovered({ date: day.date, count: day.count });
                        }}
                        onMouseMove={(e) => {
                          const grid = gridRef.current;
                          if (!grid) return;
                          const gridRect = grid.getBoundingClientRect();
                          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                          const x = rect.left - gridRect.left + rect.width / 2;
                          const maxX = grid.clientWidth - 8;
                          const minX = 8;
                          setTooltipPos({ x: Math.max(minX, Math.min(maxX, x)), y: rect.top - gridRect.top - 8 });
                        }}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div
                          className="rounded-sm transition-all hover:ring-1 hover:ring-blue-400"
                          style={{ backgroundColor: getColor(day.count), width: cellSize, height: cellSize }}
                          title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                        />
                      </div>
                    );
                  })}
                </div>
              )) : (
                <div className="text-gray-500 text-sm">
                  No public contribution data in the last year. Private activity isn’t visible here.
                </div>
              )}
            </div>

            {/* Hover tooltip */}
            {hovered && (
              <div
                className="pointer-events-none"
                style={{ position: 'absolute', left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)' }}
              >
                <div className="panel px-3 py-2 text-xs text-white border border-slate-600 shadow-lg" style={{ background: 'rgba(18,18,18,0.98)', minWidth: 200, whiteSpace: 'nowrap' }}>
                  <div className="font-medium">{hovered.count} contribution{hovered.count !== 1 ? 's' : ''}</div>
                  <div className="text-gray-400">{formatDate(hovered.date)}</div>
                </div>
              </div>
            )}
          </div>


          {!(import.meta as any).env?.VITE_GITHUB_TOKEN && (
            <div className="text-[11px] text-gray-500 mt-2">
              Connect a GitHub token in <code className="text-gray-400">.env</code> as <code className="text-gray-400">VITE_GITHUB_TOKEN</code> to show your full-year private + public contribution history.
            </div>
          )}
        </>
      )}
    </div>
  );
  };

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
