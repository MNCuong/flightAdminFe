<template>
    <div>
        <div class="modal-backdrop">
            <div class="modal">
                <p>Phiên đăng nhập của bạn đã kết thúc.</p>
                <button @click="handleOk">OK</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Logout",
    mounted() {
        localStorage.removeItem("accessToken");
    },
    methods: {
        handleOk() {
            // Reload lại toàn bộ trang (hoặc chỉ cần push về login)
            window.location.href = "/admin/flight-app/auth/login";
            // hoặc: this.$router.push('/auth/login');
        }
    }
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal {
    background: white;
    padding: 20px 30px;
    border-radius: 8px;
    text-align: center;
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    cursor: pointer;
}
</style>
