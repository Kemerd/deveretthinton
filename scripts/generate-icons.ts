import sharp from 'sharp';

async function generateIcons() {
    const sizes = [16, 32, 64, 192, 512];
    const source = './src/assets/logo.png'; // Your source logo

    for (const size of sizes) {
        await sharp(source)
            .resize(size, size)
            .toFile(`./public/logo${size}.png`);
    }

    // Generate favicon.ico (multi-size)
    await sharp(source)
        .resize(32, 32)
        .toFile('./public/favicon.ico');
}

generateIcons().catch(console.error); 