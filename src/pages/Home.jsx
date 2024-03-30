import { useState } from 'react'
import Chart from "react-apexcharts";
import Layout from '../components/layouts/Layout'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function getUser() {
    let user = localStorage.getItem('user');

    if (user) {
        user = JSON.parse(user)
    }
    else {
        user = null;
    }

    return user;
}

const Home = () => {

    const { user: currentUser } = useSelector((state) => state.auth);
    const [user, setUser] = useState(getUser());

    const [options, setObject] = useState({
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + "%";
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },

        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            position: 'top',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return val + "%";
                }
            }

        },
    });

    const [series, setSeries] = useState([{
        name: 'Inflation',
        data: [8.3, 3.1, 4.0, 6.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 5.2]
    }]);

    if (!currentUser) {
        return <Navigate to="/login" />;
      }

    return (
        <Layout>
            <div className='pages'>
                <div className="home">
                    <div className="row">
                        <h2 className="mb-5">Hi <b className='text-primary'>{user ? user.user.name : ''}</b>, welcome to dashboard</h2>

                        <div className="col-md-6 d-flex align-items-strech">
                            <div className="card w-100">
                                <div className="card-body">
                                    <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                                        <div className="mb-3 mb-sm-0">
                                            <h5 className="card-title fw-semibold">Incidents Overview</h5>
                                        </div>
                                        <div>
                                            <select className="form-select">
                                                <option value={1}>March 2023</option>
                                                <option value={2}>April 2023</option>
                                                <option value={3}>May 2023</option>
                                                <option value={4}>June 2023</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Chart
                                        options={options}
                                        series={series}
                                        type="bar"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-lg-12">
                                    {/* Yearly Breakup */}
                                    <div className="card overflow-hidden">
                                        <div className="card-body p-5">
                                            <h5 className="card-title mb-9 fw-semibold">Total Incidents</h5>
                                            <div className="row align-items-center">
                                                <div className="col-8">
                                                    <h4 className="fw-semibold mb-3">4565</h4>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <span className="me-1 rounded-circle bg-light-success round-20 d-flex align-items-center justify-content-center">
                                                            <i className="ti ti-arrow-up-left text-success" />
                                                        </span>
                                                        <p className="text-dark me-1 fs-3 mb-0">+9%</p>
                                                        <p className="fs-3 mb-0">last year</p>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-4">
                                                            <span className="round-8 bg-primary rounded-circle me-2 d-inline-block" />
                                                            <span className="fs-2">2023</span>
                                                        </div>
                                                        <div>
                                                            <span className="round-8 bg-light-primary rounded-circle me-2 d-inline-block" />
                                                            <span className="fs-2">2023</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="d-flex justify-content-center">
                                                        <div id="breakup" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    {/* Monthly Earnings */}
                                    <div className="card">
                                        <div className="card-body p-5">
                                            <div className="row alig n-items-start">
                                                <div className="col-8">
                                                    <h5 className="card-title mb-9 fw-semibold"> Monthly Reports </h5>
                                                    <h4 className="fw-semibold mb-3">506</h4>
                                                    <div className="d-flex align-items-center pb-1">
                                                        <span className="me-2 rounded-circle bg-light-danger round-20 d-flex align-items-center justify-content-center">
                                                            <i className="ti ti-arrow-down-right text-danger" />
                                                        </span>
                                                        <p className="text-dark me-1 fs-3 mb-0">+9%</p>
                                                        <p className="fs-3 mb-0">last month</p>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="d-flex justify-content-end">

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="earning" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Home