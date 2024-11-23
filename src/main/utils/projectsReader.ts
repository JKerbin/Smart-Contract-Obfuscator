import fs from 'fs';
import path from 'path';

/**
 * Gets all folders and their files in the specified path.
 * @param directoryPath Relative path.
 * @returns A Map where keys are folder names and values are arrays of file names.
 */
export const getProjects = (directoryPath: string): Map<string, string[]> => {
    const result = new Map<string, string[]>();

    const fullPath = path.resolve(directoryPath); // Convert to absolute path
    const items = fs.readdirSync(fullPath, { withFileTypes: true });

    // Filter for directories
    const folders = items.filter(item => item.isDirectory());

    folders.forEach(folder => {
        const folderPath = path.join(fullPath, folder.name);
        const files = fs.readdirSync(folderPath, { withFileTypes: true })
            .filter(item => item.isFile())
            .map(item => item.name);

        result.set(folder.name, files);
    });

    return result;
};

/**
 * Load and log the content of a file.
 * @param filePath The relative or absolute path to the file.
 * @returns A promise resolving with the file content.
 */
export const loadInFile = async (filePath: string): Promise<string> => {
    const fullPath = path.resolve(filePath); // Convert to absolute path
    const content = fs.readFileSync(fullPath, 'utf8'); // Read file content
    return content;
};