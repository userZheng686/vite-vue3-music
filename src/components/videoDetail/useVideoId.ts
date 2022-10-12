import { ref } from 'vue'
import { useRoute } from 'vue-router'


const useVideoId = (): string => {
    let id = ''

    let route = useRoute()

    if (route.query?.vid) {
        id = String(route.query.vid)
    }

    return id
}

export default useVideoId