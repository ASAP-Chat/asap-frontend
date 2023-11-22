const latestMessages = ref()

const { accessToken, user } = useGetCookie()
const { shop } = user
const { name } = shop

export const useGetLatestMsg = async () => {
  try {
    const response = await useFetch(
      `${import.meta.env.VITE_BASE_URL}/social-message/${name}/latest`,
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }
    )
    if (response.status.value === 'success') {
      latestMessages.value = await response.data.value
    } else {
      console.log('call - refresh token')
      useRefreshToken()
      useGetLatestMsg()
    }
  } catch (error: any) {
    console.log(error)
  }
  return { latestMessages }
}
