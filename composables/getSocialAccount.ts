const socialInfo = ref()

const { accessToken, user } = useGetCookie()
const { _id } = user

export const useGetSocialAccount = async () => {
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/social-account`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      params: {
        ownerId: _id,
      },
    })
    if (response.status.value === 'success') {
      socialInfo.value = await response.data.value
    } else {
      console.log('call - refresh token')
      useRefreshToken()
      useGetSocialAccount()
    }
  } catch (error: any) {
    console.log(error)
  }
  return { socialInfo }
}
