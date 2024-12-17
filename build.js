import { exec } from "child_process";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { join, relative, extname } from "path";

const srcDir = "./src";
const distDir = "./dist";

// Crear carpeta dist si no existe
if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
}

// Función para compilar archivos SCSS de manera recursiva
function compileSCSS(dir) {
    readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        const fullPath = join(dir, entry.name);
        const relativePath = relative(srcDir, fullPath);
        const distPath = join(distDir, relativePath.replace(/\.scss$/, ""));

        if (entry.isDirectory()) {
            // Crear subcarpeta en dist si no existe
            if (!existsSync(distPath)) {
                mkdirSync(distPath, { recursive: true });
            }
            compileSCSS(fullPath);
        } else if (entry.isFile() && extname(entry.name) === ".scss") {
            // Compilar archivo CSS normal
            exec(`sass ${fullPath} ${distPath}.css --no-source-map`, (err) => {
                if (err) console.error(`Error compilando ${distPath}.css:`, err);
            });

            // Compilar archivo CSS minificado
            exec(`sass ${fullPath} ${distPath}.min.css --style=compressed --no-source-map`, (err) => {
                if (err) console.error(`Error compilando ${distPath}.min.css:`, err);
            });
        }
    });
}

compileSCSS(srcDir);

