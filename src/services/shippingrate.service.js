import axiosInstance from "../utils/axiosInstance";

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/`;

const getShippingRates = async () => {
    const response = await axiosInstance.get(API_URL + "shippingrate");
    return response.data;
};

const getShippingRateById = async (id) => {
    const response = await axiosInstance.get(`${API_URL}shippingrate/${id}`);
    return response.data;
};

const saveShippingRate = async (data) => {
    try {
        const response = await axiosInstance.post(API_URL + "shippingrate", data);
        return response.data;
    } catch (err) {
        console.error('Error saving shipping rate:', err.response?.data?.message || err.message);
        throw err.response?.data || err;
    }
};

const deleteShippingRateById = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}shippingrate/${id}`);
        return response.data;
    } catch (err) {
        console.error('Error deleting shipping rate:', err);
        throw err;
    }
};

const updateShippingRateById = async (id, data) => {
    try {
      const response = await axiosInstance.patch(`${API_URL}shippingrate/${id}`, data);
      return response.data;
    } catch (err) {
      console.error('Error updating shipping rate:', err.response?.data?.message || err.message);
      throw err.response?.data || err;
    }
  };

const ShippingRateService = {
    getShippingRates,
    getShippingRateById,
    saveShippingRate,
    deleteShippingRateById,
    updateShippingRateById
};

export default ShippingRateService;
