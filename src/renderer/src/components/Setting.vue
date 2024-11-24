<template>
    <div class="list-group">
        <!-- Top-level folder -->
        <div class="list-group-item folder-item" data-bs-toggle="collapse" data-bs-target="#themes-folder"
            aria-expanded="false">
            <span>- Themes</span>
        </div>
        <!-- Nested items -->
        <div class="collapse nested-list" id="themes-folder">
            <div class="nested-item" @click="changeTheme('light')">
                <span>- Light Default</span>
            </div>
            <div class="nested-item" @click="changeTheme('dark')">
                <span>- Dark Default</span>
            </div>
        </div>

        <!-- Top-level folder -->
        <div class="list-group-item folder-item" data-bs-toggle="collapse" data-bs-target="#src-folder"
            aria-expanded="false">
            - Info
        </div>
        <!-- Nested items -->
        <div class="collapse nested-list" id="src-folder">
            <div class="nested-item">
                <span>- Documentation</span>
            </div>
            <div class="nested-item">
                <span>- About Us</span>
            </div>
        </div>
    </div>
</template>

<script setup>
// Change themes
const changeTheme = (theme) => {
    if (theme === "light") {
        document.documentElement.style.setProperty("--board-color", "#fff");
        document.documentElement.style.setProperty("--bar-color", "#f6f6f2");
        document.documentElement.style.setProperty("--title-color", "#c0c0c0");
        document.documentElement.style.setProperty("--font-color", "#808080");
    }
    else if (theme === "dark") {
        document.documentElement.style.setProperty("--board-color", "#393939");
        document.documentElement.style.setProperty("--bar-color", "#2e2e2e");
        document.documentElement.style.setProperty("--title-color", "#505050");
        document.documentElement.style.setProperty("--font-color", "#e0e0e0");
    }
};
</script>

<style scoped>
@import "../assets/explorer/viewer-style.css";
</style>