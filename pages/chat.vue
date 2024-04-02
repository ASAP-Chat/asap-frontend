<template>
  <CommonModal
    v-if="!socialInfo && isOwner"
    :header="'ยังไม่ได้ลงทะเบียนบัญชี Social Media!'"
    custom-icon="mdi-store-cog-outline"
    :content="'โปรดเชื่อมต่ออย่างน้อย 1 บัญชี Social Media เพื่อเริ่มใช้งาน ASAP'"
    :buttonText="'ตั้งค่า'"
    :isSuccess="false"
    @btn-action="navigateTo('/setting/chat-integration/')"
  />
  <div>
    <ChatFilterNav
      :selectedItem="selectedItem"
      @update:selectedItem="selectedItem = $event"
    />

    <!-- drawer รายชื่อ -->
    <v-navigation-drawer
      permanent
      width="370"
      app
    >
      <v-list
        class="tw-p-0"
        v-if="latestMessages"
        v-for="message in filteredMsg"
        density="compact"
      >
        <v-list-item
          class="tw-gap-x-3 pt-4"
          height="100"
          exact
          :title="generateName(message)"
          :value="message.customerId"
          :active="storeSelectCus && message.customerId === storeSelectCus.userId"
          @click="
            setSelectCustomer(
              message.customerId,
              generateName(message),
              generateAvatarUrl(message),
              message.source,
              message.sourceTimestamp,
              message._id,
              customer.data.filter((item: any) => item.customerId === message.customerId)[0]?._id,
              customer.data.filter((item: any) => item.customerId === message.customerId)[0]
                ?.chatStatus,
              customer.data.filter((item: any) => item.customerId === message.customerId)[0]?.agent
                ?.displayName,
              customer.data.filter((item: any) => item.customerId === message.customerId)[0]?.agent
                ?.displayName === displayName
            )
          "
        >
          <template v-slot:subtitle>
            <div :class="message.isRead ? '' : 'font-weight-bold'">
              {{ generateMessageSubtitle(message) }}
            </div>
          </template>
          <template v-slot:prepend>
            <v-badge
              color="white"
              class="social_icon"
            >
              <template v-slot:badge>
                <v-icon
                  :color="generateSocialColor(message.source)"
                  :icon="generateSocialIcon(message.source)"
                  size="small"
                ></v-icon>
              </template>
              <v-avatar :image="generateAvatarUrl(message)" />
            </v-badge>
          </template>
          <template v-slot:append>
            <div class="text-center">
              <v-badge
                dot
                floating
                color="error"
                class="tw--mt-2"
                v-if="message.isRead === false"
              >
                <time>
                  <div
                    v-if="customer.data.filter(
                          (item: any) => item.customerId === message.customerId
                        )[0]?.chatStatus === Status.PENDING && isChatbotEnabled(message.source)"
                  >
                    <v-icon color="primary">mdi-robot-excited-outline</v-icon>
                  </div>
                  <div class="tw-text-xs tw-opacity-50">
                    <b
                      :class="`text-${customer.data.filter((item: any) => item.customerId === message.customerId)[0]
                    ?.chatStatus}`"
                      >{{
                        generateStatus(
                          customer.data.filter(
                            (item: any) => item.customerId === message.customerId
                          )[0]?.chatStatus
                        )
                      }}</b
                    ><br />
                    {{
                      ((timestamp) => {
                        const messageTimestamp = useDayjs()(message.sourceTimestamp)
                        const currentTimestamp = useDayjs()()

                        const hoursDifference = Math.abs(
                          messageTimestamp.diff(currentTimestamp, 'hours')
                        )
                        const sameYear = messageTimestamp.isSame(currentTimestamp, 'year')

                        return hoursDifference <= 24
                          ? messageTimestamp.fromNow()
                          : sameYear
                          ? messageTimestamp.format('DD/M')
                          : messageTimestamp.format('DD/M/YY HH:mm')
                      })(message.sourceTimestamp)
                    }}
                  </div>
                </time>
              </v-badge>
              <time v-else>
                <div
                  v-if="customer.data.filter(
                          (item: any) => item.customerId === message.customerId
                        )[0]?.chatStatus === Status.PENDING && isChatbotEnabled(message.source)"
                >
                  <v-icon color="primary">mdi-robot-excited-outline</v-icon>
                </div>
                <div class="tw-text-xs tw-opacity-50">
                  <b
                    :class="`text-${customer.data.filter((item: any) => item.customerId === message.customerId)[0]
                    ?.chatStatus}`"
                    >{{
                      generateStatus(
                        customer.data.filter(
                          (item: any) => item.customerId === message.customerId
                        )[0]?.chatStatus
                      )
                    }}</b
                  ><br />
                  {{
                    ((timestamp) => {
                      const messageTimestamp = useDayjs()(message.sourceTimestamp)
                      const currentTimestamp = useDayjs()()

                      const hoursDifference = Math.abs(
                        messageTimestamp.diff(currentTimestamp, 'hours')
                      )
                      const sameYear = messageTimestamp.isSame(currentTimestamp, 'year')

                      return hoursDifference <= 24
                        ? messageTimestamp.fromNow()
                        : sameYear
                        ? messageTimestamp.format('DD/M')
                        : messageTimestamp.format('DD/M/YY HH:mm')
                    })(message.sourceTimestamp)
                  }}
                </div>
              </time>
            </div>
          </template>
        </v-list-item>
        <div
          class="pl-5 pb-2 tw-flex tw-items-center tw-text-xs"
          :class="{
            'pt-2': customer.data.filter((item: any) => item.customerId === message.customerId)[0]
                    ?.chatStatus !== Status.PENDING,
            'tw-bg-[#E4E4E4]': customer.data.filter((item: any) => item.customerId === message.customerId)[0]?.customerId === storeSelectCus?.userId
          }"
        >
          <div>
            มอบหมายให้ :&nbsp;
            <span
              class="mr-1"
              :class="customer.data.filter((item: any) => item.customerId === message.customerId)[0]?.agent
                .displayName ? 'text-primary font-weight-bold' : 'text-secondary-lighten'"
            >
              {{
                customer.data.filter((item: any) => item.customerId === message.customerId)[0]
                  ?.agent?.displayName
                  ? customer.data.filter((item: any) => item.customerId === message.customerId)[0]
                      ?.agent?.displayName
                  : 'ยังไม่มีผู้รับผิดชอบ'
              }}
            </span>
            <span
              class="text-secondary-lighten"
              v-if="customer.data.filter((item: any) => item.customerId === message.customerId)[0]
                    ?.agent.displayName === displayName"
              >(คุณ)</span
            >
            <v-menu
              :close-on-content-click="false"
              v-if="role !== Role.AGENT"
            >
              <template v-slot:activator="{ props }">
                <CommonIconButton
                  icon="mdi-account-edit-outline"
                  class="ma-0"
                  color="primary"
                  density="compact"
                  v-bind="props"
                />
              </template>
              <ChatAssignMember
                :id="customer.data.filter((item: any) => item.customerId === message.customerId)[0]?._id"
                :current-member="customer.data.filter((item: any) => item.customerId === message.customerId)[0]?.agent"
                @update:message="updateMsg(message.customerId, message._id)"
              />
            </v-menu>
          </div>
        </div>
      </v-list>
      <v-list v-if="filteredMsg?.length === 0">
        <v-list-item
          disabled
          class="text-center"
          title="ยังไม่มีข้อความ"
        ></v-list-item
      ></v-list>
    </v-navigation-drawer>
  </div>

  <div id="chatContainer">
    <div v-if="filteredMessages">
      <div v-if="storeSelectCus">
        <ChatAppBar
          :id="customer.data.filter((item: any) => item.customerId === storeSelectCus.userId)[0]?._id"
          :status="customer.data.filter((item: any) => item.customerId === storeSelectCus.userId)[0]
                ?.chatStatus"
        />
      </div>
      <div>
        <div
          class="text-center mb-2"
          v-if="filteredMessages?.total > totalChat"
        >
          <CommonButton
            text="คลิกเพื่อแสดงข้อความก่อนหน้า"
            icon="mdi-cursor-default-click-outline"
            @click="getMoreChat()"
            class="tw-font-normal"
            :loading="loadingBtn"
          />
        </div>
        <div
          v-for="(message, index) in filteredMessages?.data.sort((a:any, b:any) => a.sourceTimestamp - b.sourceTimestamp)"
        >
          <ChatBubble
            :msgType="message.type"
            :msg-text="message.message"
            :msg-sticker="message.type === MsgType.STICKER ? message.link[0] : ''"
            :msg-link="
              message && message.type !== MsgType.STICKER && message.link ? message.link[0] : ''
            "
            :name="generateName(message)"
            :img="generateCustomerImg(message)"
            :date="showDisplayTime(filteredMessages, index) ? message.sourceTimestamp : ''"
            :time="message.sourceTimestamp"
            :is-owner="message.isOwner"
          />
        </div>
      </div>
    </div>
    <ChatTemplateDrawer
      v-model="templateDrawer"
      @update:sendMsg="sendMsg = $event"
    />
    <v-footer
      app
      order="2"
      name="footer"
      class="tw-grid"
      :class="storeSelectCus ? ' tw-drop-shadow-2xl' : 'tw-bg-[#f2f2f2]'"
    >
      <v-form :class="storeSelectCus ? '' : 'tw-invisible'">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-textarea
                type="text"
                rounded="xl"
                v-model="sendMsg"
                density="compact"
                variant="outlined"
                @keydown.prevent.enter="sendMessage()"
                color="primary"
                auto-grow
                rows="1"
                hide-details
                :placeholder="
                  disabledChatInput
                    ? 'ไม่สามารถส่งข้อความได้ เนื่องจากข้อความล่าสุดมีอายุมากกว่า 24 ชั่วโมง ตามข้อกำหนดของ Facebook'
                    : storeSelectCus?.agent !== displayName
                    ? 'ไม่สามารถส่งข้อความได้ เนื่องจากคุณไม่ได้รับผิดชอบแชตนี้'
                    : storeSelectCus.status === Status.PENDING
                    ? 'คุณจะสามารถตอบแชตได้ ก็ต่อเมื่อสถานะของแชตเป็นดำเนินการ'
                    : 'พิมพ์ข้อความ ...'
                "
                :disabled="
                  Boolean(disabledChatInput) ||
                  storeSelectCus?.agent !== displayName ||
                  storeSelectCus.status === Status.PENDING
                "
              >
                <template v-slot:prepend>
                  <CommonIconButton
                    icon="mdi-message-text-outline"
                    color="primary"
                    density="compact"
                    @click.stop="templateDrawer = !templateDrawer"
                    :disabled="storeSelectCus?.agent !== displayName"
                  />
                </template>
                <template v-slot:append>
                  <CommonIconButton
                    icon="mdi-send"
                    color="primary"
                    @click="sendMessage()"
                    :disabled="sendMsg === ''"
                  />
                </template>
              </v-textarea>
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
import { useToast } from 'vue-toastification'
import { SocialType } from '~/constants/SocialType'
import { Manager } from 'socket.io-client'
import Notification from '~/components/chat/Notification.vue'
import { MsgType } from '~/constants/MessageType'
import { ACCESS_TOKEN, USER } from '~/constants/Token'
import buttonSfx from '~/assets/sounds/noti-sound.mp3'
import { getSocialAccount, getLatestMsg, updateMsg, getCustomer } from '~/services/message.service'
import { Status } from '~/constants/Status'
import { Role } from '~/constants/Role'
import type { ToastOptions } from 'vue-toastification/dist/types/types'
import { getChatbotStatus } from '~/services/chatbot.service'

const toast = useToast()

let socketURL
if (process.env.NODE_ENV === 'development') {
  socketURL = import.meta.env.VITE_SOCKET_URL
} else {
  socketURL = 'wss://' + import.meta.env.VITE_SOCKET_URL
}

const manager = new Manager(socketURL, {
  path: '/ssa3-socket',
  forceNew: true,
})
const socket = manager.socket('/sockets/latest-message')

const user: any = useCookie(USER)
const access_token = useCookie(ACCESS_TOKEN)

const { shop, isOwner, role, displayName } = user.value || {}
const { name } = shop
const newMsg = ref()
const filteredMessages: any = ref()
const audio = new Audio(buttonSfx)
const templateDrawer = ref(false)

function play() {
  audio.play()
}

onBeforeMount(() => {
  if (name) {
    socket.emit('join-message', name)
    socket.on('latest-message', async (data: any) => {
      newMsg.value = data
      console.log('🍪🥛 ~ socket.on ~ data:', data)
      const content = {
        component: Notification,
        props: {
          img: generateAvatarUrl(newMsg.value.data[0]),
          senderName: newMsg.value.data[0].senderDetail.displayName,
          msg: newMsg.value.data[0].message,
          type: newMsg.value.data[0].type,
        },
      }
      const notifications: ToastOptions = {
        toastClassName: generateToastClass(newMsg.value.data[0].source),
        timeout: 2984,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        draggable: true,
        draggablePercent: 0.4,
        showCloseButtonOnHover: true,
        hideProgressBar: true,
        closeButton: 'button',
        icon: generateToastIcon(newMsg.value.data[0].source),
        rtl: false,
      }
      if (
        latestMessages.value &&
        Array.isArray(latestMessages.value.data) &&
        newMsg.value.data &&
        newMsg.value.data.length > 0
      ) {
        const existingIndex = latestMessages.value.data.findIndex(
          (item: any) => item.customerId === newMsg.value.data[0].customerId
        )

        await getCustomer()
        if (existingIndex !== -1) {
          latestMessages.value.data[existingIndex] = newMsg.value.data[0]
          if (
            (newMsg.value.data[0].isOwner === false &&
              newMsg.value.data[0].isRead === false &&
              newMsg.value.data[0].senderDetail.name) ||
            newMsg.value.data[0].senderDetail.chatMode !== 'bot'
          ) {
            console.log(1)

            play()
            toast(content, notifications)
          }
        } else {
          latestMessages.value.data.push(newMsg.value.data[0])
          if (
            (newMsg.value.data[0].isOwner === false &&
              newMsg.value.data[0].isRead === false &&
              newMsg.value.data[0].senderDetail.name) ||
            newMsg.value.data[0].senderDetail.chatMode !== 'bot'
          ) {
            console.log(2)

            play()
            toast(content, notifications)
          }
        }

        if (storeSelectCus.value) {
          const isCustomerIdEqual = filteredMessages.value.data.every(
            (item: any) => item.customerId === newMsg.value.data[0].customerId
          )
          const isIdNotPresent = !filteredMessages.value.data.some(
            (item: any) => item._id === newMsg.value.data[0]._id
          )
          if (isCustomerIdEqual && isIdNotPresent) {
            filteredMessages.value.data.push(newMsg.value.data[0])
            if (
              customer.value.data.filter(
                (item: any) => item.customerId === storeSelectCus.value.userId
              )[0].agent.displayName === displayName
            )
              updateMsg(storeSelectCus.value.userId, newMsg.value.data[0]._id)
            nextTick(() => {
              window.scrollTo(0, document.body.scrollHeight)
            })
          }
        }
      }
    })
  }
})
onBeforeUnmount(() => {
  socket.emit('leave-message', name)
})

const loading = ref(false)
const loadingBtn = ref(false)

useHead({
  title: 'แชต',
})

const sendMsg = ref('')

const totalChat = ref(0)

const selectCustomer = ref<any>({
  userId: '',
  displayName: '',
  pictureUrl: '',
  source: '',
  time: '',
})

const storeSelectCus: any = useCookie('storeSelectCus', cookieOptions)
const disabledMoreThan24 = ref(true)
const disabledChatInput = computed(() => {
  return storeSelectCus?.value?.source === SocialType.FACEBOOK && disabledMoreThan24.value
})

const setSelectCustomer = async (
  userId: string,
  displayName: string,
  pictureUrl: string,
  source: string,
  time: string,
  msgId: string,
  statusId: string,
  status: string,
  agent: any,
  isChatOwner: boolean
) => {
  totalChat.value = 0
  await getMsgById(userId, totalChat.value)
  if (!filteredMessages.value.data[filteredMessages.value.data.length - 1].isRead && isChatOwner) {
    await updateMsg(userId, msgId)
  }

  const messageTimestamp = useDayjs()(time)
  selectCustomer.value = {
    userId,
    displayName,
    pictureUrl,
    source,
    messageTimestamp,
    statusId,
    status,
    agent,
  }
  storeSelectCus.value = selectCustomer.value

  const hoursDifference = Math.abs(messageTimestamp.diff(useDayjs()(), 'hours'))
  disabledMoreThan24.value = hoursDifference >= 24
  sendMsg.value = ''
  nextTick(() => window.scrollTo(0, document.body.scrollHeight))
}

const sendMessage = async () => {
  console.log(sendMsg.value === '')
  if (sendMsg.value !== '') {
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
            Authorization: 'Bearer ' + access_token.value,
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
      } else if (response.status === 404) {
        await getCustomer()
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
}
const socialTypes = ref()
const { latestMessages } = await getLatestMsg()

const getMsgById = async (customerId: any, total: number) => {
  loading.value = true
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/social-message/${name}/${customerId}?$skip=${total}`,
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + access_token.value,
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
          Authorization: 'Bearer ' + access_token.value,
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
      const myDiv = document.getElementById('chatContainer')
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

const { socialInfo } = await getSocialAccount()
const { customer } = await getCustomer()

if (Array.isArray(socialInfo?.value?.data)) {
  socialTypes.value = socialInfo.value.data.map((info: any) => info.socialType)
}

const selectedItem = ref('all')

const filteredMsg = computed(() => {
  const messages =
    latestMessages.value && latestMessages.value.data ? latestMessages.value.data : []
  const sortedMessages = messages
    .slice()
    .sort((a: any, b: any) => b.sourceTimestamp - a.sourceTimestamp)
  const filteredBySocialTypes = sortedMessages?.filter((msg: any) =>
    socialTypes?.value?.includes(msg.source)
  )
  const filteredBySelectedItem = filteredBySocialTypes.filter((msg: any) => {
    if (selectedItem.value === 'all') {
      return true
    }
    return msg.source === selectedItem.value
  })

  const statusDict: { [key: string]: { chatStatus: string; agentDisplayName: string } } = {}
  customer.value.data.forEach((customer: any) => {
    statusDict[customer.customerId] = {
      chatStatus: customer.chatStatus,
      agentDisplayName: customer.agent.displayName,
    }
  })

  // Filter latestMessages based on the condition
  const filteredByStatus = filteredBySocialTypes?.filter((message: any) => {
    const customerStatus = statusDict[message.customerId]?.chatStatus
    const agentDisplayName = statusDict[message.customerId]?.agentDisplayName

    if (selectedItem.value === 'mine') {
      return agentDisplayName === displayName
    } else if (selectedItem.value === 'empty') {
      return !agentDisplayName
    } else {
      return customerStatus === selectedItem.value
    }
  })

  const showAllItems = [Status.PENDING, Status.ONGOING, Status.COMPLETED, 'mine', 'empty']

  return showAllItems.includes(selectedItem.value) ? filteredByStatus : filteredBySelectedItem
})

const { data } = (await getChatbotStatus()).chatbotStatus.value
const statusLine = ref(data[0].isEnabledLine)
const statusFb = ref(data[0].isEnabledFacebook)
const statusIg = ref(data[0].isEnabledInstagram)

const isChatbotEnabled = (source: string) => {
  return (
    (source === SocialType.LINE && statusLine.value) ||
    (source === SocialType.FACEBOOK && statusFb.value) ||
    (source === SocialType.INSTAGRAM && statusIg.value)
  )
}

onBeforeMount(async () => {
  storeSelectCus.value && (await getMsgById(storeSelectCus.value.userId, totalChat.value))
  await getSocialAccount()
  await getLatestMsg()
  await getCustomer()
})

watch(
  () => selectedItem.value,
  (newValue) => {
    storeSelectCus.value = null
    selectCustomer.value = {
      userId: '',
      displayName: '',
      pictureUrl: '',
      source: '',
      time: '',
    }
    filteredMessages.value = null
  }
)
</script>
<style>
.v-list-item--one-line .v-list-item-subtitle {
  -webkit-line-clamp: 2;
  line-height: 1.5rem;
}

.social_icon .v-badge__badge {
  bottom: calc(100% - 43px) !important;
}
</style>
