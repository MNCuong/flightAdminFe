<template>
    <v-dialog v-model="visible" max-width="700px">
        <v-card>
            <v-card-title>Lịch sử đặt vé</v-card-title>
            <v-card-text>
                <v-table v-if="tickets.length">
                    <thead>
                    <tr>
                        <th>Ghế</th>
                        <th>Hạng</th>
                        <th>Giá</th>
                        <th>Chuyến bay</th>
                        <th>Check-in</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="t in tickets" :key="t.id">
                        <td>{{ t.seatNumber }}</td>
                        <td>{{ t.classType }}</td>
                        <td>{{ t.price.toLocaleString() }}₫</td>
                        <td>{{ t.flight?.flightNumber }}</td>
                        <td>{{ t.checkedIn ? '✔️' : '❌' }}</td>
                    </tr>
                    </tbody>
                </v-table>
                <div v-else>Không có vé nào.</div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="$emit('close')">Đóng</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
defineProps({
    visible: Boolean,
    tickets: Array
});
</script>
