<template>
    <v-container>
        <v-form>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field v-model="airport" :label="$t('table.airport')" required />
                    <v-text-field v-model="code" :label="$t('table.code')" required />
                    <v-text-field v-model="city" :label="$t('table.city')" required />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="country" :label="$t('table.country')" required />
                    <v-select
                        v-model="selectedTimezone"
                        :items="timezones"
                        :label="$t('table.timezone')"
                        item-title="label"
                        item-value="value"
                        outlined
                        clearable
                    />
                    <v-text-field v-model="gate" :label="$t('table.gate')" required />
                </v-col>
            </v-row>

            <v-row class="mt-4" justify="end" align="center">
                <v-col cols="auto" class="d-flex justify-end">
                    <v-btn color="primary" @click="submitForm" class="mr-2">
                        {{ $t('buttons.addAirport') }}
                    </v-btn>
                </v-col>
                <v-col cols="auto" class="d-flex justify-end">
                    <v-btn color="white" @click="goBack" class="mr-2">
                        {{ $t('buttons.goBack') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>

        <!-- Modal thông báo thành công -->
        <success-modal
            :visible="isSuccessVisible"
            :message="$t('messages.deleteAirportSuccess')"
            @close="closeSuccessModal"
        />

        <!-- Modal thông báo thất bại -->
        <error-modal
            :visible="isErrorVisible"
            :message="errorMessage"
            @close="closeErrorModal"
        />
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
const airport = ref('');
const code = ref('');
const city = ref('');
const country = ref('');
const gate = ref('');
const timezone = ref('');

const selectedTimezone = ref(null);

const timezones = [
    { label: 'UTC (Universal Time Coordinated)', value: 'UTC' },
    { label: 'GMT (Greenwich Mean Time)', value: 'GMT' },
    { label: 'EST (Eastern Standard Time, GMT-5)', value: 'America/New_York' },
    { label: 'CST (Central Standard Time, GMT-6)', value: 'America/Chicago' },
    { label: 'MST (Mountain Standard Time, GMT-7)', value: 'America/Denver' },
    { label: 'PST (Pacific Standard Time, GMT-8)', value: 'America/Los_Angeles' },
    { label: 'CET (Central European Time, GMT+1)', value: 'Europe/Paris' },
    { label: 'AEST (Australian Eastern Standard Time, GMT+10)', value: 'Australia/Sydney' },
    { label: 'ICT (Indochina Time, GMT+7)', value: 'Asia/Bangkok' },
    { label: 'ICT (Vietnam Time, GMT+7)', value: 'Asia/Ho_Chi_Minh' },
    { label: 'IST (India Standard Time, GMT+5:30)', value: 'Asia/Kolkata' },
    { label: 'JST (Japan Standard Time, GMT+9)', value: 'Asia/Tokyo' }
];
const submitForm = async () => {
    try {
        const payload = {
            airport: airport.value,
            code: code.value,
            city: city.value,
            country: country.value,
            gate: country.value,
            timezone: selectedTimezone.value
        };
        const response = await axios.post('/airport-info/create', payload);
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
    router.push({ name: 'AirportPage' });
};
const closeSuccessModal = () => {
    isSuccessVisible.value = false;
    router.push({ name: 'AirportPage' });
};

const closeErrorModal = () => {
    isErrorVisible.value = false;
};
</script>

<style scoped>
.text-lg {
    font-size: 1.25rem;
}

.v-select {
    width: 100%;
}

.mb-4 {
    margin-bottom: 1rem;
}
</style>
