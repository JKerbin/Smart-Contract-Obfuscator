<template>
    <div v-if="selectedFile" class="editor-container">
        <div class="head-bar">
            <div class="title">
                <span>{{ selectedFile.folder }}</span>
                <div style="color: #8cba93;">&nbsp->&nbsp</div>
                <span>{{ selectedFile.file }}</span>

                <div class="close-btn" @click="closeEditor()">
                    <svg t="1732419409935" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="4516" width="200" height="200">
                        <path
                            d="M1023.662 117.6 910.868 4.81 514.889 400.774 116.515 2.42 3.717 115.207l398.374 398.354L4.915 910.723l112.795 112.795 397.179-397.164 395.979 395.964 112.795-112.795L627.683 513.561 1023.662 117.6z"
                            p-id="4517"></path>
                    </svg>
                </div>
            </div>
        </div>
        <div class="content custom-scroll">
            <div v-if="selectedFile.fileType === 'sol'" class="text-content">{{ fileContent }}</div>
            <div v-else-if="selectedFile.fileType === 'ast'">
                <JsonTreeGraph />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '../stores/mainStore';
import JsonTreeGraph from './JsonTreeGraph.vue';

const mainStore = useMainStore();
const selectedFile = computed(() => mainStore.selectedFile);
const fileContent = computed(() => mainStore.fileContent);

function closeEditor() {
    mainStore.setSelectedFile(null);
}
</script>

<style scoped>
@import "../assets/editor/editor-style.css";
</style>
