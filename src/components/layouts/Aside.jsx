import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import MainLogo from "../../assets/images/logos/sthani_logo.png"
const Aside = () => {

    return (
        <aside className="left-sidebar bg-black" style={{maxHeight:"100vh"}}>
            {/* Sidebar scroll*/}
            
                <div className="brand-logo d-flex align-items-center justify-content-between mb-3 mt-3">
                    <Link to="/dashboard" className="text-nowrap logo-img">
                        {/* <h2><strong>Dashboa</strong></h2> */}
                        <img src={MainLogo}  width="120px"/>
                    </Link>

                    <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                        <i className="ti ti-x fs-8" />
                    </div>
                </div>
                <Navbar />
            
            {/* End Sidebar scroll*/}
        </aside>
    )
}

export default Aside