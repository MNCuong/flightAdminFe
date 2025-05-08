<!-- <script setup>
import { ref, onMounted } from 'vue';
import axios from '../../services';
import SearchInput from '@/components/common/SearchInput.vue';

const customers = ref([]);
const searchQuery = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('/user/list-user');
    customers.value = response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error);
  }
});

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customers.value;
  return customers.value.filter(c =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4 font-weight-bold text-success">Danh sách khách hàng</h1>

    <v-card flat class="pa-4 mb-4">
      <v-row justify="space-between" align="center">
        <v-col cols="12" md="6">
          <SearchInput
            label="Tìm kiếm khách hàng"
            placeholder="Nhập tên hoặc email"
            v-model:searchQuery="searchQuery"
          />
        </v-col>
      </v-row>
    </v-card>

    <v-data-table
      :headers="[
        { text: '#', value: 'index', width: '50px' },
        { text: 'Họ tên', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Số điện thoại', value: 'phone' },
        { text: 'Ngày đăng ký', value: 'registeredAt' },
      ]"
      :items="filteredCustomers"
      class="elevation-1"
      :items-per-page="10"
      item-value="id"
    >
      <template v-slot:item.index="{ index }">
        {{ index + 1 }}
      </template>
    </v-data-table>
  </div>
</template> -->
