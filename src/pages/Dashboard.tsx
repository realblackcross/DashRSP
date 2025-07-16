// src/pages/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import { parseCSV } from '../utils/dataProcessor';
import Chart from '../components/Chart';

/**
 * Main dashboard component displaying filters and the monthly RSP chart.
 */
const Dashboard: React.FC = () => {
  // Define dropdown options
  const cities = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'];
  const fuels = ['Petrol', 'Diesel'];
  const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

  // Store user-selected filter states
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [selectedFuel, setSelectedFuel] = useState(fuels[0]);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  // Holds filtered data for the chart
  const [filteredData, setFilteredData] = useState<any[]>([]);

  /**
   * Loads and filters CSV data based on selected city, fuel type, and year.
   */
  useEffect(() => {
    async function loadAndFilter() {
      const allData = await parseCSV('/rspData.csv'); // Load CSV from public

      console.log('Raw Data Sample:', allData.slice(0, 3));

      const filtered = allData.filter((entry) => {
        const city = String(entry['Metro Cities'] || entry['Metro Cities ']).trim().toLowerCase();
        const fuel = String(entry['Products'] || entry['Products ']).trim().toLowerCase();
        const day = entry['Calendar Day'] || entry['Calendar Day '];
        const year = day ? new Date(day).getFullYear() : null;

        return (
          city === selectedCity.toLowerCase() &&
          fuel === selectedFuel.toLowerCase() &&
          year === parseInt(selectedYear)
        );
      });

      console.log('Filtered Count:', filtered.length);
      setFilteredData(filtered);
    }

    loadAndFilter(); // Trigger whenever filters change
  }, [selectedCity, selectedFuel, selectedYear]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1e1e1e', // dark background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '3rem 1rem',
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="dashboard-layout" // used for responsive CSS
        style={{
          width: '100%',
          maxWidth: '1400px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap', // allow wrap on small screens
          gap: '2rem',
        }}
      >
        {/* 🔹 Filter Panel */}
        <div
          style={{
            flex: '1 1 280px',
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#2c3e50' }}>
            Filter Options
          </h2>
          <Dropdown label="City" options={cities} value={selectedCity} onChange={setSelectedCity} />
          <Dropdown label="Fuel Type" options={fuels} value={selectedFuel} onChange={setSelectedFuel} />
          <Dropdown label="Year" options={years} value={selectedYear} onChange={setSelectedYear} />
        </div>

        {/* 🔷 Chart Panel */}
        <div
          style={{
            flex: '3 1 600px',
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            minWidth: '300px',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              color: '#2c3e50',
              textAlign: 'center',
              marginBottom: 0,
            }}
          >
            RSP Dashboard
          </h1>

          <div style={{ width: '100%' }}>
            <Chart data={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
