<template>
    <div>
        <v-card class="white pa-4" flat>
            <v-form>
                <v-text-field
                    v-model="code"
                    :label="$t('form.airlineCode')"
                    required
                />
                <v-text-field
                    v-model="name"
                    :label="$t('form.airlineName')"
                    required
                />
                <input ref="fileInputRef" type="file" @change="handleFileChange" />

                <v-btn
                    color="primary"
                    @click="submitForm"
                    class="mt-4"
                    :disabled="isSubmitting"
                >
                    {{ $t('buttons.addAirline') }}
                </v-btn>
                <v-btn color="content" @click="goBack" class="mt-4">
                    {{ $t('buttons.goBack') }}
                </v-btn>
            </v-form>
        </v-card>
    </div>

    <!-- Modal thông báo thành công -->
    <success-modal
        :visible="isSuccessVisible"
        :message="$t('messages.addSuccess')"
        @close="closeSuccessModal"
    />

    <!-- Modal thông báo thất bại -->
    <error-modal
        :visible="isErrorVisible"
        :message="errorMessage"
        @close="closeErrorModal"
    />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../services/api';
import ErrorModal from '@/components/ErrorModal.vue';
import SuccessModal from '@/components/SuccessModa.vue';

const router = useRouter();

// Khai báo các Enum có sẵn cho "status" và "typeEnums"



const code = ref('');
const name = ref('');
const file = ref(null);

const isSubmitting = ref(false);
const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const fileInputRef = ref(null);



function goBack() {
    router.push({ name: 'AirlinesList' });
}

function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
    file.value = selectedFile;
}


const closeSuccessModal = () => {
    isSuccessVisible.value = false;
    router.push({ name: 'AirlinesList' });
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};

async function submitForm() {
    isSubmitting.value = true;

    if (!code.value || !name.value ||  !file.value) {
        errorMessage.value = 'Vui lòng điền đầy đủ thông tin và chọn ảnh.';
        isErrorVisible.value = true;
        isSubmitting.value = false;
        return;
    }

    try {
        const payload = {
            code: code.value,
            name: name.value,
        };
        console.log(payload);

        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        console.log(formData);

        if (file.value) {
            formData.append('file', file.value);
        } else {
            console.error('File not selected');
        }
        console.log(formData);
        // Gửi yêu cầu
        const response = await axios.post('/airlines', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status === 200) {
            isSuccessVisible.value = true;
        } else {
            errorMessage.value = 'Lỗi: ' + response.statusText;
            isErrorVisible.value = true;
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Lỗi không xác định';
        isErrorVisible.value = true;
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style scoped></style>
