import React from 'react';
import assets from '../../assets/assets';

const IconButton = ({ src, alt, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-14 h-14 flex items-center justify-center rounded-xl transition-colors ${
        active
          ? 'bg-gradient-to-r from-white/20 to-yellow-500/20 ring-1 ring-yellow-400'
          : 'hover:bg-white/5'
      }`}
    >
      <img src={src} alt={alt} className="w-7 h-7 object-contain" />
    </button>
  );
};

const SupportSidebar = () => {
  return (
    <aside className="w-36 bg-black border-r border-gray-900 flex flex-col items-center py-6 gap-6 h-screen">
      <img src={assets.Rich} alt="Rich" className="w-24 h-auto" />
      <div className="w-px h-1 bg-gray-800" />
      <div className="flex flex-col items-center gap-6 flex-grow-0">
        <IconButton src={assets.wallet} alt="Wallet" onClick={() => (window.location.hash = '')} />
        <IconButton src={assets.dashboard} alt="Dashboard" onClick={() => (window.location.hash = '')} />
        <IconButton src={assets.traders} alt="Traders" />
        <IconButton src={assets.markets} alt="Markets" />
        <IconButton src={assets.settings} alt="Settings" />
        <IconButton src={assets.support} alt="Support" active onClick={() => (window.location.hash = '#/support')} />
        <IconButton src={assets.pools} alt="Pools"/>
      </div>
     
      <div className="flex-grow" />
    </aside>
  );
};

export default SupportSidebar;