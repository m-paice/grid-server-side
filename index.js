const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Parâmetros da grid (ajustar conforme necessário ou obter de uma entrada do usuário)
const gridSize = 2; // Escolha entre 2, 3 ou 4 para a grid (2x2, 3x3, 4x4)
const numImages = gridSize * gridSize;

// URLs das imagens
const imageUrls = [
  'https://vitruveo-studio-qa-assets.s3.amazonaws.com/6660f1425a6df2113d340d1e/1723582658101.jpeg',
  'https://vitruveo-studio-qa-assets.s3.amazonaws.com/6660f1425a6df2113d340d1e/1723582658101.jpeg',
  'https://vitruveo-studio-qa-assets.s3.amazonaws.com/6660f1425a6df2113d340d1e/1723582658101.jpeg',
  'https://vitruveo-studio-qa-assets.s3.amazonaws.com/6660f1425a6df2113d340d1e/1723582658101.jpeg',
].slice(0, numImages); // Ajusta o número de URLs de acordo com a grid

// Tamanho da imagem final (ajuste conforme necessário)
const width = 800; // Largura total da grid
const height = 800; // Altura total da grid
const gap = 20; // Espaço entre as imagens (em pixels)
const tileWidth = (width - (gridSize - 1) * gap) / gridSize; // Largura de cada imagem na grid
const tileHeight = (height - (gridSize - 1) * gap) / gridSize; // Altura de cada imagem na grid

// Função para baixar uma imagem
async function fetchImage(url) {
  const response = await axios({ url, responseType: 'arraybuffer' });
  return loadImage(response.data);
}

// Função principal para gerar a grid de imagens
async function createImageGrid() {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Baixa todas as imagens
  const images = await Promise.all(imageUrls.map(fetchImage));

  // Desenha as imagens na grid
  images.forEach((image, index) => {
    const x = (index % gridSize) * (tileWidth + gap);
    const y = Math.floor(index / gridSize) * (tileHeight + gap);
    ctx.drawImage(image, x, y, tileWidth, tileHeight);
  });

  // Salva a imagem como um arquivo PNG
  const out = fs.createWriteStream(path.join(__dirname, `grid_${gridSize}x${gridSize}.png`));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`A grid ${gridSize}x${gridSize} PNG foi salva.`));
}

createImageGrid().catch(console.error);
