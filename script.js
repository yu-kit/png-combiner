document.getElementById('combineButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const columns = parseInt(document.getElementById('columnsInput').value, 10);

    if (!files.length) {
      alert("Please select PNG files.");
      return;
    }
    if (isNaN(columns) || columns < 1) {
      alert("Please enter a valid number of columns.");
      return;
    }
    
    // Load images
    const images = await Promise.all(
      Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      })
    );
  
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
  
    // カラムをもとにキャンパスサイズを計算
    const totalWidth = Math.max(...images.map(img => img.width)) * columns;
    const rows = Math.ceil(images.length / columns);
    const totalHeight = Math.max(...images.map(img => img.height)) * rows;
    canvas.width = totalWidth;
    canvas.height = totalHeight;
  
    // 画像をキャンバスに描画
    let xOffset = 0;
    let yOffset = 0;
    images.forEach((img, index) => {
      context.drawImage(img, xOffset, yOffset);
      xOffset += img.width;
      
      // Move to next row if end of column is reached
      if ((index + 1) % columns === 0) {
        xOffset = 0;
        yOffset += img.height;
      }
    });
  
    // PNGとしてエクスポート
    const combinedImage = canvas.toDataURL("image/png");
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = combinedImage;
    downloadLink.download = "combined.png";
    downloadLink.style.display = "inline";
    downloadLink.textContent = "Download Combined Image";
  });
  
