import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartArrowDown, faCubesStacked, faDollar, faHome, faHouse, faLayerGroup, faMoneyBill, faPercent, faRightFromBracket, faShippingFast, faShop, faShoppingBag, faShoppingCart, faTag, faTicketSimple,faUsers } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons'

const Navbar = () => {

    const [isActive, setIsActive] = useState('');
    const navigate = useNavigate()

    const { user: currentUser } = useSelector((state) => state.auth) ||  {};
    // const [user, setUser] = useState(currentUser);

  

    const dispatch = useDispatch();
    
    const handleLogout = async (event) => {
        event.preventDefault();

        let refreshToken = currentUser.tokens.refresh.token;

        dispatch(logout(refreshToken)).then((result) => {
            if (result) {
                navigate('/login');
            }
        })
    }


    // console.log(isActive);

    // const handleLinkClick = (link) => {
    //     setIsActive(link)
    //     // navigate(link)
    // }
    let location = useLocation();
    return (
        <nav className="sidebar-nav scroll-sidebar d-flex flex-column" data-simplebar style={{height:"calc(100vh-200px"}}>
            <ul id="sidebarnav" className='d-flex flex-column flex-grow-1' >
                <li className="sidebar-item">
                    <Link id="dashboard" className={`${location.pathname=='/dashboard' ?'sidebar-link active':'sidebar-link'}`} onClick={() =>  setIsActive('dashboard') } to="/dashboard" aria-expanded="false">
                    <span>
                        <FontAwesomeIcon icon={faHome} />
                        </span>
                        <span className="hide-menu">Home</span>
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link id="home-page"className={`${location.pathname=='/orders' ?'sidebar-link active':'sidebar-link'}`} onClick={() => { setIsActive('orders') }} to="/orders" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        </span>
                        <span className="hide-menu">Orders</span>
                    </Link>
                </li>
               
                <li className="sidebar-item">
                    <Link id="product" className={`${location.pathname=='/product' ?'sidebar-link active':'sidebar-link'}`} onClick={() =>  setIsActive('product') } to="/product" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faProductHunt} />
                        </span>
                        <span className="hide-menu">Products</span>
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link id="inventory" className={`${location.pathname=='/inventory' ?'sidebar-link active':'sidebar-link'}`} onClick={() =>  setIsActive('inventory') } to="/inventory" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faProductHunt} />
                        </span>
                        <span className="hide-menu">Inventory</span>
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link id="category"  className={`${location.pathname=='/category' ?'sidebar-link active':'sidebar-link'}`} onClick={() =>  setIsActive('category') } to="/category" aria-expanded="false">
                    <span>
                        <FontAwesomeIcon icon={faLayerGroup} />
                        </span>
                        <span className="hide-menu">Categories</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link id="brand" className={`${location.pathname=='/brand' ?'sidebar-link active':'sidebar-link'}`} onClick={() =>  setIsActive('brand') } to="/brand" aria-expanded="false">
                    <span>
                        <FontAwesomeIcon icon={faTag} />
                        </span>
                        <span className="hide-menu">Brands</span>
                    </Link>
                </li>
                
                
                {/* <li className="sidebar-item">
                    <Link id="users" className={`${location.pathname=='/users' ?'sidebar-link active':'sidebar-link'}`} onClick={() => { setIsActive('users') }} to="/users" aria-expanded="false">
                        <span>
                            <i className="ti ti-users" />
                        </span>
                        <span className="hide-menu">Users</span>
                    </Link>
                </li> */}
                <li className="sidebar-item">
                    <Link id="customers" className={`${location.pathname=='/customers' ?'sidebar-link active':'sidebar-link'}`} onClick={() => { setIsActive('customers') }} to="/customers" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faUsers} />
                        </span>
                        <span className="hide-menu">Customers</span>
                    </Link>
                </li>
                
                <li className="sidebar-item">
                    <Link id="home-page"className={`${location.pathname=='/discount' ?'sidebar-link active':'sidebar-link'}`} onClick={() => { setIsActive('home-page') }} to="/discount" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faPercent} />
                        </span>
                        <span className="hide-menu">Discounts</span>
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link id="home-page"className={`${location.pathname=='/homePage' ?'sidebar-link active':'sidebar-link'}`} onClick={() => { setIsActive('home-page') }} to="/homePage" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faCubesStacked} />
                        </span>
                        <span className="hide-menu">Widgets</span>
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link id="home-page"className={`${location.pathname=='/shippingRate' ?'sidebar-link active':'sidebar-link'}`} onClick={() => { setIsActive('shippingRate') }} to="/shippingRate" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faShippingFast} />
                        </span>
                        <span className="hide-menu">Shipping Rates</span>
                    </Link>
                </li>

                <li className="sidebar-item " style={{marginTop:"auto", marginBottom:"20px"}}>
                    <Link id="home-page" className='sidebar-link' onClick={handleLogout} to="#" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        </span>
                        <span className="hide-menu">Logout</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar