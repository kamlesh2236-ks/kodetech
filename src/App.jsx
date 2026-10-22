import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Hero from './components/Hero'
import Project from './components/Project'
import Testimonial from './components/Testimonial'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Services from './components/services'
import Packages from './components/Packages'
import HowweWork from './components/HowweWork'
import ProtectedRoute from "./components/protectedRoute";
import Login from "./pages/Login";
import Career from "./pages/Career";
import AdminLayout from "./layouts/AdminLayout";
import { ADMIN_ROUTES } from "./config/adminRoutes";

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <Packages />
      <Project />
      <HowweWork />
      <Testimonial />
      <Contact />
      <Footer />
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/career"element={<Career />}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            {ADMIN_ROUTES.map(({ path, element: Page }) => (
              <Route key={path} path={path} element={<Page />} />
            ))}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App