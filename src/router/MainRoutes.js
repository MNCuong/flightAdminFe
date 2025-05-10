const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/',
            meta: { title: 'Dashboard' },

            component: () => import('@/views/dashboard/index.vue')
        },

        {
            name: 'FlightList',
            path: '/flights',
            meta: { title: 'Quản lý chuyến bay' },
            component: () => import('@/views/flight/FlightPage.vue'),
        },
        {
            name: 'CreateFlight',
            path: '/flights/create',
            meta: { title: 'Tạo chuyến bay mới' },
            component: () => import('@/views/flight/CreateFlight.vue'),
        }, {
            name: 'UpdateFlight',
            path: '/flights/update/:id',
            meta: { title: 'Cập nhật chuyến bay' },
            component: () => import('@/views/flight/UpdateFlight.vue'),
        },
        {
            name: 'FlightDetail',
            path: '/flights/detail/:id',
            meta: { title: 'Chi tiết chuyến bay' },
            component: () => import('@/views/flight/FlightDetails.vue'),
        },
        {
            name: 'AircraftList',
            path: '/aircrafts',
            meta: { title: 'Quản lý phi cơ' },
            component: () => import('@/views/aircraft/AircraftPage.vue'),
        },
        {
            name: 'CreateAircraft',
            path: '/aircraft/create',
            meta: { title: 'Thêm phi cơ' },
            component: () => import('@/views/aircraft/CreateAircraft.vue'),
        }, {
            name: 'UpdateAircraft',
            path: '/aircraft/update/:id',
            meta: { title: 'Cập nhật phi cơ' },
            component: () => import('@/views/aircraft/UpdateAircraft.vue'),
        }, {
            name: 'BookingPage',
            path: '/booking/',
            meta: { title: 'Quản lý đặt vé' },
            component: () => import('@/views/booking/BookingPage.vue'),
        },
        {
            name: 'BookingDetail',
            path: '/booking-detai/:id',
            meta: { title: 'Chi tiết đặt vé' },
            component: () => import('@/views/booking/BookingDetail.vue'),
        },
        {
            name: 'CustomerPage',
            path: '/customer',
            meta: { title: 'Quản lý khách hàng' },
            component: () => import('@/views/customer/CustomerPage.vue'),
        },
        {
            name: 'StatisticalReportPage',
            path: '/statistical-report',
            meta: { title: 'Báo cáo thống kê' },
            component: () => import('@/views/statistical-report/ReportStatisticsPage.vue'),
        },
        {
            name: 'PaymentDetail',
            path: '/payment-detail/:id',
            meta: { title: 'Chi tiết giao dịch' },
            component: () => import('@/views/statistical-report/PaymentDetails.vue'),
        },
        {
            name: 'AccountDetailPage',
            path: '/account-detail',
            meta: { title: 'Chi tiết tài khoản' },
            component: () => import('@/views/User.vue'),
        },
        {
            name: 'Logout',
            path: '/logout',
            meta: { title: 'Đăng xuất' },
            component: () => import('@/views/Logout.vue'),
        },
    ]
};

export default MainRoutes;
