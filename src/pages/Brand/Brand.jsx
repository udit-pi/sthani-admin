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
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
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
const Brand = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const allBrands = useSelector(getAllBrands);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);
  const[deleteId,setdeleteId]=useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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

  const columns = [
      
    {
      name: "Icon",
      // width:"10%",
      grow:0.5,
      cell: (row) => <>
      {row.logo ? ( 
        <img
          src={`${mediaFolder}/${row.logo}`}
          alt="Icon"
          height="50px"
          className="custom-icon"
         
        />
      ) : (
        <span>-</span> 
           
      )}
    </>,
    },

    {
      name: "Color",
      cell: (row) => (
        <div style={{
          width: "20px",
          height: "20px",
          backgroundColor: row.color || '#FFFFFF', // Default to white if no color specified
          border: '1px solid #ddd' // Optional: adds a border around the color box
        }}>
        </div>
      ),
      grow: 0.5,
      ignoreRowClick: true,
      allowOverflow: true,
    },
    
    {
      name: "Name",
      selector: (row) => row.name,
      cell: (row) => <div style={{ fontWeight: "bold" }}>{row.name}</div>,
      sortable: true,
      grow:2,
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
      // width:"20%",
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
      cell: (row) => (
        <div >
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
    // Navigate to the edit page when a row is clicked
    navigate(`/editbrand/${row.id}`);
  };


  const handleOpen = (id) => {
    setdeleteId(id)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
      
      <h2 className="heading">Brand</h2>
   
        <div className="card">
          <div className="card-body">
          <div style={{display:"flex",justifyContent:"space-between" ,gap:"20px"}}>
          <div style={{ color: 'gray', fontWeight: 'bold' }}>
  {brands.length}  Brands
</div>
          <div style={{display:"flex",flexDirection:"row" ,gap:"10px"}}>
          <Link
            to={`/addbrand`}
            className="btn ms-1"
            style={{ backgroundColor: '#D93D6E',color:"white", width:"200px"}}
          >
            Add Brand
          </Link>
          <input
                    type="text"
                    className="w-30 form-control"
                    placeholder="Search Brands"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  </div>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 ,display:"flex",flexDirection:"column",  alignItems:"center",justifyContent:"center" }}>
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

export default Brand;
