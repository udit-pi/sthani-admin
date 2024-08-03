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
import { toast } from "react-toastify";
import { fetchAllProducts, syncProductsWithIQ } from "../../features/product/productSlice";
import { fetchAllBrands, fetchBrandById, getBrand } from "../../features/brand/brandSlice";
import exportToExcel from '../../utils/exportToExcel'; 



const mediaFolder = process.env.REACT_APP_MEDIA_URL;
const debugMode = process.env.REACT_APP_DEBUG || "";
const Product = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const allCategories = useSelector(getAllCategories);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brand, setBrand] = useState({})
  const { syncResults, error, isLoading } = useSelector(state => state.product);
  const [showModal, setShowModal] = useState(false);

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
    if (syncResults) {
      console.log(syncResults);
      setShowModal(true);
    }
  }, [syncResults]);
  
  const handleSyncClick = async () => {
    dispatch(syncProductsWithIQ())
      .unwrap()
      .catch((errorMsg) => {
        toast.error(`Error: ${errorMsg}`);
      });
  };

  useEffect(() => {
    // Component unmount cleanup function
    return () => {
      setShowModal(false);  // This will ensure the modal is closed when the component unmounts
    };
  }, []);


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
  const [brands, setbrands] = useState([])
  const [category, setcategory] = useState([])

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

  const handleExport = () => {
    exportToExcel(products, category);
  };

  const getCategoryNames = (categoryIds) => {
    const names = categoryIds.map(id => {
      const categories = category.find(cat => cat.id === id);
      return categories ? categories.name : 'Unknown';
    });
    return names.join(', ');
  };

  // const exportToExcel = () => {
  //   const data = products.map(product => ({
  //     'Name': product.name,
  //     'SKU': product.sku,
  //     'Slug': product.slug,
  //     'Short Description': product.description_short,
  //     'Description': product.description,
  //     'Weight': product.weight,
  //     'Dimensions (LxWxH)': `${product.length}x${product.width}x${product.height}`,
  //     'Minimum Quantity': product.quantity_min,
  //     'Stock': product.stock,
  //     'Price': product.price,
  //     'Discounted Price': product.discounted_price,
  //     'Cost': product.cost,
  //     'Media': product.media.join(', '),
  //     'Published': product.published,
  //     'Upselling': product.is_upsell,
  //     'Categories': product.categories.join(', '),
  //     'Product Variants': product.product_variants.map(variant => `${variant.name}: ${variant.price}`).join(' | '),
  //     'Additional Descriptions': product.additional_descriptions.map(desc => `${desc.label}: ${desc.value}`).join(' | ')
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

  //   XLSX.writeFile(workbook, 'products.xlsx');
  // };

  

  const columns = [
    // {
    //   name: "Id",
    //   selector: (row) => row.id,
    //   sortable: true,
    // },
    {
      name: "Image",
      grow: 0.75,
      cell: (row) => <>
        {row.media ? (
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
      grow: 2,
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
      grow: 0.5
    },
    {
      name: "Brand",
      selector: (row) => getBrandName(row.brand_id),
      sortable: true,
      grow: 1,
    },
    {
      name: 'Category',
      selector: (row) => getCategoryNames(row.categories),
      sortable: true,
      grow: 2,
    },
    {
      name: "Price",
      selector: (row) => "AED " + row.price,
      sortable: true,
      grow: 0.75,
    },
    {
      name: "Upsell",
      selector: (row) => row.is_upsell === true ? "Yes" : "No",
      sortable: true,
      grow: 0.75,
    },
    {
      name: "Published",
      selector: (row) => row.published === true ? "Yes" : "No",
      sortable: true,
      grow: 0.75,
    },
    // {
    //   name: "Synced with IQ",
    //   selector: (row) => row.isSyncedWithIQ === true ? "Yes" : "No",
    //   sortable: true,
    //   grow: 0.75,
    // },
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
      right: true,

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

      {showModal && (
        <>
        <div className="modal-backdrop fade show"></div>
        <div className={`modal  fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content"  style={{width:"700px", height:"600px"}}>
            <div className="modal-header">
              <h4 className="modal-title">Sync Summary</h4>
             
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close">
                
              </button>
            </div>
            <div className="modal-body"  style={{width:"700px", height:"600px", overflow: "auto"}}>
            <div className="text-black fw-bolder mb-3">
              <span className="me-3">{syncResults && Array.isArray(syncResults.created) && (
                `Created ${syncResults.created.length} Product(s)`
              )} </span>
              <span>
              {syncResults && Array.isArray(syncResults.updated) && (
                `Updated ${syncResults.updated.length} Product(s)`
              )}</span></div>
      <hr/>
            {syncResults && Array.isArray(syncResults.created) && syncResults.created.length >0 && (
            <div>
              <u><h6>Created Products List:</h6></u>
              <ul>
                {syncResults.created.map((item, index) => (
                  <li key={item}>{index + 1}. {item}</li>
                ))}
              </ul>
            </div>
          )}
          {syncResults && Array.isArray(syncResults.updated) && syncResults.updated.length >0 && (
            <div>
              <u><h6>Updated Products List:</h6></u>
              <ul>
                {syncResults.updated.map((item, index) => (
                 <li key={item}>{index + 1}. {item}</li>
                ))}
              </ul>
            </div>
          )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
      </>
      )}

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
            <div><button onClick={handleSyncClick} className="me-2 btn btn-dark" disabled={isLoading}>{isLoading ? 'Syncing...' : 'Sync with IQ'}</button></div>
            {debugMode && (
              <div>
            <div><button onClick={handleExport} className="me-2 btn btn-dark">Export</button></div>
            <div><Link to={`/productimport`} className="me-2 btn btn-dark">Import</Link></div>
            </div>
             )}
            <div><Link
              to={`/editproduct`}
              className="btn"
              style={{
                backgroundColor: "#D93D6E",
                color: "white",
                width: "200px",
              }}
            >
              Add Product
            </Link></div>
            <div>
              <input
                type="text"
                className="w-30 form-control"
                placeholder="Search Product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              /></div>
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
