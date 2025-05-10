<template>
    <v-dialog v-model="visible" max-width="400px" persistent>
        <v-card class="elevation-10">
            <v-card-title class="headline text-center">Xác Nhận Xóa</v-card-title>
            <v-card-text class="text-center">
                <v-icon large color="red">mdi-alert-circle-outline</v-icon>
                <p class="mt-4">Bạn có chắc chắn muốn xóa không?</p>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
                <v-btn color="grey" @click="cancel" class="mr-3">Hủy</v-btn>
                <v-btn color="red" @click="confirmDelete" class="text-white">Xóa</v-btn>
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
        flightId: {
            type: Number,
            required: true
        }
    },
    emits: ['confirm', 'close'],
    methods: {
        cancel() {
            this.$emit('close');
        },
        confirmDelete() {
            this.$emit('confirm', this.flightId);
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

.v-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.v-btn:hover {
    background-color: #ff4444 !important;
}
.mr-3:hover{
    background-color: #050505 !important;
    color: white;

}
</style>
