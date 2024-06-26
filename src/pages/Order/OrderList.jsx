import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../features/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';
import { formatDateUAE } from '../../utils/formatDate';
import { orderStatusFormat, paymentStatusFormat } from '../../utils/statusFormat';

const mediaFolder = process.env.REACT_APP_MEDIA_URL;

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) => {
        const orderId = item.order_no.toString().toLowerCase();
        const customerName = item.address.name.toLowerCase();
        const email = item.customer.email.toLowerCase();
        const orderStatus = item.orderStatus.toLowerCase();
        const paymentStatus = item.paymentStatus.toLowerCase();
        const query = searchQuery.toLowerCase();

        return (
          orderId.includes(query) ||
          customerName.includes(query) ||
          email.includes(query) ||
          orderStatus.includes(query) ||
          paymentStatus.includes(query)
        );
      })
    );
  }, [items, searchQuery]);

  const columns = [
    {
      name: 'Order #',
      selector: (row) => <b>{row.order_no}</b>,
      sortable: true,
      grow:1.75
    },
    {
      name: 'Customer',
      selector: (row) => row.address.name,
      sortable: true,
      grow:1.5
    },
    {
      name: 'Email',
      selector: (row) => row.customer.email,
      sortable: true,
      grow:1.5
    },
    {
      name: 'Items',
      selector: (row) => row.items.length,
      sortable: true,
      grow:0.5
    },
    {
      name: 'Total',
      selector: (row) => "AED " + row.total,
      sortable: true,
      grow:0.5
    },
    {
      name: 'Payment Status',
      selector: (row) => paymentStatusFormat(row.paymentStatus),
      sortable: true,
      grow:1
    },
    {
      name: 'Order Status',
      selector: (row) => orderStatusFormat(row.orderStatus),
      sortable: true,
      grow:1
    },
    {
      name: 'Ordered On',
      selector: (row) => formatDateUAE(row.createdAt),
      sortable: true,
      grow:1.5,
    },
    {
      name: 'Actions',
      
      cell: (row) => (
        <button className="btn btn-link text-primary" onClick={() => navigate(`/orders/${row.id}`)}>
          View
        </button>
      ),
    },
  ];

  const exportData = items.flatMap(order => {
    const formattedDate = formatDateUAE(order.createdAt);
    return order.items.map((item, index) => ({
      OrderNo: index === 0 ? order.order_no : '',
      OrderDate: index === 0 ? formattedDate : '',
      CustomerName: index === 0 ? order.customer.name : '',
      CustomerEmail: index === 0 ? (order.customer.email || '') : '',
      CustomerMobile: index === 0 ? (order.customer.mobile || '') : '',
      Address: index === 0 ? `${order.address.name}, ${order.address.address_line}, ${order.address.landmark}` : '',
      City: index === 0 ? `${order.address.city}` : '',
      State: index === 0 ? `${order.address.state}` : '',
      PostalCode: index === 0 ? `${order.address.postal_code}` : '',
      DiscountCode: index === 0 ? (order.discount.code || '') : '',
      DiscountAmount: index === 0 ? (order.discount.amount || 0) : '',
      ShippingCost: index === 0 ? order.shipping : '',
      OrderSubtotal: index === 0 ? order.subtotal : '',
      OrderTotal: index === 0 ? order.total : '',
      OrderStatus: index === 0 ? order.orderStatus : '',
      ItemName: item.name,
      ItemSKU: item.sku,
      VariantName: item.variant ? item.variant.name : '',
      VariantSKU: item.variant ? item.variant.sku : '',
      ItemQuantity: item.quantity,
      ItemPrice: item.price,
     // ItemDiscountedPrice: item.discounted_price || item.price,
      ItemTotal: item.total,
      
     // VariantPrice: item.variant ? item.variant.price : '',
      //VariantDiscountedPrice: item.variant ? item.variant.discounted_price : ''
    }));
  });

  const headers = [
    { label: "Order No", key: "OrderNo" },
    { label: "Order Date", key: "OrderDate" },
    { label: "Customer Name", key: "CustomerName" },
    { label: "Customer Email", key: "CustomerEmail" },
    { label: "Customer Mobile", key: "CustomerMobile" },
    { label: "Address", key: "Address" },
    { label: "City", key: "City" },
    { label: "State", key: "State" },
    { label: "Postal Code", key: "PostalCode" },
    { label: "Discount Code", key: "DiscountCode" },
    { label: "Discount Amount", key: "DiscountAmount" },
    { label: "Shipping Cost", key: "ShippingCost" },
    { label: "Subtotal", key: "OrderSubtotal" },
    { label: "Total", key: "OrderTotal" },
    { label: "Order Status", key: "OrderStatus" },
    { label: "Item Name", key: "ItemName" },
    { label: "Item SKU", key: "ItemSKU" },
    { label: "Variant Name", key: "VariantName" },
    { label: "Variant SKU", key: "VariantSKU" },
    { label: "Item Quantity", key: "ItemQuantity" },
    { label: "Item Price", key: "ItemPrice" },
    //{ label: "Item Discounted Price", key: "ItemDiscountedPrice" },
    { label: "Item Total", key: "ItemTotal" },
   
    //{ label: "Variant Price", key: "VariantPrice" },
    //{ label: "Variant Discounted Price", key: "VariantDiscountedPrice" },
  ];

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "Orders" + moment() + ".xlsx");
  };


  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <h2 className="heading">Orders</h2>
        <div className='row'>
          <div className='col' style={{ color: "gray", fontWeight: "bold" }}>
            <p className="">{items?.length} Orders</p>
          </div>
          <div className='col'>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "20" }}>

              <div>
                <button onClick={handleDownload} className="btn btn-dark me-2">
                  Download Excel
                </button>
              </div>
              <div>
                <input
                  type="text" style={{ maxWidth: "350px" }}
                  className="form-control"
                  placeholder="Search: Order Id, Name, Email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          <DataTable
            columns={columns}
            data={filteredItems}
            progressPending={loading}
            fixedHeader
            pagination
            highlightOnHover
            subHeader

          />
        </div>
      </div>
    </Layout>
  );
};

export default OrderList;
