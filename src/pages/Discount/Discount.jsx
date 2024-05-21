import React, { useEffect, useState } from 'react'
import Layout from '../../components/layouts/Layout'
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { deleteDiscount, fetchAllDiscount } from "../../features/discount/discountSlice";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Typography } from "@mui/material";
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

const Discount = () => {
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const[deleteId,setdeleteId]=useState("")
  console.log(deleteId)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchDiscount = async () => {
    const res = await dispatch(fetchAllDiscount()).unwrap();
      console.log(res)
      setFilteredCustomers(res)

  };

  useEffect(() => {
    fetchDiscount();
  }, [dispatch]);

  const handleOpen = (id) => {
    setdeleteId(id)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const  handleDelete = (id) => {
      
    dispatch(deleteDiscount({id}))
    .unwrap()
    .then(() => {
    
      fetchDiscount()
      
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
  const columns = [
    // {
    //   grow:2,
    //   name: "Id",
    //   selector: (row) => row.id,
    //   sortable: true,
      
    // },
    {
      name: "Code",
      selector: (row) => row.first_name ,
      cell: (row) => <div style={{ fontWeight: "bold" }}>{row.code}</div>,
      sortable: true,
      grow:3,
    },
   
    {
      name: "Type",
      selector: (row) => row.discountType,
      sortable: true,
      grow:2,
    },
    {
        name: "parent",
        selector: (row) => row.status,
        sortable: true,
        grow:2,
      },
    
  
    {
      name: "Action",
      right:true,
      // grow:1,
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
          <span  onClick={() => handleOpen(row._id)}  style={{marginLeft:"20px",cursor:"pointer",color: ' #D93D6E ' }}>

Delete
   
 </span>

          <Link
            to={`/editCustomer/${row.id}`}
            // className="btn btn-sm btn-warning ms-1"
            style={{marginLeft:"20px",cursor:"pointer",color: ' #D93D6E ' }}
          >
           <span style={{ color: ' #D93D6E ' }}>
           Edit
              
               </span>
          </Link>
       
        </div>
      ),
    },
    // {
    //     name: 'Created',
    //     selector: row => row.createdAt,
    //     sortable: true,
    // },
  ];

  const handleRowClick = (row) => {
    // Navigate to the edit page when a row is clicked
    navigate(`/editDiscount/${row._id}`);
  };

  return (
    
          <Layout>
       <h2 className="heading ms-3">Discount</h2>
   
      <div className="col-12 stretch-card container-fluid">
     
        <div className="card">
     
          <div className="card-body">
          <div style={{display:"flex",flexDirection:"row",justifyContent:"flex-end" ,gap:"10px"}}>
          <Link
            to={`/addDiscount`}
            className="btn ms-1"
            style={{ backgroundColor: '#D93D6E',color:"white", width:"200px"}}
          >
            Add Discount
          </Link>
          <input
                    type="text"
                    className="w-25 form-control"
                    placeholder="Search Discounts"
                    // value={search}
                    // onChange={(e) => setSearch(e.target.value)}
                  />
                  </div>
            <div className="table-responsive">
              <DataTable
                // title="Category"
                columns={columns}
                data={filteredCustomers}
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
                //     // value={search}
                //     // onChange={(e) => setSearch(e.target.value)}
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
 
  )
}

export default Discount