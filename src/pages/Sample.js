// import React, { useEffect, useState, useRef } from 'react';
// import './Sample.css'; // Import CSS file
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
// import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
// import { useNavigate } from 'react-router-dom';
// import { API_VPS, API_BASE_URL } from '../constant/constants';

// const Sample = () => {
//   const [samples, setSamples] = useState([]);
//   const [selectedSample, setSelectedSample] = useState(null);
//   const canvasRef = useRef(null);
//   const navigate = useNavigate(); // Use navigate for redirection
//   const token = localStorage.getItem('accessToken');
//   const URL = API_BASE_URL;

//   // Fetch list of samples from the API
//   useEffect(() => {
//     fetch(URL + '/api/samples', {
//       credentials: 'include',
//       headers: {
//         'Authorization': `Bearer ${token}`, // Gắn JWT vào header
//         'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
//       },  
//     })
//       .then((response) => response.json())
//       .then((data) => setSamples(data))
//       .catch((error) => console.error('Error fetching samples:', error));
//   }, [token, URL]);

//   // Fetch details of a sample by ID when a sample is clicked
//   const handleSampleClick = (id) => {
//     fetch(`${API_VPS}/api/samples/${id}`, {
//       credentials: 'include',
//       headers: {
//         'Authorization': `Bearer ${token}`, // Gắn JWT vào header
//         'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
//       },  
//     })
//       .then((response) => response.json())
//       .then((data) => setSelectedSample(data))
//       .catch((error) => console.error('Error fetching sample details:', error));
//   };

//   // Load and draw image on canvas when a sample is selected
//   useEffect(() => {
//     if (selectedSample) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       const img = new Image();

//       // img.src = `http://localhost:5000/get-file?path=${selectedSample.path.replaceAll('\\', '/')}`;
//       img.src = selectedSample.path
//       img.onload = () => {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0);

//         selectedSample.labels.forEach((label, index) => {
//           const { centerX, centerY, width, height } = label;
//           const x_center_px = centerX * canvas.width;
//           const y_center_px = centerY * canvas.height;
//           const w_px = width * canvas.width * 0.35;
//           const h_px = height * canvas.height * 2.3;
//           const x_min = x_center_px - w_px / 2;
//           const y_min = y_center_px - h_px / 2;

//           ctx.strokeStyle = 'red';
//           ctx.lineWidth = 1;
//           ctx.strokeRect(x_min, y_min, w_px, h_px);
//           ctx.fillStyle = 'white';
//           ctx.font = '12px Arial';
//           ctx.fillText(index + 1, x_min, y_min);
//         });
//       };
//     }
//   }, [selectedSample]);

//   const handleAddSample = () => {
//     navigate('/createSample');
//   };

//   // Navigate to EditSample page with the selected sample ID
//   const handleEditSample = (id) => {
//     navigate(`/updateSample/${id}`);
//   };

//   // Delete sample with confirmation
//   const handleDeleteSample = (id) => {
//     if (window.confirm("Are you sure you want to delete this sample?")) {
//       fetch(`${API_VPS}/api/samples/${id}`, {
//         credentials: 'include'  ,
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`, // Gắn JWT vào header
//           'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
//         },
//       })
//         .then(() => setSamples(samples.filter((sample) => sample.id !== id)))
//         .catch((error) => console.error('Error deleting sample:', error));
//     }
//   };

//   return (
//     <div className="sample-container">
//       {/* Sample Details */}
//       {selectedSample ? (
//         <div className="sample-details">
//           <h2>Name: {selectedSample.name}</h2>
//           <p><strong>Code:</strong> {selectedSample.code}</p>
//           <img
//             // src={`http://localhost:5000/get-file?path=${selectedSample.path.replaceAll('\\', '/')}`}
//             src={selectedSample.path}
//             alt={selectedSample.name}
//             style={{ display: 'none' }}
//           />
//           <canvas ref={canvasRef} />

//           {/* Label Details Table */}
//           <h3>Label Details</h3>
//           <div className="label-table-container">
//             <table className="label-table" border="1" cellPadding="10">
//               <thead>
//                 <tr>
//                   <th>STT</th>
//                   <th className="small-column">Center X</th>
//                   <th className="small-column">Center Y</th>
//                   <th className="small-column">Height</th>
//                   <th className="small-column">Width</th>
//                   <th className="traffic-sign-column">Traffic Sign Name</th>
//                   <th className="description-column">Description</th>
//                   <th>Image</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedSample.labels.map((label, index) => (
//                   <tr key={label.id}>
//                     <td>{index + 1}</td>
//                     <td className="small-column overflow" title={label.centerX}>{label.centerX.toFixed(2)}...</td>
//                     <td className="small-column overflow" title={label.centerY}>{label.centerY.toFixed(2)}...</td>
//                     <td className="small-column overflow" title={label.height}>{label.height.toFixed(2)}...</td>
//                     <td className="small-column overflow" title={label.width}>{label.width.toFixed(2)}...</td>
//                     <td>{label.traffic_sign.name}</td>
//                     <td className="description-column-detail" title={label.traffic_sign.description}>{label.traffic_sign.description}</td>
//                     <td>
//                       <img
//                         src={label.traffic_sign.path}
//                         alt={label.traffic_sign.name}
//                         style={{ width: '50px' }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="sample-details">
//           <h2>Select a Sample</h2>
//         </div>
//       )}

//       {/* Samples Grid */}
//       <div className="samples-grid">
//         <button className="btn btn-primary add-sample-button" onClick={handleAddSample}>
//           Add Sample
//         </button>
//         {samples.map((sample) => (
//           <div
//             key={sample.id}
//             className="sample-card"
//             onClick={() => handleSampleClick(sample.id)}
//           >
//             <img
//               // src={`http://localhost:5000/get-file?path=${sample.path.replaceAll('\\', '/')}`}
//               src={sample.path}
//               alt={sample.name}
//             />
//             <div className="sample-actions">
//               <FontAwesomeIcon
//                 icon={faEdit}
//                 color="dodgerblue"
//                 className="sample-action-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleEditSample(sample.id);
//                 }}
//               />
//               <FontAwesomeIcon
//                 icon={faTrashAlt}
//                 color="red"
//                 className="sample-action-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteSample(sample.id);
//                 }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sample;
// import React, { useEffect, useState, useRef } from 'react';
// import './Sample.css'; // Import CSS file
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
// import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
// import { useNavigate } from 'react-router-dom';
// import { API_VPS, API_BASE_URL } from '../constant/constants';
// import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
// const Sample = () => {
//   const [samples, setSamples] = useState([]);
//   const [selectedSample, setSelectedSample] = useState(null);
//   const [searchParams, setSearchParams] = useState({
//     keyword: '',
//     category_id: null,
//     page: 1,
//     page_size: 10
//   });
//   const canvasRef = useRef(null);
//   const navigate = useNavigate(); // Use navigate for redirection
//   const token = localStorage.getItem('accessToken');
//   const URL = API_BASE_URL;

//   // Fetch samples based on search parameters
//   useEffect(() => {
//     const fetchSamples = async () => {
//       const { keyword, category_id, page, page_size } = searchParams;
//       const query = new URLSearchParams({
//         keyword,
//         category_id,
//         page,
//         page_size
//       }).toString();

//       try {
//         const response = await fetch(`${URL}/api/samples/search?${query}`, {
//           credentials: 'include',
//           headers: {
//             'Authorization': `Bearer ${token}`, // Add JWT in header
//             'Accept': 'application/json',
//           },
//         });

//         const data = await response.json();
//         setSamples(data.data); // Set the sample data from response
//       } catch (error) {
//         console.error('Error fetching samples:', error);
//       }
//     };

//     fetchSamples();
//   }, [searchParams, token, URL]);

//   // Fetch details of a sample by ID when a sample is clicked
//   const handleSampleClick = (id) => {
//     fetch(`${API_VPS}/api/samples/${id}`, {
//       credentials: 'include',
//       headers: {
//         'Authorization': `Bearer ${token}`, // Add JWT in header
//         'Accept': 'application/json',
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => setSelectedSample(data))
//       .catch((error) => console.error('Error fetching sample details:', error));
//   };

//   // Load and draw image on canvas when a sample is selected
//   useEffect(() => {
//     if (selectedSample) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       const img = new Image();

//       img.src = selectedSample.path;
//       img.onload = () => {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0);

//         selectedSample.labels.forEach((label, index) => {
//           const { centerX, centerY, width, height } = label;
//           const x_center_px = centerX * canvas.width;
//           const y_center_px = centerY * canvas.height;
//           const w_px = width * canvas.width * 0.35;
//           const h_px = height * canvas.height * 2.3;
//           const x_min = x_center_px - w_px / 2;
//           const y_min = y_center_px - h_px / 2;

//           ctx.strokeStyle = 'red';
//           ctx.lineWidth = 1;
//           ctx.strokeRect(x_min, y_min, w_px, h_px);
//           ctx.fillStyle = 'white';
//           ctx.font = '12px Arial';
//           ctx.fillText(index + 1, x_min, y_min);
//         });
//       };
//     }
//   }, [selectedSample]);

//   const handleAddSample = () => {
//     navigate('/createSample');
//   };

//   // Navigate to EditSample page with the selected sample ID
//   const handleEditSample = (id) => {
//     navigate(`/updateSample/${id}`);
//   };

//   // Delete sample with confirmation
//   const handleDeleteSample = (id) => {
//     if (window.confirm('Are you sure you want to delete this sample?')) {
//       fetch(`${API_VPS}/api/samples/${id}`, {
//         credentials: 'include',
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`, // Add JWT in header
//           'Accept': 'application/json',
//         },
//       })
//         .then(() => setSamples(samples.filter((sample) => sample.id !== id)))
//         .catch((error) => console.error('Error deleting sample:', error));
//     }
//   };
//   const [categories, setCategories] = useState([]); // State to store categories

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${URL}/api/categories`, {
//           credentials: 'include',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json',
//           },
//         });

//         const data = await response.json();
//         setCategories(data); // Save categories data to state
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchCategories();
//   }, [URL, token]);

//   // Handle search form change
//   const handleSearchChange = (e) => {
//     setSearchParams({
//       ...searchParams,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     // Trigger a search when form is submitted
//     setSearchParams((prevParams) => ({
//       ...prevParams,
//       page: 1, // Reset page number to 1 when new search is submitted
//     }));
//   };

//   return (
//     <div className="sample-container">


//       {/* Sample Details */}
//       {selectedSample ? (
//         <div className="sample-details">
//           <h2>Name: {selectedSample.name}</h2>
//           <p><strong>Code:</strong> {selectedSample.code}</p>
//           <img
//             src={selectedSample.path}
//             alt={selectedSample.name}
//             style={{ display: 'none' }}
//           />
//           <canvas ref={canvasRef} />

//           {/* Label Details Table */}
//           <h3>Label Details</h3>
//           <div className="label-table-container">
//             <table className="label-table" border="1" cellPadding="10">
//               <thead>
//                 <tr>
//                   <th>STT</th>
//                   <th className="small-column">Center X</th>
//                   <th className="small-column">Center Y</th>
//                   <th className="small-column">Height</th>
//                   <th className="small-column">Width</th>
//                   <th className="traffic-sign-column">Traffic Sign Name</th>
//                   <th className="description-column">Description</th>
//                   <th>Image</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedSample.labels.map((label, index) => (
//                   <tr key={label.id}>
//                     <td>{index + 1}</td>
//                     <td className="small-column overflow" title={label.centerX}>{label.centerX.toFixed(2)}...</td>
//                     <td className="small-column overflow" title={label.centerY}>{label.centerY.toFixed(2)}...</td>
//                     <td className="small-column overflow" title={label.height}>{label.height.toFixed(2)}...</td>
//                     <td className="small-column overflow" title={label.width}>{label.width.toFixed(2)}...</td>
//                     <td>{label.traffic_sign.name}</td>
//                     <td className="description-column-detail" title={label.traffic_sign.description}>{label.traffic_sign.description}</td>
//                     <td>
//                       <img
//                         src={label.traffic_sign.path}
//                         alt={label.traffic_sign.name}
//                         style={{ width: '50px' }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="sample-details">
//           <h2>Select a Sample</h2>
//         </div>
//       )}

//       {/* Samples Grid */}
//       <div className="samples-grid">
//               {/* Search Form */}
//               <div className="sticky-buttons-container">

//         <button className="add-sample-buttonn" onClick={handleAddSample}>
//           Add Sample
//         </button>
//         <form onSubmit={handleSearchSubmit} className="search-form">
//         <div className="search-containerr">
//         <input
//           type="text"
//           name="keyword"
//           value={searchParams.keyword}
//           onChange={handleSearchChange}
//           className="search-inputt"

//         />
//             <FontAwesomeIcon icon={faSearch} className="search-icon" /></div>
// {/* Category Dropdown */}
// <div className='category-dropdownn'>
// <select
//             name="category_id"
//             value={searchParams.category_id || ''}
//             onChange={handleSearchChange}
//             className="category-select"
//           >
//             <option value="">Select Category</option>
//             {categories.map((category) => (
//               <option key={category.id} value={category.id}>
//                 {category.name}
//               </option>
//             ))}
//           </select></div>
//       </form>
//       </div>
//         {samples.map((sample) => (
//           <div
//             key={sample.id}
//             className="sample-card"
//             onClick={() => handleSampleClick(sample.id)}
//           >
//             <img
//               src={sample.path}
//               alt={sample.name}
//             />
//             <div className="sample-actions">
//               <FontAwesomeIcon
//                 icon={faEdit}
//                 color="dodgerblue"
//                 className="sample-action-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleEditSample(sample.id);
//                 }}
//               />
//               <FontAwesomeIcon
//                 icon={faTrashAlt}
//                 color="red"
//                 className="sample-action-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteSample(sample.id);
//                 }}
//                 />
//                 </div>
//                 <h3>{sample.name}</h3>
//                 <p>{sample.code}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         ); };

//         export default Sample;
// import React, { useEffect, useState, useRef } from 'react';
// import './Sample.css'; // Import CSS file
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
// import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
// import { useNavigate } from 'react-router-dom';
// import { API_VPS, API_BASE_URL } from '../constant/constants';
// import debounce from 'lodash/debounce'; // Import debounce function from lodash

// const Sample = () => {
//   const [samples, setSamples] = useState([]);
//   const [selectedSample, setSelectedSample] = useState(null);
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query
//   const canvasRef = useRef(null);
//   const navigate = useNavigate(); // Use navigate for redirection
//   const token = localStorage.getItem('accessToken');
//   const URL = API_BASE_URL;

//   // Fetch list of samples from the search API
//   const fetchSamples = async (query) => {
//     try {
//       const response = await fetch(`${URL}/api/samples/search?page=1&page_size=12&category_id=4&search=${query}`, {
//         credentials: 'include',
//         headers: {
//           'Authorization': `Bearer ${token}`, // Gắn JWT vào header
//           'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
//         },
//       });
//       const data = await response.json();
//       setSamples(data);
//     } catch (error) {
//       console.error('Error fetching samples:', error);
//     }
//   };

//   // Debounced version of the fetchSamples function
//   const debouncedSearch = debounce((query) => fetchSamples(query), 500);

//   useEffect(() => {
//     fetchSamples(""); // Fetch all samples initially with empty search query
//   }, [token, URL]);

//   // Fetch details of a sample by ID when a sample is clicked
//   const handleSampleClick = (id) => {
//     fetch(`${API_VPS}/api/samples/${id}`, {
//       credentials: 'include',
//       headers: {
//         'Authorization': `Bearer ${token}`, // Gắn JWT vào header
//         'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => setSelectedSample(data))
//       .catch((error) => console.error('Error fetching sample details:', error));
//   };

//   // Load and draw image on canvas when a sample is selected
//   useEffect(() => {
//     if (selectedSample) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       const img = new Image();
//       img.src = selectedSample.path;
//       img.onload = () => {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0);

//         selectedSample.labels.forEach((label, index) => {
//           const { centerX, centerY, width, height } = label;
//           const x_center_px = centerX * canvas.width;
//           const y_center_px = centerY * canvas.height;
//           const w_px = width * canvas.width * 0.35;
//           const h_px = height * canvas.height * 2.3;
//           const x_min = x_center_px - w_px / 2;
//           const y_min = y_center_px - h_px / 2;

//           ctx.strokeStyle = 'red';
//           ctx.lineWidth = 1;
//           ctx.strokeRect(x_min, y_min, w_px, h_px);
//           ctx.fillStyle = 'white';
//           ctx.font = '12px Arial';
//           ctx.fillText(index + 1, x_min, y_min);
//         });
//       };
//     }
//   }, [selectedSample]);

//   const handleAddSample = () => {
//     navigate('/createSample');
//   };

//   // Navigate to EditSample page with the selected sample ID
//   const handleEditSample = (id) => {
//     navigate(`/updateSample/${id}`);
//   };

//   // Delete sample with confirmation
//   const handleDeleteSample = (id) => {
//     if (window.confirm("Are you sure you want to delete this sample?")) {
//       fetch(`${API_VPS}/api/samples/${id}`, {
//         credentials: 'include',
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`, // Gắn JWT vào header
//           'Accept': 'application/json', // Chỉ định kiểu dữ liệu mong muốn
//         },
//       })
//         .then(() => setSamples(samples.filter((sample) => sample.id !== id)))
//         .catch((error) => console.error('Error deleting sample:', error));
//     }
//   };

//   // Handle search query change
//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     debouncedSearch(query); // Trigger debounced search
//   };

//   return (
//     <div className="sample-container">
//       {/* Sample Details */}
//       {selectedSample ? (
//         <div className="sample-details">
//           <h2>Name: {selectedSample.name}</h2>
//           <p><strong>Code:</strong> {selectedSample.code}</p>
//           <img
//             src={selectedSample.path}
//             alt={selectedSample.name}
//             style={{ display: 'none' }}
//           />
//           <canvas ref={canvasRef} />

//           {/* Label Details Table */}
//           <h3>Label Details</h3>
//           <div className="label-table-container">
//             <table className="label-table" border="1" cellPadding="10">
//               <thead>
//                 <tr>
//                   <th>STT</th>
//                   <th className="small-column">Center X</th>
//                   <th className="small-column">Center Y</th>
//                   <th className="small-column">Height</th>
//                   <th className="small-column">Width</th>
//                   <th className="traffic-sign-column">Traffic Sign Name</th>
//                   <th className="description-column">Description</th>
//                   <th>Image</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedSample.labels.map((label, index) => (
//                   <tr key={label.id}>
//                     <td>{index + 1}</td>
//                     <td className="small-column overflow" title={label.centerX}>{label.centerX.toFixed(2)}...</td>
//                     <td className="small-column overflow" title={label.centerY}>{label.centerY.toFixed(2)}...</td>
//                     <td className="small-column overflow" title={label.height}>{label.height.toFixed(2)}...</td>
//                     <td className="small-column overflow" title={label.width}>{label.width.toFixed(2)}...</td>
//                     <td>{label.traffic_sign.name}</td>
//                     <td className="description-column-detail" title={label.traffic_sign.description}>{label.traffic_sign.description}</td>
//                     <td>
//                       <img
//                         src={label.traffic_sign.path}
//                         alt={label.traffic_sign.name}
//                         style={{ width: '50px' }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="sample-details">
//           <h2>Select a Sample</h2>
//         </div>
//       )}

//       {/* Samples Grid */}
//       <div className="samples-grid">
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search samples..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//         />
//         <button className="btn btn-primary add-sample-button" onClick={handleAddSample}>
//           Add Sample
//         </button>
//         {samples.map((sample) => (
//           <div
//             key={sample.id}
//             className="sample-card"
//             onClick={() => handleSampleClick(sample.id)}
//           >
//             <img
//               src={sample.path}
//               alt={sample.name}
//             />
//             <div className="sample-actions">
//               <FontAwesomeIcon
//                 icon={faEdit}
//                 color="dodgerblue"
//                 className="sample-action-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleEditSample(sample.id);
//                 }}
//               />
//               <FontAwesomeIcon
//                 icon={faTrashAlt}
//                 color="red"
//                 className="sample-action-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteSample(sample.id);
//                 }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sample;
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import './Sample.css'; // Import CSS file
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
// import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
// import { useNavigate } from 'react-router-dom';
// import { API_VPS, API_BASE_URL } from '../constant/constants';
// import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
// import { debounce } from 'lodash'; // Import lodash for debouncing

// const Sample = () => {
//   const [samples, setSamples] = useState([]);
//   const [selectedSample, setSelectedSample] = useState(null);
//   const [searchParams, setSearchParams] = useState({
//     keyword: '',
//     category_id: null,
//     page: 1,
//     page_size: 10, // Default page size
//   });
//   const [categories, setCategories] = useState([]);
//   const [totalPages, setTotalPages] = useState(0); // Track the total number of pages
//   const canvasRef = useRef(null);
//   const navigate = useNavigate(); // Use navigate for redirection
//   const token = localStorage.getItem('accessToken');
//   const URL = API_BASE_URL;

//   // Fetch samples based on search parameters
//   const fetchSamples = useCallback(async () => {
//     const { keyword, category_id, page, page_size } = searchParams;
//     const categoryQuery = category_id ? `&category_id=${category_id}` : '';
//     const query = new URLSearchParams({
//       keyword,
//       page,
//       page_size,
//     }).toString();
  
//     try {
//       const response = await fetch(
//         `${URL}/api/samples/search?${query}${categoryQuery}`,
//         {
//           credentials: 'include',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/json',
//           },
//         }
//       );
//       const data = await response.json();
//       setSamples(data.data);
//       setTotalPages(data.pagination.total_pages); // Sử dụng giá trị trả về từ API
//       setSearchParams((prevParams) => ({
//         ...prevParams,
//         page: data.pagination.current_page, // Cập nhật trang hiện tại
//         page_size: data.pagination.page_size, // Cập nhật page size từ API
//       }));
//     } catch (error) {
//       console.error('Error fetching samples:', error);
//     }
//   }, [searchParams, token, URL]);
  
//   useEffect(() => {
//     fetchSamples();
//   }, [fetchSamples]);
  

//   const handleSearchChange = debounce((e) => {
//     setSearchParams((prevParams) => ({
//       ...prevParams,
//       keyword: e.target.value,
//       page: 1, // Reset page to 1 when a new search is done
//     }));
// }, 500); // Thời gian debounce có thể điều chỉnh tùy vào nhu cầu


//   // Fetch categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${URL}/api/categories`, {
//           credentials: 'include',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/json',
//           },
//         });

//         const data = await response.json();
//         setCategories(data); // Save categories data to state
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchCategories();
//   }, [URL, token]);

//   // Fetch details of a sample by ID when a sample is clicked
//   const handleSampleClick = (id) => {
//     fetch(`${API_VPS}/api/samples/${id}`, {
//       credentials: 'include',
//       headers: {
//         Authorization: `Bearer ${token}`, // Add JWT in header
//         Accept: 'application/json',
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => setSelectedSample(data))
//       .catch((error) => console.error('Error fetching sample details:', error));
//   };

//   // Load and draw image on canvas when a sample is selected
//   useEffect(() => {
//     if (selectedSample) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       const img = new Image();

//       img.src = selectedSample.path;
//       img.onload = () => {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0);

//         selectedSample.labels.forEach((label, index) => {
//           const { centerX, centerY, width, height } = label;
//           const x_center_px = centerX * canvas.width;
//           const y_center_px = centerY * canvas.height;
//           const w_px = width * canvas.width * 0.35;
//           const h_px = height * canvas.height * 2.3;
//           const x_min = x_center_px - w_px / 2;
//           const y_min = y_center_px - h_px / 2;

//           ctx.strokeStyle = 'red';
//           ctx.lineWidth = 1;
//           ctx.strokeRect(x_min, y_min, w_px, h_px);
//           ctx.fillStyle = 'white';
//           ctx.font = '12px Arial';
//           ctx.fillText(index + 1, x_min, y_min);
//         });
//       };
//     }
//   }, [selectedSample]);

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return; // Kiểm tra nếu trang vượt quá giới hạn
//     setSearchParams((prevParams) => ({
//       ...prevParams,
//       page: newPage,
//     }));
//   };
  

//   // Handle changing page size
//   const handlePageSizeChange = (e) => {
//     setSearchParams((prevParams) => ({
//       ...prevParams,
//       page_size: parseInt(e.target.value),
//       page: 1, // Reset to page 1 when changing page size
//     }));
//   };
//   // Handle Add Sample
//   const handleAddSample = () => {
//     navigate('/createSample');
//   };

//   // Navigate to EditSample page with the selected sample ID
//   const handleEditSample = (id) => {
//     navigate(`/updateSample/${id}`);
//   };

//   // Delete sample with confirmation
//   const handleDeleteSample = (id) => {
//     if (window.confirm('Are you sure you want to delete this sample?')) {
//       fetch(`${API_VPS}/api/samples/${id}`, {
//         credentials: 'include',
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`, // Add JWT in header
//           'Accept': 'application/json',
//         },
//       })
//         .then(() => setSamples(samples.filter((sample) => sample.id !== id)))
//         .catch((error) => console.error('Error deleting sample:', error));
//     }
//   };

//   return (
//     <div className="sample-container">
//       {/* Sample Details */}
//       {selectedSample ? (
//         <div className="sample-details">
//           <h2>Name: {selectedSample.name}</h2>
//           <p>
//             <strong>Code:</strong> {selectedSample.code}
//           </p>
//           <img src={selectedSample.path} alt={selectedSample.name} style={{ display: 'none' }} />
//           <canvas ref={canvasRef} />

//           {/* Label Details Table */}
//           <h3>Label Details</h3>
//           <div className="label-table-container">
//             <table className="label-table" border="1" cellPadding="10">
//               <thead>
//                 <tr>
//                   <th>STT</th>
//                   <th className="small-column">Center X</th>
//                   <th className="small-column">Center Y</th>
//                   <th className="small-column">Height</th>
//                   <th className="small-column">Width</th>
//                   <th className="traffic-sign-column">Traffic Sign Name</th>
//                   <th className="description-column">Description</th>
//                   <th>Image</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedSample.labels.map((label, index) => (
//                   <tr key={label.id}>
//                     <td>{index + 1}</td>
//                     <td className="small-column overflow" title={label.centerX}>
//                       {label.centerX.toFixed(2)}...
//                     </td>
//                     <td className="small-column overflow" title={label.centerY}>
//                       {label.centerY.toFixed(2)}...
//                     </td>
//                     <td className="small-column overflow" title={label.height}>
//                       {label.height.toFixed(2)}...
//                     </td>
//                     <td className="small-column overflow" title={label.width}>
//                       {label.width.toFixed(2)}...
//                     </td>
//                     <td>{label.traffic_sign.name}</td>
//                     <td className="description-column-detail" title={label.traffic_sign.description}>
//                       {label.traffic_sign.description}
//                     </td>
//                     <td>
//                       <img src={label.traffic_sign.path} alt={label.traffic_sign.name} style={{ width: '50px' }} />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="sample-details">
//           <h2>Select a Sample</h2>
//         </div>
//       )}

//       {/* Samples Grid */}
//       <div className="samples-grid">
//         <div className="sticky-buttons-container">
//           <button className="add-sample-buttonn" onClick={handleAddSample}>
//             Add Sample
//           </button>
//           <form onSubmit={(e) => e.preventDefault()} className="search-form">
//             <div className="search-containerr">
//               <input
//                 type="text"
//                 name="keyword"
//                 value={searchParams.keyword}
//                 onChange={handleSearchChange}
//                 className="search-inputt"
//               />
//               <FontAwesomeIcon icon={faSearch} className="search-icon" />
//             </div>

//             {/* Category Dropdown */}
//             <div className="category-dropdownn">
//             <div className="pagination">
//             <span>Page size: </span>
//   <select
//     value={searchParams.page_size}
//     onChange={handlePageSizeChange}
//     className="page-size-select"
//   >
//     <option value={5}>5</option>
//     <option value={10}>10</option>
//     <option value={15}>15</option>
//     <option value={20}>20</option>
//   </select>
//   <button
//     onClick={() => handlePageChange(searchParams.page - 1)}
//     disabled={searchParams.page === 1}
//   >
//     Previous
//   </button>

//   <span>
//     Page {searchParams.page} / {totalPages}
//   </span>



//   <button
//     onClick={() => handlePageChange(searchParams.page + 1)}
//     disabled={searchParams.page === totalPages}
//   >
//     Next
//   </button>
// </div>
//               <select
//                 name="category_id"
//                 value={searchParams.category_id || ''}
//                 onChange={(e) => setSearchParams({ ...searchParams, category_id: e.target.value })}
//                 className="category-select"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </form>
//         </div>

//         {/* Sample Cards */}
//         {samples.map((sample) => (
//           <div
//             key={sample.id}
//             className="sample-card"
//             onClick={() => handleSampleClick(sample.id)}
//           >
//             <img src={sample.path} alt={sample.name} />
//             <div className="sample-actions">
//               <FontAwesomeIcon
//                 icon={faEdit}
//                 color="dodgerblue"
//                 className="sample-action-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleEditSample(sample.id);
//                 }}
//               />
//               <FontAwesomeIcon
//                 icon={faTrashAlt}
//                 color="red"
//                 className="sample-action-icon"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleDeleteSample(sample.id);
//                 }}
//               />
//             </div>
//             <h3>{sample.name}</h3>
//             <p>{sample.code}</p>
//           </div>
//         ))}

        
//       </div>
//     </div>
//   );
// };

// export default Sample;
import React, { useEffect, useState, useRef } from 'react';
import './Sample.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import { useNavigate } from 'react-router-dom';
import { API_VPS } from '../constant/constants';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

const Sample = () => {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category_id: null,
    page: 1,
    page_size: 10, // Default page size
  });
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // Track the total number of pages
  const canvasRef = useRef(null);
  const navigate = useNavigate(); // Use navigate for redirection
  const token = localStorage.getItem('accessToken');
  const URL = API_VPS;

  // Fetch samples based on search parameters
  useEffect(() => {
    const fetchSamples = async () => {
      const { keyword, category_id, page, page_size } = searchParams;
      const categoryQuery = category_id ? `&category_id=${category_id}` : ''; // Fix syntax error
      const query = new URLSearchParams({
        keyword,
        page,
        page_size,
      }).toString();

      try {
        const response = await fetch(
          `${URL}/api/samples/search?${query}${categoryQuery}`, // Fix template literal
          {
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${token}`, // Fix template literal
              Accept: 'application/json',
            },
          }
        );
        const data = await response.json();
        setSamples(data.data); // Set the sample data from response
        setTotalPages(data.pagination.total_pages); // Assuming the API returns totalPages
      } catch (error) {
        console.error('Error fetching samples:', error);
      }
    };

    fetchSamples();
  }, [searchParams, token, URL]);

  const handleSearchChange = (e) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      keyword: e.target.value,
      page: 1, // Reset page to 1 when a new search is done
    }));
  };
  
  

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${URL}/api/categories`, { // Fix template literal
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`, // Fix template literal
            Accept: 'application/json',
          },
        });

        const data = await response.json();
        setCategories(data); // Save categories data to state
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [URL, token]);

  // Fetch details of a sample by ID when a sample is clicked
  const handleSampleClick = (id) => {
    fetch(`${API_VPS}/api/samples/${id}`, { // Fix template literal
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`, // Fix template literal
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setSelectedSample(data))
      .catch((error) => console.error('Error fetching sample details:', error));
  };

  // Load and draw image on canvas when a sample is selected
  useEffect(() => {
    if (selectedSample) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = selectedSample.path;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        selectedSample.labels.forEach((label, index) => {
          const { centerX, centerY, width, height } = label;
          const x_center_px = centerX * canvas.width;
          const y_center_px = centerY * canvas.height;
          const w_px = width * canvas.width * 0.35;
          const h_px = height * canvas.height * 2.3;
          const x_min = x_center_px - w_px / 2;
          const y_min = y_center_px - h_px / 2;

          ctx.strokeStyle = 'red';
          ctx.lineWidth = 1;
          ctx.strokeRect(x_min, y_min, w_px, h_px);
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.fillText(index + 1, x_min, y_min);
        });
      };
    }
  }, [selectedSample]);

  // Handle pagination
  const handlePageChange = (page) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      page,
    }));
  };

  // Handle changing page size
  const handlePageSizeChange = (e) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      page_size: parseInt(e.target.value),
      page: 1, // Reset to page 1 when changing page size
    }));
  };

  // Handle Add Sample
  const handleAddSample = () => {
    navigate('/createSample');
  };

  // Navigate to EditSample page with the selected sample ID
  const handleEditSample = (id) => {
    navigate(`/updateSample/${id}`); // Fix template literal
  };

  // Delete sample with confirmation
  const handleDeleteSample = (id) => {
    if (window.confirm('Are you sure you want to delete this sample?')) {
      fetch(`${API_VPS}/api/samples/${id}`, { // Fix template literal
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Fix template literal
          'Accept': 'application/json',
        },
      })
        .then(() => setSamples(samples.filter((sample) => sample.id !== id)))
        .catch((error) => console.error('Error deleting sample:', error));
    }
  };

  return (
    <div className="sample-container">
      {/* Sample Details */}
      {selectedSample ? (
        <div className="sample-details">
          <h2>Name: {selectedSample.name}</h2>
          <p>
            <strong>Code:</strong> {selectedSample.code}
          </p>
          <img src={selectedSample.path} alt={selectedSample.name} style={{ display: 'none' }} />
          <canvas ref={canvasRef} />

          {/* Label Details Table */}
          <h3>Label Details</h3>
          <div className="label-table-container">
            <table className="label-table" border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>STT</th>
                  <th className="small-column">Center X</th>
                  <th className="small-column">Center Y</th>
                  <th className="small-column">Height</th>
                  <th className="small-column">Width</th>
                  <th className="traffic-sign-column">Traffic Sign Name</th>
                  <th className="description-column">Description</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {selectedSample.labels.map((label, index) => (
                  <tr key={label.id}>
                    <td>{index + 1}</td>
                    <td className="small-column overflow" title={label.centerX}>
                      {label.centerX.toFixed(2)}...
                    </td>
                    <td className="small-column overflow" title={label.centerY}>
                      {label.centerY.toFixed(2)}...
                    </td>
                    <td className="small-column overflow" title={label.height}>
                      {label.height.toFixed(2)}...
                    </td>
                    <td className="small-column overflow" title={label.width}>
                      {label.width.toFixed(2)}...
                    </td>
                    <td>{label.traffic_sign.name}</td>
                    <td className="description-column-detail" title={label.traffic_sign.description}>
                      {label.traffic_sign.description}
                    </td>
                    <td>
                      <img src={label.traffic_sign.path} alt={label.traffic_sign.name} style={{ width: '50px' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="sample-details">
          <h2>Select a Sample</h2>
        </div>
      )}

      {/* Samples Grid */}
      <div className="samples-grid">
        <div className="sticky-buttons-container">
          <button className="add-sample-buttonn" onClick={handleAddSample}>
            Add Sample
          </button>
          <form onSubmit={(e) => e.preventDefault()} className="search-form">
                  <div className="search-containerr">
         <input
          type="text"
          name="keyword"
          value={searchParams.keyword}
          onChange={handleSearchChange}
          className="search-inputt"

        />
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>

            {/* Category Dropdown */}
            <div className="category-dropdownn">

                         <div className="pagination">
             <span>Page size: </span>
   <select
    value={searchParams.page_size}
    onChange={handlePageSizeChange}
    className="page-size-select"
  >
    <option value={5}>5</option>
    <option value={10}>10</option>
    <option value={15}>15</option>
    <option value={20}>20</option>
  </select>
  <button
    onClick={() => handlePageChange(searchParams.page - 1)}
    disabled={searchParams.page === 1}
  >
    &#8249;
  </button>

  <span>
    Page {searchParams.page} / {totalPages}
  </span>



  <button
    onClick={() => handlePageChange(searchParams.page + 1)}
    disabled={searchParams.page === totalPages}
  >
    &#8250;
  </button>
</div>
              <select
                name="category_id" 
                value={searchParams.category_id || ''}
                onChange={(e) => setSearchParams({ ...searchParams, category_id: e.target.value })}
                className="category-select"
              >
                <option value="">Type</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Sample Cards */}
        {samples.map((sample) => (
          <div
            key={sample.id}
            className="sample-card"
            onClick={() => handleSampleClick(sample.id)}
          >
            <img src={sample.path} alt={sample.name} />
            <div className="sample-actions">
              <FontAwesomeIcon
                icon={faEdit}
                color="dodgerblue"
                className="sample-action-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSample(sample.id);
                }}
              />
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="red"
                className="sample-action-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSample(sample.id);
                }}
              />
            </div>
            <h3>{sample.name}</h3>
            <p>{sample.code}</p>
          </div>
        ))}

        
      </div>
    </div>
  );
};

export default Sample;
