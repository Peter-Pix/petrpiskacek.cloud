const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function createOG() {
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Dark Background
    ctx.fillStyle = '#09090b'; // zinc-950
    ctx.fillRect(0, 0, width, height);

    // Brand Gold Accent line
    ctx.strokeStyle = '#c8962e';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(100, 315);
    ctx.lineTo(1100, 315);
    ctx.stroke();

    // Text
    ctx.fillStyle = '#c8962e';
    ctx.font = 'bold 80px Inter, sans-serif, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Petr Piskáček', width / 2, height / 2 - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '50px Inter, sans-serif, Arial';
    ctx.fillText('AI Playground', width / 2, height / 2 + 60);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('public/og-image.png', buffer);
    console.log('Saved public/og-image.png');
}

createOG().catch(console.error);
