<template>
    <v-container>
        <loading-modal :visible="isLoading" />
        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="6">
                <v-text-field
                    v-model="searchQuery"
                    :label="$t('searchPlaceholder')"
                    outlined
                />
            </v-col>
            <v-col cols="2">
                <v-btn color="primary" @click="handleExport">{{ $t('exportBtn') }}</v-btn>
            </v-col>
        </v-row>

        <v-table>
            <thead>
            <tr>
                <th>{{ $t('index') }}</th>
                <th>{{ $t('fullName') }}</th>
                <th>{{ $t('passportNumber') }}</th>
                <th>{{ $t('nationalId') }}</th>
                <th>{{ $t('nationality') }}</th>
                <th>{{ $t('email') }}</th>
                <th>{{ $t('actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!passengers.length && !isLoading">
                <td colspan="7">{{ $t('noData') }}</td>
            </tr>
            <tr v-for="(p, index) in passengers" :key="p.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ p.fullName }}</td>
                <td>{{ p.passportNumber }}</td>
                <td>{{ p.nationalId }}</td>
                <td>{{ p.nationality }}</td>
                <td>{{ p.email }}</td>
                <td>
                    <v-btn color="info" @click="viewHistory(p)">{{ $t('viewHistory') }}</v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>

        <success-modal
            :visible="isSuccessVisible"
            :message="$t('successMessage')"
            @close="closeSuccessModal"
        />

        <error-modal
            :visible="isErrorVisible"
            :message="errorMessage"
            @close="closeErrorModal"
        />

        <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
        />
    </v-container>
    <TicketHistoryModal
        :visible="showTicketModal"
        :tickets="selectedTickets"
        @close="showTicketModal = false"
    />
</template>


<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from '@/services/api';
import { exportToExcel } from '@/services/ExportService';
import LoadingModal from '@/components/LoadingModal.vue';
import SuccessModal from '@/components/SuccessModa.vue';
import ErrorModal from '@/components/ErrorModal.vue';
import TicketHistoryModal from '@/components/TicketHistoryModal.vue';
const showTicketModal = ref(false);
const selectedTickets = ref([]);

const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const passengers = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 10;
const isLoading = ref(false);
const closeSuccessModal = () => {
    isSuccessVisible.value = false;
};

// Close Error Modal
const closeErrorModal = () => {
    isErrorVisible.value = false;
};
const fetchPassengers = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get('/passengers/list', {
            params: {
                page: currentPage.value - 1,
                size: pageSize,
                search: searchQuery.value
            }
        });
        console.log('Passengers:', response.data.data.content);

        if (response.data.code == 200 || response.data.code === '200') {
            // isSuccessVisible.value = true;
            passengers.value = response.data.data.content;
            totalPages.value = Math.ceil(response.data.data.totalElements / pageSize);
        }else{
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Có lỗi xảy ra khi lấy thông tin.';
        }
    } catch (err) {
        isErrorVisible.value = true;
        errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin.';
        console.error('Error submitting form:', error);    } finally {
        isLoading.value = false;
    }
};

const handleExport = async () => {
    try {
        const response = await axios.get('/passengers/list', {
            params: {
                page: 0,
                size: 10000
            }
        });

        const data = response.data.data.content.map((p, index) => ({
            STT: index + 1,
            'Họ tên': p.fullName,
            'Số hộ chiếu': p.passportNumber,
            'Quốc tịch': p.nationality,
            Email: p.email
        }));

        exportToExcel(data, 'Danh_sach_hanh_khach');
    } catch (err) {
        console.error('Lỗi export:', err);
    }
};


const viewHistory = async (passenger) => {
    isLoading.value = true;
    try {
        const res = await axios.get(`/passengers/ticket/${passenger.id}`);
        selectedTickets.value = res.data.data;
        console.log("data",res.data);
        showTicketModal.value = true;
    } catch (e) {
        console.error('Lỗi khi lấy lịch sử vé:', e);
        isErrorVisible.value = true;
        errorMessage.value = 'Không thể lấy lịch sử vé.';
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchPassengers);
watch([currentPage, searchQuery], fetchPassengers, {immediate:true});
</script>

<style scoped>
.mb-4 {
    margin-bottom: 16px;
}
</style>
