import React, { useState, useEffect } from 'react';
import './index.css'; // If you want to keep the external CSS

const Loader = () => {
  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
     <div className="loader-container">
      <span className="loader2"></span>
    </div>
    </div>
    </>
   
    
  );
};

export default  Loader;
