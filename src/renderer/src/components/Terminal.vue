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
        <div v-if="terminalShow === true" class="content custom-scroll">
            <div class="content-inner">
                <!-- 使用 v-for 循环显示每一行输出 -->
                <div v-for="(line, index) in terminalOutput" :key="index" class="terminal-line">
                    {{ line }}
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

// 保存控制台输出内容
const terminalOutput = ref([]);

// 监听主进程传来的控制台输出
onMounted(() => {
    electron.ipcRenderer.on('terminal-clear', (event, data) => {
        terminalOutput.value = [];
    });

    electron.ipcRenderer.on('terminal-output', (event, data) => {
        mainStore.setTerminalShow(true)
        // 将新数据加入输出数组，确保滚动显示
        terminalOutput.value.push(data);

        // 保持滚动到最新内容
        setTimeout(() => {
            const contentElement = document.querySelector('.content.custom-scroll');
            if (contentElement) {
                contentElement.scrollTop = contentElement.scrollHeight;
            }
        }, 0);
    });
});

// 清理监听器
onUnmounted(() => {
    electron.ipcRenderer.removeAllListeners('terminal-output');
});
</script>

<style scoped>
@import "../assets/terminal/terminal-style.css";
</style>
