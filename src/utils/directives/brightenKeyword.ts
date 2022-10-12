import { App, DirectiveBinding } from 'vue'

//搜索高亮
function brightenKeyword(keyword: string, val: string) {
    let res = val
    if (keyword.length > 0) {
        let regexp = new RegExp(keyword, 'gi')
        let match = val.match(regexp)
        if (match?.length) {
            res = val.replace(
                new RegExp(match[0], "gi"),
                '<font color="#f75353">' + match[0] + "</font>"
            );
        }
    }
    return res;
}

//匹配<>
function matchSign(keyword: string) {
    let match = keyword.replace(/</g, '&lt;')
    return match.replace(/>/g, '&gt;')
}

export default (app: App<Element>) => {
    app.directive('brightenKeyword', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
            if (el && binding.modifiers) {
                if (binding.arg && binding.modifiers.length) {
                    el.innerHTML = brightenKeyword(binding.arg, String(binding.modifiers))
                } else if (!binding.arg && Object.keys(binding.modifiers).length) {
                    el.innerHTML = matchSign(String(binding.modifiers))
                }
            }
        },
        updated(el: HTMLElement, binding: DirectiveBinding) {
            if (el && binding.modifiers) {
                if (binding.arg && binding.modifiers.length) {
                    el.innerHTML = brightenKeyword(binding.arg, String(binding.modifiers))
                } else if (!binding.arg && Object.keys(binding.modifiers).length) {
                    el.innerHTML = matchSign(String(binding.modifiers))
                }
            }

        }
    })
}