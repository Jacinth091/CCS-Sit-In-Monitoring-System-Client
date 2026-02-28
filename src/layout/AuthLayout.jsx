import {Outlet} from 'react-router'
import AuthNavbar from './Auth/AuthNavbar'
import AuthFooter from './Auth/AuthFooter'
export default function AuthLayout () {

    return (
        <div className="min-h-screen flex flex-col">
            {/* <AuthNavbar/> */}
            <main className="main-content flex-grow">
                <Outlet/>
            </main>
            {/* <AuthFooter/> */}
        </div>
    )

}