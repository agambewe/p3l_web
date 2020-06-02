<template>
<v-app class="full-height">
    <!-- <link rel="manifest" href="../public/manifest.json"> -->
    <main class="full-height">
        <router-view></router-view>
    </main>
</v-app>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style>
html, body {
    height: 100%;
}

.full-height {
    height: 100%;
}
</style>