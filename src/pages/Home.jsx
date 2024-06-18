import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../features/order/orderSlice';
import { fetchAllBrands } from '../features/brand/brandSlice';
import { fetchAllProducts } from '../features/product/productSlice';
import { fetchProducts, selectLowStockItems } from '../features/inventory/inventorySlice';
import { fetchAllCustomers } from '../features/customer/customerSlice';
import Layout from '../components/layouts/Layout';
import Chart from 'react-apexcharts';
import LowStockTable from '../components/LowStockTable'

const Dashboard = () => {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.items);
    const customers = useSelector(state => state.customer.customers);
    const brands = useSelector(state => state.brand.brands);
    const products = useSelector(state => state.product.products);
    
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
    const monthlySales = orders.reduce((acc, order) => {
        const month = new Date(order.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + order.total;
        return acc;
    }, Array(12).fill(0));

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchProducts());
        dispatch(fetchAllCustomers());
        dispatch(fetchAllBrands());
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const options = {
        chart: {
            type: 'bar',
            height: 350
        },
        title: {
            text: 'Monthly Sales',
            align: 'center'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yaxis: {
            title: {
                text: 'Total Sales (AED)'
            }
        }
    };

    const series = [{
        name: 'Sales',
        data: monthlySales
    }];
    console.log(monthlySales);
    return (
        <Layout>
            <div className='dashboard p-5 '>
                <h2 className="heading mb-4">Dashboard</h2>
                <div className="row">
                    <div className="col">
                        <div className="card text-center mb-4 rounded" style={{borderRadius:"20px"}}>
                            <div className="card-body bg-primary text-white rounded">
                                <h3 className="card-title text-white">Total Orders</h3>
                                <p className="card-text ">{orders.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card text-center mb-4">
                            <div className="card-body rounded" style={{backgroundColor:"#f6ccd9"}}>
                                <h5 className="card-title  text-primary">Total Sales</h5>
                                <p className="card-text  text-black">${totalSales.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card text-center mb-4">
                            <div className="card-body rounded"  style={{backgroundColor:"#f6ccd9"}}>
                                <h5 className="card-title text-primary">Total Customers</h5>
                                <p className="card-text  text-black">{customers.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card text-center mb-4 rounded" >
                            <div className="card-body rounded"  style={{backgroundColor:"#f6ccd9"}}>
                                <h3 className="card-title text-primary">Total Brands</h3>
                                <p className="card-text text-black">{brands.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card text-center mb-4 rounded" >
                            <div className="card-body rounded"  style={{backgroundColor:"#f6ccd9"}}>
                                <h3 className="card-title text-primary">Total Products</h3>
                                <p className="card-text text-black">{products.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 ">
                    <div className="card mb-4">
                    <div className="card-body">
                        <div className="chart">
                        <h5 className="card-title p-2 text-primary">Orders</h5>
                        <hr/>
                            <Chart options={options} series={series} type="bar" />
                        </div>
                        </div></div>
                    </div>
                    <div className="col-md-6">
                         <LowStockTable />
                    </div>
                    
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
