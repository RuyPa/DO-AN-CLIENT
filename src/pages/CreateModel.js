// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client'; // Import socket.io-client
// import './CreateModel.css'; // Import CSS với tên mới
// import { API_VPS } from '../constant/constants';

// const CreateModel = () => {
//   const [progress, setProgress] = useState(0);
//   const [message, setMessage] = useState('Waiting for progress...');
//   const [samples, setSamples] = useState([]);
//   const [selectedSamples, setSelectedSamples] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const token = localStorage.getItem('accessToken');

//   useEffect(() => {
//     // Lấy giá trị thanh tiến trình từ localStorage
//     const savedProgress = localStorage.getItem('modelProgress');
//     const savedMessage = localStorage.getItem('modelMessage');

//     if (savedProgress) {
//       setProgress(parseInt(savedProgress, 10));
//       if (parseInt(savedProgress, 10) === 100) {
//         // Nếu tiến trình đã đạt 100%, reset về 0
//         localStorage.removeItem('modelProgress');
//         localStorage.removeItem('modelMessage');
//         setProgress(0);
//         setMessage('Waiting for progress...');
//       }
//     }

//     if (savedMessage) {
//       setMessage(savedMessage);
//     }

//     // Gọi API lấy danh sách các mẫu
//     fetch(`${API_VPS}/api/samples`, {
//       credentials: 'include',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json',
//       },  
//     })
//       .then(response => response.json())
//       .then(data => {
//         setSamples(data);
//       })
//       .catch(error => console.error('Error fetching samples:', error));

//     const socket = io('http://127.0.0.1:5001'); // Kết nối tới server Socket.io

//     socket.on('progress', (data) => {
//       setMessage(data.message);
//       setProgress(data.progress);

//       // Lưu trạng thái vào localStorage
//       localStorage.setItem('modelProgress', data.progress);
//       localStorage.setItem('modelMessage', data.message);
//     });

//     return () => {
//       socket.disconnect(); // Ngắt kết nối khi component unmount
//     };
//   }, [token]);

//   const startModelCreation = () => {
//     fetch('http://localhost:5001/api/start-model', {
  
//       credentials: 'include',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ samples: selectedSamples })
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log(data.message);
//       // Khi tiến trình hoàn tất, xóa trạng thái trong localStorage
//       localStorage.removeItem('modelProgress');
//       localStorage.removeItem('modelMessage');
//       setProgress(0); // Reset lại thanh tiến trình
//       setMessage('Waiting for progress...'); // Reset lại thông điệp
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
//   };

//   const handleSelectSample = (id) => {
//     if (selectedSamples.includes(id)) {
//       setSelectedSamples(selectedSamples.filter(sampleId => sampleId !== id));
//     } else {
//       setSelectedSamples([...selectedSamples, id]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (!selectAll) {
//       const allSampleIds = samples.map(sample => sample.id);
//       setSelectedSamples(allSampleIds);
//     } else {
//       setSelectedSamples([]);
//     }
//     setSelectAll(!selectAll);
//   };

//   return (
//     <div className="model-creation-section">
//       <h2>Model Creation</h2>

//       {/* Hiển thị các sample trong bảng */}
//       <table className="sample-table">
//         <thead>
//           <tr>
//             <th style={{ width: '50px' }}>
//               <input
//                 type="checkbox"
//                 checked={selectAll}
//                 onChange={handleSelectAll}
//               />
//             </th>
//             <th style={{ width: '50px' }}>STT</th>
//             <th>Name</th>
//             <th>Code</th>
//             <th>Path</th>
//             <th>Image</th>
//           </tr>
//         </thead>
//         <tbody>
//           {samples.map((sample, index) => (
//             <tr key={sample.id}>
//               <td>
//                 <input
//                   type="checkbox"
//                   checked={selectedSamples.includes(sample.id)}
//                   onChange={() => handleSelectSample(sample.id)}
//                 />
//               </td>
//               <td>{index + 1}</td>
//               <td>{sample.name}</td>
//               <td>{sample.code}</td>
//               <td>{sample.path}</td>
//               <td>
//                 <img 
//                   src={sample.path} 
//                   alt={sample.name} 
//                   className="sample-image" 
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Phần cố định ở dưới cùng màn hình */}
//       <div className="model-creation-footer">
//         <button className="model-creation-start-button" onClick={startModelCreation}>
//           Start Model Creation
//         </button>

//         <div className="model-creation-progress">{message}</div>
//         <div className="model-creation-progress-bar" style={{ width: '100%', backgroundColor: '#ddd' }}>
//           <div className="model-creation-bar" style={{ width: `${progress}%`, height: '30px', backgroundColor: '#4caf50' }}></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateModel;
// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client'; // Import socket.io-client
// import './CreateModel.css'; // Import CSS với tên mới
// import { API_VPS } from '../constant/constants';
// import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// const CreateModel = () => {
//   const [progress, setProgress] = useState(0);
//   const [message, setMessage] = useState('Waiting for progress...');
//   const [samples, setSamples] = useState([]);
//   const [selectedSamples, setSelectedSamples] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [page, setPage] = useState(1); // Trang hiện tại
//   const [pageSize, setPageSize] = useState(10); // Số mẫu mỗi trang
//   const [keyword, setKeyword] = useState(null); // Từ khóa tìm kiếm
//   const [pagination, setPagination] = useState({
//     current_page: 1,
//     page_size: 10,
//     total_items: 0,
//     total_pages: 0
//   });
//   const token = localStorage.getItem('accessToken');

//   useEffect(() => {
//     // Lấy giá trị thanh tiến trình từ localStorage
//     const savedProgress = localStorage.getItem('modelProgress');
//     const savedMessage = localStorage.getItem('modelMessage');

//     if (savedProgress) {
//       setProgress(parseInt(savedProgress, 10));
//       if (parseInt(savedProgress, 10) === 100) {
//         // Nếu tiến trình đã đạt 100%, reset về 0
//         localStorage.removeItem('modelProgress');
//         localStorage.removeItem('modelMessage');
//         setProgress(0);
//         setMessage('Waiting for progress...');
//       }
//     }

//     if (savedMessage) {
//       setMessage(savedMessage);
//     }

//     // Gọi API tìm kiếm mẫu
//     fetch(`${API_VPS}/api/samples/search?page=${page}&page_size=${pageSize}&keyword=${keyword || ''}`, {
//       credentials: 'include',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json',
//       },
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (Array.isArray(data.data)) {
//           setSamples(data.data); // Cập nhật danh sách mẫu từ 'data'
//           setPagination(data.pagination); // Cập nhật thông tin phân trang
//         } else {
//           console.error("Data is not an array:", data);
//           setSamples([]); // Nếu dữ liệu không phải mảng, reset lại samples
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching samples:', error);
//         setSamples([]); // Nếu có lỗi trong việc gọi API, reset lại samples
//       });

//     const socket = io('http://127.0.0.1:5001'); // Kết nối tới server Socket.io

//     socket.on('progress', (data) => {
//       setMessage(data.message);
//       setProgress(data.progress);

//       // Lưu trạng thái vào localStorage
//       localStorage.setItem('modelProgress', data.progress);
//       localStorage.setItem('modelMessage', data.message);
//     });

//     return () => {
//       socket.disconnect(); // Ngắt kết nối khi component unmount
//     };
//   }, [page, pageSize, keyword, token]); // Khi trang, số mẫu mỗi trang hoặc từ khóa thay đổi thì gọi lại API

//   const startModelCreation = () => {
//     fetch('http://localhost:5001/api/start-model', {
//       credentials: 'include',
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ samples: selectedSamples })
//     })
//       .then(response => response.json())
//       .then(data => {
//         console.log(data.message);
//         // Khi tiến trình hoàn tất, xóa trạng thái trong localStorage
//         localStorage.removeItem('modelProgress');
//         localStorage.removeItem('modelMessage');
//         setProgress(0); // Reset lại thanh tiến trình
//         setMessage('Waiting for progress...'); // Reset lại thông điệp
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   };

//   const handleSelectSample = (id) => {
//     if (selectedSamples.includes(id)) {
//       setSelectedSamples(selectedSamples.filter(sampleId => sampleId !== id));
//     } else {
//       setSelectedSamples([...selectedSamples, id]);
//     }
//   };

//   const handleSelectAll = () => {
//     if (!selectAll) {
//       const allSampleIds = samples.map(sample => sample.id);
//       setSelectedSamples(allSampleIds);
//     } else {
//       setSelectedSamples([]);
//     }
//     setSelectAll(!selectAll);
//   };

//   return (
//     <div className="model-creation-section">
//   <div className="model-creation-header">
//     <h2>Model Creation</h2>

//     {/* Phần tìm kiếm và page size nằm cùng dòng */}
//     <div className="model-creation-controls">
//       {/* Phần thay đổi số lượng mẫu mỗi trang */}
//       <div className="page-size-section">
//         <label>Page Size: </label>
//         <select  value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))} className='page-size-selectt'>
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//           <option value={50}>50</option>
//         </select>
//       </div>
// {/* Phần Pagination */}
// <div className="pagination-section">
//     <button onClick={() => setPage(page - 1)} disabled={page <= 1} >
//     &#8249;
//     </button>
//     <span>Page {pagination.current_page} / {pagination.total_pages}</span>
//     <button onClick={() => setPage(page + 1)} disabled={pagination.current_page >= pagination.total_pages}>
//     &#8250;
//     </button>
//   </div>
//       {/* Phần tìm kiếm */}
//       <div className="search-section">
//         <input
//           type="text"
//           value={keyword || ''}
//           onChange={(e) => setKeyword(e.target.value)}
//           placeholder="Search samples..."
//         />
//             <FontAwesomeIcon icon={faSearch} className="search-icon" />

//       </div>

//       <button className="model-creation-start-button" onClick={startModelCreation}>
//       Start Model Creation
//     </button>
//     </div>
//   </div>

//   {/* Các phần còn lại của model creation */}
//   <div className="sample-table-wrapper">
//     <table className="sample-table">
//       <thead>
//         <tr>
//           <th style={{ width: '50px' }}>
//             <input
//               type="checkbox"
//               checked={selectAll}
//               onChange={handleSelectAll}
//             />
//           </th>
//           <th style={{ width: '50px' }}>STT</th>
//           <th>Name</th>
//           <th>Code</th>
//           <th>Path</th>
//           <th>Image</th>
//         </tr>
//       </thead>
//       <tbody>
//         {Array.isArray(samples) && samples.length > 0 ? (
//           samples.map((sample, index) => (
//             <tr key={sample.id}>
//               <td>
//                 <input
//                   type="checkbox"
//                   checked={selectedSamples.includes(sample.id)}
//                   onChange={() => handleSelectSample(sample.id)}
//                 />
//               </td>
//               <td>{(page - 1) * pageSize + index + 1}</td>
//               <td>{sample.name}</td>
//               <td>{sample.code}</td>
//               <td>{sample.path}</td>
//               <td>
//                 <img
//                   src={sample.path}
//                   alt={sample.name}
//                   className="sample-image"
//                 />
//               </td>
//             </tr>
//           ))
//         ) : (
//           <tr><td colSpan="6">No samples found</td></tr>
//         )}
//       </tbody>
//     </table>
//   </div>

//   {/* Phần footer */}
//   {/* <div className="model-creation-footer"> */}
//   <div className="progress-container">



//     <div className="progress-message">{message}</div>
//             <div className="progress-bar">
//               <div className="progress-fill" style={{ width: `${progress}%` }}></div>
//             </div>
//   </div>
// </div>

//   );
// };

// export default CreateModel;
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client'; // Import socket.io-client
import './CreateModel.css'; // Import CSS với tên mới
import { API_VPS } from '../constant/constants';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CreateModel = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Waiting for progress...');
  const [samples, setSamples] = useState([]);
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(20); // Số mẫu mỗi trang
  const [keyword, setKeyword] = useState(null); // Từ khóa tìm kiếm
  const [categoryId, setCategoryId] = useState(null); // ID của loại biển báo
  const [categories, setCategories] = useState([]); // Danh sách các loại biển báo
  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 0
  });
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    // Gọi API lấy danh sách các loại biển báo
    fetch(`${API_VPS}/api/categories`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setCategories(data); // Cập nhật danh sách các loại biển báo
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    // Gọi API tìm kiếm mẫu
    fetch(`${API_VPS}/api/samples/search?page=${page}&page_size=${pageSize}&keyword=${keyword || ''}&category_id=${categoryId || ''}`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          setSamples(data.data); // Cập nhật danh sách mẫu từ 'data'
          setPagination(data.pagination); // Cập nhật thông tin phân trang
        } else {
          console.error("Data is not an array:", data);
          setSamples([]); // Nếu dữ liệu không phải mảng, reset lại samples
        }
      })
      .catch(error => {
        console.error('Error fetching samples:', error);
        setSamples([]); // Nếu có lỗi trong việc gọi API, reset lại samples
      });

    const socket = io('http://127.0.0.1:5001'); // Kết nối tới server Socket.io

    socket.on('progress', (data) => {
      setMessage(data.message);
      setProgress(data.progress);

      // Lưu trạng thái vào localStorage
      localStorage.setItem('modelProgress', data.progress);
      localStorage.setItem('modelMessage', data.message);
    });

    return () => {
      socket.disconnect(); // Ngắt kết nối khi component unmount
    };
  }, [page, pageSize, keyword, categoryId, token]); // Khi trang, số mẫu mỗi trang, từ khóa, hoặc categoryId thay đổi thì gọi lại API

  const startModelCreation = () => {
    fetch('http://localhost:5001/api/start-model', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ samples: selectedSamples })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        // Khi tiến trình hoàn tất, xóa trạng thái trong localStorage
        localStorage.removeItem('modelProgress');
        localStorage.removeItem('modelMessage');
        setProgress(0); // Reset lại thanh tiến trình
        setMessage('Waiting for progress...'); // Reset lại thông điệp
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleSelectSample = (id) => {
    if (selectedSamples.includes(id)) {
      setSelectedSamples(selectedSamples.filter(sampleId => sampleId !== id));
    } else {
      setSelectedSamples([...selectedSamples, id]);
    }
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      const allSampleIds = samples.map(sample => sample.id);
      setSelectedSamples(allSampleIds);
    } else {
      setSelectedSamples([]);
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="model-creation-section">
      <div className="model-creation-header">
        <h2>Model Creation</h2>

        {/* Phần tìm kiếm và page size nằm cùng dòng */}
        <div className="model-creation-controls">

        <button className="model-creation-start-button" onClick={startModelCreation}>
            Start Model Creation
          </button>
          {/* Phần thay đổi số lượng mẫu mỗi trang */}
          <div className="page-size-section">
            <label>Page Size: </label>
            <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))} className='page-size-selectt'>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Phần Pagination */}
          <div className="pagination-section">
            <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
              &#8249;
            </button>
            <span>Page {pagination.current_page} / {pagination.total_pages}</span>
            <button onClick={() => setPage(page + 1)} disabled={pagination.current_page >= pagination.total_pages}>
              &#8250;
            </button>
          </div>

          {/* Phần dropdown Traffic Sign Type */}
          <div className="category-section">
            <select onChange={(e) => setCategoryId(e.target.value)} value={categoryId || ''}>
              <option value="">Traffic Sign Type</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Phần tìm kiếm */}
          <div className="search-section">
            <input
              type="text"
              value={keyword || ''}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search samples..."
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>


        </div>
      </div>

      {/* Các phần còn lại của model creation */}
      <div className="sample-table-wrapper">
        <table className="sample-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th style={{ width: '50px' }}>STT</th>
              <th>Name</th>
              <th>Code</th>
              <th>Path</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(samples) && samples.length > 0 ? (
              samples.map((sample, index) => (
                <tr key={sample.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSamples.includes(sample.id)}
                      onChange={() => handleSelectSample(sample.id)}
                    />
                  </td>
                  <td>{(page - 1) * pageSize + index + 1}</td>
                  <td>{sample.name}</td>
                  <td>{sample.code}</td>
                  <td>{sample.path}</td>
                  <td>
                    <img
                      src={sample.path}
                      alt={sample.name}
                      className="sample-image"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No samples found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phần footer */}
      <div className="progress-container">
        <div className="progress-message">{message}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default CreateModel;
