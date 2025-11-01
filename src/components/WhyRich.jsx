import React from "react";
import assets from "../assets/assets";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const WhyRich = () => {
      useGSAP(() => {
   gsap.from("#card1", {
      opacity: 0,
      y: 70,
      duration: 3,
      delay: 0.2,
      ease: "power3.inOut",
      rotatex: 10,
    }
    )
  }, []);
        useGSAP(() => {
   gsap.from("#card2", {
      opacity: 0,
      y: 30,
      duration: 3,
      delay: 0.1,
      ease: "power3.in",
      rotateY: 20,
    }
    )
  }, []);
        useGSAP(() => {
   gsap.from("#card3", {
      opacity: 0,
      y: 70,
      duration: 3,
      delay: 0.3,
      ease: "power3.inOut",
      rotateX: 10,
    }
    )
  }, []);
        useGSAP(() => {
   gsap.from("#card4", {
      opacity: 0,
      y: 90,
      duration: 3,
      delay: 0.1,
      ease: "power3.in",
      rotateY: 20,
    }
    )
  }, []);
  return (
    <section className="bg-black text-white py-10 px-6 flex flex-col items-center">
      {/* Title */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <h2 className="text-4xl md:text-5xl font-semibold text-center">
          Why
        </h2>
        <img
          src={assets.logo}
          alt="Rich Logo"
          className="w-28 md:w-36 opacity-80 hover:opacity-100 cursor-pointer object-contain"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full" id="card1">
       
        <div className="border border-yellow-400 rounded-2xl p-6 flex flex-col items-center text-center bg-black/30 shadow-lg">
          <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center">
            <img src={assets.dollar} alt="" />
          </div>
          <h3 className="text-yellow-400 text-xl font-semibold mb-2">
            Affordable
          </h3>
          <p className="text-gray-300 text-sm">
            Join the pool with as little as $10 and grow from there. Simple,
            fair, and open to everyone.
          </p>
        </div>

        <div className="border border-yellow-400 rounded-2xl p-6 flex flex-col items-center text-center bg-black/30 shadow-lg" id="card2">
          <div className="w-12 h-12 mb-4 flex items-center justify-center">
            <img src={assets.increase} alt="" />
          </div>
          <h3 className="text-yellow-400 text-xl font-semibold mb-2">
            Earn as You Hold
          </h3>
          <p className="text-gray-300 text-sm">
            Holding pool tokens isn’t just ownership ; it’s participation. You
            benefit directly from the growth and performance of the pool.
          </p>
        </div>

  
        <div className="border border-yellow-400 rounded-2xl p-6 flex flex-col items-center text-center bg-black/30 shadow-lg" id="card3">
          <div className="w-12 h-12 mb-4 flex items-center justify-center">
            <img src={assets.mobile} alt="" />
          </div>
          <h3 className="text-yellow-400 text-xl font-semibold mb-2">
            Secure
          </h3>
          <p className="text-gray-300 text-sm">
            Your funds are handled by verified smart contracts, removing human
            error and ensuring every action is recorded safely on-chain.
          </p>
        </div>

        <div className="border border-yellow-400 rounded-2xl p-6 flex flex-col items-center text-center bg-black/30 shadow-lg" id="card4">
          <div className="w-12 h-12 mb-4 flex items-center justify-center">
            <img src={assets.timer} alt="" />
          </div>
          <h3 className="text-yellow-400 text-xl font-semibold mb-2">
            Instant
          </h3>
          <p className="text-gray-300 text-sm">
            Transactions and rewards happen in real time — no waiting, no
            delays. Participate and see results instantly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyRich;
