/**
 * Extends interfaces in Vue.js
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentCustomProperties } from 'vue';
import AuthProperty from './AuthProperty';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        /**
         * @deprecated The global property $auth should not be used. Use ´inject('auth')´ instead.
         */
        $auth: AuthProperty;
    }
}
