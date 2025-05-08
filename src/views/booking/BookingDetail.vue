<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../../services/api'

const route = useRoute()
const router = useRouter()
const booking = ref(null)

const fetchBookingDetail = async () => {
  try {
    const response = await axios.get(`/bookings/${route.params.id}`) // sửa URL theo API thực tế
    booking.value = response.data.data
  } catch (error) {
    console.error('Lỗi khi tải chi tiết đặt vé:', error)
  }
}

const goBack = () => {
  router.push({ name: 'BookingPage' })
}

onMounted(fetchBookingDetail)
</script>

<template>
  <div class="container mt-4">
    <div v-if="booking" class="card p-4 shadow">
      <h3 class="text-success text-center mb-4">Chi tiết đặt vé</h3>

      <div class="row">
        <div class="col-md-6">
          <p><strong>Mã đặt vé:</strong> {{ booking.code }}</p>
          <p><strong>Hành khách:</strong> {{ booking.passengerName }}</p>
          <p><strong>Email:</strong> {{ booking.email }}</p>
          <p><strong>Số điện thoại:</strong> {{ booking.phone }}</p>
        </div>
        <div class="col-md-6">
          <p><strong>Chuyến bay:</strong> {{ booking.flightNumber }}</p>
          <p><strong>Loại vé:</strong> {{ booking.ticketType }}</p>
          <p><strong>Giá vé:</strong> {{ booking.price.toLocaleString() }} VND</p>
          <p><strong>Ngày đặt:</strong> {{ booking.bookingDate }}</p>
        </div>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-secondary" @click="goBack">Quay lại</button>
      </div>
    </div>

    <div v-else class="text-center text-muted">Đang tải chi tiết...</div>
  </div>
</template>
