<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../services/api';

const username = ref('');
const password = ref('');
const remember = ref(false);
const router = useRouter();

onMounted(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedUsername && savedPassword) {
        username.value = savedUsername;
        password.value = savedPassword;
        remember.value = true;
    }
});

const handleLogin = async () => {
    try {
        const payload = {
            email: username.value,
            password: password.value
        };
        console.log(payload);
        const response = await axios.post('/auth/login', payload);

        const token = response.data.data.token;
        if (token) {
            localStorage.setItem('accessToken', token);

            if (remember.value) {
                localStorage.setItem('rememberedUsername', username.value);
                localStorage.setItem('rememberedPassword', password.value);
            } else {
                localStorage.removeItem('rememberedUsername');
                localStorage.removeItem('rememberedPassword');
            }

            await router.push('/');
        }
    } catch (error) {
        console.error('Đăng nhập thất bại:', error);
        alert('Sai tài khoản hoặc mật khẩu');
    }
};

</script>

<template>
    <div>
        <div class="d-flex align-center text-center mb-6">
            <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
        <span class="bg-surface px-5 py-3 position-relative text-subtitle-1 text-grey100">
VietNam Airline
        </span>
            </div>
        </div>
        <v-row class="mb-3">
            <v-col cols="12">
                <v-label class="font-weight-medium mb-1">Email</v-label>
                <v-text-field
                    v-model="username"
                    variant="outlined"
                    class="pwdInput"
                    hide-details
                    color="primary"
                />
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-medium mb-1">Mật khẩu</v-label>
                <v-text-field
                    v-model="password"
                    variant="outlined"
                    type="password"
                    class="border-borderColor"
                    hide-details
                    color="primary"
                />
            </v-col>
            <v-col cols="12" class="py-0">
                <div class="d-flex flex-wrap align-center w-100">
                    <v-checkbox v-model="remember" hide-details color="primary">
                        <template #label>Nhớ mật khẩu</template>
                    </v-checkbox>

                </div>
            </v-col>
            <v-col cols="12">
                <v-btn
                    @click="handleLogin"
                    size="large"
                    rounded="pill"
                    color="primary"
                    block
                    type="submit"
                    flat
                >
                    Đăng nhập
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>
