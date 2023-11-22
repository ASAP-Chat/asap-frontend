export let useGetCookie = () => {
  return {
    accessToken: useCookie('accessToken').value,
    refreshToken: useCookie('refreshToken').value,
    user: useCookie('user').value as any,
  }
}
