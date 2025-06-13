import React, { useState, useEffect } from 'react';
import customerService from '../services/customerService';
import './CustomerForm.css';

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    nicNumber: '',
    dateOfBirth: '',
    mobileNumbers: [''],
    addresses: [{
      addressLine1: '',
      addressLine2: '',
      cityId: '',
      countryId: ''
    }],
    familyMemberIds: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState([]);

  useEffect(() => {
    fetchMasterData();
    fetchAllCustomers();
    
    if (customer) {
      setFormData({
        name: customer.name || '',
        nicNumber: customer.nicNumber || '',
        dateOfBirth: customer.dateOfBirth || '',
        mobileNumbers: customer.mobileNumbers?.length > 0 ? customer.mobileNumbers : [''],
        addresses: customer.addresses?.length > 0 ? customer.addresses : [{
          addressLine1: '',
          addressLine2: '',
          cityId: '',
          countryId: ''
        }],
        familyMemberIds: customer.familyMemberIds || []
      });
      setSelectedFamilyMembers(customer.familyMembers || []);
    }
  }, [customer]);

  const fetchMasterData = async () => {
    try {
      const [citiesData, countriesData] = await Promise.all([
        customerService.getCities(),
        customerService.getCountries()
      ]);
      setCities(citiesData);
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching master data:', error);
    }
  };

  const fetchAllCustomers = async () => {
    try {
      const customers = await customerService.getAllCustomers();
      setAllCustomers(customers.filter(c => c.id !== customer?.id));
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Mobile number handlers
  const addMobileNumber = () => {
    setFormData(prev => ({
      ...prev,
      mobileNumbers: [...prev.mobileNumbers, '']
    }));
  };

  const removeMobileNumber = (index) => {
    setFormData(prev => ({
      ...prev,
      mobileNumbers: prev.mobileNumbers.filter((_, i) => i !== index)
    }));
  };

  const updateMobileNumber = (index, value) => {
    setFormData(prev => ({
      ...prev,
      mobileNumbers: prev.mobileNumbers.map((mobile, i) => i === index ? value : mobile)
    }));
  };

  // Address handlers
  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, {
        addressLine1: '',
        addressLine2: '',
        cityId: '',
        countryId: ''
      }]
    }));
  };

  const removeAddress = (index) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const updateAddress = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => 
        i === index ? { ...addr, [field]: value } : addr
      )
    }));
  };

  // Family member handlers
  const addFamilyMember = (customerId) => {
    const member = allCustomers.find(c => c.id === parseInt(customerId));
    if (member && !selectedFamilyMembers.find(f => f.id === member.id)) {
      setSelectedFamilyMembers(prev => [...prev, member]);
      setFormData(prev => ({
        ...prev,
        familyMemberIds: [...prev.familyMemberIds, member.id]
      }));
    }
  };

  const removeFamilyMember = (memberId) => {
    setSelectedFamilyMembers(prev => prev.filter(m => m.id !== memberId));
    setFormData(prev => ({
      ...prev,
      familyMemberIds: prev.familyMemberIds.filter(id => id !== memberId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.nicNumber.trim()) {
      newErrors.nicNumber = 'NIC Number is required';
    }
    
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Filter out empty mobile numbers
      const cleanedData = {
        ...formData,
        mobileNumbers: formData.mobileNumbers.filter(mobile => mobile.trim() !== ''),
        addresses: formData.addresses.filter(addr => 
          addr.addressLine1.trim() !== '' || addr.cityId !== '' || addr.countryId !== ''
        )
      };

      if (customer && customer.id) {
        await customerService.updateCustomer(customer.id, cleanedData);
        alert('Customer updated successfully!');
      } else {
        await customerService.createCustomer(cleanedData);
        alert('Customer created successfully!');
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isEditing = customer && customer.id;

  return (
    <div className="customer-form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button 
            type="submit" 
            form="customerForm"
            disabled={loading} 
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Customer' : 'Create Customer')}
          </button>
        </div>
      </div>
      
      <form id="customerForm" onSubmit={handleSubmit} className="customer-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter customer name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                NIC Number <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nicNumber"
                value={formData.nicNumber}
                onChange={handleChange}
                className={`form-input ${errors.nicNumber ? 'error' : ''}`}
                placeholder="Enter NIC number"
              />
              {errors.nicNumber && <span className="error-message">{errors.nicNumber}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>
          </div>
        </div>

        {/* Mobile Numbers */}
        <div className="form-section">
          <div className="section-header">
            <h3>Mobile Numbers</h3>
            <button type="button" onClick={addMobileNumber} className="btn btn-outline">
              + Add Mobile
            </button>
          </div>
          <div className="dynamic-list">
            {formData.mobileNumbers.map((mobile, index) => (
              <div key={index} className="dynamic-item">
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => updateMobileNumber(index, e.target.value)}
                  className="form-input"
                  placeholder="Enter mobile number"
                />
                {formData.mobileNumbers.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeMobileNumber(index)}
                    className="btn btn-danger-outline btn-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Addresses */}
        <div className="form-section">
          <div className="section-header">
            <h3>Addresses</h3>
            <button type="button" onClick={addAddress} className="btn btn-outline">
              + Add Address
            </button>
          </div>
          <div className="address-list">
            {formData.addresses.map((address, index) => (
              <div key={index} className="address-item">
                <div className="address-header">
                  <h4>Address {index + 1}</h4>
                  {formData.addresses.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeAddress(index)}
                      className="btn btn-danger-outline btn-sm"
                    >
                      Remove Address
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Address Line 1</label>
                    <input
                      type="text"
                      value={address.addressLine1}
                      onChange={(e) => updateAddress(index, 'addressLine1', e.target.value)}
                      className="form-input"
                      placeholder="Enter address line 1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address Line 2</label>
                    <input
                      type="text"
                      value={address.addressLine2}
                      onChange={(e) => updateAddress(index, 'addressLine2', e.target.value)}
                      className="form-input"
                      placeholder="Enter address line 2"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <select
                      value={address.cityId}
                      onChange={(e) => updateAddress(index, 'cityId', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select
                      value={address.countryId}
                      onChange={(e) => updateAddress(index, 'countryId', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Family Members */}
        <div className="form-section">
          <div className="section-header">
            <h3>Family Members</h3>
            <select 
              onChange={(e) => {
                if (e.target.value) {
                  addFamilyMember(e.target.value);
                  e.target.value = '';
                }
              }}
              className="form-select"
            >
              <option value="">Select Family Member</option>
              {allCustomers
                .filter(c => !selectedFamilyMembers.find(f => f.id === c.id))
                .map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.nicNumber})
                  </option>
                ))
              }
            </select>
          </div>
          <div className="family-members-list">
            {selectedFamilyMembers.map(member => (
              <div key={member.id} className="family-member-item">
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-nic">NIC: {member.nicNumber}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeFamilyMember(member.id)}
                  className="btn btn-danger-outline btn-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            {selectedFamilyMembers.length === 0 && (
              <p className="no-family-members">No family members added</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;