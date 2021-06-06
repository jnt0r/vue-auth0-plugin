/**
 * Extends interfaces in Vue.js
 */
import { ComponentCustomProperties } from 'vue';
import AuthProperty from "./AuthProperty";

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $auth: AuthProperty;
    }
}
