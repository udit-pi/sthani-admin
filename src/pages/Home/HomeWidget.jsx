import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Layout from "../../components/layouts/Layout";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faRemove } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { toast } from "react-toastify";
import { deleteWidget, fetchAllwidget } from "../../features/widget/homeWidgetSlice";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";


const HomeWidget = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
 
  const [homeWidgets, setHomeWidgets] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredHomeWidgets, setFilteredHomeWidgets] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setdeleteId] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
  
    bgcolor: "background.paper",
    border: "2px solid white",
    borderRadius: "10px",
    boxShadow: 24,
    pt: 4,
    px: 4,
    pb: 5,
  };

  // console.log(allCategories)
  const fetchWidget = async () => {
    const res = await dispatch(fetchAllwidget()).unwrap();
    //  console.log(res)
    setHomeWidgets(res);
    setFilteredHomeWidgets(res);
  };

  useEffect(() => {
    fetchWidget();
  }, [dispatch]);

//   useEffect(() => {
//     const result = categories.filter((cat) => {
//       return cat.name.toLowerCase().match(search.toLowerCase());
//     });
//     setFilteredCategories(result);
//   }, [search]);

  const capitalizeString = (str) => {
    // console.log(str);
    return str.toUpperCase();
  };
  const handleDelete = (id) => {
      
    dispatch(deleteWidget({id}))
    .unwrap()
    .then(() => {
    
      fetchWidget();
      
      navigate("/homePage");
      // window.location.reload();
      toast.success('Widget deleted successfully!')
      // setSuccessful(true);
      setOpen(false);
   
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
      name: "Position",
      selector: (row) => row.placement_id,
      sortable: true,
      grow:0,
    },
    {
      name: "Widget Type",
      selector: (row) => row.widget_type,
      cell: (row) => <div style={{ fontWeight: "bold" }}>{row.widget_type}</div>,
      sortable: true,
      grow:2,
    },
    {
      name: "Title",
      selector: (row) => row.title,
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
      cell: (row) => (
        <div>
          <Link to={`/editWidget/${row.id}`}>
            <span style={{ color: " #D93D6E " }}>Edit</span>
          </Link>

          <span
            onClick={() => handleOpen(row.id)}
            style={{
              marginLeft: "20px",
              cursor: "pointer",
              color: " #D93D6E ",
            }}
          >
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

  const handleOpen = (id) => {
    setdeleteId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Layout>
      <h2 className="heading ms-3">Home Widget</h2>
      <div className="col-12 stretch-card container-fluid">
        <div className="card">
          <div className="card-body">
          <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div style={{ color: "gray", fontWeight: "bold" }}>
                <p className="">{homeWidgets?.length} widgets</p>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "10px" }}
              >
                <Link
                  to={`/addWidget`}
                  className="btn"
                  style={{
                    backgroundColor: "#D93D6E",
                    color: "white",
                    width: "200px",
                  }}
                >
                  Add Widget
                </Link>
                <input
                  type="text"
                  className="w-30 form-control"
                  placeholder="Search Widget"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <DataTable
                // title="Category"
                columns={columns}
                data={filteredHomeWidgets}
                fixedHeader
                pagination
                highlightOnHover
                subHeader
                // subHeaderComponent={
                //   <input
                //     type="text"
                //     className="w-25 form-control"
                //     placeholder="Search Widget"
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
        <Box
          sx={{
            ...style,
            width: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2 id="child-modal-title">Do you want to delete?</h2>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <button
              type="button"
              className="btn btn-sm  mt-4"
              style={{
                backgroundColor: "transparent",
                border: "1px solid #D93D6E",
                width: "100px",
              }}
              onClick={() => handleDelete(deleteId)}
            >
              Yes
            </button>

            <button
              type="button"
              className="btn btn-sm  mt-4"
              onClick={handleClose}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #D93D6E",
                width: "100px",
                marginLeft: "20px",
              }}
            >
              No
            </button>
          </Typography>
        </Box>
      </Modal>
    </Layout>
  );
};

export default HomeWidget;
