import { ACCESS_TOKEN } from '~/constants/Cookie'

const access_token = useCookie(ACCESS_TOKEN)

const memberData = ref()
export const getMember = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/team-member`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status === 200) {
      memberData.value = await response.json()
    } else if (response.status === 401) {
      console.log('call - refresh token')
      await useRefreshToken()
      await getMember()
    }
  } catch (error: any) {
    console.log(error)
  }

  return { memberData }
}
