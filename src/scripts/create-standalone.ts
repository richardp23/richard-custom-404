import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';

// Paths - using proper Node.js path resolution
const rootDir: string = process.cwd();
const distDir: string = path.join(rootDir, 'dist');
const sourceDir: string = path.join(distDir, 'source');
const htmlFile: string = path.join(sourceDir, 'index.html');
const outputFile: string = path.join(distDir, '404.html');

/**
 * Create a standalone HTML file with inlined CSS and JavaScript
 */
async function createStandaloneFile(): Promise<void> {
  console.log('Creating standalone 404.html file...');
  
  try {
    // Ensure the dist directory exists
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Read the HTML file
    let htmlContent: string = fs.readFileSync(htmlFile, 'utf8');

    // Find all script tags with src attributes
    const scriptRegex: RegExp = /<script[^>]*src="([^"]*)"[^>]*><\/script>/g;
    let scriptMatches: RegExpExecArray | null;

    while ((scriptMatches = scriptRegex.exec(htmlContent)) !== null) {
      const fullScriptTag: string = scriptMatches[0];
      const scriptSrc: string = scriptMatches[1];
      
      // Get the absolute path to the script file
      const scriptPath: string = path.join(sourceDir, scriptSrc);
      
      if (fs.existsSync(scriptPath)) {
        // Read the script content
        const scriptContent: string = fs.readFileSync(scriptPath, 'utf8');
        
        // Replace the script tag with an inline script
        htmlContent = htmlContent.replace(
          fullScriptTag, 
          `<script>${scriptContent}</script>`
        );
        
        console.log(`✅ Inlined script: ${scriptSrc}`);
      } else {
        console.warn(`⚠️ Script file not found: ${scriptPath}`);
      }
    }

    // Find all link tags for stylesheets
    const styleRegex: RegExp = /<link[^>]*rel="stylesheet"[^>]*href="([^"]*)"[^>]*>/g;
    let styleMatches: RegExpExecArray | null;

    while ((styleMatches = styleRegex.exec(htmlContent)) !== null) {
      const fullLinkTag: string = styleMatches[0];
      const styleSrc: string = styleMatches[1];
      
      // Skip external stylesheets (like Google Fonts)
      if (styleSrc.startsWith('http')) {
        console.log(`⏩ Skipping external stylesheet: ${styleSrc}`);
        continue;
      }
      
      // Get the absolute path to the CSS file
      const stylePath: string = path.join(sourceDir, styleSrc);
      
      if (fs.existsSync(stylePath)) {
        // Read the CSS content
        const styleContent: string = fs.readFileSync(stylePath, 'utf8');
        
        // Replace the link tag with an inline style
        htmlContent = htmlContent.replace(
          fullLinkTag, 
          `<style>${styleContent}</style>`
        );
        
        console.log(`✅ Inlined stylesheet: ${styleSrc}`);
      } else {
        console.warn(`⚠️ Stylesheet file not found: ${stylePath}`);
      }
    }

    // Format the HTML with prettier for readability
    console.log('🎨 Formatting HTML output...');
    const formattedHTML = await prettier.format(htmlContent, {
      parser: 'html',
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      singleQuote: false,
      htmlWhitespaceSensitivity: 'css',
      bracketSameLine: false,
      endOfLine: 'lf'
    });

    // Write the formatted HTML to the output file
    fs.writeFileSync(outputFile, formattedHTML);
    console.log(`📄 Created standalone file: ${outputFile}`);
    
    console.log('✨ Standalone build completed successfully!');
  } catch (error) {
    console.error('❌ Error creating standalone file:', error);
    process.exit(1);
  }
}

// Execute the function
createStandaloneFile().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 