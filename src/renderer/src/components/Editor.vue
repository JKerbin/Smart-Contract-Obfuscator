<template>
    <div v-if="selectedFile" class="editor-container">
        <div class="head-bar">
            <div class="title">
                <span>{{ selectedFile.folder }}</span>
                <div style="color: #8cba93;">&nbsp->&nbsp</div>
                <span>{{ selectedFile.file }}</span>
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
</script>

<style scoped>
@import "../assets/editor/editor-style.css";
</style>
