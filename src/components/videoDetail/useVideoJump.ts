//链接跳转
const useVideoJump = <T>(id: number, router: T, category: String) => {
    router.push({
        path: "/video",
        query: {
            id,
            category
        },
    });
};

export default useVideoJump
