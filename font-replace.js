const fs = require('fs');
const path = require('path');

const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css'];
const srcPath = path.join(__dirname, 'frontend', 'src');

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
  
  if (content.includes('Jost')) {
    content = content.replace(/Jost/g, 'Inter');
    changed = true;
  }
  
  if (content.includes('var(--font-jost)')) {
    content = content.replace(/var\(--font-jost\)/g, "'Inter'");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated font in ${file}`);
  }
});
