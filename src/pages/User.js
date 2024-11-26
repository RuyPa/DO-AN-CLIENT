import React, { useEffect, useState, useCallback } from "react";
import { API_VPS } from "../constant/constants";
import "./User.css";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const User = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("accessToken");
  const [userIdToUpdate, setUserIdToUpdate] = useState(null);

  const [isAddUserVisible, setIsAddUserVisible] = useState(true); // Mặc định Add User hiển thị

  // Fetch dữ liệu từ API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_VPS}/api/users/search?page=${currentPage}&page_size=${pageSize}`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1); // Quay về trang 1 khi thay đổi số hàng mỗi trang
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.total_pages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleAddUserClick = () => {
    setIsAddUserVisible(true); // Mở AddUser
    setUserIdToUpdate(null); // Đóng UpdateUser
  };

  const handleUpdateUserClick = (id) => {
    setUserIdToUpdate(id); // Đặt người dùng cần cập nhật
    setIsAddUserVisible(false); // Đóng AddUser
  };

  const handleSetActive = (id) => {
    console.log(`Set active for user ${id}`);
    // Logic để set active
  };

  return (
    <div className="user-list-container">
      <h1>User Management</h1>

      {/* Thẻ tag luôn hiển thị */}
      <div className="add-user-container">
        <div
          className={`add-user-tag ${isAddUserVisible ? "clicked" : ""}`} // Add User tag
          onClick={handleAddUserClick}
        >
          Add User
        </div>
      </div>
      <div className="update-user-container">
        <div
          className={`update-user-tag ${!isAddUserVisible ? "clicked" : ""}`} // Update User tag
        >
          Update User
        </div>
      </div>

      {/* Add User Section */}
      <div className="add-user-section">
        <AddUser apiUrl={API_VPS} isClicked={isAddUserVisible} />
      </div>

      {/* Update User Section */}
      <div className="update-user-section">
        <UpdateUser
          apiUrl={API_VPS}
          userId={userIdToUpdate}
          isClicked={!isAddUserVisible}
        />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th style={{ width: "10%" }}>Actions</th>
            <th style={{ width: "15%" }}>Name</th>
            <th style={{ width: "20%" }}>Email</th>
            <th style={{ width: "20%" }}>Address</th>
            <th style={{ width: "10%" }}>Role</th>
            <th style={{ width: "15%" }}>Created By</th>
            <th style={{ width: "15%" }}>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <FontAwesomeIcon
                    icon={faEdit}
                    color="dodgerblue"
                    className="icon"
                    onClick={() => handleUpdateUserClick(user.id)} // Chỉ logic sửa qua table
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  />
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    color={user.active ? "green" : "gray"}
                    className="icon"
                    onClick={() => handleSetActive(user.id)}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                 <td data-tooltip={user.name}>{user.name}</td>
                 <td data-tooltip={user.email}>{user.email}</td>
                 <td data-tooltip={user.address}>{user.address}</td>
                <td data-tooltip={user.role}>{user.role}</td>
                 <td data-tooltip={user.created_by}>{user.created_by}</td>
                <td data-tooltip={new Date(user.created_date).toLocaleString()}>
                   {new Date(user.created_date).toLocaleString()}
                 </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <div className="page-size-selector">
          <label htmlFor="page-size">Số hàng mỗi trang: </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={loading}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="pagination-info">
          {`${(currentPage - 1) * pageSize + 1}-${
            Math.min(currentPage * pageSize, pagination.total_items)
          } trong ${pagination.total_items}`}
        </div>
        <div className="pagination-buttons">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
          >
            &#8249;
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === pagination.total_pages || loading}
          >
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
