import React from 'react';
import PropTypes from 'prop-types';

const StatusBadge = ({ isActive, label }) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';

  return (
    <span className={`${baseClasses} ${statusClasses}`}>
      {label || (isActive ? 'Active' : 'Inactive')}
    </span>
  );
};

StatusBadge.propTypes = {
  isActive: PropTypes.bool.isRequired,
  label: PropTypes.string
};

export default StatusBadge;
