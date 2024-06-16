import axios from "../utils/axiosInstance";

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/inventory/`;

// Fetch all products
const fetchProducts = async () => {
    const response = await axios.get(`${API_URL}products`);
    return response.data;
  };
  
  // Update stock for a product or variant
  const updateProductStock = async (data) => {
    const response = await axios.post(`${API_URL}update-stock`, data);
    return response.data;
  };
  
  // Bulk update stock from CSV
  const bulkUpdateProductStock = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}bulk-update-stock`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };
  
  const inventoryService = {
    fetchProducts,
    updateProductStock,
    bulkUpdateProductStock,
  };

export default inventoryService;
