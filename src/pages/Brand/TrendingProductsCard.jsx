import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByBrand } from '../../features/product/productSlice'; // Adjust the import based on your project structure

const TrendingProductsCard = ({ brandId, trendingProducts, setTrendingProducts }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await dispatch(fetchProductsByBrand({ brandId })).unwrap();
      console.log(result);
      setProducts(result);
    };

    fetchProducts();
  }, [dispatch, brandId]);

  const handleTrendingChange = (productId) => {
    setTrendingProducts((prevTrendingProducts) => {
      if (prevTrendingProducts.includes(productId)) {
        return prevTrendingProducts.filter((id) => id !== productId);
      } else {
        return [...prevTrendingProducts, productId];
      }
    });
  };

  const columns = [
    {
      name: 'Product Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Trending',
      cell: (row) => (
        <input
          type="checkbox"
          checked={trendingProducts.includes(row.id)}
          onChange={() => handleTrendingChange(row.id)}
        />
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <h5>Brands Products</h5>
        <p>Mark the products as Trending for Store Screen.</p>
        <DataTable
          columns={columns}
          data={products}
          pagination
          highlightOnHover
          subHeader
          subHeaderComponent={
            <input
              type="text"
              placeholder="Search Products"
              className="w-25 form-control"
            />
          }
        />
      </div>
    </div>
  );
};

export default TrendingProductsCard;
