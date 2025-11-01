import Navbar from "../components/Navbar"
import BitcoinHero from "../components/Hero"
import Footer from "../components/Footer"
import HowItWorks from "../components/HowItWorks"
import WhyRich from "../components/WhyRich"
import MapCard from "../components/Map"
// import ConnectWallet from "./components/ConnectWallet"
function Home() {
 

  return (
    <>
      {/* <ConnectWallet /> */}
      <Navbar />
      <div className="lg:mb-0"><BitcoinHero /></div>
      
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <HowItWorks />
    </div>
    <div className="pb-30 pt-0"><WhyRich  /></div>
    
    <MapCard />
    <Footer />

    
    </>
  )
}

export default Home
