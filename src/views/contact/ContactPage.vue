<template>
    <v-container>
        <loading-modal :visible="isLoading" />

        <v-row class="mb-4" align="center" justify="space-between">
            <v-col cols="2">
                <v-btn color="success" @click="handleExport">{{ $t('buttons.exportExcel') }}</v-btn>
            </v-col>
            <v-col cols="8">
                <v-text-field v-model="searchQuery" :label="$t('search.placeholder')" outlined clearable hide-details="auto" />
            </v-col>
        </v-row>

        <v-table>
            <thead>
                <tr>
                    <th>{{ $t('table.columns.index') }}</th>
                    <th>{{ $t('table.columns.name') }}</th>
                    <th>{{ $t('table.columns.email') }}</th>
                    <th>{{ $t('table.columns.createdAt') }}</th>
                    <th>{{ $t('table.columns.subject') }}</th>
                    <th>{{ $t('table.columns.status') }}</th>
                    <th>{{ $t('table.columns.actions') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!currentPageData.length && !isLoading">
                    <td :colspan="7">{{ $t('table.noFeedback') }}</td>
                </tr>
                <tr v-for="(contact, index) in currentPageData" :key="contact.id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ contact.name }}</td>
                    <td>{{ contact.email }}</td>
                    <td>{{ formatDateTime(contact.create_at) }}</td>
                    <td>{{ contact.subject }}</td>
                    <td>
                        <v-chip :color="setStatusColor(contact.status)" dark>
                            {{ $t('labels.' + (contact.status || 'UNKNOWN')) }}
                        </v-chip>
                    </td>


                    <td>
<!--                        <template v-if="contact.status !== 'REPLIED'">-->
                            <div style="position: relative; display: inline-block">
                                <v-btn color="primary" class="mr-2" @click="repContact(contact)">
                                    {{ $t('buttons.feedback') }}
                                </v-btn>
                            </div>
<!--                        </template>-->
<!--                        <template v-else>-->
<!--                            <v-chip color="success" text-color="white">{{ $t('labels.REPLIED') }}</v-chip>-->
<!--                        </template>-->
                        <div style="position: relative; display: inline-block">
                            <v-btn color="info" class="mr-2" @click="readContact(contact)">
                                {{ $t('buttons.detail') }}
                            </v-btn>
                            <span v-if="contact.status === 'NEW'" class="dot"></span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" />

        <!-- Modal phản hồi -->
        <v-dialog v-model="replyDialog" max-width="600px">
            <v-card>
                <v-card-title>{{ $t('modal.replyTitle') }}</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <p>
                        <strong>{{ $t('modal.emailReply') }}</strong> {{ currentContact?.email }}
                    </p>
                    <br />
                    <v-form ref="replyForm" v-model="valid" lazy-validation>
                        <v-text-field
                            v-model="replyTitle"
                            :label="$t('table.columns.subject')"
                            :rules="[(v) => !!v || $t('buttons.cancel') + ' không được để trống']"
                            required
                        />
                        <br />
                        <v-textarea
                            v-model="replyContent"
                            :label="$t('modal.emailReply')"
                            :rules="[(v) => !!v || $t('buttons.cancel') + ' không được để trống']"
                            required
                        />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="closeReplyModal">{{ $t('buttons.cancel') }}</v-btn>
                    <v-btn color="primary" :disabled="!valid" @click="sendReply">{{ $t('buttons.send') }} </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="isReplying" persistent max-width="300">
            <v-card class="pa-5 text-center">
                <div v-if="replySuccess === null">
                    <v-progress-circular indeterminate color="primary" size="40" />
                    <div class="mt-3">{{ $t('modal.sending') }}</div>
                </div>

                <div v-else-if="replySuccess === true">
                    <v-icon color="green" size="48">mdi-check-circle</v-icon>
                    <div class="mt-3">{{ $t('modal.sendSuccess') }}</div>
                </div>

                <div v-else>
                    <v-icon color="red" size="48">mdi-close-circle</v-icon>
                    <div class="mt-3">{{ $t('modal.sendFail') }}</div>
                </div>
            </v-card>
        </v-dialog>

        <v-dialog v-model="isDetailModalOpen" max-width="600px" persistent>
            <v-card elevation="4">
                <v-card-title class="text-h6 d-flex justify-space-between align-center">
                    <div>
                        <v-icon class="mr-2" color="primary">mdi-account-circle</v-icon>
                        {{ $t('modal.contactDetailTitle') }}
                    </div>
                    <v-btn icon @click="isDetailModalOpen = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text v-if="selectedContact">
                    <v-list dense>
                        <v-list-item>
                            <v-list-item-title
                                ><strong>{{ $t('table.columns.name') }}:</strong> {{ selectedContact.name }}
                            </v-list-item-title>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title
                                ><strong>{{ $t('table.columns.email') }}:</strong>
                                {{ selectedContact.email }}
                            </v-list-item-title>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title
                                ><strong>{{ $t('table.columns.subject') }}:</strong>
                                {{ selectedContact.subject }}
                            </v-list-item-title>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>
                                <strong>{{$t('labels.message')}}</strong>
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-pre-wrap text-body-2">
                                {{ selectedContact.message }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>
                                <strong>{{ $t('labels.status') }}:</strong>
                                <v-chip :color="setStatusColor(selectedContact.status)" class="ml-2" text-color="white" small>
                                    {{ $t('labels.' + (selectedContact.status || 'UNKNOWN')) }}
                                </v-chip>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn color="primary" @click="isDetailModalOpen = false">{{ $t('buttons.close') }}</v-btn>
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
import dayjs from 'dayjs';

const router = useRouter();
const contacts = ref([]);
const currentPage = ref(1);
const pageSize = 10;

const searchQuery = ref('');
const isLoading = ref(false);
const totalPages = ref(1);

const currentPageData = computed(() => contacts.value);



function setStatusColor(status) {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'new' || normalized === 'mới') {
        return 'error';
    } else if (normalized === 'read' || normalized === 'đã đọc') {
        return 'warning';
    } else if (normalized === 'replied' || normalized === 'đã phản hồi') {
        return 'success';
    } else {
        return 'grey';
    }
}


function formatDateTime(datetimeStr) {
    const date = new Date(datetimeStr);

    const pad = (num) => num.toString().padStart(2, '0');

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}

const fetchContacts = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get('/contact/list', {
            params: {
                page: currentPage.value - 1,
                size: pageSize,
                search: searchQuery.value
            }
        });
        contacts.value = response.data.data.content;
        totalPages.value = Math.ceil(response.data.data.totalElements / pageSize);
    } catch (error) {
        console.error('Error fetching contact data:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchContacts);
watch(currentPage, fetchContacts);
watch(searchQuery, fetchContacts, { immediate: true });

const replyDialog = ref(false);
const replyTitle = ref('');
const replyContent = ref('');
const valid = ref(false);
const currentContact = ref(null);
const replyForm = ref(null);

const isReplying = ref(false);
const replySuccess = ref(false);
const selectedContact = ref(null);
const isDetailModalOpen = ref(false);

function closeReplyModal() {
    replyDialog.value = false;
}

async function readContact(contact) {
    selectedContact.value = contact;
    isDetailModalOpen.value = true;
    if (contact.status === 'NEW') {
        try {
            await axios.put(`/contact/${contact.id}/mark-read`);
            contact.status = 'READ';
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái READ:', error);
        }
    }
}

function repContact(contact) {
    // if (contact.status === 'REPLIED') {
    //     return;
    // }

    currentContact.value = contact;
    replyTitle.value = '';
    replyContent.value = '';
    valid.value = false;

    replyDialog.value = true;
}

async function sendReply() {
    if (!replyForm.value.validate()) {
        return;
    }

    const payload = {
        email: currentContact.value.email,
        subject: replyTitle.value,
        message: replyContent.value,
        id: currentContact.value.id
    };

    isReplying.value = true;
    replySuccess.value = null;

    try {
        const response = await axios.post('/contact/reply', payload);
        if (response.status === 200) {
            replySuccess.value = true;

            setTimeout(() => {
                currentContact.value.status = 'REPLIED';
                closeReplyModal();
                replySuccess.value = null;
                isReplying.value = false;
            }, 1500);
        } else {
            replySuccess.value = false;
            setTimeout(() => {
                replySuccess.value = null;
                isReplying.value = false;
            }, 1500);
        }
    } catch (error) {
        replySuccess.value = false;
        setTimeout(() => {
            replySuccess.value = null;
            isReplying.value = false;
        }, 1500);
        alert('Gửi phản hồi thất bại:', error);
    }
}

function handleExport() {
    if (!contacts.value.length) {
        alert('Không có dữ liệu để xuất Excel');
        return;
    }

    const formattedData = contacts.value.map((contact, index) => ({
        STT: index + 1,
        'Họ tên': contact.name,
        Email: contact.email,
        'Tiêu đề': contact.subject,
        'Nội dung': contact.message,
        'Ngày tạo': new Date(contact.create_at).toLocaleDateString('vi-VN')
    }));

    exportToExcel(formattedData);
}
</script>

<style scoped>
.mb-4 {
    margin-bottom: 1rem;
}

.dot {
    position: absolute;
    top: -4px;
    right: 6px;
    height: 10px;
    width: 10px;
    background-color: #f85050;
    border-radius: 50%;
    display: inline-block;
    z-index: 10;
}
</style>
