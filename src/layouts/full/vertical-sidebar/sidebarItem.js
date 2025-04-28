import {
    LayoutDashboardIcon, BorderAllIcon,
    AlertCircleIcon, CircleDotIcon,
    BoxMultiple1Icon, LoginIcon,
    MoodHappyIcon, ApertureIcon, UserPlusIcon,
    PlaneIcon, PlaneDepartureIcon,
    UserIcon, ChartPieIcon, LogoutIcon
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
        to: '/'

    },
    {
        title: 'Báo cáo thống kê',
        icon: ChartPieIcon,
        BgColor: 'primary',
        to: '/'
    },
    { header: 'Logout' },
    {
        title: 'Logout',
        icon: LogoutIcon,
        BgColor: 'primary',
        to: '/'
    },
    { header: 'Ui components' },
    {
        title: 'Alert',
        icon: AlertCircleIcon,
        BgColor: 'primary',
        to: '/ui/alerts',
    },
    {
        title: 'Button',
        icon: CircleDotIcon,
        BgColor: 'primary',
        to: '/ui/buttons',
    },
    {
        title: 'Cards',
        icon: BoxMultiple1Icon,
        BgColor: 'primary',
        to: '/ui/cards',
    },
    {
        title: 'Tables',
        icon: BorderAllIcon,
        BgColor: 'primary',
        to: '/ui/tables',
    },
    { header: 'Auth' },
    {
        title: 'Login',
        icon: LoginIcon,
        BgColor: 'primary',
        to: '/auth/login',
    },
    {
        title: 'Register',
        icon: UserPlusIcon,
        BgColor: 'primary',
        to: '/auth/register',
    },
    { header: 'Extra' },
    {
        title: 'Icons',
        icon: MoodHappyIcon,
        BgColor: 'primary',
        to: '/icons',
    },
    {
        title: 'Sample Page',
        icon: ApertureIcon,
        BgColor: 'primary',
        to: '/sample-page',
    },
];

export default sidebarItem;
