import React from 'react';
import { motion } from 'framer-motion';

const TabNavigation = ({ activeTab, setActiveTab, tabConfig }) => (
  <div className="mb-6 border-b border-gray-700">
    <div className="flex space-x-1">
      {tabConfig.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
            activeTab === tab.id
              ? 'text-yellow-400 bg-gray-800'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <div className="flex items-center">
            {tab.icon}
            {tab.label}
          </div>
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="h-0.5 bg-yellow-400 mt-2"
              initial={false}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </button>
      ))}
    </div>
  </div>
);

export default TabNavigation;
