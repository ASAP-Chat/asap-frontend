<template>
  <CommonModal
    v-if="socialInfo && socialInfo.data.length === 0"
    :header="
      isOwner
        ? 'ยังไม่ได้ลงทะเบียนบัญชี Social Media!'
        : 'กรุณารอเจ้าของร้านค้าทำการเชิญเข้าร่วมทีมของร้านค้า'
    "
    custom-icon="mdi-store-cog-outline"
    :content="
      isOwner
        ? 'กรุณาตั้งค่าบัญชี Social Media เพื่อใช้งาน ASAP'
        : 'สามารถใช้งานระบบได้เมื่อเจ้าของร้านค้าทำการเชิญเข้าร่วมทีม'
    "
    :buttonText="isOwner ? 'ตั้งค่า' : 'ออกจากระบบ'"
    :isSuccess="false"
    @btn-action="isOwner ? navigateTo('/setting/chat-integration/') : useSignOut()"
  />
  <div>
    <v-navigation-drawer
      permanent
      width="145"
      color="#fafafa"
    >
      <v-list color="primary">
        <v-list-item
          title="ทั้งหมด"
          value="all"
          prepend-icon="mdi-message-outline"
          exact
          base-color="#707070"
          :active="selectedItem === 'all'"
          @click="selectItem('all')"
        ></v-list-item>

        <v-list-subheader> สถานะแชต </v-list-subheader>
        <v-divider></v-divider>
        <v-list-item
          title="รอดำเนินการ"
          value="pending"
          prepend-icon="mdi-emoticon-confused-outline"
          base-color="#707070"
          :active="selectedItem === 'pending'"
          @click="selectItem('pending')"
        ></v-list-item>

        <v-list-item
          title="ดำเนินการ"
          value="doing"
          prepend-icon="mdi-emoticon-neutral-outline"
          base-color="#707070"
          :active="selectedItem === 'doing'"
          @click="selectItem('doing')"
        ></v-list-item>
        <v-list-item
          title="เสร็จสิ้น"
          value="done"
          prepend-icon="mdi-emoticon-happy-outline"
          base-color="#707070"
          :active="selectedItem === 'done'"
          @click="selectItem('done')"
        ></v-list-item>

        <v-list-subheader> Social Media </v-list-subheader>
        <v-divider></v-divider>
        <v-list-item
          title="Line"
          :value="SocialType.LINE"
          prepend-icon="fa:fa-brands fa-line"
          base-color="#707070"
          :active="selectedItem === SocialType.LINE"
          @click="selectItem(SocialType.LINE)"
        >
          <template v-slot:prepend>
            <v-icon color="#02c153"></v-icon>
          </template>
        </v-list-item>

        <v-list-item
          title="Facebook"
          :value="SocialType.FACEBOOK"
          prepend-icon="fa:fa-brands fa-square-facebook"
          base-color="#707070"
          :active="selectedItem === SocialType.FACEBOOK"
          @click="selectItem(SocialType.FACEBOOK)"
        >
          <template v-slot:prepend>
            <v-icon color="#0765FF"></v-icon>
          </template>
        </v-list-item>
        <v-list-item
          title="Instagram"
          :value="SocialType.INSTAGRAM"
          prepend-icon="mdi-instagram"
          base-color="#707070"
          :active="selectedItem === SocialType.INSTAGRAM"
          @click="selectItem(SocialType.INSTAGRAM)"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- drawer รายชื่อ -->
    <v-navigation-drawer
      permanent
      width="280"
      app
    >
      <v-list
        class="tw-p-0"
        v-if="latestMessages"
        v-for="message in filteredMsg"
      >
        <v-list-item
          class="tw-gap-x-3"
          height="90"
          exact
          :title="
            message.isOwner ? message.receiverDetail.displayName : message.senderDetail.displayName
          "
          :value="message.customerId"
          :active="storeSelectCus && message.customerId === storeSelectCus.userId"
          @click="
            setSelectCustomer(
              message.customerId,
              message.isOwner
                ? message.receiverDetail.displayName
                : message.senderDetail.displayName,
              message.isOwner ? message.receiverDetail.pictureUrl : message.senderDetail.pictureUrl,
              message.source,
              message._id
            )
          "
        >
          <template v-slot:subtitle>
            <div :class="message.isRead ? '' : 'font-weight-bold'">
              {{ getMessageSubtitle(message) }}
            </div>
          </template>
          <template v-slot:prepend>
            <v-badge
              color="white"
              class="social_icon"
            >
              <template v-slot:badge>
                <v-icon
                  color="#02c153"
                  :icon="message.source === SocialType.LINE ? 'fa:fa-brands fa-line' : ''"
                  size="small"
                ></v-icon>
              </template>
              <v-avatar
                :image="
                  message.isOwner
                    ? message.receiverDetail.pictureUrl
                    : message.senderDetail.pictureUrl
                "
              />
            </v-badge>
          </template>
          <template v-slot:append>
            <v-badge
              dot
              floating
              color="error"
              v-if="message.isRead === false"
            >
              <time class="tw-text-xs tw-opacity-50">
                {{
                  ((timestamp) => {
                    const messageTimestamp = useDayjs()(message.sourceTimestamp)
                    const currentTimestamp = useDayjs()()

                    const hoursDifference = Math.abs(
                      messageTimestamp.diff(currentTimestamp, 'hours')
                    )

                    return hoursDifference <= 24
                      ? messageTimestamp.fromNow()
                      : messageTimestamp.format('DD/MM/YYYY HH:mm')
                  })(message.sourceTimestamp)
                }}
              </time>
            </v-badge>
            <time
              class="tw-text-xs tw-opacity-50"
              v-else
            >
              {{
                ((timestamp) => {
                  const messageTimestamp = useDayjs()(message.sourceTimestamp)
                  const currentTimestamp = useDayjs()()

                  const hoursDifference = Math.abs(messageTimestamp.diff(currentTimestamp, 'hours'))

                  return hoursDifference <= 24
                    ? messageTimestamp.fromNow()
                    : messageTimestamp.format('DD/MM/YYYY HH:mm')
                })(message.sourceTimestamp)
              }}
            </time>
          </template>
        </v-list-item>
      </v-list>
      <v-list v-if="filteredMsg.length === 0">
        <v-list-item
          disabled
          class="text-center"
          title="ยังไม่มีข้อความ"
        ></v-list-item
      ></v-list>
    </v-navigation-drawer>
  </div>

  <div id="test">
    <div v-if="filteredMessages">
      <div
        v-if="
          storeSelectCus &&
          storeSelectCus.userId.trim() !== '' &&
          storeSelectCus.displayName.trim() !== ''
        "
      >
        <v-app-bar>
          <template v-slot:prepend>
            <v-img
              :width="40"
              :height="40"
              aspect-ratio="1/1"
              cover
              class="tw-rounded-full"
              :src="storeSelectCus.pictureUrl"
            ></v-img>
          </template>
          <v-app-bar-title class="font-weight-bold">
            {{ storeSelectCus.displayName }}
          </v-app-bar-title>
        </v-app-bar>
      </div>
      <div
        class="text-center mb-2"
        v-if="filteredMessages.total > totalChat"
      >
        <v-btn
          prepend-icon="mdi-cursor-default-click-outline"
          variant="flat"
          @click="getMoreChat()"
          :loading="loadingBtn"
        >
          <template v-slot:prepend>
            <v-icon color="primary"></v-icon>
          </template>

          คลิกเพื่อแสดงข้อความก่อนหน้า
        </v-btn>
      </div>
      <div
        v-for="(message, index) in filteredMessages.data.sort((a:any, b:any) => a.sourceTimestamp - b.sourceTimestamp)"
      >
        <ChatBubble
          :msgType="message.messageObject.type"
          :msg-text="message.messageObject.text"
          :msg-sticker="message.messageObject.link"
          :msg-img="message.link[0]"
          :name="message.senderDetail.displayName"
          :img="message.senderDetail.pictureUrl"
          :date="shouldDisplayTime(index) ? message.sourceTimestamp : ''"
          :time="message.sourceTimestamp"
          :is-owner="message.isOwner"
        />
      </div>
    </div>

    <v-footer
      app
      name="footer"
      :class="
        storeSelectCus &&
        storeSelectCus.userId.trim() !== '' &&
        storeSelectCus.displayName.trim() !== ''
          ? ''
          : 'tw-bg-[#f2f2f2]'
      "
    >
      <v-form
        :class="
          storeSelectCus &&
          storeSelectCus.userId.trim() !== '' &&
          storeSelectCus.displayName.trim() !== ''
            ? ''
            : 'tw-invisible'
        "
      >
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="sendMsg"
                rounded
                type="text"
                hide-details
                placeholder="พิมพ์ข้อความ ..."
                @keydown.prevent.enter="sendMessage()"
                density="compact"
                variant="outlined"
                color="primary"
              >
                <template v-slot:append>
                  <v-btn
                    icon="mdi-send"
                    variant="text"
                    @click="sendMessage()"
                    :disabled="sendMsg === ''"
                  ></v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-footer>

    <CommonLoading
      class="tw-mt-[25%]"
      v-if="loading"
    />
  </div>
</template>
<script setup lang="ts">
import { Manager } from 'socket.io-client'
import { useToast } from 'vue-toastification'
import { SocialType } from '~/interfaces/social.interface'

import ToastNoti from '~/components/chat/ToasNoti.vue'

const toast = useToast()

// const manager = new Manager('https://' + import.meta.env.VITE_SOCKET_URL, {
//   path: '/socket.io',
// })
// const socket = manager.socket('/latest-message')
const manager = new Manager('https://' + import.meta.env.VITE_SOCKET_URL, {
  // path: '/ws/',
  // path: '/ssa3/sockets/ws/',
  path: '/ssa3/ws/',
})
const socket = manager.socket('/socketio/latest-message')

const { user } = useGetCookie()
const accessToken = useCookie('accessToken')

const { shop, isOwner, _id } = user
const { name } = shop
const newMsg = ref()
const latestMessages = ref()
const filteredMessages: any = ref()
const socialInfo = ref()

onBeforeMount(() => {
  if (name) {
    socket.emit('join-message', name)
    socket.on('latest-message', (data: any) => {
      newMsg.value = data
      if (
        latestMessages.value &&
        Array.isArray(latestMessages.value.data) &&
        newMsg.value.data &&
        newMsg.value.data.length > 0
      ) {
        const existingIndex = latestMessages.value.data.findIndex(
          (item: any) => item.customerId === newMsg.value.data[0].customerId
        )
        const content = {
          component: ToastNoti,
          props: {
            img: newMsg.value.data[0].senderDetail.pictureUrl,
            senderName: newMsg.value.data[0].senderDetail.displayName,
            msg: newMsg.value.data[0].message,
            type: newMsg.value.data[0].type,
          },
        }
        if (existingIndex !== -1) {
          latestMessages.value.data[existingIndex] = newMsg.value.data[0]
          if (newMsg.value.data[0].isOwner === false && newMsg.value.data[0].isRead === false) {
            toast.success(content, {
              timeout: 2984,
              closeOnClick: true,
              pauseOnFocusLoss: false,
              pauseOnHover: false,
              draggable: true,
              draggablePercent: 0.4,
              showCloseButtonOnHover: true,
              hideProgressBar: true,
              closeButton: 'button',
              icon: 'fa-brands fa-line',
              rtl: false,
            })
          }
        } else {
          latestMessages.value.data.push(newMsg.value.data[0])
          if (newMsg.value.data[0].isOwner === false && newMsg.value.data[0].isRead === false) {
            toast.success(content, {
              timeout: 2984,
              closeOnClick: true,
              pauseOnFocusLoss: false,
              pauseOnHover: false,
              draggable: true,
              draggablePercent: 0.4,
              showCloseButtonOnHover: true,
              hideProgressBar: true,
              closeButton: 'button',
              icon: 'fa-brands fa-line',
              rtl: false,
            })
          }
        }
      }

      if (
        storeSelectCus.value &&
        filteredMessages.value &&
        Array.isArray(filteredMessages.value.data) &&
        newMsg.value.data &&
        newMsg.value.data.length > 0
      ) {
        const isCustomerIdEqual = filteredMessages.value.data.every(
          (item: any) => item.customerId === newMsg.value.data[0].customerId
        )
        const isIdNotPresent = !filteredMessages.value.data.some(
          (item: any) => item._id === newMsg.value.data[0]._id
        )
        if (isCustomerIdEqual && isIdNotPresent) {
          filteredMessages.value.data.push(newMsg.value.data[0])
          updateMsg(storeSelectCus.value.userId, newMsg.value.data[0]._id)
          nextTick(() => {
            window.scrollTo(0, document.body.scrollHeight)
          })
        }
      }
    })
  }
})

const loading = ref(false)
const loadingBtn = ref(false)

const shouldDisplayTime = (index: number) => {
  if (index === 0) {
    return true
  }

  const currentMessage = filteredMessages.value.data[index]
  const previousMessage = filteredMessages.value.data[index - 1]

  const currentDate = new Date(currentMessage.sourceTimestamp)
  const previousDate = new Date(previousMessage.sourceTimestamp)

  const isDifferentDay = currentDate.getDate() !== previousDate.getDate()

  return isDifferentDay
}

const getMessageSubtitle = (message: any) => {
  switch (message.type) {
    case 'STICKER':
      return `${message.senderDetail.displayName} ส่งสติกเกอร์`
    case 'IMAGE':
      return `${message.senderDetail.displayName} ส่งรูปภาพ`
    default:
      return message.message
  }
}

useHead({
  title: 'แชต',
})

const sendMsg = ref()

const selectCustomer = ref<any>({
  userId: '',
  displayName: '',
  pictureUrl: '',
  source: '',
})

const storeSelectCus: any = useCookie('storeSelectCus', cookieOptions)

const totalChat = ref(0)

const setSelectCustomer = async (
  userId: string,
  displayName: string,
  pictureUrl: string,
  source: string,
  msgId: string
) => {
  totalChat.value = 0
  await getMsgById(userId, totalChat.value)
  await updateMsg(userId, msgId)
  selectCustomer.value = { userId, displayName, pictureUrl, source }
  storeSelectCus.value = selectCustomer.value
  nextTick(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
}

const sendMessage = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/social-message/${name}/${storeSelectCus.value.userId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          source: storeSelectCus.value.source,
          message: {
            text: sendMsg.value,
          },
        }),
        headers: {
          'content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken.value,
        },
      }
    )

    if (response.status === 200 || response.status === 201) {
      sendMsg.value = ''
      await getMsgById(storeSelectCus.value.userId, 0)
    } else if (response.status === 401) {
      console.log('call - refresh token')
      await useRefreshToken()
      await sendMessage()
    } else {
      console.log('err')
    }
    nextTick(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  } catch (error) {
    console.log(error)
  }
}
const socialTypes = ref()

const getLatestMsg = async () => {
  if (isOwner) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/social-message/${name}/latest`,
        {
          method: 'get',
          headers: {
            Authorization: 'Bearer ' + accessToken.value,
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

const getMsgById = async (customerId: any, total: number) => {
  loading.value = true
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/social-message/${name}/${customerId}?$skip=${total}`,
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + accessToken.value,
        },
      }
    )
    if (response.status === 200) {
      filteredMessages.value = await response.json()
      totalChat.value = filteredMessages.value && filteredMessages.value.data.length
      loading.value = false
      filteredMessages.value &&
        nextTick(() => {
          window.scrollTo(0, document.body.scrollHeight)
        })
    } else if (response.status === 401) {
      await useRefreshToken()
      await getMsgById(customerId, totalChat.value)
      loading.value = false
    }
  } catch (error) {
    console.log(error)
  }
}

const getMoreChat = async () => {
  loadingBtn.value = true
  try {
    const response = await useFetch(
      `${import.meta.env.VITE_BASE_URL}/social-message/${name}/${storeSelectCus.value.userId}`,
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + accessToken.value,
        },
        params: {
          $skip: totalChat.value,
        },
      }
    )
    if (storeSelectCus) {
      const result: any = await response.data.value
      filteredMessages.value.data.push(...Object.values(result.data))

      if (Array.isArray(result.data)) {
        totalChat.value += result.data.length
      }
      var myDiv = document.getElementById('test')
      const height = myDiv && Math.trunc(myDiv.offsetHeight / 3.32)
      nextTick(() => {
        if (myDiv && height) window.scrollTo(0, height)
      })
      loadingBtn.value = false
    } else {
      console.log('call - refresh token')
      await useRefreshToken()
      await getMoreChat()
      loadingBtn.value = false
    }
  } catch (error) {
    console.log(error)
  }
}

const updateMsg = async (userId: string, msgId: string) => {
  const res = await useFetch(
    `${import.meta.env.VITE_BASE_URL}/social-message/${name}/${userId}/${msgId}`,
    {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken.value,
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
  nextTick(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
}

const getSocialAccount = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/social-account?ownerId=${_id}`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + accessToken.value,
      },
    })
    if (response.status === 200) {
      socialInfo.value = await response.json()
      if (Array.isArray(socialInfo.value.data)) {
        socialTypes.value = socialInfo.value.data.map((info: any) => info.socialType)
      }
    } else if (response.status === 401) {
      console.log('call - refresh token')
      await useRefreshToken()
      await getSocialAccount()
    }
  } catch (error: any) {
    console.log(error)
  }
}
await getSocialAccount()
await getLatestMsg()
const selectedItem = ref('all')
const selectItem = (item: string) => {
  selectedItem.value = item
}

const filteredMsg = computed(() => {
  const messages =
    latestMessages.value && latestMessages.value.data ? latestMessages.value.data : []
  const sortedMessages = messages
    .slice()
    .sort((a: any, b: any) => b.sourceTimestamp - a.sourceTimestamp)
  const filteredBySocialTypes = sortedMessages.filter((msg: any) =>
    socialTypes.value.includes(msg.source)
  )
  const filteredBySelectedItem = filteredBySocialTypes.filter((msg: any) => {
    if (selectedItem.value === 'all') {
      return true
    }
    return msg.source === selectedItem.value
  })

  return filteredBySelectedItem
})

onBeforeMount(async () => {
  storeSelectCus.value && (await getMsgById(storeSelectCus.value.userId, totalChat.value))
  await getSocialAccount()
  await getLatestMsg()
})
</script>
<style>
.v-list-item--one-line .v-list-item-subtitle {
  -webkit-line-clamp: 2;
  line-height: 1.5rem;
}
.v-footer {
  display: grid;
}

.social_icon .v-badge__badge {
  bottom: calc(100% - 43px) !important;
}

.v-list-item-title {
  font-size: 14px !important;
  font-weight: bold !important;
}
.v-list-item__prepend {
  display: grid !important;
}
</style>
