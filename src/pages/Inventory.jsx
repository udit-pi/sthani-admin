import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { fetchProducts, updateProductStock, bulkUpdateProductStock } from '../features/inventory/inventorySlice';
import Layout from '../components/layouts/Layout';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';

const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.inventory);
  const [updatedStocks, setUpdatedStocks] = useState({});
  const [csvFile, setCsvFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleStockChange = (productId, variantId, stock) => {
    setUpdatedStocks({
      ...updatedStocks,
      [`${productId}-${variantId || 'main'}`]: stock,
    });
  };

  const handleSave = (productId, variantId) => {
    const stock = updatedStocks[`${productId}-${variantId || 'main'}`];
    dispatch(updateProductStock({ productId, variantId, stock }))
      .unwrap()
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error));
  };

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleBulkUpdate = () => {
    if (!csvFile) {
      toast.error('Please select a file to upload.');
      return;
    }
    dispatch(bulkUpdateProductStock(csvFile))
      .unwrap()
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error));
    setShowModal(false);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const columns = [
    {
      name: 'Product Name',
      selector: row => <b>{row.variantId ? `${row.productName} - ${row.variantName}` : row.productName}</b>,
      sortable: true,
      grow: 2.5
    },
    {
      name: 'SKU',
      selector: row => row.sku,
      sortable: true,
    },
    {
      name: 'Stock',
      cell: row => (
        <input
          type="number"
          className="form-control"
          value={updatedStocks[`${row.productId}-${row.variantId || 'main'}`] || row.stock}
          onChange={(e) => handleStockChange(row.productId, row.variantId, e.target.value)}
        />
      ),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <button className="btn btn-sm btn-dark" onClick={() => handleSave(row.productId, row.variantId)}>Save</button>
      )
    }
  ];

  const data = items.flatMap(product =>
    product.product_variants.length > 0 ?
    product.product_variants.map(variant => ({
      productId: product._id,
      productName: product.name,
      variantId: variant._id,
      variantName: variant.name,
      sku: variant.sku,
      stock: variant.stock,
    })) :
    [{
      productId: product._id,
      productName: product.name,
      variantId: null,
      sku: product.sku,
      stock: product.stock,
    }]
  );

  const csvData = data.map(item => ({
    productId: item.productId,
    name: item.productName,
    sku: item.sku,
    variantId: item.variantId,
    variantName: item.variantName,
    stock: item.stock,
  }));

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="heading ms-3">Inventory Management</h2>
        <hr/>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0 ms-3">Products</h4>
          <div>
            <CSVLink
              data={csvData}
              filename={"inventory.csv"}
              className="btn btn-primary me-2"
              target="_blank"
            >
              Download CSV
            </CSVLink>
            <button className="btn btn-primary" onClick={handleShowModal}>Bulk Update</button>
          </div>
        </div>

        <div className="col-12 stretch-card container-fluid">
          <div className="container mt-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DataTable
                columns={columns}
                data={data}
                pagination
              />
            )}

            <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Upload CSV</h5>
                    <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <input type="file" className="form-control-file" onChange={handleFileChange} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                    <button type="button" className="btn btn-success" onClick={handleBulkUpdate}>Upload CSV</button>
                  </div>
                </div>
              </div>
            </div>

            {showModal && <div className="modal-backdrop fade show"></div>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InventoryManagement;
