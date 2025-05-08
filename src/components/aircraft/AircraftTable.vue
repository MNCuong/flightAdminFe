<script setup>
import { ref, computed, onMounted } from 'vue';
import UiChildCard from '@/components/shared/UiChildCard.vue';
import axios from '../../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();

const aircrafts = ref([]);
const currentPage = ref(1);
const pageSize = 3;
const totalItems = ref(0);

const fetchAircrafts = async () => {
    try {
        const response = await axios.get('/flight/aircraft/list-aircraft-by-airline', {
            params: {
                page: currentPage.value,
                size: pageSize
            }
        });
        aircrafts.value = response.data.data.content;
        totalItems.value = response.data.data.totalElements;
    } catch (error) {
        console.error('Error fetching aircraft data:', error);
    }
};

onMounted(fetchAircrafts);

// Tổng số trang
const pageCount = computed(() => {
    return Math.ceil(totalItems.value / pageSize);
});

// Tính dải số trang hiển thị
const paginationRange = computed(() => {
    const range = [];
    const totalPages = pageCount.value;
    const rangeSize = 5;

    let startPage = currentPage.value - Math.floor(rangeSize / 2);
    let endPage = currentPage.value + Math.floor(rangeSize / 2);

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

// Navigation functions
async function goToPage(page) {
    currentPage.value = page;
    await fetchAircrafts();
}

async function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
        await fetchAircrafts();
    }
}

async function nextPage() {
    if (currentPage.value < pageCount.value) {
        currentPage.value++;
        await fetchAircrafts();
    }
}

function editAircraft(aircraft) {
    router.push({ name: 'UpdateAircraft', params: { id: aircraft.id } });
}

const confirmDelete = ref(false);
const aircraftToDelete = ref(null);

function deleteAircraft(aircraft) {
    aircraftToDelete.value = aircraft;
    confirmDelete.value = true;
}

function confirmDeleteAction() {
    if (aircraftToDelete.value) {
        const index = aircrafts.value.findIndex(f => f.id === aircraftToDelete.value.id);
        if (index !== -1) {
            aircrafts.value.splice(index, 1);
        }
    }
    confirmDelete.value = false;
}

function cancelDelete() {
    confirmDelete.value = false;
}
</script>


<template>
    <v-card elevation="4" class="rounded-lg">
        <v-col cols="12" sm="12">
            <UiChildCard title="Danh sách phi cơ">
                <v-table fixed-header height="300px">
                    <thead>
                    <tr>
                        <th class="text-left">STT</th>
                        <th class="text-left">Mã chuyến bay</th>
                        <th class="text-left">Số hiệu phi cơ</th>
                        <th class="text-left">Hãng hàng không</th>
                        <th class="text-left">Số hiệu ICAO</th>
                        <th class="text-left">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(aircraft, index) in aircrafts" :key="aircraft.id">
                        <td>{{ (currentPage.value - 1) * pageSize + index + 1 }}</td>
                        <td>{{ aircraft.registration }}</td>
                        <td>{{ aircraft.iata }}</td>
                        <td>{{ aircraft.airlines.name }}</td>
                        <td>{{ aircraft.icao }}</td>
                        <td>
                            <v-btn color="primary" class="mr-2" @click="editAircraft(aircraft)">
                                Sửa
                            </v-btn>
                            <v-btn color="error" @click="deleteAircraft(aircraft)">
                                Xóa
                            </v-btn>
                        </td>
                    </tr>
                    </tbody>
                </v-table>

                <!-- PHÂN TRANG: SỐ TRANG -->
                <div class="flex justify-center items-center mt-4 space-x-2">
                    <v-btn small @click="goToPage(1)" :disabled="currentPage === 1">&lt;&lt;</v-btn>
                    <v-btn small @click="prevPage" :disabled="currentPage === 1">&lt;</v-btn>

                    <v-btn
                        v-for="page in paginationRange"
                        :key="page"
                        :color="currentPage === page ? 'primary' : 'grey'"
                        small
                        @click="goToPage(page)"
                    >
                        {{ page }}
                    </v-btn>

                    <v-btn small @click="nextPage" :disabled="currentPage === pageCount.value-1">&gt;</v-btn>
                    <v-btn small @click="goToPage(pageCount.value-1)" :disabled="currentPage === pageCount.value-1">&gt;&gt;</v-btn>
                </div>
            </UiChildCard>
        </v-col>
    </v-card>

    <v-dialog v-model="confirmDelete" max-width="400px" transition="dialog-bottom-transition">
        <v-card class="elevation-10 rounded-xl" style="background: linear-gradient(135deg, #fc0000, #ff0000);">
            <v-card-title class="headline white--text">
                <v-icon left color="yellow">mdi-alert-circle</v-icon>
                Xác nhận xóa
            </v-card-title>
            <v-card-text class="white--text">
                Bạn có chắc chắn muốn xóa chuyến bay này không?
            </v-card-text>
            <v-card-actions>
                <v-btn color="white" text @click="confirmDeleteAction" class="mr-2" style="transition: all 0.3s ease;">
                    <v-icon left>mdi-check-circle</v-icon>
                    Có
                </v-btn>
                <v-btn color="white" text @click="cancelDelete" style="transition: all 0.3s ease;">
                    <v-icon left>mdi-close-circle</v-icon>
                    Không
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

