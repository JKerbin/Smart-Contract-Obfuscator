import { dialog } from 'electron';
import { spawn, ChildProcessWithoutNullStreams, exec } from 'child_process';
import fs from 'fs';
import path from 'path';

let terminalProcess: ChildProcessWithoutNullStreams | null = null;

/**
 * Import new project
 * @param mainWindow Window object
 * @param directoryPath ProjectDir
 */
export const importProject = async (mainWindow, directoryPath) => {
    mainWindow.webContents.send('terminal-clear');
    mainWindow.webContents.send('terminal-output', "Event: Import new project");

    const result = dialog.showOpenDialog({
        title: "Select a File",
        properties: ["openFile"],
    });
    const filePath = (await result).filePaths[0];

    if (filePath === undefined) {
        mainWindow.webContents.send('terminal-output', "Event: Abort importing");
    } else {
        try {
            // Get the file name without extension
            const fileName = path.basename(filePath, path.extname(filePath));
            const projectsDir = path.resolve(directoryPath);
            const projectFolder = path.join(projectsDir, fileName);

            // Ensure the projects directory exists
            if (!fs.existsSync(projectsDir)) {
                fs.mkdirSync(projectsDir, { recursive: true });
            }

            // Create the project folder
            if (!fs.existsSync(projectFolder)) {
                fs.mkdirSync(projectFolder);
            }

            // Copy the file to the project folder with a new name
            const destinationPath = path.join(projectFolder, 'original-code.sol');
            fs.copyFileSync(filePath, destinationPath);

            mainWindow.webContents.send('terminal-output', `File imported to: ${destinationPath}`);
            mainWindow.webContents.send('terminal-output', 'Generating abstract syntax tree...');

            if (terminalProcess) {
                terminalProcess.kill(); // Kill the existing process
                terminalProcess = null; // Clear the variable
            }

            terminalProcess = spawn('bin\\solc\\solc-windows.exe', ['--ast-compact-json', '-o', projectFolder, destinationPath], {
                shell: true, // Enable shell commands
            });

            // Capture standard output
            terminalProcess.stdout.on('data', (data: Buffer) => {
                mainWindow.webContents.send('terminal-output', data.toString());
            });

            // Capture standard error
            terminalProcess.stderr.on('data', (data: Buffer) => {
                mainWindow.webContents.send('terminal-output', data.toString());
            });

            // Listen for process close
            terminalProcess.on('close', (code: number) => {
                mainWindow.webContents.send('terminal-output', "\n");
                mainWindow.webContents.send('terminal-output', `Terminal exited with code ${code}`);
                terminalProcess = null; // Reset the process variable
            });
        } catch (error) {
            mainWindow.webContents.send('terminal-output', error);
            mainWindow.webContents.send('terminal-output', "Possible reasons include existing projects with the same name or lack of administrator rights");
        }

    }
};

/**
 * Delete selected project
 * @param mainWindow Window object
 * @param directoryPath ProjectDir
 * @param projectName Selected project
 */
export const deleteProject = async (mainWindow, directoryPath, projectName) => {
    // Get the file name without extension
    const projectFolder = path.basename(projectName, path.extname(projectName));
    const projectsDir = path.resolve(directoryPath);
    const deleteTarget = path.join(projectsDir, projectFolder);

    // Alert
    const response = await dialog.showMessageBox(mainWindow, {
        type: 'warning',
        buttons: ['Yes', 'No'],
        defaultId: 1,
        cancelId: 1,
        title: 'Confirm Deletion',
        message: 'The file will be deleted from the computer. Are you sure you want to delete it?',
        detail: `This will permanently delete the folder: \n${deleteTarget}`,
    });

    // Cancel
    if (response.response !== 0) {
        return;
    }

    try {
        // Delete
        fs.rmSync(deleteTarget, { recursive: true, force: true });
    } catch (error) {
        mainWindow.webContents.send('terminal-output', error);
        mainWindow.webContents.send('terminal-output', "Possible reasons include lack of administrator rights");

    }
};

/**
 * Open explorer of projects
 * @param directoryPath ProjectDir
 */
export const openExplorer = (directoryPath) => {
    const projectsDir = path.resolve(directoryPath);
    console.log(projectsDir);

    // Platform: Windows？
    const openCommand = process.platform === 'win32' ? 'explorer' : process.platform === 'darwin' ? 'open' : 'xdg-open';

    // Open file explorer
    exec(`${openCommand} "${projectsDir}"`, (error) => {
        if (error) {
            console.error(`Failed to open file explorer: ${error.message}`);
        } else {
            console.log(`File explorer opened at: ${projectsDir}`);
        }
    });
};