export const useRefreshToken = async () => {
  const { refreshToken } = useGetCookie()
  const accessToken = useCookie('accessToken')

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
}
