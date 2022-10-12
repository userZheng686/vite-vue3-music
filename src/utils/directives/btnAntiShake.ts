import { App, DirectiveBinding } from 'vue'
let timer: NodeJS.Timeout | null = null

export default (app: App<Element>) => {
    app.directive('btnAntiShake', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
            el.addEventListener('click', () => {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    timer = null
                    binding.value()
                }, 1000);
            })
        }
    })

    app.directive('wheelAntiShake', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
            el.addEventListener('wheel', (e) => {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    timer = null
                    binding.value(e)
                }, 100);

            })
        }
    })

    app.directive('mouseMoveAntiShake', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
            el.addEventListener('mousemove', () => {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = setTimeout(() => {
                    timer = null
                    binding.value(el)
                }, 1000);
            })
        }
    })
}
