<template>
    <v-container>
        <loading-modal :visible="isLoading" />

        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="6">
                <v-text-field
                    v-model="searchQuery"
                    :label="$t('label.searchTicket')"
                    outlined
                    clearable
                />
            </v-col>
            <v-col cols="2">
                <v-btn color="primary" @click="handleExport">
                    {{ $t('buttons.exportExcel') }}
                </v-btn>
            </v-col>
        </v-row>

        <v-table>
            <thead>
            <tr>
                <th>{{ $t('table.index') }}</th>
                <th>{{ $t('table.passengerName') }}</th>
                <th>{{ $t('table.seatNumber') }}</th>
                <th>{{ $t('table.ticketType') }}</th>
                <th>{{ $t('table.price') }}</th>
                <th>{{ $t('table.flightCode') }}</th>
                <th>{{ $t('table.transactionCode') }}</th>
                <th>{{ $t('table.createdAt') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!currentPageData.length && !isLoading">
                <td colspan="8">{{ $t('table.noTicketData') }}</td>
            </tr>
            <tr v-for="(ticket, index) in currentPageData" :key="ticket.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ ticket.passengerFullName }}</td>
                <td>{{ ticket.seatNumber }}</td>
                <td>
                    <div :class="`ticket-${ticket.classType.trim().toLowerCase()}`">
                        {{ ticket.classType }}
                    </div>
                </td>
                <td>{{ ticket.price }}</td>
                <td>
                    <v-btn text color="white" @click="goToFlightDetails(ticket.flightId)">
                        {{ ticket.flightCode }}
                    </v-btn>
                </td>
                <td>
                    {{ ticket.transactionNo != null ? ticket.transactionNo : 'NaN' }}
                </td>
                <td v-if="ticket.createdAt">{{ formatDate(ticket.createdAt) }}</td>
                <td v-else></td>
            </tr>
            </tbody>
        </v-table>

        <success-modal
            :visible="isSuccessVisible"
            :message="$t('messages.checkinSuccess')"
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
const tickets = ref([]);
const currentPage = ref(1);
const pageSize = 10;

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
const checkinCustomer = async (ticketId) => {
    if (!ticketId) return;

    isLoading.value = true;
    try {
        const response = await axios.put(`/ticket/checkin/${ticketId}`);
        console.log('Xóa vé thành công!: ', response.data);
        if (response.data.code == 200 || response.data.code === '200') {
            isSuccessVisible.value = true;
            await fetchTickets();
        } else {
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Có lỗi xảy ra khi check-in.';
        }
    } catch (error) {
        isErrorVisible.value = true;
        errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra khi check-in.';
        console.error('Error checkin ticket:', error);
    } finally {
        isLoading.value = false;
    }
};
const currentPageData = computed(() => tickets.value);
const goToFlightDetails = (flightId) => {
    if (flightId) {
        router.push({ name: 'FlightDetail', params: { id: flightId } });
    }
};
const fetchTickets = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get('/ticket/list', {
            params: {
                page: currentPage.value - 1,
                size: pageSize,
                search: searchQuery.value
            }
        });

        if (response.data.code == 200 || response.data.code === '200') {
            // isSuccessVisible.value = true;
            console.log('Fetched data:', response.data.data.content);
            tickets.value = response.data.data.content;
            totalPages.value = Math.ceil(response.data.data.totalElements / pageSize);
        } else {
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Có lỗi xảy ra khi lấy thông tin.';
        }
    } catch (error) {
        isErrorVisible.value = true;
        errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra khi lấy thông tin.';
        console.error('Error submitting form:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchTickets);
watch(currentPage, fetchTickets);

async function deleteTicket(id) {
    try {
        const response = await axios.delete(`/crew-member/${id}`);
        if (response.data.code === '200') {
            isSuccessVisible.value = true;
            // await fetchTickets();
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

async function fetchAllTicketsForExport() {
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
    const allData = await fetchAllTicketsForExport();

    if (!allData.length) {
        alert('Không có dữ liệu để xuất Excel');
        return;
    }

    const formattedData = allData.map((ticket, index) => ({
        STT: index + 1,
        'Mã thành viên': ticket.id,
        'Họ tên': ticket.name,
        'Chức vụ': getPositionName(ticket.position),
        'Ngày hết hạn giấy phép': new Date(ticket.licenseExpiry).toLocaleDateString('vi-VN'),
        'Tình trạng': getStatusName(ticket.status),
        'Ngày tạo': new Date(ticket.createAt).toLocaleDateString('vi-VN'),
        'Ngày Cập Nhật': new Date(ticket.updateAt).toLocaleDateString('vi-VN')
    }));

    exportToExcel(formattedData);
}
</script>

<style scoped>
.mb-4 {
    margin-bottom: 1rem;
}

.ticket-business,
.ticket-economy {
    display: inline-block;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 4px;
}

.ticket-business {
    background-color: #3b82f6;
    color: #fff;
}

.ticket-economy {
    background-color: #10b981;
    color: #fff;
}
.text-green-600 {
    background-color: #ffdd3a;
    color: #131313;
    padding: 6px;
    border-radius: 8px;
}

</style>
