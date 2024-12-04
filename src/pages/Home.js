import React from 'react';
import SignSampleLabelStatsChart from './SignSampleLabelStatsChart';  // Biểu đồ 1
import CategoryStatsChart from './CategoryStatsChart';  // Biểu đồ 2
import CategorySampleLabelStatsChart from './CategorySampleLabelStatsChart';  // Biểu đồ 3
import ModelTable from './ModelTable';  // Bảng

import './Home.css';  // Thêm CSS để style

const Home = () => {
  return (
    <div className="home-container">
      <div className="grid-container">
        {/* Biểu đồ 1 và 2 trên một hàng */}
        <div className="grid-item">
          <SignSampleLabelStatsChart />
        </div>
        <div className="grid-item">
          <CategoryStatsChart />
        </div>

        {/* Biểu đồ 3 và Bảng ModelTable dưới */}
        <div className="grid-item">
          <CategorySampleLabelStatsChart />
        </div>
        <div className="grid-item">
          <ModelTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
