<!-- AddFlight.vue -->
<script setup>
import { ref } from 'vue';

const flightCode = ref('');
const planeNumber = ref('');
const departureDate = ref('');
const seats = ref('');

function submitForm() {
    console.log('Chuyến bay mới:', {
        flightCode: flightCode.value,
        planeNumber: planeNumber.value,
        departureDate: departureDate.value,
        seats: seats.value,
    });

}
</script>

<template>
    <div>
        <h1 class="text-h4 mb-4 font-weight-bold">Thêm chuyến bay</h1>
        <v-card class="white pa-4" flat>
            <v-form>
                <v-text-field
                    v-model="flightCode"
                    label="Mã chuyến bay"
                    required
                />
                <v-text-field
                    v-model="planeNumber"
                    label="Số hiệu phi cơ"
                    required
                />
                <v-text-field
                    v-model="departureDate"
                    label="Ngày khởi hành"
                    type="date"
                    required
                />
                <v-text-field
                    v-model="seats"
                    label="Số chỗ ngồi"
                    type="number"
                    required
                />

                <v-btn color="primary" @click="submitForm" class="mt-4">
                    Thêm chuyến bay
                </v-btn>
                <v-btn color="content" @click="submitForm" class="mt-4">
                    Quay lại
                </v-btn>
            </v-form>
        </v-card>
    </div>
</template>

<style scoped>
/* Bạn có thể thêm style tùy chỉnh ở đây */
</style>
