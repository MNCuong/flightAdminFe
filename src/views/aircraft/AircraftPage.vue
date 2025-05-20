<template>
    <v-container>
        <loading-modal :visible="isLoading" />

        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="2">
                <v-btn color="primary" @click="addAircraft">Thêm Phi Cơ</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn color="success" @click="handleExport">Xuất Excel</v-btn>
            </v-col>
            <v-col cols="8">
                <v-text-field v-model="searchQuery" label="Tìm kiếm phi cơ" outlined clearable hide-details="auto" />
            </v-col>
        </v-row>

        <v-table>
            <thead>
            <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Mã phi cơ</th>
<!--                <th>Hãng hàng không</th>-->
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!currentPageData.length && !isLoading">
                <td colspan="6">Không có phi cơ</td>
            </tr>
            <tr v-for="(aircraft, index) in currentPageData" :key="aircraft.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>
                    <v-img
                        v-if="aircraft.imageUrl && aircraft.imageUrl !== ''"
                        :src="aircraft.imageUrl"
                        :alt="'Ảnh ' + aircraft.registration"
                        max-width="120"
                        aspect-ratio="1.6"
                        class="rounded"
                        cover
                    >
                        <template #placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="primary" />
                            </v-row>
                        </template>
                    </v-img>

                    <span v-if="!aircraft.imageUrl || aircraft.imageUrl === ''">NaN</span>


                </td>
                <td>{{ aircraft.registration }}</td>
<!--                <td>{{ aircraft.airlines.name }}</td>-->
                <td>{{ aircraft.createAt }}</td>
                <td>{{ aircraft.updateAt }}</td>
                <td>{{ getStatusLabel(aircraft.status) }}</td>
                <td>
                    <v-btn color="primary" class="mr-2" @click="editAircraft(aircraft)"> Cập nhật</v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>

        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" />
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/services/api';
import { exportToExcel } from '@/services/ExportService';
import LoadingModal from '@/components/LoadingModal.vue';

const router = useRouter();
const aircrafts = ref([]);
const currentPage = ref(1);
const pageSize = 10;

const searchQuery = ref('');
const isLoading = ref(false);
const totalPages = ref(1);

const currentPageData = computed(() => aircrafts.value);

const getStatusLabel = (statusValue) => {
    const statusMap = {
        'AVAILABLE': 'Sẵn sàng sử dụng',
        'IN_SERVICE': 'Đang hoạt động',
        'MAINTENANCE': 'Đang bảo trì',
        'IN_FLIGHT': 'Đang bay',
        'LANDED': 'Đã hạ cánh',
        'DELAYED': 'Bị hoãn',
        'CANCELLED': 'Hủy chuyến bay',
        'GROUND': 'Đang đỗ tại sân bay',
        'REFUELING': 'Đang tiếp nhiên liệu',
        'PARKED': 'Đang đỗ tại bãi',
        'CHECKING': 'Kiểm tra kỹ thuật',
        'RETIREMENT': 'Ngừng hoạt động'
    };

    return statusMap[statusValue] || statusValue;
};
const fetchAircrafts = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get('/flight/aircraft/list-aircraft-by-airline', {
            params: {
                page: currentPage.value - 1,
                size: pageSize,
                search:searchQuery.value
            }
        });
        console.log('Fetched data:', response.data.data.content);
        aircrafts.value = response.data.data.content;
        totalPages.value = Math.ceil(response.data.data.totalElements / pageSize);
    } catch (error) {
        console.error('Error fetching aircraft data:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchAircrafts);
watch(currentPage, fetchAircrafts);
watch(searchQuery, fetchAircrafts, { immediate: true });

function addAircraft() {
    router.push({ name: 'CreateAircraft' });
}

function editAircraft(aircraft) {
    router.push({ name: 'UpdateAircraft', params: { id: aircraft.id } });
}

function handleExport() {
    if (!aircrafts.value.length) {
        alert('Không có dữ liệu để xuất Excel');
        return;
    }

    const formattedData = aircrafts.value.map((aircraft, index) => ({
        STT: index + 1,
        'Mã Phi cơ': aircraft.registration,
        'Ngày Tạo': new Date(aircraft.createAt).toLocaleDateString('vi-VN'),
        'Ngày Cập Nhật': new Date(aircraft.updateAt).toLocaleDateString('vi-VN')
    }));

    exportToExcel(formattedData);
}
</script>

<style scoped>
.mb-4 {
    margin-bottom: 1rem;
}
</style>
