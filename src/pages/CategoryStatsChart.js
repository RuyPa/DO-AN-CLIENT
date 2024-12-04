import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { API_VPS } from '../constant/constants';
import "./CategoryStatsChart.css";
// Đăng ký các module cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategoryStatsChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  // Fetch dữ liệu từ API
  useEffect(() => {
    fetch(`${API_VPS}/api/stats/category_stats`,{
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
    })
      .then((response) => response.json())
      .then((data) => {
        const labels = data.map(item => item.traffic_sign_type);  // Lấy tên loại biển báo
        const values = data.map(item => item.num_traffic_signs);  // Lấy số lượng biển báo
        
        setChartData({
          labels: labels,  // Các nhãn (loại biển báo)
          datasets: [
            {
              label: 'Traffic Sign Number',  // Nhãn của dataset
              data: values,  // Dữ liệu số lượng biển báo
              backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Màu nền của cột
              borderColor: 'rgba(75, 192, 192, 1)',  // Màu viền cột
              borderWidth: 1
            }
          ]
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [token]);

  // Nếu đang load dữ liệu, hiển thị loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '80%', margin: '0 auto', height: '500px' }}>
      <div className='h2-catestat'><h2>Number of Signs by Sign Type</h2></div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Number of Signs by Sign Type Statistic'
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw} Traffic Sign`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Traffic Sign Type'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Traffic Sign Number'
              },
              beginAtZero: true
            }
          }
        }}
      />
    </div>
  );
};

export default CategoryStatsChart;
