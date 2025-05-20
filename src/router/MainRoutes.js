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
            meta: { title: 'dashboard' },
            component: () => import('@/views/dashboard/index.vue')
        },
        {
            name: 'FlightList',
            path: '/flights',
            meta: { title: 'flight_management' },
            component: () => import('@/views/flight/FlightPage.vue')
        },
        {
            name: 'CreateFlight',
            path: '/flights/create',
            meta: { title: 'create_flight' },
            component: () => import('@/views/flight/CreateFlight.vue')
        },
        {
            name: 'UpdateFlight',
            path: '/flights/update/:id',
            meta: { title: 'update_flight' },
            component: () => import('@/views/flight/UpdateFlight.vue')
        },
        {
            name: 'FlightDetail',
            path: '/flights/detail/:id',
            meta: { title: 'flight_detail' },
            component: () => import('@/views/flight/FlightDetails.vue')
        },
        {
            name: 'AircraftList',
            path: '/aircrafts',
            meta: { title: 'aircraft_management' },
            component: () => import('@/views/aircraft/AircraftPage.vue')
        },
        {
            name: 'CreateAircraft',
            path: '/aircraft/create',
            meta: { title: 'create_aircraft' },
            component: () => import('@/views/aircraft/CreateAircraft.vue')
        },
        {
            name: 'UpdateAircraft',
            path: '/aircraft/update/:id',
            meta: { title: 'update_aircraft' },
            component: () => import('@/views/aircraft/UpdateAircraft.vue')
        },
        {
            name: 'AirlinesList',
            path: '/airlines',
            meta: { title: 'airline_management' },
            component: () => import('@/views/airline/AirlinePage.vue')
        },
        {
            name: 'CreateAirline',
            path: '/airline/create',
            meta: { title: 'create_airline' },
            component: () => import('@/views/airline/CreateAirline.vue')
        },
        {
            name: 'UpdateAirline',
            path: '/airline/update/:id',
            meta: { title: 'update_airline' },
            component: () => import('@/views/airline/UpdateAirline.vue')
        },
        {
            name: 'BookingPage',
            path: '/booking/',
            meta: { title: 'booking_management' },
            component: () => import('@/views/booking/BookingPage.vue')
        },
        {
            name: 'BookingDetail',
            path: '/booking-detai/:id',
            meta: { title: 'booking_detail' },
            component: () => import('@/views/booking/BookingDetail.vue')
        },
        {
            name: 'CustomerPage',
            path: '/customer',
            meta: { title: 'customer_management' },
            component: () => import('@/views/customer/CustomerPage.vue')
        },
        {
            name: 'StatisticalReportPage',
            path: '/statistical-report',
            meta: { title: 'statistical_report' },
            component: () => import('@/views/statistical-report/ReportStatisticsPage.vue')
        },
        {
            name: 'PaymentDetail',
            path: '/payment-detail/:id',
            meta: { title: 'payment_detail' },
            component: () => import('@/views/statistical-report/PaymentDetails.vue')
        },
        {
            name: 'AccountDetailPage',
            path: '/account-detail',
            meta: { title: 'account_detail' },
            component: () => import('@/views/User.vue')
        },
        {
            name: 'TicketPage',
            path: '/tickets',
            meta: { title: 'ticket_list' },
            component: () => import('@/views/ticket/TicketPage.vue')
        },
        {
            name: 'SystemPage',
            path: '/system',
            meta: { title: 'system_config' },
            component: () => import('@/views/system/SystemPage.vue')
        },
        {
            name: 'CreateSystem',
            path: '/system/create',
            meta: { title: 'create_system_member' },
            component: () => import('@/views/system/CreateSystem.vue')
        },
        {
            name: 'UpdateSystem',
            path: '/system/update/:id',
            meta: { title: 'update_system_member' },
            component: () => import('@/views/system/UpdateSystem.vue')
        },
        {
            name: 'PassengerPage',
            path: '/passengers',
            meta: { title: 'passenger_info' },
            component: () => import('@/views/passenger/PassengerPage.vue')
        },
        {
            name: 'ViewHistory',
            path: '/view-history',
            meta: { title: 'view_history' },
            component: () => import('@/views/passenger/ViewHistory.vue')
        },
        {
            name: 'AirportPage',
            path: '/airports',
            meta: { title: 'airport_list' },
            component: () => import('@/views/airport/AirPortPage.vue')
        },
        {
            name: 'CreateAirport',
            path: '/airports/create',
            meta: { title: 'create_airport' },
            component: () => import('@/views/airport/CreateAirport.vue')
        },
        {
            name: 'AccountDetailPage',
            path: '/account-detail',
            meta: { title: 'account_detail' },
            component: () => import('@/views/')
        },
        {
            name: 'ContactPage',
            path: '/contact',
            meta: { title: 'contact_page' },
            component: () => import('@/views/contact/ContactPage.vue')
        },
        {
            name: 'Logout',
            path: '/logout',
            meta: { title: 'logout' },
            component: () => import('@/views/Logout.vue')
        }
    ]
};

export default MainRoutes;
