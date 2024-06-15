import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../features/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import DataTable from 'react-data-table-component';

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
        const orderId = item.id.toString().toLowerCase();
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
      name: 'Order ID',
      selector: (row) => <b>{row.id}</b>,
      sortable: true,
    },
    {
      name: 'Customer',
      selector: (row) => row.address.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.customer.email,
      sortable: true,
    },
    {
      name: 'Items',
      selector: (row) => row.items.length,
      sortable: true,
    },
    {
      name: 'Total',
      selector: (row) => "AED " + row.total,
      sortable: true,
    },
    {
      name: 'Payment Status',
      selector: (row) => row.paymentStatus,
      sortable: true,
    },
    {
      name: 'Order Status',
      selector: (row) => row.orderStatus,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button className="btn btn-primary" onClick={() => navigate(`/orders/${row.id}`)}>
          View
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <h2 className="heading">Orders</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div style={{ color: "gray", fontWeight: "bold" }}>
            <p className="">{items?.length} Orders</p>
          </div>
          <div
            style={{ display: "flex", flexDirection: "row", gap: "10px" }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search: Order Id, Name, Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
