<script setup >
import { RouterLink } from 'vue-router';
import logo from '@/assets/images/logos/logo.jpg';
</script>
<template>
    <div class="logo">
        <RouterLink to="/">
            <img :src="logo" alt="home"  style="width: 100%"/>
        </RouterLink>
    </div>
</template>
