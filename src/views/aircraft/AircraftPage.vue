<script setup>
import AircraftTable from '@/components/aircraft/AircraftTable.vue';
import SearchInput from '@/components/common/SearchInput.vue';

function addAircraft() {
    console.log('Thêm chuyến bay mới!');
}
</script>

<template>
    <div>
        <h1 class="text-h4 mb-4 font-weight-bold">Phi cơ</h1>
        <!--        <v-row >-->
        <v-card class="white pa-2 pb-4 " style="padding-bottom: 20px" flat>
            <v-row justify="space-between" align="center" no-gutters>
                <!-- Ô tìm kiếm nằm bên trái và căn giữa -->
                <v-col cols="8" sm="8" md="6" class="d-flex align-center justify-center">
                    <SearchInput
                        label="Tìm kiếm chuyến bay"
                        placeholder="Nhập mã chuyến bay hoặc số hiệu phi cơ"
                        v-model:searchQuery="searchQuery"
                    />
                </v-col>

                <v-col cols="auto">
                    <v-btn color="primary" @click="addAircraft">Thêm chuyến bay</v-btn>
                </v-col>
            </v-row>
        </v-card>

        <!--        </v-row>-->
        <AircraftTable />
    </div>
</template>
