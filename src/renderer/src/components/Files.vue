<template>
    <div class="list-group">
        <div v-for="[folder, files] in projects" :key="folder">
            <!-- Top-level folder -->
            <div class="list-group-item folder-item" data-bs-toggle="collapse" :data-bs-target="'#' + folder"
                aria-expanded="false">
                <span>- {{ folder }}</span>
                <div class="delete-btn" @click="deleteProject(folder)">
                    <svg t="1732377934600" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="19791" width="200" height="200">
                        <path
                            d="M354.133333 418.133333c-17.066667 0-34.133333 12.8-34.133333 34.133334v341.333333c0 17.066667 12.8 34.133333 34.133333 34.133333s29.866667-17.066667 29.866667-34.133333v-341.333333c0-21.333333-12.8-34.133333-29.866667-34.133334zM512 418.133333c-17.066667 0-34.133333 12.8-34.133333 34.133334v341.333333c0 17.066667 12.8 34.133333 34.133333 34.133333s34.133333-12.8 34.133333-34.133333v-341.333333c0-21.333333-17.066667-34.133333-34.133333-34.133334zM640 452.266667v341.333333c0 17.066667 12.8 34.133333 34.133333 34.133333s34.133333-12.8 34.133334-34.133333v-341.333333c0-17.066667-12.8-34.133333-34.133334-34.133334s-34.133333 12.8-34.133333 34.133334z"
                            p-id="19792"></path>
                        <path
                            d="M938.666667 128h-213.333334v-21.333333C725.333333 46.933333 678.4 0 618.666667 0h-213.333334C345.6 0 298.666667 46.933333 298.666667 106.666667V128H85.333333c-25.6 0-42.666667 17.066667-42.666666 42.666667s17.066667 42.666667 42.666666 42.666666h42.666667v704C128 977.066667 174.933333 1024 234.666667 1024h554.666666c59.733333 0 106.666667-46.933333 106.666667-106.666667V213.333333h42.666667c25.6 0 42.666667-17.066667 42.666666-42.666666s-17.066667-42.666667-42.666666-42.666667zM384 106.666667c0-12.8 8.533333-21.333333 21.333333-21.333334h213.333334c12.8 0 21.333333 8.533333 21.333333 21.333334V128H384v-21.333333z m426.666667 810.666666c0 12.8-8.533333 21.333333-21.333334 21.333334h-554.666666c-12.8 0-21.333333-8.533333-21.333334-21.333334V213.333333h597.333334v704z"
                            p-id="19793"></path>
                    </svg>
                </div>
            </div>
            <!-- Nested items -->
            <div class="collapse nested-list" :id="folder">
                <div v-for="file in files" :key="file" class="nested-item" @click="handleFileClick(folder, file)">
                    <span>- {{ file }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMainStore } from '../stores/mainStore';
const projects = ref([]);
const mainStore = useMainStore();

// Request the main process to fetch folders and files
async function fetchProjects() {
    const result = await electron.ipcRenderer.invoke('get-projects', mainStore.projectsDirectoryPath);
    projects.value = Array.from(result.entries());
}

// Load file content
async function handleFileClick(folder, file) {
    const filePath = `${mainStore.projectsDirectoryPath}/${folder}/${file}`;
    const fileType = file.substr(-3, 3);
    mainStore.setSelectedFile({ folder, file, fileType });
    const content = await electron.ipcRenderer.invoke('log-file-content', filePath);
    mainStore.setFileContent(content);
}

function deleteProject(folder) {
    electron.ipcRenderer.invoke('delete-projects', mainStore.projectsDirectoryPath, folder);
}

// Refresh projects list
fetchProjects();
setInterval(() => {
    fetchProjects();
}, 1000);
</script>


<style scoped>
@import "../assets/explorer/viewer-style.css";
</style>