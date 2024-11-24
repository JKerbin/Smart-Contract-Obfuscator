import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

let terminalProcess: ChildProcessWithoutNullStreams | null = null;

export const obfuscateTargetProject = async (mainWindow, directoryPath, projectName) => {
    mainWindow.webContents.send('terminal-clear');
    mainWindow.webContents.send('terminal-output', "Event: Obfuscate target project");
    try {
        const projectsDir = path.resolve(directoryPath);
        const targetProject = path.join(projectsDir, projectName);
        const codeURL = path.join(targetProject, 'original-code.sol');
        const astURL = path.join(targetProject, 'original-code.sol_json.ast');

        terminalProcess = spawn('bin\\obf\\obfuscator.exe', ['-fobf=opaque', `-output=${targetProject}\\output-code.sol`, codeURL, astURL], {
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

        setTimeout(() => {
            mainWindow.webContents.send('terminal-output', "\nEvent: Generate AST of output code");
        }, 1000);

        setTimeout(() => {
            terminalProcess = spawn('bin\\solc\\solc-windows.exe', ['--ast-compact-json', '-o', targetProject, `${targetProject}\\output-code.sol`], {
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
                mainWindow.webContents.send('terminal-output', `\nTerminal exited with code ${code}`);
                terminalProcess = null; // Reset the process variable
            });
        }, 2000);
    } catch (error) {
        mainWindow.webContents.send('terminal-output', error);
    }
}