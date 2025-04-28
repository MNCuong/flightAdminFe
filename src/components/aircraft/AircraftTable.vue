<script setup>
import { ref, computed } from 'vue';
import UiChildCard from '@/components/shared/UiChildCard.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

function editFlight(flight) {
    router.push({ name: 'UpdateFlight', params: { id: flight.id } });
}
const confirmDelete = ref(false);
const flightToDelete = ref(null);

function deleteFlight(flight) {
    flightToDelete.value = flight;
    confirmDelete.value = true;
}

function confirmDeleteAction() {
    if (flightToDelete.value) {
        const index = flights.value.findIndex(f => f.id === flightToDelete.value.id);
        if (index !== -1) {
            flights.value.splice(index, 1);
        }
    }
    confirmDelete.value = false;
}

function cancelDelete() {
    confirmDelete.value = false;
}

const flights = ref([
    { id: 1, code: 'VN123', planeNumber: 'AB123', departureDate: '2025-05-01', seats: 180 },
    { id: 2, code: 'VN456', planeNumber: 'CD456', departureDate: '2025-05-02', seats: 200 },
    { id: 3, code: 'VN789', planeNumber: 'EF789', departureDate: '2025-05-03', seats: 150 },
    { id: 4, code: 'VN321', planeNumber: 'GH321', departureDate: '2025-05-04', seats: 190 },
    { id: 5, code: 'VN654', planeNumber: 'IJ654', departureDate: '2025-05-05', seats: 170 },
    { id: 6, code: 'VN987', planeNumber: 'KL987', departureDate: '2025-05-06', seats: 160 },
    { id: 7, code: 'VN101', planeNumber: 'LM101', departureDate: '2025-05-07', seats: 180 },
    { id: 8, code: 'VN202', planeNumber: 'NO202', departureDate: '2025-05-08', seats: 200 },
    { id: 9, code: 'VN303', planeNumber: 'PQ303', departureDate: '2025-05-09', seats: 150 },
    { id: 10, code: 'VN404', planeNumber: 'RS404', departureDate: '2025-05-10', seats: 190 },
    { id: 11, code: 'VN505', planeNumber: 'TU505', departureDate: '2025-05-11', seats: 170 },
    { id: 12, code: 'VN606', planeNumber: 'VW606', departureDate: '2025-05-12', seats: 160 },
    { id: 13, code: 'VN707', planeNumber: 'XY707', departureDate: '2025-05-13', seats: 180 },
    { id: 14, code: 'VN808', planeNumber: 'ZA808', departureDate: '2025-05-14', seats: 200 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
    { id: 15, code: 'VN909', planeNumber: 'AB909', departureDate: '2025-05-15', seats: 150 },
]);

const currentPage = ref(1);
const pageSize = 3;

const paginatedFlights = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return flights.value.slice(start, start + pageSize);
});

const pageCount = computed(() => {
    return Math.ceil(flights.value.length / pageSize);
});

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


function goToPage(page) {
    currentPage.value = page;
}

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
    if (currentPage.value < pageCount.value) currentPage.value++;
}
</script>

<template>
    <v-card elevation="4" class="rounded-lg">
        <v-col cols="12" sm="12">
            <UiChildCard title="Danh sách chuyến bay">
                <v-table fixed-header height="300px">
                    <thead>
                    <tr>
                        <th class="text-left">STT</th>
                        <th class="text-left">Mã chuyến bay</th>
                        <th class="text-left">Số hiệu phi cơ</th>
                        <th class="text-left">Ngày khởi hành</th>
                        <th class="text-left">Số chỗ ngồi</th>
                        <th class="text-left">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(flight, index) in paginatedFlights" :key="flight.id">
                        <td>{{ (currentPage.value - 1) * pageSize + index + 1 }}</td>
                        <td>{{ flight.code }}</td>
                        <td>{{ flight.planeNumber }}</td>
                        <td>{{ flight.departureDate }}</td>
                        <td>{{ flight.seats }}</td>
                        <td>
                            <v-btn color="primary" class="mr-2" @click="editFlight(flight)">
                                Sửa
                            </v-btn>
                            <v-btn color="error" @click="deleteFlight(flight)">
                                Xóa
                            </v-btn>
                        </td>
                    </tr>
                    </tbody>
                </v-table>

                <!-- PHÂN TRANG: SỐ TRANG -->
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
<!--<script setup>-->
<!--import { ref, computed } from 'vue';-->
<!--import UiChildCard from '@/components/shared/UiChildCard.vue';-->
<!--import Pagination from '@/components/shared/Pagination.vue'; // Import component Pagination-->

<!--const flights = ref([-->
<!--    { id: 1, code: 'VN123', planeNumber: 'AB123', departureDate: '2025-05-01', seats: 180 },-->
<!--    { id: 2, code: 'VN456', planeNumber: 'CD456', departureDate: '2025-05-02', seats: 200 },-->
<!--    { id: 3, code: 'VN789', planeNumber: 'EF789', departureDate: '2025-05-03', seats: 150 },-->
<!--    { id: 4, code: 'VN321', planeNumber: 'GH321', departureDate: '2025-05-04', seats: 190 },-->
<!--    { id: 5, code: 'VN654', planeNumber: 'IJ654', departureDate: '2025-05-05', seats: 170 },-->
<!--    { id: 6, code: 'VN987', planeNumber: 'KL987', departureDate: '2025-05-06', seats: 160 },-->
<!--    { id: 7, code: 'VN101', planeNumber: 'LM101', departureDate: '2025-05-07', seats: 180 },-->
<!--    { id: 8, code: 'VN202', planeNumber: 'NO202', departureDate: '2025-05-08', seats: 200 },-->
<!--    { id: 9, code: 'VN303', planeNumber: 'PQ303', departureDate: '2025-05-09', seats: 150 },-->
<!--    { id: 10, code: 'VN404', planeNumber: 'RS404', departureDate: '2025-05-10', seats: 190 },-->
<!--    // Thêm nhiều chuyến bay khác-->
<!--]);-->

<!--const currentPage = ref(1);-->
<!--const pageSize = 3;-->

<!--const paginatedFlights = computed(() => {-->
<!--    const start = (currentPage.value - 1) * pageSize;-->
<!--    return flights.value.slice(start, start + pageSize);-->
<!--});-->

<!--const pageCount = computed(() => {-->
<!--    return Math.ceil(flights.value.length / pageSize);-->
<!--});-->

<!--function editFlight(flight) {-->
<!--    console.log('Edit flight:', flight);-->
<!--}-->

<!--function deleteFlight(flight) {-->
<!--    console.log('Delete flight:', flight);-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--    <v-card elevation="4" class="rounded-lg">-->
<!--        <v-col cols="12" sm="12">-->
<!--            <UiChildCard title="Danh sách chuyến bay">-->
<!--                <v-table fixed-header height="300px">-->
<!--                    <thead>-->
<!--                    <tr>-->
<!--                        <th class="text-left">STT</th>-->
<!--                        <th class="text-left">Mã chuyến bay</th>-->
<!--                        <th class="text-left">Số hiệu phi cơ</th>-->
<!--                        <th class="text-left">Ngày khởi hành</th>-->
<!--                        <th class="text-left">Số chỗ ngồi</th>-->
<!--                        <th class="text-left">Thao tác</th>-->
<!--                    </tr>-->
<!--                    </thead>-->
<!--                    <tbody>-->
<!--                    <tr v-for="(flight, index) in paginatedFlights" :key="flight.id">-->
<!--                        <td>{{ (currentPage.value - 1) * pageSize + index + 1 }}</td>-->
<!--                        <td>{{ flight.code }}</td>-->
<!--                        <td>{{ flight.planeNumber }}</td>-->
<!--                        <td>{{ flight.departureDate }}</td>-->
<!--                        <td>{{ flight.seats }}</td>-->
<!--                        <td>-->
<!--                            <v-btn size="small" color="primary" class="mr-2" @click="editFlight(flight)">-->
<!--                                Sửa-->
<!--                            </v-btn>-->
<!--                            <v-btn size="small" color="error" @click="deleteFlight(flight)">-->
<!--                                Xóa-->
<!--                            </v-btn>-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                    </tbody>-->
<!--                </v-table>-->

<!--                &lt;!&ndash; Sử dụng Pagination component &ndash;&gt;-->
<!--                <Pagination-->
<!--                    :currentPage="currentPage"-->
<!--                    :pageSize="pageSize"-->
<!--                    :totalItems="flights.length"-->
<!--                    @update:currentPage="currentPage = $event"-->
<!--                />-->

<!--            </UiChildCard>-->
<!--        </v-col>-->
<!--    </v-card>-->
<!--</template>-->
