<template>
    <v-container>
        <v-card class="pa-4">
            <v-card-title>{{ $t('systemSettings') }}</v-card-title>

            <v-card-text>
                <v-select
                    v-model="locale"
                    :items="languages"
                    label="{{ $t('language') }}"
                    @change="changeLang"
                />

<!--                <v-form @submit.prevent="saveSettings">-->
<!--                    <v-text-field-->
<!--                        v-model="settings.systemName"-->
<!--                        :label="$t('systemName')"-->
<!--                    />-->
<!--                    <v-text-field-->
<!--                        v-model="settings.adminEmail"-->
<!--                        :label="$t('adminEmail')"-->
<!--                    />-->
<!--                    <v-text-field-->
<!--                        v-model.number="settings.checkInBefore"-->
<!--                        :label="$t('checkInBefore')"-->
<!--                        type="number"-->
<!--                    />-->
<!--                    <v-text-field-->
<!--                        v-model.number="settings.taxPercent"-->
<!--                        :label="$t('taxPercent')"-->
<!--                        type="number"-->
<!--                    />-->
<!--                    <v-btn type="submit" color="primary">{{ $t('save') }}</v-btn>-->
<!--                </v-form>-->
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { locale } = useI18n()
const languages = ['vi', 'en']

const changeLang = (lang) => {
    locale.value = lang
}
</script>
