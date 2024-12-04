import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { API_VPS } from '../constant/constants';
import "./CategoryStatsChart.css";

// Đăng ký các module cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CategorySampleLabelStatsChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  // Fetch dữ liệu từ API
  useEffect(() => {
    fetch(`${API_VPS}/api/stats/category_sample_label_stats`,{
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
    })
      .then((response) => response.json())
      .then((data) => {
        const labels = data.map(item => item.traffic_sign_type);  // Lấy tên loại biển báo
        const numLabels = data.map(item => item.num_labels);  // Lấy số lượng nhãn
        const numSamples = data.map(item => item.num_samples);  // Lấy số lượng mẫu

        setChartData({
          labels: labels,  // Các nhãn (loại biển báo)
          datasets: [
            {
              label: 'Label Quantity',
              data: numLabels,  // Dữ liệu số lượng nhãn
              backgroundColor: 'rgba(75, 192, 192, 0.5)',  // Màu nền của cột nhãn
              borderColor: 'rgba(75, 192, 192, 1)',  // Màu viền cột nhãn
              borderWidth: 1,
              categoryPercentage: 0.4,  // Giảm độ rộng của cột nhãn để có thể có cột mẫu bên cạnh
            },
            {
              label: 'Sample Quantity',
              data: numSamples,  // Dữ liệu số lượng mẫu
              backgroundColor: 'rgba(153, 102, 255, 0.5)',  // Màu nền của cột mẫu
              borderColor: 'rgba(153, 102, 255, 1)',  // Màu viền cột mẫu
              borderWidth: 1,
              categoryPercentage: 0.4,  // Đảm bảo cả hai cột không chồng lên nhau
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
      <div className='h2-catestat'><h2>Number of Sample and Label By Traffic Sign Type</h2></div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Statistic Number of Sample and Label By Traffic Sign Type'
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw} ${tooltipItem.dataset.label === 'Number of Label' ? 'Label' : 'Sample'}`;
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
                text: 'Quantity'
              },
              beginAtZero: true
            }
          },
          barThickness: 40,  // Điều chỉnh độ dày của các cột
        }}
      />
    </div>
  );
};

export default CategorySampleLabelStatsChart;
