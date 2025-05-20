import {
    LayoutDashboardIcon,
    PlaneIcon,
    PlaneDepartureIcon,
    UserIcon,
    LogoutIcon,
    StickerIcon,
    GaugeIcon,
    BookmarkIcon,
    FileReportIcon,
} from 'vue-tabler-icons';

const sidebarItem = [
    { header: 'sidebar.home' },
    {
        title: 'sidebar.logout',
        icon: LogoutIcon,
        BgColor: 'primary',
        to: '/logout'
    },
    {
        title: 'sidebar.dashboard',
        icon: LayoutDashboardIcon,
        BgColor: 'primary',
        to: '/'
    },
    {
        title: 'sidebar.airlinesManagement',
        icon: PlaneIcon,
        BgColor: 'primary',
        to: '/airlines'
    },
    {
        title: 'sidebar.flightsManagement',
        icon: PlaneDepartureIcon,
        BgColor: 'primary',
        // to: '/flights'
        children: [
            {
                title: 'Danh sách chuyến bya',
                to: '/flights',
                icon: UserIcon
            },
            {
                title: 'Thêm khách hàng',
                to: '/',
                icon: UserIcon
            }
        ]
    },
    {
        title: 'sidebar.accountsManagement',
        icon: UserIcon,
        BgColor: 'primary',
        to: '/customer'
    },
    {
        title: 'sidebar.ticketsManagement',
        icon: StickerIcon,
        BgColor: 'primary',
        to: '/tickets'
    },
    {
        title: 'sidebar.passengersInfo',
        icon: GaugeIcon,
        BgColor: 'primary',
        to: '/passengers'
    },
    {
        title: 'sidebar.contact',
        icon: GaugeIcon,
        BgColor: 'primary',
        to: '/contact'
    },
    {
        title: 'sidebar.systemManagement',
        icon: BookmarkIcon,
        BgColor: 'primary',
        to: '/system'
    },
    {
        title: 'sidebar.airportsManagement',
        icon: BookmarkIcon,
        BgColor: 'primary',
        to: '/airports'
    },
    {
        title: 'sidebar.statisticalReport',
        icon: FileReportIcon,
        BgColor: 'primary',
        to: '/statistical-report'
    },
    {
        title: '',
        BgColor: 'primary',
        to: '/'
    },
    {
        title: '',
        icon: FileReportIcon,
        BgColor: 'primary',
        to: '/'
    },
];

export default sidebarItem;
