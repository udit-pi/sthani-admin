import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAllCategories, editCategory } from '../../features/category/categorySlice';
import Layout from '../../components/layouts/Layout';
import DataTable from 'react-data-table-component';
import { Link, Navigate, useNavigate } from "react-router-dom";

const FeaturedCategoryManagement = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.category.categories);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  const mediaFolder = process.env.REACT_APP_MEDIA_URL; // Assuming you have a base URL for images

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllCategories());
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setFilteredCategories(
      categories.filter(category =>
        category.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, categories]);

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

  const handleEditClick = (id) => {
    navigate(`/editcategory/${id}`);
  };

  const handleRowClick = row => {
    // Implement row click functionality if needed
  };

  const columns = [
    {
      name: 'Banner',
      grow: 0.5,
      cell: row => (
        row.banner &&
        <img
          src={`${mediaFolder}/${row.banner}`}
          alt={row.name}
          style={{ width: '50px', height: '50px' }}
        />
      ),
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
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
      name: 'Actions',
      cell: row => (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleEditClick(row.id)}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="col-12 stretch-card container-fluid">
        <h2 className="heading">Featured Categories</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div style={{ color: 'gray', fontWeight: 'bold' }}>
            {categories.length} Categories
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
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
            columns={columns}
            data={filteredCategories}
            fixedHeader
            pagination
            highlightOnHover
            subHeader
            onRowClicked={handleRowClick}
            defaultSortFieldId={1}
          />
        </div>
      </div>
    </Layout>
  );
};

export default FeaturedCategoryManagement;
