<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true,  // Nếu muốn chắc chắn rằng prop là bắt buộc
    }
});
</script>

<template>
    <v-card elevation="10">
        <v-card-item class="py-4 px-6">
            <div class="d-sm-flex align-center justify-space-between">
                <v-card-title class="text-h5 font-weight-semibold">{{ props.title }}</v-card-title>
                <slot name="action"></slot>
            </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text>
            <slot />
        </v-card-text>
    </v-card>
</template>
