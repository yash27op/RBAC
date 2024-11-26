import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/auditlogspage.css";

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterOption, setFilterOption] = useState(""); // Dropdown option
  const [filterCriteria, setFilterCriteria] = useState(""); // Text input for search

  // Fetch logs from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/logs")
      .then((response) => {
        setLogs(response.data);
        setFilteredLogs(response.data);
      })
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  // Filter logs based on criteria
  const handleFilterLogs = () => {
    let filtered = [...logs];

    // Apply search filter
    if (filterCriteria) {
      filtered = filtered.filter(
        (log) =>
          log.role.toLowerCase().includes(filterCriteria.toLowerCase()) ||
          log.eventType.toLowerCase().includes(filterCriteria.toLowerCase()) ||
          log.changes.toLowerCase().includes(filterCriteria.toLowerCase())
      );
    }

    // Apply dropdown sort
    if (filterOption === "date") {
      filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (filterOption === "role") {
      filtered.sort((a, b) => a.role.localeCompare(b.role));
    } else if (filterOption === "eventType") {
      filtered.sort((a, b) => a.eventType.localeCompare(b.eventType));
    }

    setFilteredLogs(filtered);
  };

  // Trigger filtering when filter criteria or option changes
  useEffect(() => {
    handleFilterLogs();
  }, [filterCriteria, filterOption, logs]);

  // Delete a log
  const handleDeleteLog = (id) => {
    axios
      .delete(`http://localhost:5000/logs/${id}`)
      .then(() => {
        const updatedLogs = logs.filter((log) => log.id !== id);
        setLogs(updatedLogs);
        setFilteredLogs(updatedLogs);
      })
      .catch((error) => console.error("Error deleting log:", error));
  };

  return (
    <div className="audit-logs-page">
      <div className="header">
        <input
          type="text"
          placeholder="Search Logs"
          value={filterCriteria}
          onChange={(e) => setFilterCriteria(e.target.value)}
          className="filter-input"
        />
        <select
          className="filter-dropdown"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="">Select Filter</option>
          <option value="date">Sort by Date</option>
          <option value="role">Sort by Role</option>
          <option value="eventType">Sort by Event Type</option>
        </select>
      </div>
      <table className="logs-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Role</th>
            <th>Event Type</th>
            <th>Changes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.role}</td>
              <td>{log.eventType}</td>
              <td>{log.changes}</td>
              <td>
                <button
                  onClick={() => handleDeleteLog(log.id)}
                  className="delete-log-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogsPage;
