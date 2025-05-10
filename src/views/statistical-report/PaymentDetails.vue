<template>
    <v-container>
        <v-row>
            <!-- Chi tiết giao dịch -->
            <v-col cols="12" sm="6" md="6" lg="6">
                <v-card class="pa-4">
                    <v-card-title class="">Chi tiết giao dịch</v-card-title>

                    <v-divider></v-divider>

                    <!-- Thông tin giao dịch -->
<!--                    <v-card-subtitle>-->
<!--                        <strong>Thông tin giao dịch:</strong>-->
<!--                    </v-card-subtitle>-->
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-list dense>
                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">ID giao dịch:</v-list-item-title>
                                        <v-list-item-subtitle>{{ paymentDetails?.id }}</v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Trạng thái:</v-list-item-title>
                                        <v-list-item-subtitle>{{ paymentDetails?.status }}</v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Ngày giao dịch:</v-list-item-title>
                                        <v-list-item-subtitle>{{ formatDate(paymentDetails?.transactionDate) }}</v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-list dense>
                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Số tiền:</v-list-item-title>
                                        <v-list-item-subtitle>{{ formatCurrency(paymentDetails?.amount) }}</v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Phương thức thanh toán:</v-list-item-title>
                                        <v-list-item-subtitle>{{ paymentDetails?.paymentMethod }}</v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Mã giao dịch:</v-list-item-title>
                                        <v-list-item-subtitle>{{ paymentDetails?.transactionNo }}</v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <p><strong>Mô tả:</strong> {{ paymentDetails?.description }}</p>
                        <p><strong>Loại dịch vụ:</strong> {{ paymentDetails?.typeBooking }}</p>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Thông tin người dùng -->
            <v-col cols="12" sm="6" md="6" lg="6">
                <v-card class="pa-4">
                    <v-card-title class="headline">Thông tin người dùng</v-card-title>

                    <v-divider></v-divider>

                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Tên người dùng:</v-list-item-title>
                                        <v-list-item-subtitle>{{ paymentDetails?.user?.fullName }}</v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Email:</v-list-item-title>
                                        <v-list-item-subtitle>{{ paymentDetails?.user?.email }}</v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Số điện thoại:</v-list-item-title>
                                        <v-list-item-subtitle>{{ paymentDetails?.user?.phone }}</v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Ngày tạo tài khoản:</v-list-item-title>
                                        <v-list-item-subtitle>{{ formatDate(paymentDetails?.user?.createdAt) }}</v-list-item-subtitle>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-title class="font-weight-bold">Vai trò:</v-list-item-title>
                                        <v-list-item-subtitle>{{ paymentDetails?.user?.roles }}</v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <!-- Thêm nút nếu cần -->
                    <v-card-actions>
                        <v-btn color="primary" @click="goBack">Quay lại</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../services/api';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const paymentDetails = ref(null);

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(value);
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
};

const fetchPaymentDetail = async () => {
    try {
        const response = await axios.get(`/payment/payment-detail/${route.params.id}`);
        console.log(response.data);
        if (response.data && response.data.data) {
            paymentDetails.value = response.data.data;
        } else {
            console.error('Không có dữ liệu giao dịch hoặc dữ liệu không hợp lệ');
            paymentDetails.value = null;
        }
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết giao dịch:', error);
        paymentDetails.value = null;
    }
};

onMounted(fetchPaymentDetail);

const goBack = () => {
    router.go(-1); // Quay lại trang trước đó
};
</script>

<style scoped>
.v-card {
    margin-bottom: 20px;
    height-max:100% ;
}

.v-card-title {
    background-color: #1976d2;
    color: white;
}

.v-card-subtitle {
    font-weight: bold;
    margin-top: 10px;
}

.v-divider {
    margin: 15px 0;
}

.v-btn {
    width: 100%;
}
</style>

<!--<script setup>-->
<!--import { ref, onMounted } from 'vue';-->
<!--import axios from '../../services/api';-->
<!--import { useRoute } from 'vue-router';-->

<!--const route = useRoute();-->
<!--const paymentDetails = ref(null);-->

<!--const formatCurrency = (value) => {-->
<!--    return new Intl.NumberFormat('vi-VN', {-->
<!--        style: 'currency',-->
<!--        currency: 'VND',-->
<!--        minimumFractionDigits: 0-->
<!--    }).format(value);-->
<!--};-->

<!--const formatDate = (dateStr) => {-->
<!--    const date = new Date(dateStr);-->
<!--    return date.toLocaleDateString('vi-VN');-->
<!--};-->

<!--const fetchPaymentDetail = async () => {-->
<!--    try {-->
<!--        const response = await axios.get(`/payment/payment-detail/${route.params.id}`);-->


<!--        if (response.data ) {-->
<!--            paymentDetails.value = response.data.data;-->
<!--        } else {-->
<!--            console.error('Không có dữ liệu giao dịch hoặc dữ liệu không hợp lệ');-->
<!--            paymentDetails.value = null;-->
<!--        }-->
<!--    } catch (error) {-->
<!--        console.error('Lỗi khi lấy chi tiết giao dịch:', error);-->
<!--        paymentDetails.value = null;-->
<!--    }-->
<!--};-->

<!--onMounted(fetchPaymentDetail);-->
<!--</script>-->

<!--<style scoped>-->
<!--.v-card {-->
<!--    margin-bottom: 20px;-->
<!--}-->

<!--.v-card-title {-->
<!--    background-color: #1976d2;-->
<!--    color: white;-->
<!--}-->

<!--.v-card-subtitle {-->
<!--    font-weight: bold;-->
<!--    margin-top: 10px;-->
<!--}-->
<!--</style>-->
