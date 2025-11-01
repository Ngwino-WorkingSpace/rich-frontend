import React from "react";
import assets from "../assets/assets";
import gsap from "gsap";
import { useGSAP } from "@gsap/react"
import { useNavigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger)
const BitcoinHero = () => {
  const navigate = useNavigate();


      useGSAP(() => {
   gsap.from("#text", {
      opacity: 0,
      y: 70,
      duration: 5,
      delay: 0.5,
      ease: "powerOut.In"
    }
    )
  }, []);


  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between bg-black text-white px-6 md:px-16 lg:px-24 py-12 md:py-10">
  
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold leading-snug mb-6 lg:ml-20"  id="text" >
          Invest in Bitcoin<br />
          Together Fairly<br />
          and Transparently.
        </h1>
        <p className="text-gray-300 text-lg mb-8 lg:ml-20">
          Create a global pool of investors and own.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start lg:ml-20">
          <button onClick={() => navigate("/create-pool")} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition">
            Create a pool
          </button>
          <button  className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold px-6 py-3 rounded-full transition">
            How it works
          </button>
        </div>
      </div>

     
      <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0 relative">
      
       <div className="relative w-[90vw] h-[60vw] md:w-[60vw] md:h-[45vw] max-w-[800px] max-h-[400px]">

      
            <img src={assets.earth} alt="" id="globe" />

     
        </div>
      </div>
    </section>
  );
};

export default BitcoinHero;
