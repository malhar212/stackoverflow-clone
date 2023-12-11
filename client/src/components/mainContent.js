import React from 'react';
// Main content component for each page
export default function MainContent({children}) {
    return (
      <div id="content" className="main">
       {children}
      </div>
    );
  }