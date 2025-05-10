<script setup>
import { UserIcon, MailIcon, ListCheckIcon } from 'vue-tabler-icons';
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn class="" variant="text" v-bind="props" icon>
                <v-avatar size="35">
                    <img src="@/assets/images/profile/user-1.jpg" height="35" alt="user" />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="xl" width="200" elevation="10" class="mt-2">
            <v-list class="py-0" lines="one" density="compact">
<!--                <v-list-item value="item1" color="primary" >-->
<!--                    <template v-slot:prepend>-->
<!--                        <UserIcon stroke-width="1.5" size="20"/>-->
<!--                    </template>-->
<!--                    <v-list-item-title class="pl-4 text-body-1">My Profile</v-list-item-title>-->
<!--                </v-list-item>-->
                <v-list-item value="item2" color="primary" @click="goToAccount">
                    <template v-slot:prepend>
                        <MailIcon stroke-width="1.5" size="20"/>
                    </template>
                    <v-list-item-title  class="pl-4 text-body-1">My Account</v-list-item-title>
                </v-list-item>
<!--                <v-list-item value="item3" color="primary"> -->
<!--                    <template v-slot:prepend>-->
<!--                        <ListCheckIcon stroke-width="1.5"  size="20"/>-->
<!--                    </template>-->
<!--                    <v-list-item-title class="pl-4 text-body-1">My Task</v-list-item-title>-->
<!--                </v-list-item>-->
            </v-list>
            <div class="pt-4 pb-4 px-5 text-center">
                <v-btn @click="logout" color="primary" variant="outlined" class="rounded-pill" block>Đăng xuất</v-btn>
            </div>

        </v-sheet>
    </v-menu>
</template>
<script>
export default {
    // methods: {
    //     logout() {
    //         // Xóa thông tin người dùng khỏi localStorage hoặc sessionStorage nếu có
    //         // localStorage.removeItem('user');  // Ví dụ nếu bạn lưu thông tin người dùng trong localStorage
    //         // Redirect về trang login
    //         this.$router.push('/auth/login'); // Chuyển hướng về trang login
    //     }
    // },
    methods: {
        logout() {
            this.$router.push('/auth/login');
        },
        goToAccount() {
            // const user = JSON.parse(localStorage.getItem('user'));
            // if (user && user.id) {
                this.$router.push(`/account/${user.id}`);
            // } else {
            //     this.$router.push('/auth/login');
            // }
        }
    }

}

</script>
