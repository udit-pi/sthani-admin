import React, { useEffect, useState } from 'react'
import Layout from '../../components/layouts/Layout'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCategoryById } from '../../features/category/categorySlice';

const ShowCategory = () => {

  const dispatch = useDispatch();
  const {id} = useParams();

  const [category,setCategory] = useState({})
 
  // const imageUrl = 'http://localhost:3500/uploads/' + category.banner;
  // const imageUrl = 'http://165.22.222.184/api/uploads/' + category.banner;
  // const imageUrl = 'https://64.227.162.145/api/uploads/' + category.banner;

  const imageUrl = `${process.env.REACT_APP_API_URL}/api/uploads/${category.banner}`;

  const fetchCategory = async () => {
    const res = await dispatch(fetchCategoryById({id})).unwrap();
    //  console.log(res)
    setCategory(res);
    // setFilteredCategories(res);
  };

  useEffect(() => {
    fetchCategory();
  }, [dispatch]);
  return (
    <Layout>
    <div className="col-12 stretch-card container-fluid">
      <div className="card">
        <div className="card-body">
          <h4>Category Details</h4>
          <div className='row'>
          <div className='col-md-6'>
                    <p><b>Id:</b>  {category.id}</p>
                    <p><b>Code:</b>  {category.code}</p>
                    <p><b>Meta Description:</b>  {category.meta_description}</p>
                    <p><b>Banner:</b> </p> <img src={imageUrl} alt=""  width={150} height={150} />
              </div>
              <div className='col-md-6'>
                    <p><b>Name</b>: {category.name}</p>
                    <p><b>Meta Tile</b>: {category.meta_title}</p>
                    <p><b>Slug</b>: {category.slug}</p>
              </div>
          </div>
             
          </div>
          </div>
          </div>
      </Layout>
  )
}

export default ShowCategory