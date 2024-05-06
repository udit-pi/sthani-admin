import Aside from './Aside'
import Header from './Header'
import { ToastContainer} from 'react-toastify';


const Layout = ({ children }) => {


    return (
        <div className="page-wrapper bg-light" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
            data-sidebar-position="fixed" data-header-position="fixed">
            <Aside />
            <div className="body-wrapper">
                <Header />
                <div className="container-fluid" style={{minHeight:"100vh"}}>
                    {children}
                   
                </div>
            </div>
        </div>
    )
}

export default Layout