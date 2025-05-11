<template>
    <v-container>
        <v-card class="pa-4" elevation="4">
            <v-card-title>
                Quản lý chuyến bay
                <v-spacer />
                <v-btn color="primary" @click="openForm()">Thêm chuyến bay</v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="flights" class="mt-4">
                <template #item.actions="{ item }">
                    <v-btn size="small" color="blue" @click="openForm(item)">Sửa</v-btn>
                    <v-btn size="small" color="red" @click="removeFlight(item.id)">Xóa</v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- Dialog form -->
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>{{ editingFlight.id ? 'Cập nhật' : 'Thêm' }} chuyến bay</v-card-title>
                <v-card-text>
                    <v-form ref="formRef">
                        <v-text-field v-model="editingFlight.flightCode" label="Mã chuyến bay" required />
                        <v-text-field v-model="editingFlight.status" label="Trạng thái" />

                        <v-text-field v-model="editingFlight.departureAirportId" label="Sân bay đi (ID)" type="number" />
                        <v-text-field v-model="editingFlight.arrivalAirportId" label="Sân bay đến (ID)" type="number" />

                        <v-text-field v-model="editingFlight.aircraftId" label="Máy bay (ID)" type="number" />
                        <v-text-field v-model="editingFlight.departureTime" label="Thời gian đi (yyyy-MM-ddTHH:mm)" />
                        <v-text-field v-model="editingFlight.arrivalTime" label="Thời gian đến (yyyy-MM-ddTHH:mm)" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="saveFlight" color="success">Lưu</v-btn>
                    <v-btn @click="dialog = false">Hủy</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FlightService from '@/services/FlightService';

const flights = ref([]);
const dialog = ref(false);
const editingFlight = ref({});
const formRef = ref();

const headers = [
    { text: 'Mã chuyến bay', value: 'flightCode' },
    { text: 'Trạng thái', value: 'status' },
    { text: 'Sân bay đi', value: 'departureAirportId' },
    { text: 'Sân bay đến', value: 'arrivalAirportId' },
    { text: 'Máy bay', value: 'aircraftId' },
    { text: 'Thao tác', value: 'actions', sortable: false }
];

const loadFlights = async () => {
    const res = await FlightService.getAll();
    flights.value = res.data;
};

const openForm = (flight = null) => {
    editingFlight.value = flight ? { ...flight } : {
        flightCode: '',
        status: '',
        aircraftId: null,
        departureAirportId: null,
        arrivalAirportId: null,
        departureTime: '',
        arrivalTime: '',
        crewIds: []
    };
    dialog.value = true;
};

const saveFlight = async () => {
    if (!editingFlight.value.flightCode) return;

    if (editingFlight.value.id) {
        await FlightService.update(editingFlight.value.id, editingFlight.value);
    } else {
        await FlightService.create(editingFlight.value);
    }

    dialog.value = false;
    loadFlights();
};

const removeFlight = async (id) => {
    await FlightService.delete(id);
    loadFlights();
};

onMounted(() => {
    loadFlights();
});
</script>
