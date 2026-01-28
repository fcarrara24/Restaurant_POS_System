import PropTypes from 'prop-types';
import { FaTable, FaList, FaUtensils } from 'react-icons/fa';

const iconComponents = {
  FaTable,
  FaList,
  FaUtensils
};

const DataTabs = ({ activeTab, setActiveTab, tabConfig }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabConfig.map((tab) => {
          const IconComponent = iconComponents[tab.icon] || (() => null);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <IconComponent />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

DataTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  tabConfig: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired
};

export default DataTabs;