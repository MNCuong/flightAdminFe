<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../services/api';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.vue';
import SuccessModal from '../../components/SuccessModa.vue';
import ErrorModal from '../../components/ErrorModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';

const route = useRoute();
const code = ref('');
const airlines = ref('');
const createAt = ref('');
const updateAt = ref('');

const name = ref('');
const logoUrl = ref('');
const airlineDetails = ref(null);
const router = useRouter();
const isSuccessVisible = ref(false);
const isErrorVisible = ref(false);
const errorMessage = ref('');
const airlineId = route.params.id;
const isLoading = ref(false);

// Fetch flight details

const fetchFlightDetails = async () => {
    isLoading.value = true;

    try {
        const response = await axios.get(`/airlines/${airlineId}`);
        airlineDetails.value = response.data.data;

        name.value = airlineDetails.value.name || '';
        code.value = airlineDetails.value.code || '';
        logoUrl.value = airlineDetails.value.logoUrl || '';
        createAt.value = airlineDetails.value.createdAt || '';
        updateAt.value = airlineDetails.value.updatedAt || '';
    } catch (error) {
        isErrorVisible.value = true;
        errorMessage.value = error || 'Có lỗi xảy ra khi cập nhật hãng bay.';
        console.error('Error fetching airline details:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchFlightDetails);

// Handle form submission
const submitForm = async () => {
    isLoading.value = true;

    try {
        const updatedData = {
            name: name.value,
            code: code.value
        };

        console.log('Updating airline:', updatedData);

        const response = await axios.put(`/airlines/${airlineId}`, updatedData);
        console.log('Update response:', response.data);
        if (response.status === 200) {
            isSuccessVisible.value = true;
            await fetchFlightDetails();
        } else {
            isErrorVisible.value = true;
            errorMessage.value = response.data.message || 'Có lỗi xảy ra khi cập nhật hãng bay.';
        }
    } catch (error) {
        isErrorVisible.value = true;
        errorMessage.value = error || 'Có lỗi xảy ra khi cập nhật hãng bay.';
        console.error('Error submitting form:', error);
    } finally {
        isLoading.value = false;
    }
};
const closeSuccessModal = () => {
    isSuccessVisible.value = false;
};

// Close Error Modal
const closeErrorModal = () => {
    isErrorVisible.value = false;
};
// Go back to the flight list
const goBack = () => {
    router.push({ name: 'AirlinesList' });
};
</script>

<template>
    <loading-modal :visible="isLoading" />

    <v-form>
        <v-row>
            <v-col cols="12" md="6">
                <div v-if="airlineDetails">
                    <div v-if="airlineDetails.logoUrl">
                        <v-img
                            :src="airlineDetails.logoUrl"
                            :alt="$t('alt.airlineImage', { name: airlineDetails.name })"
                            max-width="100%"
                            aspect-ratio="1.6"
                            class="rounded"
                            cover
                        >
                            <template #placeholder>
                                <v-row
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                                >
                                    <v-progress-circular indeterminate color="primary" />
                                </v-row>
                            </template>
                        </v-img>
                    </div>
                    <div v-else>
                        <span>{{ $t('messages.noImage') }}</span>
                    </div>
                </div>
            </v-col>

            <v-col cols="12" md="6">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="name"
                            :label="$t('form.airlineName')"
                            required
                        />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="code"
                            :label="$t('form.airlineCode')"
                            required
                            disabled
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="createAt"
                            :label="$t('form.createdAt')"
                            required
                            disabled
                        />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="updateAt"
                            :label="$t('form.updatedAt')"
                            required
                            disabled
                        />
                    </v-col>
                </v-row>
                <v-row class="mt-4" justify="end" align="center">
                    <v-col cols="auto" class="d-flex justify-end">
                        <v-btn color="primary" @click="submitForm" class="mr-2">
                            {{ $t('buttons.updateAirline') }}
                        </v-btn>
                        <v-btn color="grey" @click="goBack">
                            {{ $t('buttons.goBack') }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-form>

    <!-- Modal thông báo thành công -->
    <success-modal
        :visible="isSuccessVisible"
        :message="$t('messages.updateSuccess')"
        @close="closeSuccessModal"
    />

    <!-- Modal thông báo thất bại -->
    <error-modal
        :visible="isErrorVisible"
        :message="errorMessage"
        @close="closeErrorModal"
    />
</template>

<style scoped>
.flight-details-section {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
}

h1 {
    color: #0077b6;
}
</style>
