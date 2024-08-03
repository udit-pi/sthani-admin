import { useEffect, useState, useSyncExternalStore } from "react";
import DataTable from "react-data-table-component";
import Layout from "../../components/layouts/Layout";
import * as XLSX from 'xlsx';

import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  fetchAllCategories,
  deleteCategory,
  editCategory,
} from "../../features/category/categorySlice";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
// import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { toast } from "react-toastify";
 
import { FaCircle } from "react-icons/fa";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

const mediaFolder = process.env.REACT_APP_MEDIA_URL;

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
const debugMode = process.env.REACT_APP_DEBUG || "";
const Category = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const allCategories = useSelector(getAllCategories);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setdeleteId] = useState("");
  const [exportData, setExportData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log(allCategories)
  const fetchCategory = async () => {
    const res = await dispatch(fetchAllCategories()).unwrap();
    console.log(res);
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
    dispatch(deleteCategory({ id }))
      .unwrap()
      .then(() => {
        fetchCategory();

        navigate("/category");
        // window.location.reload();
        toast.success("Category deleted successfully!");
        // setSuccessful(true);
        setOpen(false);
      })
      .catch((err) => {
        toast.success(err);
        // setSuccessful(false);
      });
  };

  const handleFeaturedChange = (id, isFeatured) => {
    // Optimistically update the local state
    setFilteredCategories(prevState =>
      prevState.map(category =>
        category.id === id ? { ...category, is_featured: isFeatured } : category
      )
    );
    // Dispatch the action to update the Redux state
    dispatch(editCategory({ id, updateData: { is_featured: isFeatured } }));
  };

  const handleSortOrderChange = (id, newSortOrder) => {
    // Optimistically update the local state
    setFilteredCategories(prevState =>
      prevState.map(category =>
        category.id === id ? { ...category, sort_order: newSortOrder } : category
      )
    );
    // Dispatch the action to update the Redux state
    dispatch(editCategory({ id, updateData: { sort_order: newSortOrder } }));
  };

  useEffect(() => {
    if (categories.length > 0) {
      const formattedData = categories.map(category => {
        const parentCategory = categories.find(cat => cat.id === category.parent_category);
        return {
        'Slug': category.slug,
        'Name': category.name,
        'Description': category.description,
        'Parent Category':  parentCategory ? parentCategory.slug : '',
        'Icon': category.icon ? `${mediaFolder}/${category.icon}` : '',
        'Is Featured': category.is_featured,
        'Banner': category.banner ? `${mediaFolder}/${category.banner}` : '',
        'Slideshow': category.slide_show ? category.slide_show.map(slide => `${mediaFolder}/${slide}`).join(', ') : '',
        'Tag': category.tag,
        'Sort Order': category.sort_order
      };
    });
      setExportData(formattedData);
    }
  }, [categories]);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');

    XLSX.writeFile(workbook, 'categories.xlsx');
  };

  // filteredCategories.forEach((cat, index) => {
  //   cat.serial = index + 1;
  // });
  const parentCategoryName = (row, categories) => {
    const parentCategoryId = row.parent_category;

    // Find the category with the matching ID
    
    const parentCategory = categories.find(
      (category) => category.id === parentCategoryId
    );

    

    // If parent category is found, return its name, otherwise return a default value
    return parentCategory ? parentCategory.name : "-";
  };

  const columns = [
    {
      name: "Icon",
      cell: (row) => (
        <>
          {row.icon ? ( 
            <img
              src={`${mediaFolder}/${row.icon}`}
              alt="Icon"
              height="50px"
              style={{ padding: "5px" }}
            />
          ) : (
            <span>-</span>
          )}
        </>
      ),
      width: "10%",
    },

    {
      name: "Name",
      selector: (row) => row.name,
      cell: (row) => <div style={{ fontWeight: "bold" }}>{row.name}</div>,
      sortable: true,
      grow:3,
    },

    {
      name: "Parent category",
      selector: (row) => parentCategoryName(row, categories),
      sortable: true,
      grow:2,
    },
    {
      name: 'Featured',
      selector: row => row.is_featured,
      sortable: true,
      cell: row => (
        <input
          type="checkbox"
          checked={row.is_featured}
          onChange={(e) => handleFeaturedChange(row.id, e.target.checked)}
        />
      ),
    },
    {
      name: 'Sort Order',
      cell: row => row.is_featured && (
        <input
          type="number"
          className="form-control form-control-sm"
          style={{ width: '60px' }}
          value={row.sort_order}
          onChange={(e) => handleSortOrderChange(row.id, parseInt(e.target.value))}
        />
      ),
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
          <Link to={`/editcategory/${row.id}`} className=" ">
            <span style={{ color: " #D93D6E " }}>
              {/* <i className="ti ti-pencil" /> */}
              Edit
            </span>
          </Link>

          {/* <span  onClick={() => handleDelete(row.id)}  style={{marginLeft:"20px",cursor:"pointer",color: ' #D93D6E ' }}> */}
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
      width: "15%",
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
    setdeleteId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  console.log(categories.length);
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
     
          <h2 className="heading">Categories</h2>
     
      
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div style={{ color: "gray", fontWeight: "bold" }}>
                {categories.length} Categories
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "10px" }}
              >
                {debugMode && (
              <div>
                <button  style={{
                    backgroundColor: "#000",
                    color: "white",
                    width: "180px",
                  }} className="btn btn-black" onClick={handleExport}>Export</button>
                <Link
                  to={`/categoryimport`}
                  className="btn "
                  style={{
                    backgroundColor: "#000",
                    color: "white",
                    width: "200px",
                  }}
                >
                  Import
                </Link>
                <Link
                  to={`/addcategory`}
                  className="btn "
                  style={{
                    backgroundColor: "#D93D6E",
                    color: "white",
                    width: "200px",
                  }}
                >
                  Add Category
                </Link>
                </div>
                )}
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

export default Category;
