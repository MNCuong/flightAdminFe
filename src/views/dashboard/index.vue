<template>
    <v-container class="dashboard">
        <v-row class="mb-4" style="height: 300px">
            <v-col cols="12" md="6">
                <v-card class="p-2" style="height: 300px">
                    <v-card-title>Booking Trend</v-card-title>
                    <!-- Vue component cho BarChart -->
                    <BarChart :chart-data="barData" :options="chartOptions" />
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="p-2" style="height: 300px">
                    <v-card-title>Revenue Distribution</v-card-title>
                    <!-- Vue component cho PieChart -->
                    <PieChart :chart-data="pieData" :options="chartOptions" />
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-4">
            <v-col cols="12" md="6" fill-height>
                <v-card class="p-2" style="height: 300px">
                    <v-card-title>Monthly Sales</v-card-title>
                    <!-- Vue component cho LineChart -->
                    <LineChart :chart-data="lineData" :options="chartOptions" />
                </v-card>
            </v-col>

            <v-col cols="12" md="6" fill-height>
                <v-card class="p-2" style="height: 300px">
                    <v-card-title>Passenger Demographics</v-card-title>
                    <!-- Vue component cho DoughnutChart -->
                    <DoughnutChart :chart-data="doughnutData" :options="chartOptions" />
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-card class="p-2">
                    <v-card-title>Booking Map Overview</v-card-title>
                    <!-- Vue component cho RadarChart -->
                    <RadarChart :chart-data="radarData" :options="chartOptions" />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import { defineComponent } from 'vue';
import { Bar, Pie, Line, Doughnut, Radar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, PointElement, RadarController, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(
    Title, Tooltip, Legend,
    BarElement, LineElement, PointElement, RadarController, ArcElement,
    CategoryScale, LinearScale
);

const ChartWrapper = (chart) => defineComponent({
    components: { chart },
    props: ['chartData', 'options'],
    template: `<div style="height: 150px;"><chart :data="chartData" :options="options" /></div>`
});

const BarChart = ChartWrapper(Bar);
const PieChart = ChartWrapper(Pie);
const LineChart = ChartWrapper(Line);
const DoughnutChart = ChartWrapper(Doughnut);
const RadarChart = ChartWrapper(Radar);

export default {
    components: { BarChart, PieChart, LineChart, DoughnutChart, RadarChart },
    data() {
        return {
            chartOptions: { responsive: true, maintainAspectRatio: false },
            barData: { labels: ['January', 'February', 'March', 'April'], datasets: [{ label: 'Bookings', data: [30, 50, 70, 90], backgroundColor: '#3498db' }] },
            pieData: { labels: ['Business', 'Economy', 'First Class'], datasets: [{ data: [30, 60, 10], backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'] }] },
            lineData: { labels: ['Jan', 'Feb', 'Mar', 'Apr'], datasets: [{ label: 'Sales', data: [1000, 1500, 1200, 1800], borderColor: '#3498db' }] },
            doughnutData: { labels: ['Male', 'Female', 'Other'], datasets: [{ data: [60, 30, 10], backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'] }] },
            radarData: { labels: ['North', 'South', 'East', 'West'], datasets: [{ label: 'Booking Density', data: [65, 59, 90, 81], backgroundColor: 'rgba(52, 152, 219, 0.5)' }] }
        };
    }
};
</script>

<style lang="scss">
.dashboard {
    .card {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
    }

    .row {
        margin-bottom: 1rem;
    }

    .card p-2 {
        padding: 1rem;
    }
}
</style>
