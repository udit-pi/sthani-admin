import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShop, faTicketSimple } from '@fortawesome/free-solid-svg-icons'


const Navbar = () => {

    const [isActive, setIsActive] = useState('');
    const navigate = useNavigate()
    // console.log(isActive);

    // const handleLinkClick = (link) => {
    //     setIsActive(link)
    //     // navigate(link)
    // }

    return (
        <nav className="sidebar-nav scroll-sidebar" data-simplebar>
            <ul id="sidebarnav">
                <li className="sidebar-item">
                    <Link id="dashboard" className={isActive === 'dashboard' ? 'sidebar-link active' : 'sidebar-link'} onClick={() =>  setIsActive('dashboard') } to="/dashboard" aria-expanded="false">
                        <span>
                            <i className="ti ti-layout-dashboard" />
                        </span>
                        <span className="hide-menu">Home</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link id="category" className={isActive === 'category' ? 'sidebar-link active' : 'sidebar-link'} onClick={() =>  setIsActive('category') } to="/category" aria-expanded="false">
                        <span>
                            <i className="ti ti-folder" />
                        </span>
                        <span className="hide-menu">Category</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link id="brand" className={isActive === 'brand' ? 'sidebar-link active' : 'sidebar-link'} onClick={() =>  setIsActive('brand') } to="/brand" aria-expanded="false">
                        <span>
                            <i className="ti ti-package" />
                        </span>
                        <span className="hide-menu">Brand</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link id="product" className={isActive === 'product' ? 'sidebar-link active' : 'sidebar-link'} onClick={() =>  setIsActive('product') } to="/product" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faShop} />
                        </span>
                        <span className="hide-menu">Product</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link id="properties" className={isActive === 'properties' ? 'sidebar-link active' : 'sidebar-link'} onClick={() =>  setIsActive('properties') } to="/properties" aria-expanded="false">
                        <span>
                        <FontAwesomeIcon icon={faTicketSimple} />
                        </span>
                        <span className="hide-menu">Product Properties</span>
                    </Link>
                </li>
                <li className="sidebar-item">
                    <Link id="dashboard" className={isActive === 'users' ? 'sidebar-link active' : 'sidebar-link'} onClick={() => { setIsActive('users') }} to="/users" aria-expanded="false">
                        <span>
                            <i className="ti ti-users" />
                        </span>
                        <span className="hide-menu">Users</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar