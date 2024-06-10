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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { fetchAllProducts } from "../../features/product/productSlice";
import { Grow } from "@mui/material";
import { fetchAllBrands, fetchBrandById, getBrand } from "../../features/brand/brandSlice";

const mediaFolder = process.env.REACT_APP_MEDIA_URL ;

const Product = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const allCategories = useSelector(getAllCategories);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brand,setBrand] = useState({})

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log(allCategories)
  const fetchProducts = async () => {
    const res = await dispatch(fetchAllProducts()).unwrap();
    console.log(res)
    // const id = res.brand_id
    // const brand = await dispatch(fetchBrandById({id })).unwrap()
    //  setBrand(brand);
   
    setProducts(res);
    setFilteredProducts(res);
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const result = products.filter((cat) => {
      return cat.name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredProducts(result);
  }, [search]);

  const capitalizeString = (str) => {
    // console.log(str);
    return str.toUpperCase();
  };
  const handleDelete = (id) => {
    // dispatch(deleteCategory({id}))
    // .unwrap()
    // .then(() => {
    //   fetchCategory();
    //   navigate("/category");
    //   // window.location.reload();
    //   toast.success('Category deleted successfully!')
    //   // setSuccessful(true);
    // })
    // .catch((err) => {
    //   toast.success(err)
    //   // setSuccessful(false);
    // });
  };

  // filteredCategories.forEach((cat, index) => {
  //   cat.serial = index + 1;
  // });
const [brands,setbrands]=useState([])
const [category,setcategory]=useState([])

  const fetchBrand = async () => {
    const res = await dispatch(fetchAllBrands()).unwrap();
    //  console.log(res)
    setbrands(res);
   
  };
  const fetchCategory = async () => {
    const res = await dispatch(fetchAllCategories()).unwrap();
     console.log(res)
     setcategory(res);
   
  };

  useEffect(() => {
    fetchBrand();
    fetchCategory()
  }, [dispatch]);
  const getBrandName = (brandId) => {

    const brand = brands.find((b) => b.id == brandId);

    return brand ? brand.name : 'Unknown';
  };

 
  const getCategoryNames = (categoryIds) => {
    const names = categoryIds.map(id => {
      const categories = category.find(cat => cat.id === id);
      return categories ? categories.name : 'Unknown';
    });
    return names.join(', ');
  };
  const columns = [
    // {
    //   name: "Id",
    //   selector: (row) => row.id,
    //   sortable: true,
    // },
    {
      name: "Image",
      grow:1,
      cell: (row) => <>
      {row.media  ? ( 
        <img
          src={`${mediaFolder}/${row.media[0]}`}
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
      name: "Name",
      selector: (row) => <b>{row.name}</b>,
      sortable: true,
      grow:3,
    },
    {
      name: "SKU",
      selector: (row) => row.sku,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row) =>getBrandName(row.brand_id) ,
      sortable: true,
      grow:2,
    },
    {
      name: 'Category',
      selector: (row) => getCategoryNames(row.categories),
      sortable: true,
      grow: 2,
    },
    {
      name: "Price",
      selector: (row) => "AED "+row.price,
      sortable: true,
      grow:1,
    },
    // {
    //   name: "Variants",
    //   selector: (row) =>row.product_variants.length,
    //   sortable: true,
      
    // },
    // {
    //     name: 'Meta Description',
    //     selector: row => row.meta_description,
    //     sortable: true,
    // },
    {
      name: "Action",
      right:true,
      
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    fixed: 'right', 
      cell: (row) => (
        <div>
          <Link to={`/editproduct/${row.id}`}>
            <span style={{ color: " #D93D6E " }}>Edit</span>
          </Link>

          {/* <span
            onClick={() => handleDelete(row.id)}
            style={{
              marginLeft: "20px",
              cursor: "pointer",
              color: " #D93D6E ",
            }}
          >
            Delete
          </span> */}
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
  
          <h2 className="heading">Product</h2>
     
       
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div style={{ color: "gray", fontWeight: "bold" }}>
                <p className="">{products?.length} products</p>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "10px" }}
              >
                <Link
                  to={`/editproduct`}
                  className="btn"
                  style={{
                    backgroundColor: "#D93D6E",
                    color: "white",
                    width: "200px",
                  }}
                >
                  Add Product
                </Link>
                <input
                  type="text"
                  className="w-30 form-control"
                  placeholder="Search Product"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <DataTable
                // title="Category"
                columns={columns}
                data={filteredProducts}
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
        
    </Layout>
  );
};

export default Product;
