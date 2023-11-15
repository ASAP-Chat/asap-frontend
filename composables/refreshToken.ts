export const useRefreshToken = async () => {
  if (process.client) {
    const refreshToken = localStorage.getItem('refreshToken')

    const response = await useFetch(`${import.meta.env.VITE_BASE_URL}/refresh-token`, {
      method: 'post',
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    })
    if (response.status.value === 'success') {
      const responseData: any = response.data.value
      localStorage.setItem('accessToken', `${responseData.accessToken}`)

      console.log('refresh token')
    } else if (response.status.value === 'error') {
      useSignOut()
    }
  }
}
