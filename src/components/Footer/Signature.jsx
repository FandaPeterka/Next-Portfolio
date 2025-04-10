// Signature.jsx
import React, { useState, useEffect } from 'react';

const Signature = () => {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    fetch('/signature.svg')
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch((err) => console.error('Chyba při načítání SVG:', err));
  }, []);

  return (
    <div className="signature" aria-hidden="true">
      {svgContent && <div dangerouslySetInnerHTML={{ __html: svgContent }} />}
    </div>
  );
};

export default Signature;