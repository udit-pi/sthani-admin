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


const Brand = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const allBrands = useSelector(getAllBrands);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log(allCategories)
  const fetchBrand = async () => {
    const res = await dispatch(fetchAllBrands()).unwrap();
    //  console.log(res)
    setBrands(res);
    setFilteredBrands(res);
  };

  useEffect(() => {
    fetchBrand();
  }, [dispatch]);

  useEffect(() => {
    const result = brands.filter((cat) => {
      return cat.name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredBrands(result);
  }, [search]);

  const capitalizeString = (str) => {
    // console.log(str);
    return str.toUpperCase();
  };
  const  handleDelete = (id) => {
      
    dispatch(deleteBrand({id}))
    .unwrap()
    .then(() => {
    
      fetchBrand()
       navigate("/brand");
      // window.location.reload();
      toast.success('Category deleted successfully!')
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
      selector: (row) => row.name,
      sortable: true,
    },
    // {
    //   name: "Slug",
    //   selector: (row) => row.slug,
    //   sortable: true,
    // },
    // {
    //   name: "Description",
    //   selector: (row) => row.description,
    //   sortable: true,
    // },
    {
      name: "Website",
      selector: (row) => row.website,
      sortable: true,
    },
    // {
    //     name: 'Meta Description',
    //     selector: row => row.meta_description,
    //     sortable: true,
    // },
    {
      name: "Action",
      cell: (row) => (
        <div>
          {/* <Link
            to={`/showbrand/${row.id}`}
            className="btn btn-sm btn-primary"
          >
            <span>
            <FontAwesomeIcon icon={faCircleInfo} />
             
            </span>
          </Link> */}
          <Link
            to={`/editbrand/${row.id}`}
            
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
  const handleRowClick = (row) => {
    // Navigate to the edit page when a row is clicked
    navigate(`/editbrand/${row.id}`);
  };

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
      <div style={{ marginBottom: '30px' }}>
      <h2 className="heading">Brand</h2>
    </div>
        <div className="card">
          <div className="card-body">
          <div style={{display:"flex",justifyContent:"end" ,gap:"20px"}}>

          <Link
            to={`/addbrand`}
            className="btn ms-1"
            style={{ backgroundColor: '#D93D6E',color:"white" }}
          >
            Add Brand
          </Link>
          <input
                    type="text"
                    className="w-25 form-control"
                    placeholder="Search Category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
          </div>
            <div className="table-responsive">
              <DataTable
                // title="Category"
                columns={columns}
                data={filteredBrands}
                fixedHeader
                pagination
                highlightOnHover
                subHeader
                onRowClicked={handleRowClick}
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

export default Brand;
