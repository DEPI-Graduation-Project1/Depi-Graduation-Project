import { Outlet } from 'react-router-dom'
import Header from '../Common/Header'
import Footer from '../Common/Footer'

const UserLayout = () => {
  return (
 <>
 {/* Header */}
 <Header/>
 {/* Main content */}
 <main>
  <Outlet/>
 </main>
 {/* Footer components */}
 <Footer/>

 </>
  )
}

export default UserLayout
