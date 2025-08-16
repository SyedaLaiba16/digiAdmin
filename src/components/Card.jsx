import React from 'react';
import { FaUsers, FaBook, FaUpload, FaChartLine } from 'react-icons/fa';


const Card = ({ title, value, change, icon, color }) => {
  const icons = {
    users: <FaUsers />,
    book: <FaBook />,
    upload: <FaUpload />,
    'chart-line': <FaChartLine />
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>{title}</h3>
          <div className="number">{value}</div>
          <div className="subtext">{change}</div>
        </div>
        <div className={`card-icon ${color}`}>
          {icons[icon]}
        </div>
      </div>
    </div>
  );
};

export default Card;