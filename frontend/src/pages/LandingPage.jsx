import NavBar from '../components/Landing/NavBar'
import Hero from '../components/Landing/Hero'
import Features from '../components/Landing/Features'
import Footer from '../components/Landing/Footer'

const LandingPage = () => {
  return (
    <div className='min-h-screen'>
        <NavBar />
        <Hero />
        <Features />
        <Footer />
    </div>
  )
}

export default LandingPage
