import React, { useState, useMemo } from "react";
import {format, subDays, eachDayOfInterval, endOfToday,} from "date-fns";
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

/** ProblemSolvingStats Component
  
  Displays problem-solving analytics for a student, including:
  - Total and average problems solved
  - Most difficult problem rating
  - Bar chart for problems by rating bucket
  - Submission heatmap for past 365 days
 
  Props:
  - submissions: Array of Codeforces submission objects

 */
const ProblemSolvingStats = ({ submissions }) => {
  const [filterDays, setFilterDays] = useState(30);                             // Filter state
  const now = new Date();

  // Filter submissions based on selected timeframe (7/30/90 days)

  const filteredSubmissions = useMemo(() => {
    const cutoff = subDays(now, filterDays).getTime();
    return submissions.filter(
      (s) => s.creationTimeSeconds * 1000 >= cutoff
    );
  }, [submissions, filterDays]);

  // Identify unique solved problems by contestId + index

  const solvedProblems = useMemo(() => {
    const map = new Map();
    filteredSubmissions.forEach((sub) => {
      if (sub.verdict === "OK" && sub.problem) {
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        if (!map.has(key)) {
          map.set(key, sub.problem.rating || 0);
        }
      }
    });
    return Array.from(map.values());
  }, [filteredSubmissions]);

  // Key metrics
  const mostDifficult = solvedProblems.length
    ? Math.max(...solvedProblems)
    : "N/A";

  const avgRating = solvedProblems.length
    ? Math.round(
        solvedProblems.reduce((a, b) => a + b, 0) / solvedProblems.length
      )
    : "N/A";

  const avgPerDay = solvedProblems.length
    ? (solvedProblems.length / filterDays).toFixed(2)
    : "N/A";

  // Bar chart: Count problems per rating bucket (e.g., 800–899)

  const ratingBuckets = useMemo(() => {
    const buckets = {};
    solvedProblems.forEach((rating) => {
      if (!rating) return;
      const lower = Math.floor(rating / 100) * 100;
      const label = `${lower}-${lower + 99}`;
      buckets[label] = (buckets[label] || 0) + 1;
    });

    return Object.entries(buckets)
      .map(([bucket, count]) => ({ bucket, count }))
      .sort((a, b) => parseInt(a.bucket) - parseInt(b.bucket));
  }, [solvedProblems]);

  // Generate heatmap grid for last 365 days

  const fullYearDays = eachDayOfInterval({
    start: subDays(endOfToday(), 364),
    end: endOfToday(),
  });

  const heatmapCounts = useMemo(() => {
    const map = {};
    submissions.forEach((s) => {
      const dateStr = format(
        new Date(s.creationTimeSeconds * 1000),
        "yyyy-MM-dd"
      );
      map[dateStr] = (map[dateStr] || 0) + 1;
    });
    return map;
  }, [submissions]);

  // Color scale for heatmap boxes
  const getHeatColor = (count) => {
    if (!count) return "#e0e0e0";                               // light gray
    if (count < 2) return "#c6e48b";
    if (count < 5) return "#7bc96f";
    if (count < 10) return "#239a3b";
    return "#196127";                                          // dark green
  };

  return (
    <div className="problem-solving-stats card">
      <h2>🧠 Problem Solving Statistics</h2>

      {/* Filter dropdown */}
      <div style={{ marginBottom: "1rem" }}>
        <label><strong>Filter:</strong></label>
        <select
          value={filterDays}
          onChange={(e) => setFilterDays(parseInt(e.target.value))}
          style={{ marginLeft: "0.5rem" }}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Stats summary */}
      <p><strong>Total Problems Solved:</strong> {solvedProblems.length}</p>
      <p><strong>Most Difficult Problem Solved:</strong> {mostDifficult}</p>
      <p><strong>Average Rating:</strong> {avgRating}</p>
      <p><strong>Average Problems/Day:</strong> {avgPerDay}</p>

      {/* Rating distribution bar chart */}
      <h3>📊 Problems Solved per Rating Bucket</h3>
      {ratingBuckets.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingBuckets}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bucket" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No problems solved in this range.</p>
      )}

      {/* Submission heatmap */}
      <h3>🔥 Submission Heatmap (Last 365 Days)</h3>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(7, 1fr)",
          gridAutoFlow: "column",
          gap: "4px",
          overflowX: "auto",
          paddingTop: "10px",
          maxWidth: "100%",
        }}
      >
        {fullYearDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const count = heatmapCounts[dateStr] || 0;
          return (
            <div
              key={dateStr}
              title={`${dateStr}: ${count} submission${count !== 1 ? "s" : ""}`}
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: getHeatColor(count),
                borderRadius: "2px",
                transition: "0.3s",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProblemSolvingStats;
