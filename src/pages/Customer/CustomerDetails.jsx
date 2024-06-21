import React, { useEffect, useState } from 'react';
import Layout from '../../components/layouts/Layout';
import DataTable from "react-data-table-component";
import { FaArrowLeft } from "react-icons/fa";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAllCustomersById } from '../../features/customer/customerSlice';
import CustomerOrders from './CustomerOrders';
import { formatDateUAE } from '../../utils/formatDate';



const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const fetchCustomer = async () => {
    try {
      const customerData = await dispatch(fetchAllCustomersById({ id })).unwrap();
      console.log(customerData);
      setCustomer(customerData);
    } catch (error) {
      setError('Error fetching customer details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [dispatch, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!customer) {
    return <div>No customer data</div>;
  }

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      cell: (row) => <div style={{ fontWeight: "semi-bold" }}>{row.name}</div>,
      sortable: true,
      width: "",
    },
    {
      name: "Address",
      selector: (row) => row.address,
      cell: (row) => <div style={{ fontWeight: "" }}>{row.address_line}</div>,
      sortable: true,
      width: "",
    },
    {
      name: "City, State",
      selector: (row) => row.state_country,
      cell: (row) => <div style={{ fontWeight: "" }}>{`${row.city} , ${row.state}`}</div>,
      sortable: true,
      width: "",
    },
    {
      name: "Type",
      selector: (row) => row.type,
      cell: (row) => <div style={{ fontWeight: "" }}>{row.address_type}</div>,
      sortable: true,
      width: "",
    },
    {
      name: "Default",
      selector: (row) => row.default,
      cell: (row) => <div style={{ fontWeight: "" }}>{`${row.default}`}</div>,
      sortable: true,
      width: "",
    },
  ];

  return (
    <Layout>
      <div>
        <div style={{ marginBottom: '30px', display: "flex", alignItems: "start", gap: "20px", color: '#D93D6E' }}>
        <FaArrowLeft size={20} cursor="pointer" style={{ marginTop: "6px" }} onClick={() => navigate(-1)} />
          <div>
            <h2 className="heading m-0 p-0">{customer.first_name} {customer.last_name}</h2>
            <p style={{ color: '#333' }}>Registered on: {formatDateUAE(customer.createdAt)}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body row">
            <div className='col-4'>
              <h5 className="card-title">Email Address</h5>
              <p className="card-text">{customer.email}</p>
            </div>
            <div className='col-3'>
              <h5 className="card-title">Mobile</h5>
              <p className="card-text">{customer.mobile}</p>
            </div>
            <div className='col-3'>
              <h5 className="card-title">Date of birth</h5>
              <p className="card-text">{customer.dob}</p>
            </div>
            <div className='col'>
              <h5 className="card-title">Gender</h5>
              <p className="card-text">{customer.gender}</p>
            </div>
          </div>
        </div>

        { customer.addresses && customer.addresses.length >0 && (
        <div className="card">
          <div className="card-body">
            <h6 className='fs-5 fw-bold mb-3 text-black'>Addresses</h6>
            <div className="table-responsive">
              <DataTable
                columns={columns}
                data={customer.addresses || []}
                pagination
                highlightOnHover
              />
            </div>
          </div>
        </div>
 )}
   
    
        <div className="d-flex justify-content-between">

        { customer.wishlist && customer.wishlist.length >0 && (
          <div className="card" style={{ width: "48%" }}>
            <div className="card-body">
              <h6 className="fw-bold">Wishlist</h6>
              {customer.wishlist && customer.wishlist.map((wishlistItem, index) => (
                <ol key={index} className="list-group ms-3 gap-1">
                  <li className="">{wishlistItem.name}</li>
                </ol>
              ))}
            </div>
          </div>
         
        )}
        
        { customer.favoriteBrands && customer.favoriteBrands.length >0 && (
          <div className="card" style={{ width: "48%" }}>
            <div className="card-body">
              <h6 className="fw-bold">Brands Following</h6>
              {customer.favoriteBrands && customer.favoriteBrands.map((brand, index) => (
                <ol key={index} className="list-group ms-3 gap-1">
                  <li className="">{brand.name}</li>
                </ol>
              ))}
            </div>
          </div>
           )}
        </div>
     

        <div className='card'>
          <div className='card-body'>
            <h3>Orders</h3>
            <CustomerOrders orders={customer.orders || []} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditCustomer;
