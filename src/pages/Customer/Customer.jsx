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

  // console.log(allCategories)
  const fetchCustomers = async () => {
    const res = await dispatch(fetchAllCustomers()).unwrap();
      console.log(res)
    setCustomers(res);
    setFilteredCustomers(res);
  };

  useEffect(() => {
    fetchCustomers();
  }, [dispatch]);

  useEffect(() => {
    const result = customers.filter((cat) => {
      return cat.first_name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredCustomers(result);
  }, [search]);

  const capitalizeString = (str) => {
    // console.log(str);
    return str.toUpperCase();
  };
  const handleDelete = (id) => {
      
    // dispatch(deleteCategory({id}))
    // .unwrap()
    // .then(() => {
    
    //   fetchCategory();
      
    //   navigate("/category");
    //   // window.location.reload();
    //   toast.success('Category deleted successfully!')
    //   // setSuccessful(true);
   
    // })
    // .catch((err) => {
      
    //   toast.success(err)
    //   // setSuccessful(false);
      
    // });
}

  // filteredCategories.forEach((cat, index) => {
  //   cat.serial = index + 1;
  // });

  const columns = [
    // {
    //   grow:2,
    //   name: "Id",
    //   selector: (row) => row.id,
    //   sortable: true,
      
    // },
    {
      name: "Name",
      selector: (row) => row.first_name ,
      cell: (row) => <div style={{ fontWeight: "bold" }}>{row.first_name} {row.last_name}</div>,
      sortable: true,
      grow:3,
    },
   
    {
      name: "Date of Birth",
      selector: (row) => row.dob,
      sortable: true,
      grow:2,
    },
    {
        name: "Gender",
        selector: (row) => row.gender,
        sortable: true,
        grow:2,
      },
    // {
    //     name: 'Meta Description',
    //     selector: row => row.meta_description,
    //     sortable: true,
    // },
    {
      name: "Action",
      right:true,
      grow:1,
      cell: (row) => (
        <div>
          {/* <Link
            to={`/showproduct/${row.id}`}
            className="btn btn-sm btn-primary"
          >
            <span>
            <FontAwesomeIcon icon={faCircleInfo} />
             
            </span>
          </Link> */}
          <Link
            to={`/editCustomer/${row.id}`}
            // className="btn btn-sm btn-warning ms-1"
          >
           <span style={{ color: ' #D93D6E ' }}>
             Edit
              
               </span>
          </Link>
          {/* <button
            className="btn btn-sm btn-danger ms-1"
            onClick={() => handleDelete(row.id)}
          >
            <span>
            <FontAwesomeIcon icon={faTrash} />
              
            </span>
          </button>    */}
        </div>
      ),
    },
    // {
    //     name: 'Created',
    //     selector: row => row.createdAt,
    //     sortable: true,
    // },
  ];

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div className="card">
          <div className="card-body">
         
            <div className="table-responsive">
              <DataTable
                // title="Category"
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
                    placeholder="Search Category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Customer;
