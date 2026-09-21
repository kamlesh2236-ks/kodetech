import React from 'react'
import Hero from './component/Hero'
import Project from './component/Project'
import Testimonial from './component/Testimonial'
import Contact from './component/Contact'
import Footer from './component/Footer'
import Services from './component/services'
import Packages from './component/Packages'
import HowWeWork from './component/HowweWork'

const App = () => {
  return (
    <>
      <Hero />
      <Services />
      <Packages />
      <Project />
      <HowWeWork />
      <Testimonial />
      <Contact />
      <Footer />
    </>
  )
}

export default App
