<template>
    <v-dialog v-model="visible" max-width="500px">
        <v-card>
            <v-card-title>
                Cập nhật trạng thái chuyến bay
            </v-card-title>
            <v-card-text>
                <v-select
                    v-model="selectedStatus"
                    :items="flightStatuses"
                    item-title="label"
                    item-value="value"
                    label="Chọn trạng thái chuyến bay"
                    outlined
                />
                <v-textarea v-model="reason" label="Lý do cập nhật" outlined rows="3" />
            </v-card-text>
            <v-card-actions>
                <v-btn @click="close" text>Hủy</v-btn>
                <v-btn @click="updateStatus" color="primary">Cập nhật</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        visible: Boolean,
        flightId: [String, Number],
        currentStatus: String
    },
    data() {
        return {
            selectedStatus: this.currentStatus,
            reason: '',
            flightStatuses: [
                { label: 'Đã lên lịch', value: 'SCHEDULED' },
                { label: 'Đang lên máy bay', value: 'BOARDING' },
                { label: 'Đã khởi hành', value: 'DEPARTED' },
                { label: 'Bị hoãn', value: 'DELAYED' },
                { label: 'Đang bay', value: 'IN_AIR' },
                { label: 'Đã hạ cánh', value: 'LANDED' },
                { label: 'Đã hủy', value: 'CANCELLED' },
                { label: 'Đã chuyển hướng', value: 'REDIRECTED' }
            ]
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
        updateStatus() {
            console.log('Cập nhật trạng thái chuyến bay:', this.flightId, this.selectedStatus, this.reason);

            this.$emit('close');
        }
    },
    watch: {
        currentStatus(newStatus) {
            this.selectedStatus = newStatus;
        }
    }
};

</script>