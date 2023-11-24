const { refreshToken } = useGetCookie()
const accessToken = useCookie('accessToken')

export const useRefreshToken = async () => {
  try {
    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/refresh-token`, {
      method: 'post',
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    })

    if (response.status.value === 'success') {
      const responseData: any = response.data.value
      accessToken.value = responseData.accessToken
      console.log('refresh token')
    } else if (response.status.value === 'error') {
      useSignOut()
    }
  } catch (error) {
    console.error('Error refreshing token:', error)
    useSignOut() // Log out the user if there is an error refreshing the token
  }
}
