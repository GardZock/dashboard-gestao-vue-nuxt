<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ChartData,
    type Point
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, Filler)

const { data, options, height, width } = defineProps<{
    data: ChartData<"line", (number | Point | null)[], unknown>,
    options?: any,
    height: string,
    width: string
}>()

</script>

<template>
    <Line class="rounded-md" :data="data" :options="options" :height="height" :width="width" />
</template>
