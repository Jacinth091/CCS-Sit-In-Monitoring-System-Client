import {Outlet} from 'react-router'
export default function Layout () {

    return (
        <div className="layout-container">

            <main className="main-content">
                <Outlet/>
            </main>
        </div>
    )

}