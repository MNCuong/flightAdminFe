<template>
    <v-container>
        <loading-modal :visible="isLoading" />

        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="2">
                <v-btn color="primary" @click="addAirlines">{{ $t('buttons.addAirlines') }}</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn
                    color="error"
                    :disabled="selectedAirlines.length === 0"
                    @click="openDeleteMultipleDialog"
                >
                    {{ $t('buttons.deleteSelected') }}
                </v-btn>
            </v-col>

            <v-col cols="2">
                <v-btn color="success" @click="handleExport">{{ $t('buttons.exportExcel') }}</v-btn>
            </v-col>
            <v-col cols="8">
                <v-text-field
                    v-model="searchQuery"
                    :label="$t('labels.searchPlaceholder')"
                    outlined
                    clearable
                    hide-details="auto"
                />
            </v-col>
        </v-row>

        <v-table>
            <thead>
            <tr>
                <th>
                    <v-checkbox
                        v-model="selectAll"
                        @change="toggleSelectAll"
                        :indeterminate="isIndeterminate"
                        hide-details
                        dense
                        :aria-label="$t('labels.selectAll')"
                    />
                </th>
                <th>{{ $t('labels.stt') }}</th>
                <th>{{ $t('labels.image') }}</th>
                <th>{{ $t('labels.airlineCode') }}</th>
                <th>{{ $t('labels.airlineName') }}</th>
                <th>{{ $t('labels.createdAt') }}</th>
                <th>{{ $t('labels.updatedAt') }}</th>
                <th>{{ $t('labels.actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!currentPageData.length && !isLoading">
                <td :colspan="8">{{ $t('labels.noData') }}</td>
            </tr>
            <tr v-for="(airlines, index) in currentPageData" :key="airlines.id">
                <td>
                    <v-checkbox
                        v-model="selectedAirlines"
                        :value="airlines"
                        hide-details
                        dense
                    />
                </td>
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>
                    <v-img
                        v-if="airlines.logoUrl && airlines.logoUrl !== ''"
                        :src="airlines.logoUrl"
                        :alt="$t('labels.image') + ' ' + airlines.code"
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

                    <span v-if="!airlines.logoUrl || airlines.logoUrl === ''">NaN</span>
                </td>
                <td>{{ airlines.code }}</td>
                <td>{{ airlines.name }}</td>
                <td>{{ airlines.createAt }}</td>
                <td>{{ airlines.updateAt }}</td>
                <td>
                    <v-btn color="primary" class="mr-2" @click="editAirlines(airlines)">{{ $t('buttons.update') }}</v-btn>
                    /
                    <v-btn color="primary" class="mr-2" @click="deleteAirlines(airlines)">{{ $t('buttons.delete') }}</v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>

        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" />

        <!-- Modal thông báo thành công -->
        <success-modal
            :visible="isSuccessVisible"
            :message="$t('messages.deleteSuccess')"
            @close="closeSuccessModal"
        />

        <!-- Modal thông báo thất bại -->
        <error-modal
            :visible="isErrorVisible"
            :message="errorMessage"
            @close="closeErrorModal"
        />

        <v-dialog v-model="deleteDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">{{ $t('dialogs.deleteSingleTitle') }}</v-card-title>
                <v-card-text>
                    {{ $t('dialogs.deleteSingleMessage') }}
                    <strong>{{ airlineToDelete?.name || '' }}</strong> {{ '?' }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="deleteDialog = false">{{ $t('buttons.cancel') }}</v-btn>
                    <v-btn color="red darken-1" text @click="confirmDelete">{{ $t('buttons.confirmDelete') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteMultipleDialog" max-width="500">
            <v-card>
                <v-card-title class="headline">{{ $t('dialogs.deleteMultipleTitle') }}</v-card-title>
                <v-card-text>
                    {{ $t('dialogs.deleteMultipleMessage', { count: selectedAirlines.length }) }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="deleteMultipleDialog = false">{{ $t('buttons.cancel') }}</v-btn>
                    <v-btn color="red darken-1" text @click="confirmDeleteMultiple">{{ $t('buttons.confirmDelete') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
const deleteDialog = ref(false);
const airlineToDelete = ref(null);

const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const router = useRouter();
const airlines = ref([]);
const currentPage = ref(1);
const pageSize = 10;

const searchQuery = ref('');
const isLoading = ref(false);
const totalPages = ref(1);

const currentPageData = computed(() => airlines.value);
const closeSuccessModal = () => {
    isSuccessVisible.value = false;
    router.push({ name: 'AirlinesList' });
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};
const fetchAirlines = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get('/airlines', {
            params: {
                page: currentPage.value - 1,
                size: pageSize,
                search: searchQuery.value
            }
        });
        console.log('Fetched data:', response.data.data.content);
        airlines.value = response.data.data.content;
        totalPages.value = Math.ceil(response.data.data.totalElements / pageSize);
    } catch (error) {
        console.error('Error fetching airline data:', error);
    } finally {
        isLoading.value = false;
    }
};
async function confirmDelete() {
    if (!airlineToDelete.value) return;
    isLoading.value = true;
    try {
        await axios.delete(`/airlines/${airlineToDelete.value.id}`);
        deleteDialog.value = false;
        isSuccessVisible.value = true;
        airlineToDelete.value = null;
        await fetchAirlines();
    } catch (error) {
        errorMessage.value = error;
        isErrorVisible.value = true;

        console.error('Lỗi khi xóa hãng bay:', error);
        alert('Xóa hãng bay thất bại!');
    } finally {
        isLoading.value = false;
    }
}


onMounted(fetchAirlines);
watch(currentPage, fetchAirlines);
watch(searchQuery, fetchAirlines, { immediate: true });

function addAirlines() {
    router.push({ name: 'CreateAirline' });
}

function editAirlines(airline) {
    router.push({ name: 'UpdateAirline', params: { id: airline.id } });
}

function deleteAirlines(airline) {
    airlineToDelete.value = airline;
    deleteDialog.value = true;
}

const selectedAirlines = ref([]);
const selectAll = ref(false);

const isIndeterminate = computed(() => {
    return selectedAirlines.value.length > 0 && selectedAirlines.value.length < currentPageData.value.length;
});

function toggleSelectAll() {
    if (selectAll.value) {
        // chọn tất cả các hãng trên trang hiện tại
        selectedAirlines.value = [...currentPageData.value];
    } else {
        selectedAirlines.value = [];
    }
}

watch(currentPageData, () => {
    selectedAirlines.value = [];
    selectAll.value = false;
});
const deleteMultipleDialog = ref(false);

function openDeleteMultipleDialog() {
    deleteMultipleDialog.value = true;
}

async function confirmDeleteMultiple() {
    if (selectedAirlines.value.length === 0) return;

    isLoading.value = true;
    try {
        const idsToDelete = selectedAirlines.value.map(a => a.id);

        await Promise.all(idsToDelete.map(id => axios.delete(`/airlines/${id}`)));
        deleteMultipleDialog.value = false;
        selectedAirlines.value = [];
        selectAll.value = false;
        await fetchAirlines();

        isSuccessVisible.value = true;
    } catch (error) {
        console.error('Lỗi khi xóa nhiều hãng bay:', error);
        errorMessage.value = error.message || 'Xóa thất bại';
        isErrorVisible.value = true;
    } finally {
        isLoading.value = false;
    }
}

function handleExport() {
    if (!airlines.value.length) {
        alert('Không có dữ liệu để xuất Excel');
        return;
    }

    const formattedData = airlines.value.map((airline, index) => ({
        STT: index + 1,
        'Mã Phi cơ': airline.code,
        'Hãng Hàng Không': airline.name,
        'Ngày Tạo': new Date(airline.createAt).toLocaleDateString('vi-VN'),
        'Ngày Cập Nhật': new Date(airline.updateAt).toLocaleDateString('vi-VN')
    }));

    exportToExcel(formattedData);
}
</script>

<style scoped>
.mb-4 {
    margin-bottom: 1rem;
}
</style>
