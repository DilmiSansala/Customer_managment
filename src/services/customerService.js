import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const customerService = {
  // Customer CRUD operations
  getAllCustomers: async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  createCustomer: async (customer) => {
    try {
      const response = await axios.post(`${API_URL}/customers`, customer);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, customer) => {
    try {
      const response = await axios.put(`${API_URL}/customers/${id}`, customer);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Bulk operations
  uploadBulkCustomers: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/customers/bulk-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading bulk customers:', error);
      throw error;
    }
  },

  // Family relationships
  getFamilyMembers: async (customerId) => {
    try {
      const response = await axios.get(`${API_URL}/customers/${customerId}/family`);
      return response.data;
    } catch (error) {
      console.error('Error fetching family members:', error);
      throw error;
    }
  },

  addFamilyMember: async (customerId, familyMemberId) => {
    try {
      const response = await axios.post(`${API_URL}/customers/${customerId}/family/${familyMemberId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding family member:', error);
      throw error;
    }
  },

  removeFamilyMember: async (customerId, familyMemberId) => {
    try {
      const response = await axios.delete(`${API_URL}/customers/${customerId}/family/${familyMemberId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing family member:', error);
      throw error;
    }
  },

  // Master data
  getCities: async () => {
    try {
      const response = await axios.get(`${API_URL}/cities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  },

  getCountries: async () => {
    try {
      const response = await axios.get(`${API_URL}/countries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }
};

export default customerService;