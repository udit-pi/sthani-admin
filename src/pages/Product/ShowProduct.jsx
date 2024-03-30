import React, { useEffect, useState } from 'react'
import Layout from '../../components/layouts/Layout'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';


import { fetchProductById } from '../../features/product/productSlice';

const ShowProduct = () => {

  const dispatch = useDispatch();
  const {id} = useParams();

  const [product,setProduct] = useState({})
  const [brand,setBrand] = useState({})
 
//   const imageUrl = 'http://localhost:3500/uploads/' + category.banner;
  const fetchProduct = async () => {
    const res = await dispatch(fetchProductById({id})).unwrap();
     console.log(res)
     setProduct(res.product);
     setBrand(res.brand)
    // setFilteredCategories(res);
  };

  useEffect(() => {
    fetchProduct();
  }, [dispatch]);
  return (
    <Layout>
    <div className="col-12 stretch-card container-fluid">
      <div className="card">
        <div className="card-body">
          <h4>Product Details</h4>
          <div className='row mt-5'>
          <div className='col-md-6'>
                    <p><b>Id:</b>  {product.id}</p>
                    <p><b>Brand Name:</b>  {brand.name}</p>
                    <p><b>Meta Description:</b>  {product.meta_description}</p>
                    <p><b>Weight:</b>  {product.weight}</p>
                    <p><b>length:</b>  {product.length}</p>
                    <p><b>height:</b>  {product.height}</p>
                    <p><b>Min Quantity:</b>  {product.quantity_min}</p>
                    <p><b>Stock:</b>  {product.stock}</p>
                    <p><b>Published:</b>  {product.published ? 'Yes' : 'No'}</p>
                    <p><b>Price Includes Tax:</b>  {product.price_include_tax ? 'Yes' : 'No'}</p>
                    <p><b>Sales Count:</b>  {product.sales_count ? product.sales_count : 0}</p>
                    <p><b>Reviews Rating:</b>  {product.reviews_rating ? product.review_rating : 'Not Rated Yet'}</p>
                    {/* <p><b>Banner:</b> </p> <img src={imageUrl} alt=""  width={150} height={150} /> */}
              </div>
              <div className='col-md-6'>
                    <p><b>Name</b>: {product.name}</p>
                    <p><b>Meta Tile</b>: {product.meta_title}</p>
                    <p><b>Slug</b>: {product.slug}</p>
                    <p><b>SKU</b>: {product.sku}</p>
                    <p><b>Width</b>: {product.width}</p>
                    <p><b>Default Quantity</b>: {product.quantity_default}</p>
                    <p><b>Max Quantity</b>: {product.quantity_max}</p>
                    <p><b>Price</b>: {product.price}</p>
                    <p><b>Cost</b>: {product.cost ? product.cost : 0}  </p>
                    <p><b>Discounted Price</b>: {product.discounted_price ? product.discounted_price : 0}</p>
                    <p><b>Allow Out Of Stock Purchase:</b>  {product.allow_out_of_stock_purchase ? 'Yes' : 'No'}</p>
              </div>
          </div>
             
          </div>
          </div>
          </div>
      </Layout>
  )
}

export default ShowProduct