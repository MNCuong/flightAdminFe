<template>
    <v-text-field
        v-model="searchQuery"
        :label="label"
        :placeholder="placeholder"
        @input="handleSearch"
        class="mb-4"
        clearable
    />
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// Định nghĩa các props có thể thay đổi như: placeholder, label
const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
        required: false,
        default: 'Nhập từ khóa...',
    },
});

const emit = defineEmits(['update:searchQuery']);

const searchQuery = ref('');

const handleSearch = () => {
    emit('update:searchQuery', searchQuery.value);
};
</script>

<style scoped>
</style>
