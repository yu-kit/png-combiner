document.getElementById('combineButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    if (!files.length) {
      alert("Please select PNG files.");
      return;
    }
  
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
  
    // 計算: 結合後のキャンバスのサイズを決定（縦に連結する場合）
    const totalWidth = Math.max(...images.map(img => img.width));
    const totalHeight = images.reduce((sum, img) => sum + img.height, 0);
    canvas.width = totalWidth;
    canvas.height = totalHeight;
  
    // 画像をキャンバスに描画
    let yOffset = 0;
    for (const img of images) {
      context.drawImage(img, 0, yOffset);
      yOffset += img.height;
    }
  
    // PNGとしてエクスポート
    const combinedImage = canvas.toDataURL("image/png");
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = combinedImage;
    downloadLink.download = "combined.png";
    downloadLink.style.display = "inline";
    downloadLink.textContent = "Download Combined Image";
  });
  