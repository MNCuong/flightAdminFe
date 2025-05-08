import {
    LayoutDashboardIcon, BorderAllIcon,
    AlertCircleIcon, CircleDotIcon,
    BoxMultiple1Icon, LoginIcon,
    MoodHappyIcon, ApertureIcon, UserPlusIcon,
    PlaneIcon, PlaneDepartureIcon,
    UserIcon, ChartPieIcon, LogoutIcon,
    BookmarkIcon
} from 'vue-tabler-icons';

const sidebarItem = [
    { header: 'Home' },
    {
        title: 'Dashboard',
        icon: LayoutDashboardIcon,
        BgColor: 'primary',
        to: '/'
    },
    {
        title: 'Quản lý phi cơ',
        icon: PlaneIcon,
        BgColor: 'primary',
        // children: [
        //     {
        //         title: 'Danh sách phi cơ',
        //         to: '/',
        //         icon: PlaneIcon
        //     },
        //     {
        //         title: 'Thêm phi cơ',
        //         to: '/',
        //         icon: PlaneIcon
        //     }
        // ]
        to: '/aircrafts'
    },
    {
        title: 'Quản lý chuyến bay',
        icon: PlaneDepartureIcon,
        BgColor: 'primary',
        // children: [
        //     {
        //         title: 'Danh sách chuyến bay',
        //         to: '/',
        //         icon: PlaneDepartureIcon
        //     },
        //     {
        //         title: 'Tạo chuyến bay mới',
        //         to: '/',
        //         icon: PlaneDepartureIcon
        //     }
        // ]
        to: '/flights'
    },

    {
        title: 'Quản lý khách hàng',
        icon: UserIcon,
        BgColor: 'primary',
        // children: [
        //     {
        //         title: 'Danh sách khách hàng',
        //         to: '/',
        //         icon: UserIcon
        //     },
        //     {
        //         title: 'Thêm khách hàng',
        //         to: '/',
        //         icon: UserIcon
        //     }
        // ]
        to: '/customer'

    },
    {
        title: 'Quản lý đặt vé',
        icon: BookmarkIcon,
        BgColor: 'primary',
        to: '/booking'
    },

    {
        title: 'Báo cáo thống kê',
        icon: ChartPieIcon,
        BgColor: 'primary',
        to: '/statistical-report'
    },
    { header: 'Logout' },
    {
        title: 'Logout',
        icon: LogoutIcon,
        BgColor: 'primary',
        to: '/'
    },
];

export default sidebarItem;
