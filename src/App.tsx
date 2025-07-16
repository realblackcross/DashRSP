// src/App.tsx

// No need to import React in React 17+ with automatic JSX runtime

import Dashboard from './pages/Dashboard'; // Import your main dashboard page

/**
 * App component - entry point of the application.
 * It simply renders the Dashboard component, which contains filters and the chart.
 */
function App() {
  return (
    <div>
      {/* Render the DashRSP dashboard */}
      <Dashboard />
    </div>
  );
}

export default App;
