/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, DollarSign, Package, ShoppingCart } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = 'http://localhost:9001/';
const SELLER_ID = '674f0636a38e8481e24978a8';

const TIME_RANGES = [
  { label: '24 Hours', value: '24h' },
  { label: '3 Days', value: '3d' },
  { label: '1 Week', value: '1w' },
  { label: '1 Month', value: '1m' },
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon }) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-sm ${
          isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}

function App() {
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    totalOrders: 0,
    revenueChange: 0,
  });
  const [revenueData, setRevenueData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [revenueResponse, timeSeriesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}getRevenue/${SELLER_ID}`),
        axios.get(`${API_BASE_URL}getTimeSeries?range=${timeRange}&sellerId=${SELLER_ID}`)
      ]);

      const { totalRevenue, averageOrderValue, totalOrders } = revenueResponse.data;
      
      setMetrics({
        totalRevenue,
        averageOrderValue,
        totalOrders,
        revenueChange: ((totalRevenue - timeSeriesResponse.data[0]?.amount) / timeSeriesResponse.data[0]?.amount * 100) || 0
      });

      setRevenueData(timeSeriesResponse.data.map(item => ({
        date: formatDate(item.timestamp),
        amount: parseFloat(item.amount)
      })));

    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: `Revenue Over ${TIME_RANGES.find(r => r.value === timeRange)?.label}`,
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      }
    }
  };

  const chartData = {
    labels: revenueData.map(item => item.date),
    datasets: [{
      label: 'Revenue',
      data: revenueData.map(item => item.amount),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error loading dashboard</h2>
          <p className="text-red-600 mt-1">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Revenue Dashboard</h1>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(metrics.totalRevenue)}
                change={metrics.revenueChange}
                icon={DollarSign}
              />
              <MetricCard
                title="Average Order Value"
                value={formatCurrency(metrics.averageOrderValue)}
                change={5.2}
                icon={ShoppingCart}
              />
              <MetricCard
                title="Total Orders"
                value={metrics.totalOrders}
                change={12.5}
                icon={Package}
              />
              <MetricCard
                title="Growth Rate"
                value={`${metrics.revenueChange}%`}
                change={metrics.revenueChange}
                icon={TrendingUp}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-wrap gap-2 mb-6">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      timeRange === range.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              <div className="h-[400px]">
                <Line options={chartOptions} data={chartData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;