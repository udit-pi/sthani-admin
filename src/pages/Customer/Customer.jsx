import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Layout from "../../components/layouts/Layout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../features/customer/customerSlice";

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
      grow: 3,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
      grow: 2,
    },
    {
      name: "Registered On",
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
      grow: 2,
    },
    {
      name: "Action",
      right: true,
      grow: 1,
      cell: (row) => (
        <div>
          <Link to={`/editCustomer/${row.id}`}>
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
              <input
                type="text"
                className="w-25 form-control"
                placeholder="Search Customers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default Customer;
