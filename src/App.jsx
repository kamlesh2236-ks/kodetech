import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from './components/Hero'
import Project from './components/Project'
import Testimonial from './components/Testimonial'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Services from './components/services'
import Packages from './components/Packages'
import HowweWork from './components/HowweWork'
import Login from "./pages/Login";


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
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App