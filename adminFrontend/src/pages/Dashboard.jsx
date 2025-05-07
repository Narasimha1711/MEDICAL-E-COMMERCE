import React from 'react';
import { Users, Store, Package, DollarSign } from 'lucide-react';
import { useStore } from '../data/store';

// Fallback components
const Card = ({ title, value, icon: Icon, trend, color }) => {
  console.log('Rendering Card:', { title, value });
  return (
    <div className={`${color} rounded-lg p-4 text-white shadow-md`}>
      <Icon size={24} />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-2xl">{value}</p>
      {/* <p className="text-sm">+{trend}% from last period</p> */}
    </div>
  );
};

const Table = ({ columns, data }) => {
  console.log('Rendering Table:', { columns, data });
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.header} className="text-left p-2 border-b text-gray-700">{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="p-2 text-center text-gray-500">
              No data available
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((col) => (
                <td key={col.header} className="p-2 border-b text-gray-600">
                  {col.cell ? col.cell(row) : (row[col.accessor] || 'N/A')}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

const Badge = ({ status }) => {
  console.log('Rendering Badge:', { status });
  return (
    <span className={`px-2 py-1 rounded ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {status || 'active'}
    </span>
  );
};

const Dashboard = ({ stats }) => {
  const { loading, error } = useStore();
  console.log('Dashboard rendering:', { stats, loading, error });

  if (loading) {
    return <div className="text-center text-gray-600 p-6 bg-white">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 p-6 bg-white">Error: {error}</div>;
  }
  if (!stats || Object.keys(stats).length === 0) {
    return <div className="text-center text-gray-600 p-6 bg-white">No dashboard data available</div>;
  }

  const userColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge status={row.status || 'active'} />,
    },
    { header: 'Joined', accessor: 'joinedDate' },
  ];

  const sellerColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge status={row.status || 'active'} />,
    },
    {
      header: 'Revenue',
      accessor: 'revenue',
      cell: (row) => `$${(row.revenue || 0).toLocaleString()}`,
    },
  ];

  const productColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Price',
      accessor: 'price',
      cell: (row) => `$${(row.price || 0).toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <Badge status={row.status || 'active'} />,
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-600">
          Overview of our medical store administration
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={Users}
          trend={5.6}
          color="bg-violet-600"
        />
        <Card
          title="Total Sellers"
          value={stats.totalSellers || 0}
          icon={Store}
          trend={2.3}
          color="bg-purple-600"
        />
        <Card
          title="Total Products"
          value={stats.totalProducts || 0}
          icon={Package}
          trend={7.1}
          color="bg-indigo-600"
        />
        <Card
          title="Total Revenue"
          value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          trend={12.5}
          color="bg-green-600"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800">
              {stats.totalUsers || 0} total
            </span>
          </div>
          <Table columns={userColumns} data={stats.recentUsers || []} />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Sellers</h3>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
              {stats.totalSellers || 0} total
            </span>
          </div>
          <Table columns={sellerColumns} data={stats.recentSellers || []} />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Products</h3>
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
            {stats.totalProducts || 0} total
          </span>
        </div>
        <Table columns={productColumns} data={stats.recentProducts || []} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
        </div>
        <div className="h-72">
          <div className="flex h-full items-end space-x-1">
            {(stats.revenue || []).map((item, index) => (
              <div
                key={index}
                className="group relative flex w-full flex-col items-center"
              >
                <div className="relative flex flex-1 flex-col items-center">
                  <div
                    className="w-full bg-violet-600 transition-all group-hover:bg-violet-700"
                    style={{
                      height: `${
                        (stats.revenue || []).every((r) => r.value === 0)
                          ? 0
                          : (item.value / Math.max(...(stats.revenue || []).map((i) => i.value))) * 100
                      }%`,
                    }}
                  ></div>
                  <div className="absolute bottom-full mb-2 hidden transform rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                    ${item.value.toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;