import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartProps {
  data: any[];
}

/**
 * Chart component to display monthly average RSP using ECharts
 */
const Chart: React.FC<ChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null); // Reference to the chart container div

  /**
   * Groups daily data entries by month and calculates average RSP
   * @param data - Filtered daily data array
   * @param priceKey - The exact column name for RSP price in the CSV
   * @returns { labels: string[], averages: number[] }
   */
  function getMonthlyAverages(data: any[], priceKey: string) {
    const monthMap: Record<string, { total: number; count: number }> = {};

    data.forEach((entry) => {
      const rawPrice = entry[priceKey];
      const price = parseFloat(String(rawPrice).trim());
      const dateStr = entry['Calendar Day'] || entry['Calendar Day '];

      if (!dateStr || isNaN(price)) return;

      const date = new Date(dateStr);
      const key = `${date.getFullYear()}-${date.getMonth()}`; // Unique key for each month-year (e.g., "2024-0")

      if (!monthMap[key]) {
        monthMap[key] = { total: 0, count: 0 };
      }

      monthMap[key].total += price;
      monthMap[key].count += 1;
    });

    const labels: string[] = [];
    const averages: number[] = [];

    // Convert monthMap to two arrays: one for labels, one for values
    Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b)) // sort by date key
      .forEach(([key, { total, count }]) => {
        const [year, month] = key.split('-');
        const monthName = new Date(Number(year), Number(month)).toLocaleString('default', {
          month: 'short',
        });
        labels.push(`${monthName} ${year}`);
        averages.push(parseFloat((total / count).toFixed(2))); // Rounded average
      });

    return { labels, averages };
  }

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const chartInstance = echarts.init(chartRef.current);

    // Exact column name from the CSV file (important to match!)
    const priceKey =
      'Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1';

    // Compute monthly averages
    const { labels, averages } = getMonthlyAverages(data, priceKey);
    console.log('📊 Monthly Averages:', { labels, averages });

    // Chart configuration
    const option = {
      title: {
        text: 'Monthly Average Fuel RSP',
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontWeight: 600,
          color: '#2c3e50',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const { name, value } = params[0];
          return `${name}<br/>Avg RSP: ₹${value.toFixed(2)} per Litre`;
        },
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: {
          rotate: 45, // rotate month labels for better readability
        },
      },
      yAxis: {
        type: 'value',
        name: '₹/Litre',
      },
      series: [
        {
          name: 'Monthly Avg RSP',
          type: 'bar', // bar chart for monthly data
          data: averages,
          itemStyle: {
            color: '#3f51b5',
          },
        },
      ],
      grid: {
        left: '5%',
        right: '5%',
        bottom: '20%',
        containLabel: true,
      },
    };

    // Render the chart with the config
    chartInstance.setOption(option);

    // Cleanup on unmount
    return () => {
      chartInstance.dispose();
    };
  }, [data]);

  return (
    <div style={{ marginTop: '1rem', width: '100%', height: '100%' }}>
      {data.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '1rem' }}>
          No matching data found for this selection.
        </p>
      ) : (
        <div
          ref={chartRef}
          style={{
            height: '400px',
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  );
};

export default Chart;
