<script setup>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { defineProps } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps({
    data: Object,
    options: Object,
})
</script>

<template>
    <Line :data="data" :options="options" />
</template>
