import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Layout from "../../components/layouts/Layout";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  fetchAllCategories,
  deleteCategory,
} from "../../features/category/categorySlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { toast } from "react-toastify";
import { FaCat } from "react-icons/fa";




const Category = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const allCategories = useSelector(getAllCategories);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log(allCategories)
  const fetchCategory = async () => {
    const res = await dispatch(fetchAllCategories()).unwrap();
     console.log(res)
    setCategories(res);
    setFilteredCategories(res);
  };

  useEffect(() => {
    fetchCategory();
  }, [dispatch]);

  useEffect(() => {
    const result = categories.filter((cat) => {
      return cat.name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredCategories(result);
  }, [search]);

  const capitalizeString = (str) => {
    // console.log(str);
    return str.toUpperCase();
  };
  const handleDelete = (id) => {
      
    dispatch(deleteCategory({id}))
    .unwrap()
    .then(() => {
    
      fetchCategory();
      
      navigate("/category");
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
  console.log(categories)
 
  const columns = [
   
     
      {
        name: "Icon",
        cell: (row) => <img src={`${process.env.REACT_APP_API_URL}/api/uploads/${row.icon}`} alt="Icon" height="50px" />,
      },
   
  
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
   
    {
      name: "Parent category",
      selector: (row) => row.parent_category,
      sortable: true,
    },
  
    {
      name: "Action",
      cell: (row) => (
        <div>
          {/* <Link
            to={`/showcategory/${row.id}`}
            className="btn btn-sm btn-primary"
          >
            <span>
            <FontAwesomeIcon icon={faCircleInfo} />
             
            </span>
          </Link> */}
          <Link
            to={`/editcategory/${row.id}`}
            className=" "
          >
            <span style={{ color: ' #D93D6E ' }}>
              {/* <i className="ti ti-pencil" /> */}
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
    
    navigate(`/editcategory/${row.id}`);
  };
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">

      <div style={{ marginBottom: '30px' }}>
   
      <h2 className="heading">Category</h2>
    </div>
        <div className="card">
          <div className="card-body">
          <div style={{display:"flex",justifyContent:"end" ,gap:"20px"}} >

        
          <Link
            to={`/addcategory`}
            className="btn "
            style={{ backgroundColor: '#D93D6E',color:"white" }}
          >
            Add Category
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
                data={filteredCategories}
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

export default Category;
