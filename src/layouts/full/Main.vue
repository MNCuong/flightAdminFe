<script setup>
import { ref, computed, watch } from 'vue';
import sidebarItems from './vertical-sidebar/sidebarItem';
import NavGroup from './vertical-sidebar/NavGroup/index.vue';
import NavItem from './vertical-sidebar/NavItem/index.vue';
import Logo from './logo/Logo.vue';
import { useI18n } from 'vue-i18n';
// Icon Imports
import { Menu2Icon } from 'vue-tabler-icons';
import NotificationDD from './vertical-header/NotificationDD.vue';
import ProfileDD from './vertical-header/ProfileDD.vue';

const sDrawer = ref(true);

const { locale, t } = useI18n();

const languages = [
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' }
];

watch(locale, (newVal) => {
    localStorage.setItem('locale', newVal);
});

function changeLanguage(langCode) {
    locale.value = langCode;
    localStorage.setItem('locale', langCode);
}
function toggleLanguage() {
    const newLang = locale.value === 'vi' ? 'en' : 'vi';
    locale.value = newLang;
    localStorage.setItem('locale', newLang);
}

// computed sidebar menu: map sidebarItems và dịch header + title
const sidebarMenu = computed(() =>
    sidebarItems.map(item => {
        if (item.header) {
            return { ...item, header: t(item.header) };
        }
        return { ...item, title: t(item.title) };
    })
);
</script>

<template>
    <v-navigation-drawer
        left
        v-model="sDrawer"
        app
        class="leftSidebar ml-sm-5 mt-sm-5 bg-containerBg"
        elevation="10"
        width="270"
        style="height: auto; display: flex; flex-direction: column"
    >
        <div class="pa-5 pl-4">
            <Logo />
        </div>

        <perfect-scrollbar class="scrollnavbar bg-containerBg" style="flex-grow: 1; overflow-y: auto">
            <v-list class="py-4 px-4 bg-containerBg">
                <template v-for="(item, i) in sidebarMenu" :key="i">
                    <NavGroup v-if="item.header" :item="item" />
                    <NavItem v-else class="leftPadding" :item="item" />
                </template>
            </v-list>
        </perfect-scrollbar>
    </v-navigation-drawer>

    <div class="container verticalLayout">
        <div class="maxWidth">
            <v-app-bar elevation="0" height="70">
                <div class="d-flex align-center justify-space-between w-100">
                    <div></div>
                    <div class="d-flex align-center">
                        <v-btn class="hidden-lg-and-up text-muted" @click="sDrawer = !sDrawer" icon variant="flat" size="small">
                            <Menu2Icon size="20" stroke-width="1.5" />
                        </v-btn>

                        <!-- Language switcher -->
                        <!-- Toggle Language Button -->
                       {{$t('labels.language')}}
                        <v-btn
                            class="ml-2 d-flex align-center"
                            rounded
                            height="32"
                            variant="outlined"
                            @click="toggleLanguage"
                            style="min-width: 80px; text-transform: none; font-size: 12px"
                        >
                            <span class="mr-1" style="font-size: 12px">{{ locale === 'vi' ? 'VI' : 'EN' }}</span>
                        </v-btn>

                        <!-- Notification -->
                        <NotificationDD />
                        <ProfileDD />
                    </div>
                </div>
            </v-app-bar>
        </div>
    </div>
</template>
