import React, { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { fetchProductById } from "../../features/product/productSlice";
import { editProductValidation } from "../../validations/editProductValidation";
import QuillEditor from "../../components/Editor";
import ReactQuill from "react-quill";

const ShowProduct = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [brand, setBrand] = useState({});
  const [productVariant, setProductVariant] = useState({});
  const [productMedia, setProductMedia] = useState({});

  //   const imageUrl = 'http://localhost:3500/uploads/' + category.banner;
  const imageBaseUrl = "http://localhost:3500/uploads/";

  const initialValues = {
    name: product.name,
  };
  const fetchProduct = async () => {
    const res = await dispatch(fetchProductById({ id })).unwrap();
    console.log(res);
    setProduct(res.product);
    setBrand(res.brand);
    setProductVariant(res.productVariant);
    setProductMedia(res.productMedia);
    initialValues.name = res.product.name
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
            <div className="row">
              <div className="col-md-6">
                <p>
                  <b>Brand :</b> {brand.name?.charAt(0).toUpperCase() + brand.name?.slice(1)}
                </p>
                <p>
                  <b>Description:</b> {product.description}
                </p>
                <p>
                <b>meta_title</b>: {product.meta_title}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <b>Name</b>: {product.name}
                </p>
                {/* <p><b>Meta Tile</b>: {category.meta_title}</p> */}
                <p>
                  <b>Slug</b>: {product.slug}
                </p>
                <p>
               
                </p>
                
              </div>
            </div>
            <div className="row mt-4 mb-2">
                <h6>Images uploaded:</h6>
              {brand.images?.map((image, key) => {
                return (
                  <div class="col-md-3 grid-item">
                    <img
                      src={imageBaseUrl + image.value}
                      class="img-fluid"
                      alt="Image 2"
                      width={150}
                      height={150}
                    ></img>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShowProduct;
