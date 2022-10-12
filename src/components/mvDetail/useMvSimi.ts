import { getSimiMv } from '@/api/api_mv'
import { SimiMvItem } from 'i/api/api_mv.d'

/**
 * 请求相似mv
 * @param mvid mvid
 * @returns 
 */
let useMvSimiList = (mvid: number): Promise<SimiMvItem[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let { mvs } = await getSimiMv(mvid)
            resolve(mvs)
        } catch (err: any) {
            let error = {
                message: err?.message || "请求相似mv列表失败 请检查你的网络是否有问题?"
            }
            reject(error)
        }
    })
}

export default useMvSimiList