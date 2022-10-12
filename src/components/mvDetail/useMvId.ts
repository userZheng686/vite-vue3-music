import { ref } from 'vue'
import { useRoute } from 'vue-router'


const useMvId = (): number => {
    let id = 0

    let route = useRoute()

    if (route.query?.mvid) {

        id = Number(route.query.mvid)
    }
    return id
}

export default useMvId