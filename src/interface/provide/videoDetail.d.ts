import { InjectionKey } from 'vue';
import type { Ref } from 'vue'

export const dialogVisibleKey: InjectionKey<Ref<boolean>> = Symbol('');
export const shareContentKey: InjectionKey<Ref<string>> = Symbol('');
export const shareImgKey: InjectionKey<Ref<string>> = Symbol('');
export const shareSourceKey: InjectionKey<Ref<string>> = Symbol('');
export const shareTypeKey: InjectionKey<Ref<string>> = Symbol('');
export const shareIdKey: InjectionKey<Ref<string | number>> = Symbol('');
export const shareCountKey: InjectionKey<Ref<number>> = Symbol('');
export const shareCallbackKey: InjectionKey<Ref<Function>> = Symbol('');