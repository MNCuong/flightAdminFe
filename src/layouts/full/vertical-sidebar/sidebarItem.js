import {
    LayoutDashboardIcon,
    BorderAllIcon,
    AlertCircleIcon,
    CircleDotIcon,
    BoxMultiple1Icon,
    LoginIcon,
    MoodHappyIcon,
    ApertureIcon,
    UserPlusIcon,
    PlaneIcon,
    PlaneDepartureIcon,
    UserIcon,
    ChartPieIcon,
    LogoutIcon,
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
              to: '/aircrafts'
    },
    {
        title: 'Quản lý chuyến bay',
        icon: PlaneDepartureIcon,
        BgColor: 'primary',
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
    }, {
        title: 'Quản lý vé',
        icon: BookmarkIcon,
        BgColor: 'primary',
        to: '/tickets'
    },
    {
        title: 'Thông tin hành khách',
        icon: BookmarkIcon,
        BgColor: 'primary',
        to: '/passengers'
    },
    {
        title: 'Quản lý phi hành đoàn',
        icon: BookmarkIcon,
        BgColor: 'primary',
        to: '/crew-members'
    },

    {
        title: 'Báo cáo thống kê',
        icon: ChartPieIcon,
        BgColor: 'primary',
        to: '/statistical-report'
    },
    { header: 'Logout' },
    {
        title: 'Đăng xuất',
        icon: LogoutIcon,
        BgColor: 'primary',
        to: '/logout'
    }
];

export default sidebarItem;
