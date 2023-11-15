const socialInfo = ref()

const userInfoString = localStorage.getItem('user')
const userInfo = userInfoString && JSON.parse(userInfoString)

const { _id } = userInfo

export const useGetSocialAccount = async () => {
  try {
    const response = await useFetch(
      `${import.meta.env.VITE_BASE_URL}/social-account/?ownerId=${_id}&$limit=3`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    )
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
