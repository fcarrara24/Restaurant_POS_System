import React from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const DataTable = ({
  data,
  columns,
  activeTab,
  editingId,
  editData,
  setEditData,
  handleEdit,
  handleSave,
  handleDelete,
  handleCancel,
  renderCellContent
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#262626]">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={col} 
                className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                  index === 0 ? 'rounded-tl-lg' : ''
                } ${index === columns.length - 1 ? 'rounded-tr-lg' : ''}`}
              >
                {col}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#1f1f1f] divide-y divide-gray-800">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-800/50">
              {columns.map((col, colIndex) => (
                <td key={`${item._id}-${col}`} className="px-6 py-4 whitespace-nowrap">
                  {editingId === item._id ? (
                    <input
                      type={col === 'Price' ? 'number' : 'text'}
                      name={col.toLowerCase()}
                      value={editData[col.toLowerCase()] || ''}
                      onChange={(e) => 
                        setEditData({
                          ...editData,
                          [e.target.name]: e.target.value
                        })
                      }
                      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  ) : (
                    <div className="text-sm text-gray-200">
                      {renderCellContent(item, col, activeTab)}
                    </div>
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingId === item._id ? (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave(item._id, activeTab.slice(0, -1))}
                      className="text-green-400 hover:text-green-300"
                    >
                      <FaSave className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(activeTab.slice(0, -1), item._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
