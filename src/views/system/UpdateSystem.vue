<template>
    <v-container>
        <loading-modal :visible="isLoading" />

        <v-form v-if="crewmember" @submit.prevent="updateCrewmember">
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field v-model="crewmember.name" label="Họ tên thành viên" required />
                </v-col>

                <v-col cols="12" md="6">
                    <v-select
                        v-model="crewmember.position"
                        :items="positionOptions"
                        label="Chức vụ"
                        item-title="text"
                        item-value="value"
                        required
                    />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="crewmember.licenseExpiry" label="Ngày hết hạn giấy phép" type="date" required />
                </v-col>
                <v-col cols="12" md="6">
                    <v-select
                        v-model="crewmember.status"
                        :items="statusOptions"
                        label="Tình trạng"
                        item-title="text"
                        item-value="value"
                        required
                    />
                </v-col>

                <v-col cols="12" md="6">
                    <v-btn type="submit" color="primary">Cập nhật</v-btn>
                </v-col>
            </v-row>
        </v-form>
        <!-- Modal thông báo thành công -->
        <success-modal
            :visible="isSuccessVisible"
            :message="'Thông tin thành viên đã được cập nhật thành công!'"
            @close="closeSuccessModal"
        />

        <!-- Modal thông báo thất bại -->
        <error-modal :visible="isErrorVisible" :message="errorMessage" @close="closeErrorModal" />
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/services/api';
import LoadingModal from '@/components/LoadingModal.vue';
import SuccessModal from '@/components/SuccessModa.vue';
import ErrorModal from '@/components/ErrorModal.vue';

const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const route = useRoute();
const router = useRouter();

const crewmember = ref(null);
const isLoading = ref(false);

const positionOptions = [
    { value: 'PILOT', text: 'Cơ trưởng' },
    { value: 'COPILOT', text: 'Cơ phó' },
    { value: 'ATTENDANT', text: 'Tiếp viên' }
];
const statusOptions = [
    { value: 'ACTIVE', text: 'Đang làm việc' },
    { value: 'INACTIVE', text: 'Không làm việc' },
    { value: 'SUSPENDED', text: 'Tạm ngừng' }
];

// Fetch dữ liệu thành viên khi trang được tải
const fetchCrewmember = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`/crew-member/${route.params.id}`);
        crewmember.value = response.data.data;
    } catch (error) {
        console.error('Error fetching crewmember:', error);
    } finally {
        isLoading.value = false;
    }
};
const closeSuccessModal = () => {
    isSuccessVisible.value = false;
    router.push({ name: 'CrewMemberPage' });
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};
onMounted(fetchCrewmember);

const updateCrewmember = async () => {
    isLoading.value = true;
    try {
        const response = await axios.put(`/crew-member/update/${crewmember.value.id}`, crewmember.value);
        if (response.data.code === '200') {
            crewmember.value = response.data.data;
            isSuccessVisible.value = true;
        } else {
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Có lỗi xảy ra khi cập nhật thông tin.';
        }
    } catch (error) {
        isErrorVisible.value = true;
        errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.';
        console.error('Error submitting form:', error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.mb-4 {
    margin-bottom: 1rem;
}
</style>
