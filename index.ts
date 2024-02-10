import {
  cpSync,
  readdirSync,
  renameSync,
  mkdirSync,
  rmdirSync,
  writeFileSync,
  readFileSync,
} from "fs";
import { join, basename } from "path";

const pathsArray = [
  "C:/Work/slides-app/public/ergorefon",
  "C:/Work/slides-app/public/rengalin",
  "C:/Work/slides-app/public/tenoten",
  "C:/Work/slides-app/public/tenoten-kids",
  "C:/Work/slides-app/public/anaferon_kids",
  "C:/Work/slides-app/public/anaferon",
];

const dirname = "C:/Work/slides-scripts/slides";

const imagesPath = "C:/Work/slides-app/public/static";

const slidesAppPath = "C:/Work/clm";

const copyParentFiles = (): void => {
  pathsArray.forEach((sourcePath) => {
    try {
      const destinationSubPath = join(dirname, basename(sourcePath));
      mkdirSync(destinationSubPath, { recursive: true });

      cpSync(sourcePath, destinationSubPath, {
        recursive: true,
      });

      // Get all directories in the destination sub path
      const directories = readdirSync(destinationSubPath, {
        withFileTypes: true,
      })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      // Iterate over each directory
      for (const dir of directories) {
        const oldPath = join(destinationSubPath, dir, "index.html");
        let newName = dir;

        // Extract the slide number from the directory name
        const slideNumber = parseInt(dir.split("-")[0]);

        // If the slide number is between 29 and 41, reduce it by 1
        if (slideNumber >= 29 && slideNumber <= 41) {
          newName = `${slideNumber - 1}${dir.slice(dir.indexOf("-"))}`;
        }

        const newPath = join(dirname, `${newName}.html`);

        // Rename the file
        renameSync(oldPath, newPath);

        // Read the file content
        let content = readFileSync(newPath, "utf8");

        // Replace all occurrences of '/static/' with 'static/'
        content = content.replace(/\/static\//g, "static/");

        // Write the modified content back to the file
        writeFileSync(newPath, content, "utf8");
      }

      // Remove the subdirectory
      rmdirSync(destinationSubPath, { recursive: true });
    } catch (error) {
      throw new Error(error);
    }
  });
};

const copyFiles = (source: string, destination: string): void => {
  try {
    cpSync(source, destination, {
      recursive: true,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const runApp = (): void => {
  copyParentFiles();

  copyFiles(dirname, slidesAppPath);
  copyFiles(imagesPath, `${slidesAppPath}/static`);
};

runApp();
