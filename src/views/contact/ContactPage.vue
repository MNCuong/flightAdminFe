<template>
    <div>
        <h2>Quản lý Liên hệ của khách hàng</h2>

        <ul>
            <li v-for="contact in contacts" :key="contact.id">
                <a href="#" @click.prevent="selectContact(contact.id)">
                    {{ contact.title }} — Trạng thái: {{ contact.status }} — Khách hàng: {{ contact.userId }}
                </a>
            </li>
        </ul>

        <div v-if="selectedContact">
            <h3>Chi tiết liên hệ: {{ selectedContact.contact.title }}</h3>

            <p>
                Trạng thái:
                <select v-model="selectedContact.contact.status" @change="updateStatus">
                    <option value="Pending">Đang chờ</option>
                    <option value="Replied">Đã phản hồi</option>
                    <option value="Closed">Đã đóng</option>
                </select>
            </p>

            <div v-for="reply in selectedContact.replies" :key="reply.id" class="reply">
                <b>{{ reply.sender }}:</b> {{ reply.message }} <i>({{ formatDate(reply.createdAt) }})</i>
            </div>

            <!-- Nút mở modal -->
            <button @click="showReplyModal = true">Trả lời</button>
        </div>

        <!-- Modal trả lời -->
        <div v-if="showReplyModal" class="modal-overlay">
            <div class="modal-content">
                <h3>Viết câu trả lời</h3>
                <textarea v-model="newMessage" placeholder="Nhập nội dung trả lời..."></textarea>
                <br />
                <button @click="submitReply">Gửi</button>
                <button @click="closeModal">Hủy</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/services/api';

const contacts = ref([]);
const selectedContact = ref(null);
const newMessage = ref("");
const showReplyModal = ref(false);

async function loadContacts() {
    const res = await axios.get('/contact/list');
    contacts.value = res.data;
}

async function selectContact(id) {
    const res = await axios.get(`/contact/tickets/${id}`);
    selectedContact.value = res.data;
    newMessage.value = "";
    showReplyModal.value = false;
}

async function submitReply() {
    if (!newMessage.value.trim()) {
        alert("Nhập nội dung trả lời");
        return;
    }

    await axios.post(`/contact/tickets/${selectedContact.value.contact.id}/replies`, {
        sender: "admin",
        message: newMessage.value.trim()
    });

    await selectContact(selectedContact.value.contact.id);
    await loadContacts();
    newMessage.value = "";
    showReplyModal.value = false;
}

async function updateStatus() {
    const contact = selectedContact.value.contact;
    await axios.put(`/contact/tickets/${contact.id}/status`, { status: contact.status });
    await loadContacts();
}

function closeModal() {
    showReplyModal.value = false;
    newMessage.value = "";
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString();
}

onMounted(loadContacts);
</script>

<style>
.reply {
    border: 1px solid #ddd;
    padding: 6px;
    margin: 6px 0;
}

/* Styles modal đơn giản */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    width: 400px;
    border-radius: 8px;
}

textarea {
    width: 100%;
    height: 100px;
}
</style>
