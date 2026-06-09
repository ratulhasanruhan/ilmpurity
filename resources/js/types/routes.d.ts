interface PageChild {
    name: string;
    slug: string;
    path: string;
    access: string[];
}

interface RoutePage {
    Icon: LucideIcon;
    name: string;
    path: string;
    slug: string;
    active: boolean;
    children: PageChild[];
    access: string[];
}

interface DashboardRoute {
    title: string;
    slug: string;
    pages: RoutePage[];
}
