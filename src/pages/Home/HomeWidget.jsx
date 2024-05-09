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


const HomeWidget = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
 
  const [homeWidgets, setHomeWidgets] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredHomeWidgets, setFilteredHomeWidgets] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    },
    {
      name: "Widget Type",
      selector: (row) => row.widget_type,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
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
            to={`/editWidget/${row.id}`}
            className="btn btn-sm btn-warning ms-1"
          >
            <span>
              <i className="ti ti-pencil" />
            </span>
          </Link>
          <button
            type="button"
            onClick ={() => handleDelete(row.id)}
            className="btn btn-sm btn-danger ms-2"
          >
            <span>
            <FontAwesomeIcon icon={faTrash} />
             
            </span>
          </button>
          {/* <button
            className="btn btn-sm btn-danger ms-1"
            onClick={() => handleDelete(row.id)}
          >
            <span>
            <FontAwesomeIcon icon={faTrash} />
              
            </span>
          </button> */}
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
            to={`/addwidget`}
            className="btn btn-sm btn-success ms-1"
          >
            Add Widget
          </Link>
            <div className="table-responsive">
              <DataTable
                // title="Category"
                columns={columns}
                data={filteredHomeWidgets}
                fixedHeader
                pagination
                highlightOnHover
                subHeader
                subHeaderComponent={
                  <input
                    type="text"
                    className="w-25 form-control"
                    placeholder="Search Widget"
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

export default HomeWidget;
