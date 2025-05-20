<template>
    <v-dialog v-model="visible" max-width="400px" persistent @after-leave="resetAnimation">
        <v-card class="elevation-10">
            <v-card-title class="headline text-center">{{ $t('errorModal.title') }}</v-card-title>
            <v-card-text class="text-center">
                <!-- Dấu "x" với hiệu ứng động chỉ khi mở -->
                <v-icon large color="red" :class="{ 'error-icon': visible }" ref="errorIcon">mdi-close-circle</v-icon>
                <p class="mt-4">{{ message }}</p>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
                <v-btn color="red" @click="closeModal" class="text-white">{{ $t('buttons.close') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            required: true
        }
    },
    emits: ['close'],
    methods: {
        closeModal() {
            this.$emit('close');
        },
        resetAnimation() {
            // Reset animation by removing the class after the modal closes
            this.$nextTick(() => {
                this.$refs.errorIcon.classList.remove('error-icon');
            });
        }
    }
};
</script>

<style scoped>
.v-dialog {
    border-radius: 12px;
}

.v-card {
    border-radius: 12px;
    padding: 20px;
}

.v-card-title {
    font-weight: bold;
    font-size: 1.25rem;
}

.v-btn {
    font-weight: 600;
    text-transform: uppercase;
    min-width: 120px;
}

.v-card-text p {
    font-size: 1rem;
    font-weight: 500;
    margin-top: 20px;
    color: #333;
}

/* Cập nhật hiệu ứng động cho icon lỗi */
.error-icon {
    animation: zoomIn 0.5s ease-out 1; /* Chạy 1 lần */
    font-size: 3rem;
    margin-bottom: 20px;
}

/* Thêm hiệu ứng phóng to từ xa */
@keyframes zoomIn {
    0% {
        transform: scale(0.3) translateZ(-200px); /* Bắt đầu nhỏ và ở xa */
        opacity: 0; /* Bắt đầu ẩn */
    }
    50% {
        transform: scale(1.1) translateZ(-50px); /* Phóng to một chút và gần hơn */
        opacity: 0.6; /* Độ mờ dần */
    }
    100% {
        transform: scale(1) translateZ(0); /* Dừng lại ở kích thước bình thường */
        opacity: 1; /* Độ mờ sáng rõ */
    }
}
</style>
