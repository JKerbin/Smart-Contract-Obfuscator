import path from 'path';

const fs = require('fs').promises;
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

let metrics = new SolidityMetricsContainer("metricsContainerName", options);

export const evaluateTargetFile = async (mainWindow, directoryPath, projectName, fileName) => {
    mainWindow.webContents.send('terminal-clear');
    mainWindow.webContents.send('terminal-output', "Event: Evaluate target file");
    try {
        const projectsDir = path.resolve(directoryPath);
        const targetFile = path.join(projectsDir, projectName, fileName);
        // console.log(targetFile);

        metrics.analyze(targetFile);

        let evaluateResult = await metrics.generateReportMarkdown();

        const outputFilePath = path.join(projectsDir, 'Evaluation-Records.md')

        // 将 evaluateResult 写入新文件
        await fs.writeFile(outputFilePath, evaluateResult, 'utf8');
        mainWindow.webContents.send('terminal-output', `Evaluation result saved to ${outputFilePath}`);
    } catch (error) {
        mainWindow.webContents.send('terminal-output', error);
    }
}