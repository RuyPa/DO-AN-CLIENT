import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { API_VPS } from "../constant/constants";
import "./ModelTable.css";

// Đăng ký các thành phần của ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ModelTable = () => {
  const [models, setModels] = useState([]);
  const token = localStorage.getItem('accessToken');

  // Fetch data từ API
  useEffect(() => {
    fetch(`${API_VPS}/api/models`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setModels(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [token]);

  // Chuyển dữ liệu API thành các giá trị cần thiết cho biểu đồ
  const chartData = {
    labels: models.map((model) => `Model ${model.id}`), // Mỗi model sẽ có 1 label riêng
    datasets: [
      {
        label: 'Accuracy (acc)',
        data: models.map((model) => model.acc || 0), // Lấy giá trị accuracy
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'F1 Score (f1)',
        data: models.map((model) => model.f1 || 0), // Lấy giá trị F1
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: false,
      },
      {
        label: 'Precision (pre)',
        data: models.map((model) => model.pre || 0), // Lấy giá trị Precision
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
      {
        label: 'Recall (recall)',
        data: models.map((model) => model.recall || 0), // Lấy giá trị Recall
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Model Performance Metrics',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 1, // Các giá trị của metrics thường nằm trong khoảng từ 0 đến 1
        ticks: {
          stepSize: 0.1,
        },
      },
    },
  };

  return (
    <div className="model-table">
      <h2>Model Performance</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ModelTable;
