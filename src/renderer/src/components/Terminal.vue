<template>
    <div class="terminal-interface">
        <div class="head-bar">
            <span>- Terminal</span>
            <div v-if="terminalShow === false" @click="mainStore.setTerminalShow(true)"
                class="terminal-status show-terminal">
                <svg t="1732352883127" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="18768" width="200" height="200">
                    <path
                        d="M74.74432 658.2784L950.52032 658.2784c30.72 0 56.78080001-18.5344 68.096-48.4352a77.824 77.824 0 0 0-17.92-84.1728l-437.8624-431.872a70.656 70.656 0 0 0-100.4032 0l-437.9136 431.872c-22.3744 22.0672-29.2352 54.272-17.8688 84.1728 11.3152 29.9008 37.376 48.4352 68.096 48.4352zM949.90592 804.5568l-876.8512 0a73.1136 73.1136 0 0 0 0 146.3296L949.90591999 950.8864a73.1136 73.1136 0 0 0 1e-8-146.3296z"
                        p-id="18769"></path>
                </svg>
            </div>
            <div v-if="terminalShow === true" @click="mainStore.setTerminalShow(false)"
                class="terminal-status unshow-terminal">
                <svg t="1732352883127" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="18768" width="200" height="200">
                    <path
                        d="M74.74432 658.2784L950.52032 658.2784c30.72 0 56.78080001-18.5344 68.096-48.4352a77.824 77.824 0 0 0-17.92-84.1728l-437.8624-431.872a70.656 70.656 0 0 0-100.4032 0l-437.9136 431.872c-22.3744 22.0672-29.2352 54.272-17.8688 84.1728 11.3152 29.9008 37.376 48.4352 68.096 48.4352zM949.90592 804.5568l-876.8512 0a73.1136 73.1136 0 0 0 0 146.3296L949.90591999 950.8864a73.1136 73.1136 0 0 0 1e-8-146.3296z"
                        p-id="18769"></path>
                </svg>
            </div>
        </div>
        <div v-if="terminalShow === true" class="content-container">
            <div class="content custom-scroll" :style="{ height: contentHeight + 'vh' }">
                <div class="resize-handle" @click="resizeContent()">
                    <svg t="1732635046067" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2725" width="200" height="200">
                        <path
                            d="M863.744 896h-224.256c-17.92 0-31.744-14.336-31.744-31.744s14.336-31.744 31.744-31.744h192.512v-640h-640v190.976c0 17.92-14.336 32.256-32.256 32.256S128 400.896 128 383.488V160.256c0-17.92 14.336-32.256 32.256-32.256h704c17.92 0 31.744 14.336 31.744 32.256v704c0 17.408-14.336 31.744-32.256 31.744z"
                            p-id="2726"></path>
                        <path
                            d="M482.304 896h-322.56c-17.92 0-32.256-14.336-32.256-31.744v-322.56c0-17.92 14.336-32.256 32.256-32.256h322.56c17.92 0 32.256 14.336 32.256 32.256v322.56c0 17.408-14.336 31.744-32.256 31.744z m-290.304-64H450.56V573.44H192v258.56z"
                            p-id="2727"></path>
                    </svg>
                </div>
                <div class="content-inner">
                    <div v-for="(line, index) in terminalOutput" :key="index" class="terminal-line">
                        {{ line }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useMainStore } from '../stores/mainStore';

const mainStore = useMainStore();
const terminalShow = computed(() => mainStore.terminalShow);

// Terminal output state
const terminalOutput = ref([]);

// Dynamic height state
const contentHeight = ref(27);
const minHeight = 27;
const maxHeight = 50;

let largerTerminal = false;
let startY = 0;
let startHeight = 0;

// Resize content
function resizeContent() {
    if (!largerTerminal) {
        contentHeight.value = maxHeight;
        largerTerminal = true
    } else {
        contentHeight.value = minHeight;
        largerTerminal = false;
    }
};

// Listen to main process
onMounted(() => {
    electron.ipcRenderer.on('terminal-clear', () => {
        terminalOutput.value = [];
    });

    electron.ipcRenderer.on('terminal-output', (event, data) => {
        mainStore.setTerminalShow(true);
        terminalOutput.value.push(data);

        // Keep showing the newest
        setTimeout(() => {
            const contentElement = document.querySelector('.content.custom-scroll');
            if (contentElement) {
                contentElement.scrollTop = contentElement.scrollHeight;
            }
        }, 0);
    });
});

// Clear listener
onUnmounted(() => {
    electron.ipcRenderer.removeAllListeners('terminal-output');
});
</script>

<style scoped>
@import "../assets/terminal/terminal-style.css";
</style>
