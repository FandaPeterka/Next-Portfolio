// LedMatrixWorker.js

// Posloucháme na zprávy z hlavního vlákna
self.onmessage = async (e) => {
    const { imageData, resolution, edgeThreshold } = e.data;
    const { width, height, data } = imageData;
  
    // Převedeme pixely na grayscale
    const gray = new Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const val = (data[i] + data[i+1] + data[i+2]) / 3;
        gray[y * width + x] = val;
      }
    }
  
    // Edge detection
    const pixels = [];
    for (let y = resolution; y < height - resolution; y += resolution) {
      for (let x = resolution; x < width - resolution; x += resolution) {
        const idx = y * width + x;
        const current = gray[idx];
        const left    = gray[y * width + (x - 1)];
        const right   = gray[y * width + (x + 1)];
        const top     = gray[(y - 1) * width + x];
        const bottom  = gray[(y + 1) * width + x];
        const isEdge =
          Math.abs(current - left)   > edgeThreshold ||
          Math.abs(current - right)  > edgeThreshold ||
          Math.abs(current - top)    > edgeThreshold ||
          Math.abs(current - bottom) > edgeThreshold;
        pixels.push(isEdge);
      }
    }
  
    // Šířka matic
    const matrixWidth = Math.ceil((width - 2*resolution) / resolution);
  
    // Pošleme data zpět
    self.postMessage({ pixels, width: matrixWidth });
  };