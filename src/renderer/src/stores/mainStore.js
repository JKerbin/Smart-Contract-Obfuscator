import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
    state: () => ({
        selectedFile: null, // file informaton
        fileContent: null, // file content
        terminalShow: false, // show terminal
        projectsDirectoryPath: 'projects',
    }),
    actions: {
        setSelectedFile(fileInfo) {
            this.selectedFile = fileInfo;
        },
        setFileContent(content) {
            this.fileContent = content;
        },
        setTerminalShow(show) {
            this.terminalShow = show;
        }
    },
});
