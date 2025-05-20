<template>
    <v-container>
        <v-form>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field v-model="name" label="Tên" required />
                </v-col>
                <v-col cols="12" md="6">
                    <v-select
                        v-model="posittion"
                        :items="posittionOptions"
                        label="Chức vụ"
                        item-title="text"
                        item-value="value"
                        hide-selected
                        required
                    />
                </v-col>
            </v-row>

            <v-col cols="12" md="6">
                <label class="font-weight-medium mb-2 d-block"> Ngày hết hạn bằng lái <span class="text-red">*</span> </label>

                <v-date-picker
                    v-model="licenseExpiry"
                    :min="new Date().toISOString().substr(0, 10)"
                    class="mb-2"
                    color="primary"
                    required
                />

                <v-text-field
                    v-if="licenseExpiry"
                    :model-value="new Date(licenseExpiry).toLocaleDateString()"
                    label="Ngày đã chọn"
                    readonly
                    class="mt-2"
                    variant="outlined"
                />
            </v-col>

            <v-row class="mt-4" justify="end" align="center">
                <v-col cols="auto" class="d-flex justify-end">
                    <v-btn color="primary" @click="submitForm" class="mr-2">Thêm thành viên phi hành đoàn</v-btn>
                </v-col>
                <v-col cols="auto" class="d-flex justify-end">
                    <v-btn color="white" @click="goBack" class="mr-2">Quay lại</v-btn>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/services/api';
import ErrorModal from '@/components/ErrorModal.vue';
import SuccessModal from '@/components/SuccessModa.vue';

const router = useRouter();
const name = ref('');
const posittion = ref('');
const licenseExpiry = ref('');
const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const posittionOptions = ref([
    { value: 'PILOT', text: 'Cơ trưởng' },
    { value: 'COPILOT', text: 'Cơ phó' },
    { value: 'ATTENDANT', text: 'Tiếp viên' }
]);

const submitForm = async () => {
    try {
        const payload = {
            name: name.value,
            position: posittion.value,
            licenseExpiry: licenseExpiry.value,
            createAt: new Date().toISOString(),
            updateAt: new Date().toISOString()
        };
        const response = await axios.post('/system/create', payload);
        console.log(payload);
        if (response.data.code === '200') {
            isSuccessVisible.value = true;
        } else {
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Có lỗi xảy ra khi thêm thông tin.';
        }
    } catch (error) {
        isErrorVisible.value = true;
        errorMessage.value = error.response?.data?.message || 'Có lỗi xảy ra khi thêm thông tin.';
        console.error('Error submitting form:', error);
    }
};

const goBack = () => {
    router.push({ name: 'SystemPage' });
};
const closeSuccessModal = () => {
    isSuccessVisible.value = false;
    router.push({ name: 'SystemPage' });
};

// Close Error Modal
const closeErrorModal = () => {
    isErrorVisible.value = false;
};
</script>

<style scoped>
.text-lg {
    font-size: 1.25rem;
}

.mb-4 {
    margin-bottom: 1rem;
}
</style>
