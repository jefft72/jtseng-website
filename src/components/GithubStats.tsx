import React, { useEffect, useMemo, useState } from 'react';

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

const GithubStats: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [latestCommit, setLatestCommit] = useState<CommitInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch multiple pages to get more historical data
        let allEvents: EventItem[] = [];
        for (let page = 1; page <= 3; page++) {
          const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100&page=${page}`);
          if (!res.ok) break;
          const data = await res.json();
          if (data.length === 0) break;
          allEvents = [...allEvents, ...data];
        }
        
        setEvents(allEvents);
        
        // Find latest PushEvent for commit info
        const pushEvent = allEvents.find((e: EventItem) => e.type === 'PushEvent');
        if (pushEvent && pushEvent.payload?.commits?.length > 0) {
          const commit = pushEvent.payload.commits[0];
          setLatestCommit({
            message: commit.message || 'Recent commit',
            timestamp: pushEvent.created_at,
            isPrivate: false
          });
        } else if (allEvents.length > 0) {
          // If no push event, show latest activity
          setLatestCommit({
            message: 'Last committed in a private repo',
            timestamp: allEvents[0].created_at,
            isPrivate: true
          });
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Build GitHub-style contribution heatmap (last ~52 weeks)
  const { contributionWeeks, maxContributions } = useMemo(() => {
    const today = new Date();
    const weeks: Array<Array<{ date: string; count: number }>> = [];
    const dayCounts: Record<string, number> = {};

    // Count contributions by date
    for (const ev of events) {
      const day = ev.created_at?.slice(0, 10);
      if (day) {
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }
    }

    // Build 52 weeks of data
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // ~52 weeks back
    
    // Align to Sunday
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    let currentWeek: Array<{ date: string; count: number }> = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateKey = currentDate.toISOString().slice(0, 10);
      currentWeek.push({
        date: dateKey,
        count: dayCounts[dateKey] || 0
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    const max = Math.max(1, ...Object.values(dayCounts));
    return { contributionWeeks: weeks, maxContributions: max };
  }, [events]);

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

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
      {loading && <div className="text-gray-400 text-sm">Loading GitHub activity...</div>}
      {error && <div className="text-gray-400 text-sm">{error}</div>}
      {!loading && !error && (
        <>
          {/* Latest commit info */}
          {latestCommit && (
            <div className="mb-4 pb-3 border-b border-slate-700">
              <div className="text-xs text-gray-400 mb-1">Latest commit:</div>
              <div className="text-sm text-white font-medium">
                {latestCommit.isPrivate ? (
                  <span className="text-gray-300">Last committed in a private repo</span>
                ) : (
                  <span className="text-blue-300">{latestCommit.message}</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">{formatTimeAgo(latestCommit.timestamp)}</div>
            </div>
          )}

          {/* GitHub-style contribution heatmap */}
          <div className="mb-2">
            <h4 className="text-white font-semibold text-sm mb-1">GitHub Contributions</h4>
            <div className="text-xs text-gray-400 mb-3">Last year of activity</div>
          </div>
          
          <div className="overflow-x-auto pb-2">
            <div className="inline-flex gap-1" style={{ minWidth: 'fit-content' }}>
              {contributionWeeks.length > 0 ? contributionWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const date = new Date(day.date);
                    const monthLabel = dayIndex === 0 && date.getDate() <= 7 
                      ? date.toLocaleDateString('en', { month: 'short' })
                      : null;
                    
                    return (
                      <div key={day.date} className="relative">
                        {monthLabel && weekIndex % 4 === 0 && (
                          <div className="absolute -top-4 left-0 text-[10px] text-gray-500">{monthLabel}</div>
                        )}
                        <div
                          className="w-3 h-3 rounded-sm transition-all hover:ring-1 hover:ring-blue-400 cursor-pointer"
                          style={{ backgroundColor: getColor(day.count) }}
                          title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                        />
                      </div>
                    );
                  })}
                </div>
              )) : (
                <div className="text-gray-500 text-sm">No contribution data available</div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getColor(level * Math.max(1, maxContributions / 4)) }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </>
      )}
    </div>
  );
};

export default GithubStats;
