import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Dashboard components
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import RecentConnectionsTable from '../components/admin/RecentConnectionsTable';
import ReportGenerator from '../components/admin/ReportGenerator';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      toast.error('Please login as admin first');
      navigate('/admin/login');
      return;
    }

    // Parse admin user data
    try {
      const userData = JSON.parse(adminUser);
      if (userData.role !== 4) {
        toast.error('You do not have admin privileges');
        localStorage.removeItem('adminUser'); // Clear invalid admin data
        navigate('/admin/login');
        return;
      }
      
      // Admin is authenticated, fetch dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication error');
      localStorage.removeItem('adminUser'); // Clear corrupted admin data
      navigate('/admin/login');
    }
  }, [navigate]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use mock data instead of fetching from the API
      // In a real application, you would fetch this data from the server
      const mockData = {
        counts: {
          users: 125,
          properties: 87,
          tenants: 95,
          owners: 29
        },
        userRoleDistribution: [
          { role: 1, count: 95 },  // Tenants
          { role: 2, count: 18 },  // Property Owners
          { role: 3, count: 11 },  // Brokers
          { role: 4, count: 1 }    // Admin
        ],
        propertyStatusDistribution: [
          { is_broker_listing: false, count: 62 },  // Owner listings
          { is_broker_listing: true, count: 25 }    // Broker listings
        ],
        recentConnections: [
          {
            connection_id: 1,
            tenant: { name: 'John Doe', email: 'john@example.com', phone: '+251911234567' },
            owner: { name: 'Sarah Williams', email: 'sarah@example.com', role: 2 },
            property: { property_name: 'Luxury Apartment', property_id: 101 },
            created_at: '2025-04-25T10:30:00.000Z',
            status: 'active'
          },
          {
            connection_id: 2,
            tenant: { name: 'Jane Smith', email: 'jane@example.com', phone: '+251922345678' },
            owner: { name: 'Michael Brown', email: 'michael@example.com', role: 3 },
            property: { property_name: 'Beach House', property_id: 102 },
            created_at: '2025-04-26T14:15:00.000Z',
            status: 'pending'
          },
          {
            connection_id: 3,
            tenant: { name: 'Bob Johnson', email: 'bob@example.com', phone: '+251933456789' },
            owner: { name: 'Emily Davis', email: 'emily@example.com', role: 2 },
            property: { property_name: 'Mountain Cabin', property_id: 103 },
            created_at: '2025-04-27T09:45:00.000Z',
            status: 'active'
          }
        ],
        monthlyConnections: [
          { month: 1, count: 18 },
          { month: 2, count: 22 },
          { month: 3, count: 30 },
          { month: 4, count: 35 },
          { month: 5, count: 28 },
          { month: 6, count: 32 },
          { month: 7, count: 40 },
          { month: 8, count: 45 },
          { month: 9, count: 38 },
          { month: 10, count: 30 },
          { month: 11, count: 25 },
          { month: 12, count: 20 }
        ],
        topLocations: [
          { subCity: 'Bole', count: 25 },
          { subCity: 'Yeka', count: 18 },
          { subCity: 'Kirkos', count: 15 },
          { subCity: 'Arada', count: 12 },
          { subCity: 'Lideta', count: 10 }
        ]
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }

  // Handle admin logout
  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // Prepare data for charts
  const prepareMonthlyConnectionData = () => {
    if (!dashboardData || !dashboardData.monthlyConnections) return [];
    
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return dashboardData.monthlyConnections.map(item => ({
      month: monthNames[item.month - 1],
      connections: parseInt(item.count)
    }));
  };
  
  const prepareUserRoleData = () => {
    if (!dashboardData || !dashboardData.userRoleDistribution) return [];
    
    const roleNames = {
      1: 'Tenant',
      2: 'Property Owner',
      3: 'Broker',
      4: 'Admin'
    };
    
    return dashboardData.userRoleDistribution.map(item => ({
      name: roleNames[item.role] || `Role ${item.role}`,
      value: parseInt(item.count)
    }));
  };
  
  const preparePropertyStatusData = () => {
    if (!dashboardData || !dashboardData.propertyStatusDistribution) return [];
    
    return dashboardData.propertyStatusDistribution.map(item => ({
      name: item.is_broker_listing ? 'Broker Listings' : 'Owner Listings',
      value: parseInt(item.count)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
        
        {activeTab === 'analytics' && dashboardData && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users" 
                value={dashboardData.counts.users} 
                icon="👥"
                color="bg-blue-500"
              />
              <StatCard 
                title="Properties" 
                value={dashboardData.counts.properties} 
                icon="🏠"
                color="bg-green-500"
              />
              <StatCard 
                title="Tenants" 
                value={dashboardData.counts.tenants} 
                icon="👤"
                color="bg-yellow-500"
              />
              <StatCard 
                title="Owners & Brokers" 
                value={dashboardData.counts.owners} 
                icon="🔑"
                color="bg-purple-500"
              />
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Connections Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Monthly Tenant-Owner Connections</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareMonthlyConnectionData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="connections" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* User Role Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">User Role Distribution</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareUserRoleData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareUserRoleData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Property Status Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Property Listings</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={preparePropertyStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {preparePropertyStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Top Locations */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Top Locations</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={dashboardData.topLocations.map(loc => ({
                        location: loc.subCity,
                        count: parseInt(loc.count)
                      }))}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="location" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Recent Connections */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Recent Tenant-Owner Connections</h2>
              <RecentConnectionsTable connections={dashboardData.recentConnections || []} />
            </div>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Generate Reports</h2>
            <ReportGenerator />
          </div>
        )}
      </div>
    </div>
  );
}
