import { RouteLocationNormalized } from 'vue-router';
import AbstractAuthenticationGuard from './AbstractAuthenticationGuard';

export default async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
): Promise<boolean> => {
    return AbstractAuthenticationGuard(to, from, true);
};
