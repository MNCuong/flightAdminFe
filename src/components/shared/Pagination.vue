<!-- src/components/shared/Pagination.vue -->
<template>
    <div class="flex justify-center items-center mt-4 space-x-2">
        <!-- Sửa << thành &lt;&lt; và >> thành &gt;&gt; -->
        <v-btn small @click="goToPage(1)" :disabled="currentPage === 1">&lt;&lt;</v-btn>
        <v-btn small @click="prevPage" :disabled="currentPage === 1">&lt;</v-btn>

        <!-- Duyệt số trang -->
        <v-btn
            v-for="page in paginationRange"
            :key="page"
            :color="currentPage === page ? 'primary' : 'grey'"
            small
            @click="goToPage(page)"
        >
            {{ page }}
        </v-btn>

        <v-btn small @click="nextPage" :disabled="currentPage === pageCount-1">&gt;</v-btn>
        <v-btn small @click="goToPage(pageCount-1)" :disabled="currentPage === pageCount-1">&gt;&gt;</v-btn>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    pageSize: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    }
});

const paginationRange = computed(() => {
    const range = [];
    const totalPages = pageCount.value;
    const rangeSize = 5;

    let startPage = props.currentPage - Math.floor(rangeSize / 2);
    let endPage = props.currentPage + Math.floor(rangeSize / 2);

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(rangeSize, totalPages);
    }

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - rangeSize + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        range.push(i);
    }

    return range;
});

const pageCount = computed(() => {
    return Math.ceil(props.totalItems / props.pageSize);
});

function goToPage(page) {
    emits ('update:currentPage', page);
}

function prevPage() {
    if (props.currentPage > 1) emits ('update:currentPage', props.currentPage - 1);
}

function nextPage() {
    if (props.currentPage < pageCount.value) emits ('update:currentPage', props.currentPage + 1);
}
</script>

<style scoped>
/* Style tùy chỉnh cho phân trang */
</style>
