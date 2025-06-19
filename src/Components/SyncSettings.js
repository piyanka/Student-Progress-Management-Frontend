import React, { useState, useEffect } from 'react';

/** SyncSettings Component
 
 * Allows the admin/user to configure how often and at what time Codeforces data should sync in the backend.
 * - Frequency can be: daily, weekly, or monthly
 * - Time is set in HH:mm (24-hour format)
 * - Sends updated config to backend and fetches current config on load

*/
const SyncSettings = () => {
  const [frequency, setFrequency] = useState('daily');  // default frequency
  const [time, setTime] = useState('02:00');            // default sync time
  const [status, setStatus] = useState('');             // feedback status message

  // Fetch current sync configuration from backend on mount

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('http://localhost:5000/sync-config', {
          headers: {
            'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
          }
        });
        const result = await res.json();
        if (result.config) {
          setFrequency(result.config.frequency);
          setTime(result.config.time);
        }
      } catch (err) {
        console.error('Failed to fetch sync config:', err);
      }
    };

    fetchConfig();
  }, []);

  //Update sync configuration to the backend
  
  const handleUpdate = async () => {
    const validFrequencies = ['daily', 'weekly', 'monthly'];
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    // Validate frequency
    if (!validFrequencies.includes(frequency)) {
      return alert('Invalid frequency. Choose from daily, weekly, or monthly.');
    }

    // Validate time format
    if (!timeRegex.test(time)) {
      return alert('Invalid time format. Please use HH:mm (24-hour clock).');
    }

    try {
      const res = await fetch('http://localhost:5000/sync-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
        body: JSON.stringify({ frequency, time }),
      });

      const result = await res.json();

      if (result.success) {
        setStatus('✅ Sync settings updated successfully.');
      } else {
        setStatus('❌ Failed to update settings.');
      }
    } catch (error) {
      console.error('Update error:', error);
      setStatus('❌ Error occurred while updating.');
    }
  };

  return (
    <div className="login-ul sync-ul">
      <h2>Sync Settings</h2>

      {/* Frequency selector */}
      <select
        className="inputBox"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly (every Monday)</option>
        <option value="monthly">Monthly (1st)</option>
      </select>

      {/* Time input */}
      <input
        className="inputBox"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      {/* Submit button */}
      <button onClick={handleUpdate} className="button-ul" type="button">
        Update Sync Settings
      </button>

      {/* Status feedback */}
      {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
    </div>
  );
};

export default SyncSettings;
