<template>
    <v-app-bar class="header " >
        <v-toolbar-title>Admin Dashboard</v-toolbar-title>
    </v-app-bar>

    <v-main class="main ">
        <v-card class="fila">
            <v-card-title>Conteúdo do Dashboard Administrativo</v-card-title>
            <v-card-text>
                <!-- Adicione aqui os componentes e funcionalidades do dashboard administrativo -->
                <p>Esta é a área administrativa do dashboard.</p>
            </v-card-text>
        </v-card>
    </v-main>
</template>

<script setup lang="ts">

</script>

<style scoped>
    .main {
        height: 300vh;
        background-color: blueviolet;
        padding: 1rem;
    }
    .header {
        height: 15vh;
        position: relative !important;
    }

</style>