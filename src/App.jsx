import React, { useState, useEffect } from 'react';
import ArticleForm from './components/ArticleForm';

function App() {
  const [isWhiteBackground, setIsWhiteBackground] = useState(true);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setIsWhiteBackground(prev => !prev);
  //   }, 5000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const backgroundStyle = {
    backgroundColor: isWhiteBackground ? '#ffffff' : '#000000',
    color: isWhiteBackground ? '#000000' : '#ffffff',
    minHeight: '100vh',
  };

  return (
    <div style={backgroundStyle}>
      <div className="container">
        <h1 style={{ color: isWhiteBackground ? '#000000' : '#ffffff' }}>Aggiungi articoli</h1>
        <ArticleForm />
      </div>
    </div>
  );
}

export default App;
