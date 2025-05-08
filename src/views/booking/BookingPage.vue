<script setup>
import { ref, onMounted } from 'vue'
import axios from '../../services/api'
import { useRouter } from 'vue-router'

const bookings = ref([])
const router = useRouter()

const fetchBookings = async () => {
  try {
    const response = await axios.get('/bookings') 
    bookings.value = response.data.data
  } catch (error) {
    console.error('Lỗi khi tải danh sách đặt vé:', error)
  }
}

const goToDetail = (id) => {
  router.push({ name: 'BookingDetail', params: { id } })
}

onMounted(fetchBookings)
</script>

<template>
  <div class="container mt-4">
    <h3 class="text-center text-primary mb-4">Danh sách đặt vé</h3>

    <div v-if="bookings.length" class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="thead-light">
          <tr>
            <th>Mã đặt vé</th>
            <th>Hành khách</th>
            <th>Chuyến bay</th>
            <th>Loại vé</th>
            <th>Giá</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.id">
            <td>{{ booking.code }}</td>
            <td>{{ booking.passengerName }}</td>
            <td>{{ booking.flightNumber }}</td>
            <td>{{ booking.ticketType }}</td>
            <td>{{ booking.price.toLocaleString() }} VND</td>
            <td>
              <button class="btn btn-sm btn-info" @click="goToDetail(booking.id)">
                Xem chi tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center text-muted">Không có dữ liệu đặt vé.</div>
  </div>
</template>
