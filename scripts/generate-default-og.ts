/** Generate the static 1200x630 editorial Open Graph image. */
import path from 'path';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

function buildSvg(): string {
  const thesis = [
    'Building accountable AI systems',
    'that survive contact with',
    'production.',
  ].map(escapeXml);

  return `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="#f7f4ee" />
      <rect x="72" y="70" width="56" height="4" fill="#006b4d" />
      <text x="72" y="112" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="2.4" fill="#006b4d">
        DAKOTA SMITH / PRINCIPAL ARCHITECT
      </text>
      <text x="72" y="230" font-family="Georgia, serif" font-size="62" font-weight="700" letter-spacing="-1.8" fill="#14211c">
        ${thesis[0]}
      </text>
      <text x="72" y="305" font-family="Georgia, serif" font-size="62" font-weight="700" letter-spacing="-1.8" fill="#14211c">
        ${thesis[1]}
      </text>
      <text x="72" y="380" font-family="Georgia, serif" font-size="62" font-weight="700" letter-spacing="-1.8" fill="#14211c">
        ${thesis[2]}
      </text>
      <line x1="72" y1="465" x2="1128" y2="465" stroke="#d4cec2" stroke-width="2" />
      <text x="72" y="515" font-family="Arial, sans-serif" font-size="21" font-weight="600" letter-spacing="1" fill="#5d665f">
        AI SYSTEMS · INNOVATION STRATEGY · ACCOUNTABLE DELIVERY
      </text>
      <text x="1128" y="570" text-anchor="end" font-family="Arial, sans-serif" font-size="21" font-weight="700" letter-spacing="1.2" fill="#14211c">
        daksmith.dev
      </text>
    </svg>
  `;
}

async function main() {
  const outputPath = path.join(process.cwd(), 'public', 'og-default.png');
  await sharp(Buffer.from(buildSvg())).png({ quality: 92 }).toFile(outputPath);
  const stats = await import('fs').then((fs) => fs.promises.stat(outputPath));
  console.log(`Generated: ${outputPath} (${WIDTH}x${HEIGHT}, ${(stats.size / 1024).toFixed(1)}KB)`);
}

main().catch((error: unknown) => {
  console.error('Failed to generate default OG image:', error);
  process.exit(1);
});
