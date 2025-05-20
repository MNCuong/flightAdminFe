<template>
    <v-dialog v-model="visible" max-width="85vw">
        <v-card>
            <v-card-title>{{ $t('ticketHistory.title') }}</v-card-title>
            <v-card-text>
                <v-table v-if="tickets.length">
                    <thead>
                    <tr>
                        <th>{{ $t('ticketHistory.seat') }}</th>
                        <th>{{ $t('ticketHistory.class') }}</th>
                        <th>{{ $t('ticketHistory.price') }}</th>
                        <th>{{ $t('ticketHistory.flightCode') }}</th>
                        <th>{{ $t('ticketHistory.checkedIn') }}</th>
                        <th>{{ $t('ticketHistory.checkinDate') }}</th>
                        <th>{{ $t('ticketHistory.transactionNo') }}</th>
                        <th>{{ $t('ticketHistory.createdAt') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="t in tickets" :key="t.id">
                        <td>{{ t.seatNumber }}</td>
                        <td>{{ t.classType }}</td>
                        <td>{{ t.price && t.price.toLocaleString ? t.price.toLocaleString() + '₫' : $t('ticketHistory.na') }}</td>
                        <td>{{ t.flight?.flightCode || $t('ticketHistory.na') }}</td>
                        <td>{{ t.checkedIn ? '✔️' : '❌' }}</td>
                        <td>{{ t.checkinDate ? new Date(t.checkinDate).toLocaleString() : $t('ticketHistory.na') }}</td>
                        <td>{{ t.transactionNo || $t('ticketHistory.na') }}</td>
                        <td>{{ t.createdAt ? new Date(t.createdAt).toLocaleString() : $t('ticketHistory.na') }}</td>
                    </tr>
                    </tbody>
                </v-table>
                <div v-else>{{ $t('ticketHistory.noTickets') }}</div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="$emit('close')">{{ $t('buttons.close') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed } from 'vue';
defineProps({
    visible: Boolean,
    tickets: {
        type: Array,
        default: () => []
    }
});

// const totalAmount = computed(() => {
//     if (!Array.isArray(tickets) || tickets.length === 0) {
//         return 0;
//     }
//
//     return tickets.reduce((total, ticket) => {
//         const price = Number(ticket.price) || 0;
//         return total + price;
//     }, 0);
// });
//
// console.log("Total amount: ", totalAmount.value);
</script>
