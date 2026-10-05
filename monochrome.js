const fs = require('fs');
const path = require('path');

const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css'];
const srcPath = path.join(__dirname, 'frontend', 'src');

// Color mapping
const colorMap = {
  '#FBFAF7': '#F7F7F5', // off-white
  '#FAF7F2': '#F7F7F5',
  '#EDE7DE': '#D9D9D9', // stone -> light-grey
  '#B76E79': '#2A2A2A', // rose -> dark-grey
  '#8F4F5A': '#0A0A0A', // deep rose -> soft-black
  '#c9c2b4': '#777777',
  '#27302E': '#000000',
  'var(--rose)': 'var(--dark-grey)',
  'var(--rose-deep)': 'var(--soft-black)',
  'var(--stone)': 'var(--light-grey)',
  'var(--ivory)': 'var(--off-white)',
  'var(--ink)': 'var(--pure-black)'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (extensions.includes(path.extname(filePath))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(srcPath);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    // Escape for regex
    const regex = new RegExp(oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(content)) {
      content = content.replace(regex, newColor);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
