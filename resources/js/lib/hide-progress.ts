import { router } from '@inertiajs/react';
import NProgress from 'nprogress';

const hideProgress = () => {
    router.on('start', () => NProgress.remove());
    router.on('finish', () => NProgress.remove());
};

export default hideProgress;
