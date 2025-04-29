import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function ReportGenerator() {
  const [reportType, setReportType] = useState('user-connections');
  const [dateRange, setDateRange] = useState('last-7-days');
  const [fileFormat, setFileFormat] = useState('excel'); // Default to Excel
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock data for different report types
  const mockData = {
    'user-connections': [
      { id: 1, tenant_name: 'John Doe', tenant_email: 'john@example.com', owner_name: 'Sarah Williams', property_name: 'Luxury Apartment', connection_date: '2025-04-25', status: 'active' },
      { id: 2, tenant_name: 'Jane Smith', tenant_email: 'jane@example.com', owner_name: 'Michael Brown', property_name: 'Beach House', connection_date: '2025-04-26', status: 'pending' },
      { id: 3, tenant_name: 'Bob Johnson', tenant_email: 'bob@example.com', owner_name: 'Emily Davis', property_name: 'Mountain Cabin', connection_date: '2025-04-27', status: 'active' },
    ],
    'user-activity': [
      { id: 1, user_name: 'John Doe', email: 'john@example.com', role: 'Tenant', last_login: '2025-04-28', profile_completion: '100%', connections_initiated: 5 },
      { id: 2, user_name: 'Jane Smith', email: 'jane@example.com', role: 'Tenant', last_login: '2025-04-27', profile_completion: '85%', connections_initiated: 3 },
      { id: 3, user_name: 'Sarah Williams', email: 'sarah@example.com', role: 'Property Owner', last_login: '2025-04-26', profile_completion: '90%', properties_listed: 2 },
      { id: 4, user_name: 'Michael Brown', email: 'michael@example.com', role: 'Broker', last_login: '2025-04-25', profile_completion: '95%', properties_listed: 4 },
    ],
    'property-listings': [
      { id: 1, property_name: 'Luxury Apartment', owner_name: 'Sarah Williams', listing_type: 'Owner Listing', location: 'Bole, Addis Ababa', price: 1200, status: 'Available' },
      { id: 2, property_name: 'Beach House', owner_name: 'Michael Brown', listing_type: 'Broker Listing', location: 'Yeka, Addis Ababa', price: 1800, status: 'Available' },
      { id: 3, property_name: 'Mountain Cabin', owner_name: 'Emily Davis', listing_type: 'Owner Listing', location: 'Kirkos, Addis Ababa', price: 900, status: 'Available' },
    ],
    'tenant-demographics': [
      { age_group: '18-25', count: 35, preferred_location: 'Bole', avg_budget: 800 },
      { age_group: '26-35', count: 42, preferred_location: 'Yeka', avg_budget: 1200 },
      { age_group: '36-45', count: 28, preferred_location: 'Kirkos', avg_budget: 1500 },
      { age_group: '46+', count: 15, preferred_location: 'Arada', avg_budget: 1800 },
    ],
    'owner-broker-analysis': [
      { role: 'Property Owner', count: 18, avg_properties: 1.5, connection_rate: '65%', avg_response_time: '2 days' },
      { role: 'Broker', count: 11, avg_properties: 3.2, connection_rate: '78%', avg_response_time: '1 day' },
    ],
    'location-popularity': [
      { location: 'Bole', property_count: 25, tenant_interest: 'High', avg_price: 1300 },
      { location: 'Yeka', property_count: 18, tenant_interest: 'Medium', avg_price: 1100 },
      { location: 'Kirkos', property_count: 15, tenant_interest: 'High', avg_price: 1200 },
      { location: 'Arada', property_count: 12, tenant_interest: 'Medium', avg_price: 950 },
      { location: 'Lideta', property_count: 10, tenant_interest: 'Low', avg_price: 850 },
    ],
  };

  // Get date range for report
  const getDateRange = () => {
    const today = new Date();
    let start = new Date();
    
    switch (dateRange) {
      case 'last-7-days':
        start.setDate(today.getDate() - 7);
        break;
      case 'last-30-days':
        start.setDate(today.getDate() - 30);
        break;
      case 'last-90-days':
        start.setDate(today.getDate() - 90);
        break;
      case 'year-to-date':
        start = new Date(today.getFullYear(), 0, 1); // January 1st of current year
        break;
      case 'custom':
        if (startDate && endDate) {
          return {
            start: format(new Date(startDate), 'yyyy-MM-dd'),
            end: format(new Date(endDate), 'yyyy-MM-dd')
          };
        }
        break;
      default:
        start.setDate(today.getDate() - 30);
    }
    
    return {
      start: format(start, 'yyyy-MM-dd'),
      end: format(today, 'yyyy-MM-dd')
    };
  };

  // Generate Excel file
  const generateExcel = (data, reportTitle) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      
      // Generate buffer
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      
      // Save file
      saveAs(blob, `${reportTitle}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      toast.success('Excel report downloaded successfully');
    } catch (error) {
      console.error('Excel generation error:', error);
      toast.error('Failed to generate Excel report');
    }
  };

  // Generate CSV file
  const generateCSV = (data, reportTitle) => {
    try {
      // Convert JSON to CSV
      const replacer = (key, value) => value === null ? '' : value;
      const header = Object.keys(data[0]);
      let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      csv = csv.join('\r\n');
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${reportTitle}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      toast.success('CSV report downloaded successfully');
    } catch (error) {
      console.error('CSV generation error:', error);
      toast.error('Failed to generate CSV report');
    }
  };

  const handleGenerateReport = () => {
    setLoading(true);
    
    // Get report data
    const data = mockData[reportType] || [];
    if (data.length === 0) {
      toast.error('No data available for this report type');
      setLoading(false);
      return;
    }
    
    const dateRangeInfo = getDateRange();
    const reportTitle = `${reportType}_${dateRangeInfo.start}_to_${dateRangeInfo.end}`;
    
    // Simulate server delay
    setTimeout(() => {
      try {
        // Generate report based on selected format
        switch (fileFormat) {
          case 'excel':
            generateExcel(data, reportTitle);
            break;
          case 'csv':
            generateCSV(data, reportTitle);
            break;
          default:
            generateExcel(data, reportTitle);
        }
      } catch (error) {
        console.error('Error generating report:', error);
        toast.error('Failed to generate report. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Type
        </label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="user-connections">User Connections</option>
          <option value="user-activity">User Activity</option>
          <option value="property-listings">Property Listings</option>
          <option value="tenant-demographics">Tenant Demographics</option>
          <option value="owner-broker-analysis">Owner & Broker Analysis</option>
          <option value="location-popularity">Location Popularity</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="last-7-days">Last 7 Days</option>
          <option value="last-30-days">Last 30 Days</option>
          <option value="last-90-days">Last 90 Days</option>
          <option value="year-to-date">Year to Date</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      
      {dateRange === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Format
        </label>
        <div className="mt-1 flex space-x-4">
          <div className="flex items-center">
            <input
              id="format-excel"
              name="format"
              type="radio"
              checked={fileFormat === 'excel'}
              onChange={() => setFileFormat('excel')}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="format-excel" className="ml-2 block text-sm text-gray-700">
              Excel
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="format-csv"
              name="format"
              type="radio"
              checked={fileFormat === 'csv'}
              onChange={() => setFileFormat('csv')}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="format-csv" className="ml-2 block text-sm text-gray-700">
              CSV
            </label>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Note: PDF format is not available in this demo version.
        </p>
      </div>
      
      <div className="pt-4">
        <button
          type="button"
          onClick={handleGenerateReport}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Report'
          )}
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Report Description</h3>
        <p className="text-sm text-gray-500">
          {reportType === 'user-connections' && 'This report shows all connections between tenants and property owners/brokers, including contact information and property details.'}
          {reportType === 'user-activity' && 'This report shows user activity metrics including sign-ups, profile completions, and connection requests.'}
          {reportType === 'property-listings' && 'This report shows all property listings, categorized by owner vs. broker listings, with location and property details.'}
          {reportType === 'tenant-demographics' && 'This report shows demographic information about tenants, including location preferences and property type interests.'}
          {reportType === 'owner-broker-analysis' && 'This report analyzes property owners and brokers, including number of properties listed and connection success rates.'}
          {reportType === 'location-popularity' && 'This report shows the most popular locations based on property listings and tenant interest.'}
        </p>
      </div>
    </div>
  );
}
