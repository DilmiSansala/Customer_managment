import React, { useState, useEffect } from 'react';
import customerService from '../services/customerService';
import './CustomerList.css';

const CustomerList = ({ onEditCustomer, onAddCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [bulkUploadModal, setBulkUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to connect to server. Make sure Spring Boot is running on port 8081.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        setCustomers(customers.filter(customer => customer.id !== id));
        alert('Customer deleted successfully!');
      } catch (err) {
        console.error('Error deleting customer:', err);
        alert('Failed to delete customer');
      }
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await customerService.uploadBulkCustomers(uploadFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setBulkUploadModal(false);
        setUploadFile(null);
        setUploadProgress(0);
        fetchCustomers();
        alert('Bulk upload completed successfully!');
      }, 500);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.nicNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.mobileNumbers && customer.mobileNumbers.some(mobile => 
        mobile.includes(searchTerm)
      ))
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Connection Error</h3>
        <p>{error}</p>
        <button onClick={fetchCustomers} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      {/* Header */}
      <div className="list-header">
        <div className="header-left">
          <h2>Customer Management</h2>
          <p className="customer-count">
            Total: {filteredCustomers.length} customers
          </p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setBulkUploadModal(true)}
            className="btn btn-outline"
          >
             Bulk Upload
          </button>
          <button 
            onClick={onAddCustomer}
            className="btn btn-primary"
          >
            + Add Customer
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="controls-panel">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, NIC, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="nicNumber">Sort by NIC</option>
            <option value="dateOfBirth">Sort by Date of Birth</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="customers-grid">
        {currentCustomers.length === 0 ? (
          <div className="no-customers">
            <div className="no-customers-icon">👥</div>
            <h3>No customers found</h3>
            <p>
              {searchTerm ? 
                'Try adjusting your search terms' : 
                'Click "Add Customer" to get started'
              }
            </p>
          </div>
        ) : (
          currentCustomers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="card-header">
                <h3 className="customer-name">{customer.name}</h3>
                <div className="card-actions">
                  <button 
                    onClick={() => onEditCustomer(customer)}
                    className="btn btn-sm btn-edit"
                    title="Edit Customer"
                  >
                    Edit                  </button>
                  <button 
                    onClick={() => handleDelete(customer.id)}
                    className="btn btn-sm btn-delete"
                    title="Delete Customer"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="card-content">
                <div className="customer-detail">
                  <span className="detail-label">NIC:</span>
                  <span className="detail-value">{customer.nicNumber}</span>
                </div>
                
                <div className="customer-detail">
                  <span className="detail-label">Date of Birth:</span>
                  <span className="detail-value">{customer.dateOfBirth}</span>
                </div>
                
                {customer.mobileNumbers && customer.mobileNumbers.length > 0 && (
                  <div className="customer-detail">
                    <span className="detail-label">Mobile:</span>
                    <div className="mobile-numbers">
                      {customer.mobileNumbers.map((mobile, index) => (
                        <span key={index} className="mobile-number">
                          {mobile}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {customer.addresses && customer.addresses.length > 0 && (
                  <div className="customer-detail">
                    <span className="detail-label">Addresses:</span>
                    <div className="addresses">
                      {customer.addresses.map((address, index) => (
                        <div key={index} className="address">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                          {address.city && `, ${address.city.name}`}
                          {address.country && `, ${address.country.name}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {customer.familyMembers && customer.familyMembers.length > 0 && (
                  <div className="customer-detail">
                    <span className="detail-label">Family Members:</span>
                    <div className="family-members">
                      {customer.familyMembers.map(member => (
                        <span key={member.id} className="family-member">
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {bulkUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Bulk Customer Upload</h3>
              <button 
                onClick={() => setBulkUploadModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="upload-info">
                <p>Upload an Excel file with customer data:</p>
                <ul>
                  <li>Required columns: Name, NIC Number, Date of Birth</li>
                  <li>Optional columns: Mobile Numbers, Addresses</li>
                  <li>Maximum file size: 10MB</li>
                  <li>Supported formats: .xlsx, .xls</li>
                </ul>
              </div>
              
              <div className="file-upload">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="file-input"
                  id="bulk-upload-file"
                />
                <label htmlFor="bulk-upload-file" className="file-label">
                  {uploadFile ? uploadFile.name : 'Choose Excel file...'}
                </label>
              </div>
              
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p>Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setBulkUploadModal(false)}
                className="btn btn-secondary"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkUpload}
                className="btn btn-primary"
                disabled={!uploadFile || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;