<template>
    <div>
        <div class="background"></div>
        <Nav />
        <div class="logo-background">
            <Logo />
        </div>
        <main class="content">
            <div class="explorer">
                <Explorer />
            </div>
            <div class="eventvwr">
                <div class="editor">
                    <Editor />
                </div>
                <div class="terminal">
                    <Terminal />
                </div>
            </div>
        </main>
        <Footer />
    </div>
</template>

<script setup>
import Nav from '../components/Nav.vue';
import Logo from '../components/Logo.vue';
import Explorer from '../components/Explorer.vue';
import Editor from '../components/Editor.vue';
import Footer from '../components/Footer.vue';
import Terminal from '../components/Terminal.vue';
</script>

<style scoped>
@import "../assets/main.css";
</style>
