import { App, DirectiveBinding } from 'vue'

export default (app: App<Element>) => {

    //标题
    app.directive('title', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
            if (el) {
                el.title = String(el.textContent)
            }
        },
        updated(el: HTMLElement, binding: DirectiveBinding) {
            if (el) {
                if (el.textContent === 'undefined') return
                el.title = String(el.textContent)
            }
        },
    })

}
