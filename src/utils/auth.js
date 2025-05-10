// Đây là hàm kiểm tra người dùng đã đăng nhập chưa
export function isAuthenticated() {
    return !!localStorage.getItem('accessToken'); // hoặc kiểm tra token hợp lệ nếu cần
}
