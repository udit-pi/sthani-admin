import { useEffect, useState, useSyncExternalStore } from "react";
import DataTable from "react-data-table-component";
import Layout from "../../components/layouts/Layout";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  fetchAllCategories,
  deleteCategory,
} from "../../features/category/categorySlice";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
// import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { toast } from "react-toastify";

import { FaCircle } from "react-icons/fa";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Typography } from "@mui/material";

const mediaFolder = process.env.REACT_APP_MEDIA_URL ;


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,

  bgcolor: 'background.paper',
  border: '2px solid white',
  borderRadius:"10px",
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 5,
};



const Category = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const allCategories = useSelector(getAllCategories);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [open, setOpen] = useState(false);
const[deleteId,setdeleteId]=useState("")


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
   setOpen(false)
    })
    .catch((err) => {
      
      toast.success(err)
      // setSuccessful(false);
      
    });
}

  // filteredCategories.forEach((cat, index) => {
  //   cat.serial = index + 1;
  // });
  const parentCategoryName = (row, categories) => {
    const parentCategoryId = row.parent_category;
  
    // Find the category with the matching ID
    const parentCategory = categories.find(category => category.id === parentCategoryId);
  
    // If parent category is found, return its name, otherwise return a default value
    return parentCategory ? parentCategory.name : '-';
  };
 
  const columns = [
   
     
      {
        name: "Icon",
        cell: (row) => <>
        {row.icon ? ( 
          <img
            src={`${mediaFolder}/${row.icon}`}
            alt="Icon"
            height="50px"
           
          />
        ) : (
          <span>-</span> 
             
        )}
      </>,
      },
   
  
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
   
    {
      name: "Parent category",
      selector: (row) => parentCategoryName(row, categories),
     
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
     
          {/* <span  onClick={() => handleDelete(row.id)}  style={{marginLeft:"20px",cursor:"pointer",color: ' #D93D6E ' }}> */}
          <span  onClick={() => handleOpen(row.id)}  style={{marginLeft:"20px",cursor:"pointer",color: ' #D93D6E ' }}>

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



  const handleOpen = (id) => {
    setdeleteId(id)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
console.log(categories.length)
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">

      <div style={{ marginBottom: '30px' }}>
   
      <h2 className="heading">Category</h2>
    </div>
        <div className="card">
          <div className="card-body">

          <div style={{display:"flex",justifyContent:"space-between" ,gap:"20px"}} >
          <div style={{ color: 'gray', fontWeight: 'bold' }}>
  {categories.length} Category
</div>
        <div style={{display:"flex",flexDirection:"row" ,gap:"10px"}}>

      
          <Link
            to={`/addcategory`}
            className="btn "
            style={{ backgroundColor: '#D93D6E',color:"white", width:"200px" }}
          >
            Add Category
          </Link>

          <input
                    type="text"
                    className="w-30 form-control"
                    placeholder="Search Category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

</div>
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
      
<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 ,display:"flex",flexDirection:"column",  alignItems:"center",justifyContent:"center"}}>
          <h2 id="child-modal-title"  >Do you want to delete?</h2>
         <Typography  sx={{display:"flex",alignItems:"center",justifyContent:"center" ,gap:"20px"}}>

       
          <button
                          type="button"
                          className="btn btn-sm  mt-4"
                        
                          style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E",width:"100px" }}
                          onClick={() => handleDelete(deleteId)}
                        >
                          Yes
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm  mt-4"
                        onClick={handleClose}
                          style={{ backgroundColor: 'transparent', border: "1px solid #D93D6E",width:"100px",marginLeft:"20px" }}
                        >
                        No
                        </button>
                        </Typography>
        </Box>
</Modal>


    </Layout>
  );
};

export default Category;
