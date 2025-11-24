import sharp from "sharp";
import { glob } from "glob"; // O 'glob' pode ser necessário para encontrar os arquivos
import path from "path";
import fs from "fs/promises";

// Re-instale o glob se o tiver removido no passo 1
// npm install --save-dev glob

async function optimizeImages() {
  // Encontra todos os arquivos de imagem na pasta public
  const imagePaths = await glob("public/**/*.{png,jpg,jpeg}");

  if (imagePaths.length === 0) {
    console.log("ℹ️ Nenhuma imagem encontrada para otimização.");
    return;
  }

  console.log(`🖼️  Encontradas ${imagePaths.length} imagens para otimizar...`);

  const optimizationPromises = imagePaths.map(async (imagePath) => {
    const fileBuffer = await fs.readFile(imagePath);
    const outputFileName = `${path.parse(imagePath).name}.webp`;
    const outputDir = path.dirname(imagePath);
    const outputPath = path.join(outputDir, outputFileName);

    try {
      await sharp(fileBuffer)
        .webp({ quality: 80 }) // Converte para WebP com 80% de qualidade
        .toFile(outputPath);
      console.log(`✅ Otimizado: ${imagePath} -> ${outputPath}`);
    } catch (error) {
      console.error(`❌ Falha ao otimizar ${imagePath}:`, error);
    }
  });

  await Promise.all(optimizationPromises);
  console.log("✨ Otimização de imagens concluída!");
}

optimizeImages().catch(console.error);
