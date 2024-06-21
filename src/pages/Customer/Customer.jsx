import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Layout from "../../components/layouts/Layout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../features/customer/customerSlice";
import * as XLSX from 'xlsx';
import { formatDateUAE } from '../../utils/formatDate';
const mediaFolder = process.env.REACT_APP_MEDIA_URL ;

const Customer = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    const res = await dispatch(fetchAllCustomers()).unwrap();
    setCustomers(res);
    setFilteredCustomers(res);
  };

  useEffect(() => {
    fetchCustomers();
  }, [dispatch]);

  useEffect(() => {
    const result = customers.filter((customer) => {
      const searchTerm = search.toLowerCase();
      return (
        (customer.first_name && customer.first_name.toLowerCase().includes(searchTerm)) ||
        (customer.last_name && customer.last_name.toLowerCase().includes(searchTerm)) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm)) ||
        (customer.mobile && customer.mobile.toString().includes(searchTerm))
      );
    });
    setFilteredCustomers(result);
  }, [search, customers]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const exportToExcel = () => {
    const data = customers.map(customer => ({
      'First Name': customer.first_name,
      'Last Name': customer.last_name,
      'Mobile': customer.mobile,
      'Email': customer.email,
      'Date of Birth': customer.dob,
      'Gender': customer.gender,
      'Wishlist': customer.wishlist.map(product => product.name).join(', '),
      'Favorite Brands': customer.favoriteBrands.map(brand => brand.name).join(', '),
      'Addresses': customer.addresses.map(address => `${address.name}, ${address.mobile}, ${address.address_line}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.landmark}, ${address.address_type}`).join(' | '),
      'Profile Picture': `${mediaFolder}${customer.profilePicture}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

    XLSX.writeFile(workbook, 'customers.xlsx');
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.first_name,
      cell: (row) => (
        <div style={{ fontWeight: "bold" }}>
          {row.first_name} {row.last_name}
        </div>
      ),
      sortable: true,
      grow: 1.5,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      grow: 1.5,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
      grow: 1,
    },
    {
      name: "Total Orders",
      selector: (row) => row.totalOrders,
      sortable: true,
      grow: 1,
    },
    {
      name: "Total Sales",
      selector: (row) => "AED " + row.totalSales,
      sortable: true,
      grow: 1,
    },
    {
      name: "Registered On",
      selector: (row) => formatDateUAE(row.createdAt),
      sortable: true,
      grow: 1.5,
    },
    {
      name: "Action",
      right: true,
      grow: 1,
      cell: (row) => (
        <div>
          <Link to={`/customer/${row._id}`}>
            <span style={{ color: '#D93D6E' }}>View Details</span>
          </Link>
        </div>
      ),
    },
  ];

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <h2 className="heading ms-3">Customers</h2>
      <div className="col-12 stretch-card container-fluid">
        <div className="table-responsive">
          <DataTable
            columns={columns}
            data={filteredCustomers}
            fixedHeader
            pagination
            highlightOnHover
            subHeader
            subHeaderComponent={
              <>
              <button onClick={exportToExcel} className="me-3 btn btn-dark">Export to Excel</button>
              <input
                type="text"
                className="w-25 form-control"
                placeholder="Search Customers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              
              </>
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default Customer;
