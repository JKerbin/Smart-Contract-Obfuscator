import path from 'path';
import fs from 'fs';

const { SolidityMetricsContainer } = require('solidity-code-metrics');

let options = {
    basePath: "",
    inputFileGlobExclusions: undefined,
    inputFileGlob: undefined,
    inputFileGlobLimit: undefined,
    debug: false,
    repoInfo: {
        branch: undefined,
        commit: undefined,
        remote: undefined
    }
}

export const evaluateTargetFile = (mainWindow, directoryPath, projectName, fileName) => {
    let metrics = new SolidityMetricsContainer("metricsContainerName", options);
    mainWindow.webContents.send('terminal-clear');
    mainWindow.webContents.send('terminal-output', "Event: Evaluate target file");
    try {
        const projectsDir = path.resolve(directoryPath);
        const targetFile = path.join(projectsDir, projectName, fileName);
        // console.log(targetFile);

        metrics.analyze(targetFile);

        let evaluateResult = metrics.totals()['avg'];
        mainWindow.webContents.send('terminal-output', `Evaluation Result For ${projectName}/${fileName}:`);
        mainWindow.webContents.send('terminal-output', '___________________________________________');
        mainWindow.webContents.send('terminal-output', `Total Lines:         | ${evaluateResult['sloc']['total']}`);
        mainWindow.webContents.send('terminal-output', `Source-code Lines:   | ${evaluateResult['sloc']['source']}`);
        mainWindow.webContents.send('terminal-output', `Comment Lines:       | ${evaluateResult['sloc']['comment']}`);
        mainWindow.webContents.send('terminal-output', `Single Comments:     | ${evaluateResult['sloc']['single']}`);
        mainWindow.webContents.send('terminal-output', `Block Comments:      | ${evaluateResult['sloc']['block']}`);
        mainWindow.webContents.send('terminal-output', `Mixed Comments:      | ${evaluateResult['sloc']['mixed']}`);
        mainWindow.webContents.send('terminal-output', `TODO Comments:       | ${evaluateResult['sloc']['todo']}`);
        mainWindow.webContents.send('terminal-output', '___________________________________________');
        mainWindow.webContents.send('terminal-output', `* Complexity Score:  | ${evaluateResult['complexity']['perceivedNaiveScore']}`);
        mainWindow.webContents.send('terminal-output', '___________________________________________');
        mainWindow.webContents.send('terminal-output', 'PS: "Complexity Score" is a custom complexity score Solidity-Code-Metrics evaluation tool.');
        mainWindow.webContents.send('terminal-output', '    It is derived from code statements that are known to introduce code complexity (branches, loops, calls, external interfaces, ...).');
        mainWindow.webContents.send('terminal-output', '    For more information about Solid-Code-metrics, refer to: "https://github.com/Consensys/solidity-metrics".');
    } catch (error) {
        mainWindow.webContents.send('terminal-output', error);
    }
}