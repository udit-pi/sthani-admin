import React from 'react';
import DataTable from 'react-data-table-component';
import { fetchProducts, selectLowStockItems } from '../features/inventory/inventorySlice';
import { useSelector } from 'react-redux';
const mediaFolder = process.env.REACT_APP_MEDIA_URL ;

const LowStockTable = () => {
    
    const lowStockItems = useSelector(selectLowStockItems);

    const data = lowStockItems.flatMap(product => {
        // First, handle products with variants
        const variants = product.product_variants.length > 0
            ? product.product_variants
                .filter(variant => variant.stock < 20)  // Only include variants with stock less than 20
                .map(variant => ({
                    productId: product._id,
                    productName: `${product.name} - ${variant.name}`,
                    variantId: variant._id,
                    variantName: variant.name,
                    sku: variant.sku,
                    stock: variant.stock,
                }))
            : [];
    
        // Now, handle products without variants, only if their stock is less than 20
        const noVariantProduct = product.stock < 20 && product.product_variants.length === 0
            ? [{
                productId: product._id,
                productName: product.name,
                variantId: null,
                sku: product.sku,
                stock: product.stock,
            }]
            : [];
    
        return [...variants, ...noVariantProduct];  // Combine and return both lists
    });
    

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
        row.stock
      ),
      sortable: true,
    },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title text-primary">Low Stock Items (under 20 units)</h5>
                <DataTable
                    columns={columns}
                    data={data}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    responsive
                    dense
                />
            </div>
        </div>
    );
};

export default LowStockTable;
