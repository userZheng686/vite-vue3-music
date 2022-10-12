import { InjectionKey } from 'vue';
import type { Ref } from 'vue'

export const emotionKey: InjectionKey<Ref<boolean>> = Symbol('');
export const atKey: InjectionKey<Ref<boolean>> = Symbol('');
export const topicKey: InjectionKey<Ref<boolean>> = Symbol('');
export const contentKey: InjectionKey<Ref<string>> = Symbol('');