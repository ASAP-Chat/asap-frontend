import { ACCESS_TOKEN } from '~/constants/Token'

const access_token = useCookie(ACCESS_TOKEN)

const chatTemplateData = ref()
export const getChatTemplate = async (page: number = 1, onChat: boolean = true) => {
  try {
    const response = await fetch(
      onChat
        ? `${import.meta.env.VITE_BASE_URL}/chat-template?shopName=${name}&$limit=12&page=${page}`
        : `${import.meta.env.VITE_BASE_URL}/chat-template?shopName=${name}`,
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + access_token.value,
        },
      }
    )
    if (response.status === 200) {
      chatTemplateData.value = await response.json()
    } else if (response.status === 401) {
      console.log('call - refresh token')
      await useRefreshToken()
      await getChatTemplate(page)
    }
  } catch (error: any) {
    console.log(error)
  }

  return { chatTemplateData }
}
