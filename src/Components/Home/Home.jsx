import React from 'react'
import Hero from './Hero/Hero'
import Starred from './Starred/Starred'
import About from './About/About'
import Contact from './Contact/Contact'

function Home() {
  return (
    <>
      <Hero/>
      <Starred/>
      <About />
      <Contact />
    </>
  )
}

export default Home