import { useState, useEffect } from "react";
import { CreditCard, Plus, Search, Upload } from "lucide-react";
import assets from "../assets/assets";

const EFYCard = () => {
  const [balance] = useState(782.00);
  const [selectedLinkedCard, setSelectedLinkedCard] = useState(null);
  const [isAddingCVV, setIsAddingCVV] = useState(false);
  const [showFileSearch, setShowFileSearch] = useState(false);
  const [sortBy, setSortBy] = useState("transaction");

  const linkedCards = [
    { id: 1, type: "VISA", lastFour: "+1343", amount: 110.00 },
    { id: 2, type: "VISA", lastFour: "+1343", amount: 110.00 },
  ];


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAddingCVV(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleLinkedCardHover = (id) => {
    setSelectedLinkedCard(id === selectedLinkedCard ? null : id);
  };

  const handleSortHover = (field) => {
    setSortBy(field);
  };

  const handleFileSearchHover = () => {
    setShowFileSearch(true);
    setTimeout(() => setShowFileSearch(false), 2000);
  };

  const getCardColor = (id) => {
    return id === selectedLinkedCard ? "border-accent" : "border-[#f5c755]";
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          0% { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideInLeft {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulseSubtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes rotateSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseHover {
          0% { box-shadow: 0 0 0 0 rgba(245, 199, 85, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(245, 199, 85, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 199, 85, 0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.5s ease-out forwards; }
        .animate-pulse-subtle { animation: pulseSubtle 2s infinite; }
        .animate-bounce-subtle { animation: bounceSubtle 1.5s infinite; }
        .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-rotate-slow { animation: rotateSlow 20s linear infinite; }
        .animate-spin-slow { animation: spinSlow 2s linear infinite; }
        .animate-pulse-hover { animation: pulseHover 1.5s infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .group-hover\\:animate-pulse-subtle .group:hover & { animation: pulseSubtle 2s infinite; }
        .group-hover\\:animate-bounce-subtle .group:hover & { animation: bounceSubtle 1.5s infinite; }
        .hover\\:animate-spin-slow:hover { animation: spinSlow 2s linear infinite; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
      <div className="bg-card border-3 border-[#f5c755] rounded-2xl p-4 sm:p-6 w-full max-w-[378px] mx-auto relative group overflow-hidden
                      transform transition-all duration-700 ease-out
                      hover:scale-[1.02] 
                      animate-pulse-subtle">
  
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 transition-colors duration-300 group-hover:text-[#f5c755] animate-fade-in-up">
          EFV Card
        </h3>

        <div className="bg-gradient-to-br from-[#f5c755]/20 to-[#f5c755]/5 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 transition-all duration-500 group-hover:from-[#f5c755]/30 group-hover:to-[#f5c755]/10 animate-slide-in-left delay-100">
          <p className="text-2xl sm:text-3xl font-bold text-[#f5c755] mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-105 group-hover:text-accent-foreground animate-scale-in delay-200">
            {formatAmount(balance)}
          </p>

        
          <div className="flex flex-col mb-3 sm:mb-4 animate-slide-in-right delay-300">
            <p className="text-sm sm:text-md text-muted-foreground mb-2 transition-colors duration-300 group-hover:text-[#f5c755] animate-fade-in-up">
              Linked Cards
            </p>
            <div className="flex flex-col space-y-2">
              {linkedCards.map((card, index) => (
                <div
                  key={card.id}
                  onMouseEnter={() => handleLinkedCardHover(card.id)}
                  onMouseLeave={() => handleLinkedCardHover(null)}
                  className={`border ${getCardColor(card.id)} rounded-md p-2 transition-all duration-300 ease-out hover:bg-[#f5c755]/10 hover:scale-105 flex items-center justify-between group/card animate-float delay-${index * 100}`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-[#f5c755] group-hover/card:animate-spin-slow" />
                    <span className="text-xs sm:text-sm font-medium text-foreground group-hover/card:text-[#f5c755] truncate transition-all duration-300 hover:translate-x-1">
                      {card.type} {card.lastFour}
                    </span>
                  </div>
                  <span className={`text-xs sm:text-sm font-medium transition-all duration-300 ease-out hover:scale-110 hover:text-[#f5c755] animate-pulse-subtle ${
                    card.id === selectedLinkedCard ? "text-[#f5c755]" : "text-[#f5c755]"
                  }`}>
                    {formatAmount(card.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

    
        <button
  className="w-[200px] mx-auto mb-4 block border border-[#f5c755] bg-[#ECC86D4D] text-primary-foreground py-2 sm:py-1 rounded-lg font-medium ease-out hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300"
>
  <Plus size={14} />
  {isAddingCVV ? "Adding..." : "Add Card"}
</button>


        <div className="flex flex-col sm:flex-row justify-between mb-2 animate-slide-in-left delay-500">
          <button
            onMouseEnter={() => handleSortHover("transaction")}
            className={`font-medium transition-all duration-300 ease-out hover:text-[#f5c755] hover:underline flex-1 text-left mr-0 sm:mr-2 mb-2 sm:mb-0 text-sm  ${
              sortBy === "transaction" ? "text-[#f5c755]" : "text-gray-200"
            }`}
          >
            Transaction
          </button>
          <button
            onMouseEnter={() => handleSortHover("notes")}
            className={`font-medium transition-all duration-300 ease-out hover:text-[#f5c755] hover:underline flex-1 text-right text-sm animate-wiggle ${
              sortBy === "notes" ? "text-[#f5c755]" : "text-gray-200"
            }`}
          >
            Notes
          </button>
        </div>

        <div className="border-t border-gray-600 mb-2 transition-opacity duration-300 group-hover:opacity-70 animate-fade-in-up delay-600"></div>


        <div className="flex justify-center mb-1">
          <img
            src={assets.GoldBars}
            alt="icon"
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain transition-all duration-500 hover:scale-125 hover:rotate-12 animate-rotate-slow"
            onMouseEnter={handleFileSearchHover}
          />
        </div>

        <div className="relative animate-slide-in-right delay-700">
          <p className={`text-center text-xs sm:text-sm transition-colors duration-300 ${
            showFileSearch ? "text-[#f5c755]" : "text-gray-400"
          } hover:animate-wiggle`}>
            {showFileSearch ? "Searching..." : "File Not Found"}
          </p>
          {showFileSearch && (
            <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-[#f5c755]/90 text-accent-foreground px-2 py-1 rounded text-xs shadow-lg animate-pulse-subtle z-10">
              <Upload size={10} className="inline mr-1 animate-spin-slow" /> Uploading...
            </div>
          )}
        </div>

       
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5c755]/5 to-muted/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-2xl pointer-events-none animate-pulse-slow">
          <div className="absolute top-0 left-0 w-full h-full animate-pulse-slow"></div>
        </div>
      </div>
    </>
  );
};

export default EFYCard;