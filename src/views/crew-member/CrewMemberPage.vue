<template>
    <v-container>
        <loading-modal :visible="isLoading" />

        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="2">
                <v-btn color="primary" @click="addCrewmember">Thêm thành viên</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn color="success" @click="handleExport">Xuất Excel</v-btn>
            </v-col>
            <v-col cols="8">
                <v-text-field v-model="searchQuery" label="Tìm kiếm " outlined clearable hide-details="auto" />
            </v-col>
        </v-row>

        <v-table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã thành viên</th>
                    <th>Họ tên </th>
                    <th>Chức vụ</th>
                    <th>Ngày hết hạn giấy phép</th>
                    <th>Tình trạng</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                    <th>Thao Tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!currentPageData.length && !isLoading">
                    <td colspan="6">Không có dữ liệu</td>
                </tr>
                <tr v-for="(crewmember, index) in currentPageData" :key="crewmember.id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ crewmember.id }}</td>
                    <td>{{ crewmember.name }}</td>
                    <td>{{ getPositionName(crewmember.position) }}</td>
                    <td>{{ crewmember.licenseExpiry }}</td>
                    <td>
                        <v-chip :class="getStatusBgClass(crewmember.status)" text-color="white" variant="flat">
                            {{ getStatusName(crewmember.status) }}
                        </v-chip>
                    </td>
                    <td v-if="crewmember.createAt">{{ formatDate(crewmember.createAt) }}</td>
                    <td v-else></td>
                    <td v-if="crewmember.updateAt">{{ formatDate(crewmember.updateAt) }}</td>
                    <td v-else></td>
                    <td>
                        <v-btn color="primary" class="mr-2" @click="editCrewmember(crewmember)"> Cập nhật</v-btn>
                        /
                        <v-btn color="primary" class="mr-2" @click="deleteCrewmember(crewmember.id)"> Xóa</v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <success-modal :visible="isSuccessVisible" :message="'Xóa thành viên thành công!'" @close="closeSuccessModal" />

        <!-- Modal thông báo thất bại -->
        <error-modal :visible="isErrorVisible" :message="errorMessage" @close="closeErrorModal" />
        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" />
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/services/api';
import { exportToExcel } from '@/services/ExportService';
import LoadingModal from '@/components/LoadingModal.vue';
import ErrorModal from '@/components/ErrorModal.vue';
import SuccessModal from '@/components/SuccessModa.vue';

const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const router = useRouter();
const crewmembers = ref([]);
const currentPage = ref(1);
const pageSize = 5;

const searchQuery = ref('');
const isLoading = ref(false);
const totalPages = ref(1);
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};
const closeSuccessModal = () => {
    isSuccessVisible.value = false;
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};
const currentPageData = computed(() => crewmembers.value);
const getStatusBgClass = (status) => {
    switch (status) {
        case 'ACTIVE':
            return 'bg-green';
        case 'INACTIVE':
            return 'bg-red';
        case 'SUSPENDED':
            return 'bg-orange';
        default:
            return 'bg-grey';
    }
};


const positionMap = {
    PILOT: 'Cơ trưởng',
    COPILOT: 'Cơ phó',
    ATTENDANT: 'Tiếp viên'
};
const statusMap = {
    ACTIVE: 'Đang làm việc',
    INACTIVE: 'Ngừng làm việc',
    SUSPENDED: 'Tạm ngừng'
};

const getStatusName = (status) => {
    return statusMap[status] || 'NaN';
};
const getPositionName = (position) => {
    return positionMap[position] || 'NaN';
};

const fetchCrewmembers = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get('/crew-member/list', {
            params: {
                page: currentPage.value - 1,
                size: pageSize
            }
        });
        console.log('Fetched data:', response.data.data.content);
        crewmembers.value = response.data.data.content;
        totalPages.value = Math.ceil(response.data.data.totalElements / pageSize);
    } catch (error) {
        console.error('Error fetching crewmember data:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchCrewmembers);
watch(currentPage, fetchCrewmembers);

function addCrewmember() {
    router.push({ name: 'CreateCrewMember' });
}

function editCrewmember(crewmember) {
    router.push({ name: 'UpdateCrewMember', params: { id: crewmember.id } });
}

async function deleteCrewmember(id) {
    try {
        const response = await axios.delete(`/crew-member/${id}`);
        if (response.data.code === '200') {
            isSuccessVisible.value = true;
            // await fetchCrewmembers();
        } else {
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Có lỗi xảy ra khi xóa thông tin.';
        }
    } catch (error) {
        isErrorVisible.value = true;
        errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra khi xóa thông tin.';
        console.error('Error submitting form:', error);
    }
}
async function fetchAllCrewmembersForExport() {
    try {
        const response = await axios.get('/crew-member/list', {
            params: {
                page: 0,
                size: 999999
            }
        });
        return response.data.data.content || [];
    } catch (error) {
        console.error('Lỗi khi lấy toàn bộ danh sách thành viên:', error);
        return [];
    }
}

async function handleExport() {
    const allData = await fetchAllCrewmembersForExport();

    if (!allData.length) {
        alert('Không có dữ liệu để xuất Excel');
        return;
    }

    const formattedData = allData.map((crewmember, index) => ({
        STT: index + 1,
        'Mã thành viên': crewmember.id,
        'Họ tên': crewmember.name,
        'Chức vụ': getPositionName(crewmember.position),
        'Ngày hết hạn giấy phép': new Date(crewmember.licenseExpiry).toLocaleDateString('vi-VN'),
        'Tình trạng': getStatusName(crewmember.status),
        'Ngày tạo': new Date(crewmember.createAt).toLocaleDateString('vi-VN'),
        'Ngày Cập Nhật': new Date(crewmember.updateAt).toLocaleDateString('vi-VN')
    }));

    exportToExcel(formattedData);
}

</script>


<style scoped>
.mb-4 {
    margin-bottom: 1rem;
}
.bg-green {
    background-color: #4CAF50 !important;
}
.bg-red {
    background-color: #F44336 !important;
}
.bg-orange {
    background-color: #FF9800 !important;
}
.text-white {
    color: white !important;
}
</style>
