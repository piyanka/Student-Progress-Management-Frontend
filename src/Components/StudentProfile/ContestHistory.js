import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

/** ContestHistory Component

  Displays user's Codeforces contest performance:
  - Line chart of rating changes over time
  - Contest summary table with rating change, rank, and unsolved problems
 
  Props:
  - ratingHistory: Array of contest data (each includes rating updates, date, contestId)
  - submissions: Array of submissions (used to calculate unsolved problems)

 */
const ContestHistory = ({ ratingHistory = [], submissions = [] }) => {
  const [filter, setFilter] = useState("30");                               // Default filter to 30 days

  const handleChange = (e) => setFilter(e.target.value);

  // Filter contests based on selected number of days
 
  const filteredContests = useMemo(() => {
    const now = Date.now() / 1000;                                        // current timestamp in seconds
    const days = parseInt(filter);
    return ratingHistory.filter(
      (c) => now - c.ratingUpdateTimeSeconds <= days * 24 * 60 * 60
    );
  }, [ratingHistory, filter]);

  // Prepare chart data: Contest name, date, new rating
  
  const ratingChartData = useMemo(() => {
    return filteredContests.map((contest) => ({
      name: contest.contestName,
      date: format(new Date(contest.ratingUpdateTimeSeconds * 1000), "MM/dd"),
      rating: contest.newRating,
    }));
  }, [filteredContests]);

  // Get count of problems that were attempted but not solved in a contest
  
  const getUnsolvedCount = (contestId) => {
    const solved = new Set(
      submissions
        .filter((s) => s.verdict === "OK" && s.contestId === contestId)
        .map((s) => s.problem.index)
    );

    const attempted = new Set(
      submissions
        .filter((s) => s.contestId === contestId)
        .map((s) => s.problem.index)
    );

    let unsolved = 0;
    attempted.forEach((idx) => {
      if (!solved.has(idx)) unsolved++;
    });

    return unsolved;
  };

  return (
    <div className="contest-history">
      <h3>📈 Contest History</h3>

      {/* Filter Dropdown */}
      <div className="filter">
        <label>Filter by:&nbsp;</label>
        <select value={filter} onChange={handleChange}>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last 365 days</option>
        </select>
      </div>

      {/* Rating Line Chart */}
      <div className="rating-graph" style={{ marginTop: "1rem", height: 300 }}>
        {ratingChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No contests to display graph</p>
        )}
      </div>

      {/* Contest Details Table */}
      <div className="contest-list" style={{ marginTop: "2rem" }}>
        <table>
          <thead>
            <tr>
              <th>Contest</th>
              <th>Date</th>
              <th>Rating Change</th>
              <th>Rank</th>
              <th>Unsolved Problems</th>
            </tr>
          </thead>
          <tbody>
            {filteredContests.length === 0 ? (
              <tr>
                <td colSpan="5">No contests found in selected range</td>
              </tr>
            ) : (
              filteredContests.map((contest) => (
                <tr key={contest.contestId}>
                  <td>{contest.contestName}</td>
                  <td>
                    {format(
                      new Date(contest.ratingUpdateTimeSeconds * 1000),
                      "yyyy-MM-dd"
                    )}
                  </td>
                  <td>
                    {contest.newRating - contest.oldRating >= 0 ? "+" : ""}
                    {contest.newRating - contest.oldRating}
                  </td>
                  <td>{contest.rank}</td>
                  <td>{getUnsolvedCount(contest.contestId)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContestHistory;
