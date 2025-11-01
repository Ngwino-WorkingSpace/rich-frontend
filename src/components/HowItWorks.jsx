import React from "react";
import assets from "../assets/assets";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


const HowItWorks = () => {
 
    useGSAP(() => {
   gsap.from("#paragraph-cards", {
      opacity: 0,
      y: 70,
      duration: 5,
      ease: "power3.inOut",
      rotate: 10,
    }
    )
  }, []);
  return (
    <section className="bg-[#2a2828] text-white py-16 px-6 md:px-20 rounded-[20px] border-t-4 border-b-4 border-[#d8a92600] relative">
      <div className="absolute inset-0 rounded-[20px] border-2 border-[#ffcc00] pointer-events-none"></div>

      <div className="relative z-10 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#ffcc00] mb-4">
          How It Works
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto text-sm md:text-base leading-relaxed" >
          Everything runs through a smart contract transparent, secure, and
          automated. You simply contribute stablecoins, and the system takes care
          of the rest. The contract pools everyone's funds, buys Bitcoin on-chain,
          and issues pool tokens that represent your share. You can monitor your
          balance in real time and withdraw anytime with a single click.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" id="paragraph-cards">
 
        <div className="bg-black rounded-2xl p-6 border border-[#ffcc00] hover:shadow-lg hover:shadow-[#ffcc0044] transition-all">
          <div className="flex justify-center mb-4">
            <img
              src={assets.link}
              alt="Join & Contribute"
              className="w-30 h-30"
            />
          </div>
          <h3 className="font-semibold text-lg mb-2">Join & Contribute</h3>
          <p className="text-gray-300 text-sm">
            Add your stablecoins to the shared pool and become part of a
            collective investment powered by smart contracts.
          </p>
        </div>


        <div className="bg-black rounded-2xl p-6 border border-[#ffcc00] hover:shadow-lg hover:shadow-[#ffcc0044] transition-all" id="paragraph-cards">
          <div className="flex justify-center mb-4">
            <img
              src={assets.bitcoin}
              alt="Automated Bitcoin Purchase"
              className="w-30 h-30"
            />
          </div>
          <h3 className="font-semibold text-lg mb-2">
            Automated Bitcoin Purchase
          </h3>
          <p className="text-gray-300 text-sm">
            The smart contract automatically uses the pooled funds to buy Bitcoin
            — no manual steps, no middlemen, just transparent blockchain execution.
          </p>
        </div>

        <div className="bg-black rounded-2xl p-6 border border-[#ffcc00] hover:shadow-lg hover:shadow-[#ffcc0044] transition-all" id="paragraph-cards">
          <div className="flex justify-center mb-4">
            <img
              src={assets.save}
              alt="Earn & Withdraw Anytime"
              className="w-30 h-30"
            />
          </div>
          <h3 className="font-semibold text-lg mb-2">Earn & Withdraw Anytime</h3>
          <p className="text-gray-300 text-sm">
            You receive pool tokens that represent your share. Track your growth,
            and when you're ready, withdraw instantly — no waiting, no restrictions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
