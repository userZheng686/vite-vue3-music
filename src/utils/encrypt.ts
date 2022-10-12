export interface encryptResult {
    hlpretag: string;
    hlposttag: string;
    s: string;
    type: string;
    offset: string;
    total: string;
    limit: string;
    csrf_token: string;
}


/**加密方法步骤 */
// 先进行两次的AES加密
// 第一次是先将歌曲信息和密钥进行一次加密 密钥是0CoJUm6Qyw8W8jud
// 第二次是将第一次加密的结果和密钥（16位字符串进行加密）
// 第三次将第二次结果进行一次RSA加密
// 最后返回第二次加密的结果和第三次加密的结果

export const encryptSearch = function (text: string, type: string, limit?: string): encryptResult {
    let json = {
        "hlpretag": "<span class=\"s-fc7\">",
        "hlposttag": "</span>",
        "s": text,
        type,
        "offset": "0",
        "total": "true",
        "limit": limit ? limit : "20",
        "csrf_token": ""
    }

    if (document.cookie) {
        let matchCookie = (document['cookie'] || '').match(/_csrf=([^(;|$)]+)/)
        if (matchCookie) {
            json.csrf_token = matchCookie[0].split('=')[1]
        }
    }

    return json
}


