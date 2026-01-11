import React from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import StatusBadge from './StatusBadge';

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
  activeTab,
  isLoading
}) => {
  const renderCellContent = (item, column) => {
    switch (column) {
      case 'Status':
        if (activeTab === 'tables') {
          return <StatusBadge isActive={item.isOccupied} label={item.isOccupied ? 'Occupied' : 'Available'} />;
        } else if (activeTab === 'dishes') {
          return <StatusBadge isActive={item.isAvailable} label={item.isAvailable ? 'Available' : 'Unavailable'} />;
        }
        return null;
      
      case 'Dish Count':
        return `${item.dishCount || 0} dishes`;
      
      case 'Price':
        return `$${item.price?.toFixed(2)}`;
      
      case 'Category':
        return item.category?.name || 'Uncategorized';
      
      default:
        return item[column.toLowerCase().replace(/\s+/g, '')] || '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No {activeTab} found{searchTerm ? ` matching "${searchTerm}"` : ''}.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>
      
      <div className="shadow overflow-hidden border-b border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-750">
                {columns.map((column) => (
                  <td key={`${item._id}-${column}`} className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">
                      {renderCellContent(item, column)}
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-yellow-400 hover:text-yellow-600"
                      title="Edit"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  isLoading: PropTypes.bool
};

export default DataTable;
