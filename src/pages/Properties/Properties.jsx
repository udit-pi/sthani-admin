import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Layout from "../../components/layouts/Layout";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBrand,
    fetchAllBrands,
  getAllBrands,
 
} from "../../features/brand/brandSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { toast } from "react-toastify";
import { deleteProperty, fetchAllProperties } from "../../features/properties/propertySlice";


const Properties = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const allBrands = useSelector(getAllBrands);
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log(allCategories)
  const fetchProperty = async () => {
    const res = await dispatch(fetchAllProperties()).unwrap();
    //  console.log(res)
    setProperties(res);
    setFilteredProperties(res);
  };

  useEffect(() => {
    fetchProperty();
  }, [dispatch]);

  useEffect(() => {
    const result = properties.filter((cat) => {
      return cat.name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredProperties(result);
  }, [search]);

  const capitalizeString = (str) => {
    // console.log(str);
    return str.toUpperCase();
  };
  const  handleDelete = (id) => {
      
    dispatch(deleteProperty({id}))
    .unwrap()
    .then(() => {
    
      fetchProperty()
       navigate("/properties");
      // window.location.reload();
      toast.success('Property deleted successfully!')
      // setSuccessful(true);
   
    })
    .catch((err) => {
      
      toast.success(err)
      // setSuccessful(false);
      
    });
}

  // filteredCategories.forEach((cat, index) => {
  //   cat.serial = index + 1;
  // });

  const columns = [
    // {
    //   name: "Id",
    //   selector: (row) => row.id,
    //   sortable: true,
    // },
    {
      name: "Name",
      selector: (row) => <b>{row.name}</b>,
      sortable: true,
      grow:2,
    },
    {
      name: "Options",
      selector: (row) => row.options.join(', '),
      sortable: true,
      grow:2,
    },
    // {
    //   name: "Description",
    //   selector: (row) => row.description,
    //   sortable: true,
    // },
    {
      name: "Unit",
      selector: (row) => row.unit,
      sortable: true,
      grow:1,
    },
    // {
    //     name: 'Meta Description',
    //     selector: row => row.meta_description,
    //     sortable: true,
    // },
    {
      name: "Action",
      right:true,
      cell: (row) => (
        <div>
            <Link
            to={`/editproperty/${row.id}`}
            
          >
            <span style={{ color: ' #D93D6E ' }}>
             Edit
              
               </span>
          </Link>
        
            <span  onClick={() => handleDelete(row.id)}  style={{marginLeft:"20px",cursor:"pointer",color: ' #D93D6E ' }}>
           Delete
              
            </span>
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
    <div style={{ marginBottom: '30px' }}>
    <h2 className="heading">Properties</h2>
  </div>
      <div className="card">
        <div className="card-body">
        <div>
          <p className="">{properties?.length} properties</p>
        </div>
        <div style={{display:"flex",justifyContent:"end" ,gap:"20px"}}>
      
        <Link
          to={`/addproperty`}
          className="btn ms-1"
          style={{ backgroundColor: '#D93D6E',color:"white" }}
        >
          Add Property
        </Link>
        <input
                  type="text"
                  className="w-25 form-control"
                  placeholder="Search Product"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
        </div>
          <div className="table-responsive">
            <DataTable
              // title="Category"
              columns={columns}
              data={filteredProperties}
              fixedHeader
              pagination
              highlightOnHover
              subHeader
              // onRowClicked={handleRowClick}
              // subHeaderComponent={
              //   <input
              //     type="text"
              //     className="w-25 form-control"
              //     placeholder="Search Category"
              //     value={search}
              //     onChange={(e) => setSearch(e.target.value)}
              //   />
              // }
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
  );
};

export default Properties;
