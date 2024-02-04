import { ACCESS_TOKEN, USER } from '~/constants/Token'

const user: any = useCookie(USER)
const access_token = useCookie(ACCESS_TOKEN)

const { shop, _id, isOwner } = user.value && user.value
const { name } = shop

const chatTemplateData = ref()
export const getChatTemplate = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/chat-template?shopName=${name}`,
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
      await getChatTemplate()
    }
  } catch (error: any) {
    console.log(error)
  }

  return { chatTemplateData }
}

const socialInfo = ref()
export const getSocialAccount = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/social-account?ownerId=${_id}`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + access_token.value,
      },
    })
    if (response.status === 200) {
      socialInfo.value = await response.json()
    } else if (response.status === 401) {
      console.log('call - refresh token')
      await useRefreshToken()
      await getSocialAccount()
    }
  } catch (error: any) {
    console.log(error)
  }

  return { socialInfo }
}

const latestMessages = ref()
export const getLatestMsg = async () => {
  if (isOwner) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/social-message/${name}/latest`,
        {
          method: 'get',
          headers: {
            Authorization: 'Bearer ' + access_token.value,
          },
        }
      )
      if (response.status === 200) {
        latestMessages.value = await response.json()
      } else if (response.status === 401) {
        console.log('call - refresh token')
        await useRefreshToken()
        await getLatestMsg()
      }
    } catch (error: any) {
      console.log(error)
    }
  }
  return { latestMessages }
}

export const updateMsg = async (userId: string, msgId: string) => {
  const res = await useFetch(
    `${import.meta.env.VITE_BASE_URL}/social-message/${name}/${userId}/${msgId}`,
    {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
      body: JSON.stringify({
        isRead: true,
      }),
    }
  )
  if (res.status.value === 'error') {
    await useRefreshToken()
    await updateMsg(userId, msgId)
  }
  if (res.status.value === 'success') {
    await getLatestMsg()
  }
  nextTick(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
}