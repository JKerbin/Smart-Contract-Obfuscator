<template>
    <header class="header">
        <div class="header-content">
            <div class="logo">
                <Logo />
            </div>

            <div class="dropdown">
                <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    File
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" @click="importProject()">Import</a></li>
                    <li><a class="dropdown-item" @click="explorer()">Explorer</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item" @click="reload()">Reload</a></li>
                    <li><a class="dropdown-item" @click="minimize()">Minimize</a></li>
                    <li><a class="dropdown-item" @click="exit()">Exit</a></li>
                </ul>
            </div>

            <div class="dropdown">
                <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Help
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" href="#">Welcome</a></li>
                    <li><a class="dropdown-item" href="#">Documentation</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item" href="#">About</a></li>
                </ul>
            </div>

            <div class="title">
                <span>SC Obfuscator</span>
            </div>

            <div class="button-container">
                <button class="button" id="obfuscate">
                    <svg t="1732105513802" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="4280" width="200" height="200">
                        <path
                            d="M264.3 141.6l275.4 179.3 284 184.8c1 0.6 3.6 2.4 3.6 6.7 0 4.3-2.6 6.1-3.6 6.7L539.8 704 264.3 883.3c-0.2-1-0.3-2.1-0.3-3.5V145.1c0-1.3 0.2-2.5 0.3-3.5M262 66.2c-36.5 0-70 32.9-70 78.9v734.6c0 46 33.5 78.9 70 78.9 11.6 0 23.6-3.3 34.8-10.7L579 764.2l284-184.8c48.5-31.6 48.5-102.5 0-134.1L579 260.5 296.9 76.9c-11.3-7.3-23.2-10.7-34.9-10.7z"
                            p-id="4281"></path>
                    </svg>
                    <span>Obfuscate</span>
                </button>
                <button class="button" id="evaluate">
                    <svg t="1732105817456" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5358" width="200" height="200">
                        <path
                            d="M704 128a32 32 0 0 1 0 64h-21.333333v160.789333a10.666667 10.666667 0 0 0 1.088 4.693334l180.874666 369.6c28.48 58.218667 4.384 128.490667-53.813333 156.970666A117.333333 117.333333 0 0 1 759.242667 896H264.746667c-64.8 0-117.333333-52.533333-117.333334-117.333333a117.333333 117.333333 0 0 1 11.946667-51.573334l180.874667-369.621333a10.666667 10.666667 0 0 0 1.088-4.693333V192h-21.333334a32 32 0 0 1-31.946666-30.122667L288 160a32 32 0 0 1 32-32z m51.968 522.666667H268.010667l-51.157334 104.554666A53.333333 53.333333 0 0 0 264.757333 832H759.253333a53.333333 53.333333 0 0 0 47.893334-76.778667L755.978667 650.666667zM618.666667 192H405.333333v160.789333a74.666667 74.666667 0 0 1-7.594666 32.821334L299.328 586.666667h425.322667l-98.389334-201.066667A74.666667 74.666667 0 0 1 618.666667 352.8V192z"
                            p-id="5359"></path>
                    </svg>
                    <span>Evaluate</span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import Logo from '../components/Logo.vue';
import { useMainStore } from '../stores/mainStore';
const mainStore = useMainStore();

function importProject() {
    // import new project
    electron.ipcRenderer.invoke('import', mainStore.projectsDirectoryPath);
}

function explorer() {
    // open explorer
    electron.ipcRenderer.invoke('explorer', mainStore.projectsDirectoryPath);
}

function reload() {
    // Reload mainWindow
    electron.ipcRenderer.invoke('reload');
}

function minimize() {
    // minimize mainWindow
    electron.ipcRenderer.invoke('minimize');
}

function exit() {
    // Exit app
    electron.ipcRenderer.invoke('exit');
}
</script>


<style scoped>
@import "../assets/navigator/nav-style.css";
</style>