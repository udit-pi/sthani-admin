import Aside from './Aside'
import Header from './Header'
import { ToastContainer} from 'react-toastify';


const Layout = ({ children }) => {


    return (
        <div className="page-wrapper bg-white" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
            data-sidebar-position="fixed" data-header-position="fixed">
            <Aside />
            <div className="body-wrapper">
                
                <div className="" style={{minHeight:"100vh", padding:"20px 25px"}}>
                    {children}
                   
                </div>
            </div>
        </div>
    )
}

export default Layout