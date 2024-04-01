import { ACCESS_TOKEN } from '~/constants/Token'

const access_token = useCookie(ACCESS_TOKEN)

const chatbotStatus = ref()
export const getChatbotStatus = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chatbot-setting`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status === 200) {
      chatbotStatus.value = await response.json()
    } else if (response.status === 401) {
      console.log('call - refresh token')
      await useRefreshToken()
      await getChatbotStatus()
    }
  } catch (error: any) {
    console.log(error)
  }

  return { chatbotStatus }
}

export const updateChatbotStatus = async (id: string, line: boolean, fb: boolean, ig: boolean) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chatbot-setting/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        isEnabledLine: line,
        isEnabledFacebook: fb,
        isEnabledInstagram: ig,
      }),
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })

    if (response.status === 401) {
      await useRefreshToken()
      await updateChatbotStatus(id, line, fb, ig)
    } else {
      console.log('err')
    }
  } catch (error) {
    console.log(error)
  }
}

const chatbotMsg = ref()
export const getChatbotMsg = async (page: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/chatbot-message?$limit=12&page=${page}`,
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + access_token.value,
        },
      }
    )
    if (response.status === 200) {
      chatbotMsg.value = await response.json()
    } else if (response.status === 401) {
      console.log('call - refresh token')
      await useRefreshToken()
      await getChatbotMsg(page)
    }
  } catch (error: any) {
    console.log(error)
  }

  return { chatbotMsg }
}
