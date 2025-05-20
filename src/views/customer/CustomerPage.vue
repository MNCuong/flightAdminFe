<template>
    <v-container>
        <loading-modal :visible="isLoading" />
        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="8">
                <v-text-field v-model="searchQuery" :label="$t('labels.searchCustomer')" outlined clearable hide-details="auto" />
            </v-col>
            <v-col cols="4">
                <v-btn color="success" @click="handleExport">
                    {{ $t('buttons.exportExcel') }}
                </v-btn>
            </v-col>
        </v-row>

        <v-table>
            <thead>
                <tr>
                    <th>{{ $t('table.index') }}</th>
                    <th>{{ $t('table.fullName') }}</th>
                    <th>{{ $t('table.email') }}</th>
                    <th>{{ $t('table.phone') }}</th>
                    <th>{{ $t('table.active') }}</th>

                    <th>{{ $t('table.roles') }}</th>
                    <th>{{ $t('table.actions') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!users.length && !isLoading">
                    <td colspan="6">
                        {{ $t('table.noCustomerData') }}
                    </td>
                </tr>
                <tr v-for="(user, index) in users" :key="user?.id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ user?.fullName }}</td>
                    <td>{{ user?.email }}</td>
                    <td>{{ user?.phone }}</td>
                    <td>
                        <v-chip :color="setStatusColorActive(user?.active)" dark>
                            {{ $t('labels.' + user?.active) }}
                        </v-chip>

                    </td>
                    <td>
                        <v-chip :color="setStatusColor(user?.roles)" dark>
                            {{ $t('labels.' + user?.roles) }}
                        </v-chip>
                    </td>
                    <td>
                        <!-- Nút khóa hoặc mở tài khoản -->
                        <v-btn v-if="user.active" color="error darken-1" @click="lockAccount(user)" icon>
                            <v-icon>mdi-lock</v-icon>
                        </v-btn>
                        <v-btn v-if="!user.active" color="green darken-1" @click="lockAccount(user)" icon>
                            <v-icon>mdi-lock-open</v-icon>
                        </v-btn>
                    </td>

                </tr>
            </tbody>
        </v-table>

        <!-- Modal xác nhận xóa -->
        <confirm-delete-modal :visible="confirmDelete" :flightId="userToDelete?.id" @confirm="confirmDeleteAction" @close="cancelDelete" />

        <!-- Modal thông báo thành công -->
        <success-modal :visible="isSuccessVisible" :message="$t('messages.accountUpdated')" @close="closeSuccessModal" />

        <!-- Modal thông báo thất bại -->
        <error-modal :visible="isErrorVisible" :message="errorMessage" @close="closeErrorModal" />

        <!-- PHÂN TRANG -->
        <v-pagination v-model="currentPage" :length="pageCount" :total-visible="5" />
    </v-container>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from '../../services/api';
import { useRouter } from 'vue-router';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.vue';
import SuccessModal from '../../components/SuccessModa.vue';
import ErrorModal from '../../components/ErrorModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

const vuetify = createVuetify();
const router = useRouter();

const users = ref([]);
const currentPage = ref(1);
const pageSize = 2;
const totalItems = ref(0);
const isLoading = ref(false);
const searchQuery = ref('');

function setStatusColor(status) {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'user' || normalized === 'người dùng') {
        return 'primary';
    } else if (normalized === 'admin' || normalized === 'quản trị viên') {
        return 'error';
    } else {
        return 'grey';
    }
}function setStatusColorActive(active) {
    return active === true
        ? 'primary darken-2'
        : active === false
            ? 'red darken-2'
            : 'grey darken-1';
}


const fetchUsers = async () => {
    isLoading.value = true;

    try {
        const response = await axios.get('/user/list-user', {
            params: {
                page: currentPage.value - 1,
                size: pageSize,
                search: searchQuery.value
            }
        });
        users.value = response.data.data.content;
        totalItems.value = response.data.data.totalElements;
    } catch (error) {
        console.error('Error fetching user data:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchUsers);
watch(
    [currentPage, searchQuery],
    () => {
        fetchUsers();
    },
    { immediate: true }
);

const pageCount = computed(() => {
    return Math.ceil(totalItems.value / pageSize);
});

const confirmDelete = ref(false);
const userToDelete = ref(null);

function deleteUser(user) {
    userToDelete.value = user;
    confirmDelete.value = true;
}

function confirmDeleteAction() {
    if (userToDelete.value) {
        const index = users.value.findIndex((f) => f.id === userToDelete.value.id);
        if (index !== -1) {
            users.value.splice(index, 1);
        }
    }
    confirmDelete.value = false;
}

function cancelDelete() {
    confirmDelete.value = false;
}

async function goToPage(page) {
    currentPage.value = page;
    await fetchUsers();
}

function editUser(user) {
    router.push({ name: 'UpdateUser', params: { id: user.id } });
}

const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');

const closeSuccessModal = () => {
    isSuccessVisible.value = false;
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};

// Lock account logic
const lockAccount = async (user) => {
    try {
        const response = await axios.put(`/user/lock/${user.email}`);
        console.log("email: ",user.email)
        if (response.status === 200) {
            user.isLocked = true; // Update the state to locked
            isSuccessVisible.value = true;
            errorMessage.value = '';
            fetchUsers();
        } else {
            isErrorVisible.value = true;
            errorMessage.value = 'Không thể khóa tài khoản. Vui lòng thử lại!';
        }
    } catch (error) {
        console.error('Error locking account:', error);
        isErrorVisible.value = true;
        errorMessage.value = error.message || 'Có lỗi xảy ra!';
    }
};

// Unlock account logic
const unlockAccount = async (user) => {
    try {
        const response = await axios.put(`/user/unlock/${user.id}`);
        if (response.status === 200) {
            user.isLocked = false; // Update the state to unlocked
            isSuccessVisible.value = true;
            errorMessage.value = '';
        } else {
            isErrorVisible.value = true;
            errorMessage.value = 'Không thể mở tài khoản. Vui lòng thử lại!';
        }
    } catch (error) {
        console.error('Error unlocking account:', error);
        isErrorVisible.value = true;
        errorMessage.value = error.message || 'Có lỗi xảy ra!';
    }
};
</script>
