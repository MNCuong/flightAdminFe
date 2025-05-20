<template>
    <v-dialog v-model="visible" width="300">
        <v-card>
            <v-card-text class="text-center py-4">
                <v-progress-circular indeterminate color="primary" />
                <p class="mt-2">
                    {{ $t('labels.loading') }}</p>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
.v-card-text {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
