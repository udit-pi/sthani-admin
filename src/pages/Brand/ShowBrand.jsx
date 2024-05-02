import React, { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchBrandById, getBrand } from "../../features/brand/brandSlice";

const ShowBrand = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const brand = useSelector(getBrand);

  //   const [brand,setBrand] = useState({})

  //  const imageBaseUrl = "http://localhost:3500/uploads/";
  // const imageBaseUrl = "http://165.22.222.184/api/uploads/";
  // const imageBaseUrl = "http://64.227.162.145/api/uploads/";

  const imageBaseUrl = `${process.env.REACT_APP_API_URL}/api/uploads/`;

  const fetchBrand = async () => {
    const res = await dispatch(fetchBrandById({ id })).unwrap();
    //  console.log(res)
    //  setBrand(res);
    //  console.log(res.images)
    // setFilteredCategories(res);
  };

  useEffect(() => {
    fetchBrand();
  }, [dispatch]);
  console.log(brand.images);
  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <div className="card">
          <div className="card-body">
            <h4>Brand Details</h4>
            <div className="row">
              <div className="col-md-6">
                <p>
                  <b>Id:</b> {brand.id}
                </p>
                <p>
                  <b>Description:</b> {brand.description}
                </p>
                <p>
                  <b>Website:</b> {brand.website ? brand.website : "No Website"}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <b>Name</b>: {brand.name}
                </p>
                {/* <p><b>Meta Tile</b>: {category.meta_title}</p> */}
                <p>
                  <b>Slug</b>: {brand.slug}
                </p>
                <p>
                  <b>Logo:</b>{" "}
                </p>{" "}
                <img
                  src={imageBaseUrl + brand.logo}
                  alt=""
                  width={150}
                  height={150}
                />
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

export default ShowBrand;
