import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Eye } from "lucide-react";

const TransactionsCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const availableBalance = 82326.23;

  const transactions = [
    { id: 1, coin: "USDT", date: "20/08/24", amount: 3000, status: "success" },
    { id: 2, coin: "BTC", date: "20/08/24", amount: 5000, status: "success" },
    { id: 3, coin: "ETH", date: "20/08/24", amount: 1000, status: "success" },
    { id: 4, coin: "USDC", date: "20/08/24", amount: 500, status: "pending" },
    { id: 5, coin: "CARDANO", date: "20/08/24", amount: 250, status: "success" },
    { id: 6, coin: "USDT", date: "20/08/24", amount: 1500, status: "success" },
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const displayedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusIconAndColor = (status) => {
    if (status === "success") {
      return { icon: CheckCircle, bg: "bg-green-100", text: "text-green-800", iconColor: "text-green-600" };
    } else if (status === "pending") {
      return { icon: Clock, bg: "bg-yellow-100", text: "text-yellow-800", iconColor: "text-yellow-600" };
    }
    return { icon: null, bg: "bg-gray-100", text: "text-gray-800", iconColor: "text-gray-600" };
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.5s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.5s ease-out forwards; }
        .animate-pulse-subtle { animation: pulseSubtle 2s infinite; }
        .animate-bounce-subtle { animation: bounceSubtle 1.5s infinite; }
        .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-rotate-slow { animation: rotateSlow 20s linear infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .group-hover\\:animate-pulse-subtle .group:hover & { animation: pulseSubtle 2s infinite; }
        .group-hover\\:animate-bounce-subtle .group:hover & { animation: bounceSubtle 1.5s infinite; }
      `}</style>
      <div className="bg-card border-3 border-[#FFB803] rounded-2xl p-4 sm:p-6 w-full max-w-[30rem] relative group overflow-hidden
                      transform transition-all duration-700 ease-out
                      hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/20
                      animate-pulse-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 relative z-20 animate-fade-in-up">
          <div className="transition-all duration-300 group-hover:translate-x-1 mb-3 sm:mb-0 animate-slide-in-left delay-100">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 animate-scale-in">Latest Transactions</h3>
            <p className="text-[20px] sm:text-sm text-accent transition-colors duration-300 group-hover:text-accent-foreground animate-slide-in-right delay-200">
              Available Balance: {formatAmount(availableBalance)}
            </p>
          </div>
          <button
            className="text-xs sm:text-sm text-accent hover:underline transition-all duration-200 hover:scale-105 flex items-center gap-1 justify-center sm:justify-start group-hover:text-accent-foreground mt-2 sm:mt-0 animate-wiggle delay-300"
          >
            View All
          </button>
        </div>

    <div className="relative z-20 animate-slide-in-up delay-400">

  <div className="hidden sm:grid grid-cols-3 text-yellow-400 font-semibold text-sm border-b border-yellow-400/40 pb-2 mb-3">
    <span>Type</span>
    <span className="text-center">Date</span>
    <span className="text-right">Value (USD)</span>
  </div>

  <div className="space-y-3">
    {displayedTransactions.map((tx, index) => {
      const { icon: StatusIcon, bg, text, iconColor } = getStatusIconAndColor(tx.status);
      return (
        <div
          key={tx.id}
          className={`grid grid-cols-1 sm:grid-cols-3 items-center py-3 border-b border-border/50 last:border-0
            rounded-lg px-3 sm:px-4 transition-all duration-300 ease-out hover:bg-yellow-400/5 
            hover:scale-[1.01] hover:shadow-sm animate-float delay-[${index * 100}ms]`}
        >
        
          <div className="flex items-center gap-3">
        
            <div className="flex flex-col ml-3">
              <p className="text-sm font-medium text-foreground truncate">{tx.coin}</p>
            </div>
          </div>

         
          <div className="hidden sm:flex justify-center text-xs text-muted-foreground">
            {tx.date}
          </div>

          
          <div className="flex justify-end text-sm font-medium text-foreground">
            {formatAmount(tx.amount)}
          </div>
        </div>
      );
    })}
  </div>
</div>


        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 relative z-20 flex-wrap animate-slide-in-left delay-500">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-7 sm:w-8 h-7 sm:h-8 bg-secondary border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-all duration-300 ease-out hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-pulse-subtle"
          >
            <ChevronLeft size={14} className="text-accent group-hover:animate-bounce-subtle" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 ease-out hover:scale-110 animate-wiggle ${
                num === currentPage
                  ? "bg-accent text-primary-foreground shadow-md hover:shadow-lg animate-pulse-subtle"
                  : "bg-secondary border border-border text-foreground hover:bg-muted"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="w-7 sm:w-8 h-7 sm:h-8 bg-secondary border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-all duration-300 ease-out hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-pulse-subtle"
          >
            <ChevronRight size={14} className="text-accent group-hover:animate-bounce-subtle" />
          </button>
        </div>

        <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground z-10 animate-fade-in-up delay-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </>
  );
};

export default TransactionsCard;