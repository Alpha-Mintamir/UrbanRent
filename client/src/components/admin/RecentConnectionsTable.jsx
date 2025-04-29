import { format } from 'date-fns';

export default function RecentConnectionsTable({ connections }) {
  if (!connections || connections.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No recent connections found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tenant
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner/Broker
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {connections.map((connection) => (
            <tr key={connection.connection_id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{connection.connection_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {connection.tenant?.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {connection.tenant?.email || 'No email'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {connection.tenant?.phone || 'No phone'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {connection.owner?.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {connection.owner?.email || 'No email'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {connection.owner?.role === 2 ? 'Property Owner' : 
                       connection.owner?.role === 3 ? 'Broker' : 'Unknown'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {connection.property?.property_name || 'Unknown Property'}
                {connection.property?.property_id && <span className="text-xs text-gray-400 block">ID: {connection.property.property_id}</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {connection.created_at ? format(new Date(connection.created_at), 'MMM dd, yyyy') : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${connection.status === 'active' ? 'bg-green-100 text-green-800' : 
                    connection.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    connection.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {connection.status || 'Unknown'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
