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
            component: () => import('@/views/dashboard/index.vue')
        },
        {
            name: 'Alert',
            path: '/ui/alerts',
            component: () => import('@/views/ui-components/Alerts.vue')
        },
        {
            name: 'Buttons',
            path: '/ui/buttons',
            component: () => import('@/views/ui-components/Buttons.vue')
        },
        {
            name: 'Cards',
            path: '/ui/cards',
            component: () => import('@/views/ui-components/Cards.vue')
        },
        {
            name: 'Tables',
            path: '/ui/tables',
            component: () => import('@/views/ui-components/Tables.vue')
        },
        {
            name: 'FlightList',
            path: '/flights',
            component: () => import('@/views/flight/FlightPage.vue'),
        },
        {
            name: 'CreateFlight',
            path: '/flights/create',
            component: () => import('@/views/flight/CreateFlight.vue'),
        }, {
            name: 'UpdateFlight',
            path: '/flights/update/:id',
            component: () => import('@/views/flight/UpdateFlight.vue'),
        },
        {
            name: 'FlightDetail',
            path: '/flights/detail/:id',
            component: () => import('@/views/flight/FlightDetails.vue'),
        },
        {
            name: 'AircraftList',
            path: '/aircrafts',
            component: () => import('@/views/aircraft/AircraftPage.vue'),
        },
        {
            name: 'CreateAircraft',
            path: '/aircraft/create',
            component: () => import('@/views/aircraft/CreateAircraft.vue'),
        }, {
            name: 'UpdateAircraft',
            path: '/aircraft/update/:id',
            component: () => import('@/views/aircraft/UpdateAircraft.vue'),
        }, {
            name: 'BookingPage',
            path: '/booking/',
            component: () => import('@/views/booking/BookingPage.vue'),
        },
        {
            name: 'BookingDetail',
            path: '/booking-detai/:id',
            component: () => import('@/views/booking/BookingDetail.vue'),
        },
        {
            name: 'CustomerPage',
            path: '/customer',
            component: () => import('@/views/customer/CustomerPage.vue'),
        },
        {
            name: 'StatisticalReportPage',
            path: '/statistical-report',
            component: () => import('@/views/statistical-report/ReportStatisticsPage.vue'),
        },
       
    ]
};

export default MainRoutes;
