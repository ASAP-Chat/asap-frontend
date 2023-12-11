const socialInfo = ref()

export const useGetSocialAccount = async () => {
  const { user } = useGetCookie()
  const accessToken = useCookie('accessToken')
  const { _id } = user

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/social-account?ownerId=${_id}`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + accessToken.value,
      },
    })
    if (response.status === 200) {
      socialInfo.value = await response.json()
    } else if (response.status === 401) {
      console.log('call - refresh token')
      await useRefreshToken()
      await useGetSocialAccount()
    }
  } catch (error: any) {
    console.log(error)
  }

  return { socialInfo }
}
