/**
 * Deno Doom Recreation: Player Movement and Level Rendering
 * Using modular design following SOLID and clean code principles
 */

// --- Serve HTML for browser ---
// Read template file
const templatePath = new URL('./src/template.html', import.meta.url);
let template = "";

// Deno namespace is available when running with Deno
declare var Deno: any;

try {
  template = await Deno.readTextFile(templatePath);
} catch (error) {
  console.error("Error reading template file:", error);
  template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Deno Doom Minimal</title>
      <style>
        body { background: #222; color: #fff; margin: 0; overflow: hidden; }
        canvas { display: block; margin: 0 auto; background: #111; }
      </style>
    </head>
    <body>
      <canvas id="game" width="640" height="400"></canvas>
      <script type="module">
        console.error('Failed to load game modules');
      </script>
    </body>
    </html>
  `;
}

// Handle HTTP requests
function handleRequest(_req: Request): Response {
  return new Response(template, {
    headers: {
      "content-type": "text/html",
    },
  });
}

// Start server if this is the main module
if (import.meta.url === (globalThis.Deno?.mainModule ?? '')) {
  const port = 8080;
  
  console.log(`Deno Doom running at http://localhost:${port}/`);
  Deno.serve({ port }, handleRequest);
}
