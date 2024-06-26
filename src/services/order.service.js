import axiosInstance from "../utils/axiosInstance";

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/orders/`;

const getOrders = async () => {
  const res = await axiosInstance.get(API_URL);
  return res.data;
};

const getOrderById = async (id) => {
  const res = await axiosInstance.get(API_URL + id);
  return res.data;
};

const updateOrderStatus = async (id, status) => {
  const res = await axiosInstance.patch(API_URL + id +"/status", { status });
  return res.data;
};

// Add this function to delete an order
const deleteOrder = async (id) => {
  const res = await axiosInstance.delete(API_URL + id);
  return res.data;
};

const OrderService = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};

export default OrderService;
