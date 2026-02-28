import {Outlet} from 'react-router'
import Navbar from './Root/Navbar'
import Footer from './Root/Footer'
export default function Layout () {

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>

            <main className="main-content flex-grow">
                <Outlet/>
            </main>

            <Footer/>
        </div>
    )

}