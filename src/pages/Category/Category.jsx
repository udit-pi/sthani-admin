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
    //  console.log(res)
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

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: "Meta Title",
      selector: (row) => row.meta_title,
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
          <Link
            to={`/showcategory/${row.id}`}
            className="btn btn-sm btn-primary"
          >
            <span>
            <FontAwesomeIcon icon={faCircleInfo} />
             
            </span>
          </Link>
          <Link
            to={`/editcategory/${row.id}`}
            className="btn btn-sm btn-warning ms-1"
          >
            <span>
              <i className="ti ti-pencil" />
            </span>
          </Link>
          <button
            className="btn btn-sm btn-danger ms-1"
            onClick={() => handleDelete(row.id)}
          >
            <span>
            <FontAwesomeIcon icon={faTrash} />
              
            </span>
          </button>
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
          <Link
            to={`/addcategory`}
            className="btn btn-sm btn-success ms-1"
          >
            Add Category
          </Link>
            <div className="table-responsive">
              <DataTable
                // title="Category"
                columns={columns}
                data={filteredCategories}
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

export default Category;
