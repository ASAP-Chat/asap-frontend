<template>
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
          :active="storeCustomer && message.customerId === storeCustomer.userId"
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
            'tw-bg-[#E4E4E4]': customer.data.filter((item: any) => item.customerId === message.customerId)[0]?.customerId === storeCustomer?.userId
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
    <div v-if="filteredMessages && storeCustomer">
      <div>
        <ChatAppBar
          :id="customer.data.filter((item: any) => item.customerId === storeCustomer.userId)[0]?._id"
          :status="customer.data.filter((item: any) => item.customerId === storeCustomer.userId)[0]
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
            :msg-location="message.messageObject"
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
      :class="storeCustomer ? ' tw-drop-shadow-2xl' : 'tw-bg-[#f2f2f2]'"
    >
      <v-form :class="storeCustomer ? '' : 'tw-invisible'">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-if="previewImageUrls.length === 0"
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
                    : storeCustomer?.agent !== displayName
                    ? 'ไม่สามารถส่งข้อความได้ เนื่องจากคุณไม่ได้รับผิดชอบแชตนี้'
                    : storeCustomer?.status === Status.PENDING
                    ? 'คุณจะสามารถตอบแชตได้ ก็ต่อเมื่อสถานะของแชตเป็นดำเนินการ'
                    : 'พิมพ์ข้อความ ...'
                "
                :disabled="
                  Boolean(disabledChatInput) ||
                  storeCustomer?.agent !== displayName ||
                  storeCustomer?.status === Status.PENDING
                "
              >
                <template v-slot:prepend>
                  <CommonIconButton
                    icon="mdi-message-text-outline"
                    color="primary"
                    density="compact"
                    @click.stop="templateDrawer = !templateDrawer"
                    :disabled="
                      storeCustomer?.agent !== displayName ||
                      storeCustomer?.status === Status.PENDING
                    "
                  />
                  <FileUploadInput
                    ref="fileInputComponentRef"
                    :previewImageUrl="previewImageUrls"
                    @handleImageChange="handleImageChange"
                    @handleClickAttachment="handleClickAttachment"
                    :disabled-btn="storeCustomer?.status === Status.PENDING"
                    :density-btn="'compact'"
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
          <div
            class="tw-flex"
            v-if="previewImageUrls.length !== 0"
          >
            <FileUploadInput
              ref="fileInputComponentRef"
              :previewImageUrl="previewImageUrls"
              @handleImageChange="handleImageChange"
              @handleClickAttachment="handleClickAttachment"
              :disabled-btn="storeCustomer?.status === Status.PENDING"
            />
            <div
              class="tw-w-full tw-rounded-3xl tw-border tw-border-solid tw-border-[#ababab] tw-p-3"
            >
              <div class="tw-justify-items-center tw-grid tw-grid-cols-5 tw-gap-y-3.5">
                <div
                  class="tw-text-end tw-relative tw-inline-block"
                  v-for="(url, index) in previewImageUrls"
                  :key="index"
                >
                  <FileUploadOutput :src="url" />
                  <CommonIconButton
                    icon="mdi-close"
                    density="compact"
                    size="small"
                    variant="flat"
                    color="#949494"
                    @click="removeImage(index)"
                    class="tw-absolute tw-top-0 tw-left-0"
                  />
                </div>
              </div>
            </div>
            <CommonIconButton
              icon="mdi-send"
              color="primary"
            />
          </div>
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

const previewUploads = ref({
  files: [] as File[],
  urls: [] as string[],
})
const previewImageUrls = computed(() => previewUploads.value.urls)
const fileInputComponentRef = ref()
const handleClickAttachment = () => {
  const fileUploadRef = fileInputComponentRef.value.fileInputRef
  fileUploadRef?.click()
}

const handleImageChange = (event: Event | any) => {
  const files = event.target?.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      previewUploads.value.files.push(file)

      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          previewUploads.value.urls.push(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
    event.target.value = null
  }
}
const removeImage = (index: number) => {
  previewUploads.value.files.splice(index, 1)
  previewUploads.value.urls.splice(index, 1)
}

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

const { shop, role, displayName } = user.value || {}
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
      const content = {
        component: Notification,
        props: {
          img: generateAvatarUrl(newMsg.value),
          senderName: newMsg.value.senderDetail.displayName,
          msg: newMsg.value.message,
          type: newMsg.value.type,
        },
      }

      const notifications: ToastOptions = {
        toastClassName: generateToastClass(newMsg.value.source),
        timeout: 2984,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        draggable: true,
        draggablePercent: 0.4,
        showCloseButtonOnHover: true,
        hideProgressBar: true,
        closeButton: 'button',
        icon: generateToastIcon(newMsg.value.source),
        rtl: false,
      }
      await getLatestMsg()
      if (latestMessages.value && Array.isArray(latestMessages.value.data) && newMsg.value) {
        const existingIndex = latestMessages.value.data.findIndex(
          (item: any) => item.customerId === newMsg.value.customerId
        )

        await getCustomer()
        if (existingIndex !== -1) {
          latestMessages.value[existingIndex] = newMsg.value
          if (newMsg.value.isOwner === false && newMsg.value.isRead === false) {
            play()
            toast(content, notifications)
          }
        } else {
          latestMessages.value.data.push(newMsg.value)
          if (newMsg.value.isOwner === false && newMsg.value.isRead === false) {
            play()
            toast(content, notifications)
          }
        }

        if (storeCustomer.value) {
          const isCustomerIdEqual = filteredMessages.value.data.every(
            (item: any) => item.customerId === newMsg.value.customerId
          )
          const isIdNotPresent = !filteredMessages.value.data.some(
            (item: any) => item._id === newMsg.value._id
          )
          if (isCustomerIdEqual && isIdNotPresent) {
            filteredMessages.value.data.push(newMsg.value)
            if (
              customer.value.data.filter(
                (item: any) => item.customerId === storeCustomer.value.userId
              )[0].agent.displayName === displayName
            )
              updateMsg(storeCustomer.value.userId, newMsg.value._id)
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

const storeCustomer = useStoreCustomer()

const disabledMoreThan24 = ref(true)
const disabledChatInput = computed(() => {
  return storeCustomer?.value?.source === SocialType.FACEBOOK && disabledMoreThan24.value
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
  storeCustomer.value = selectCustomer.value
  const hoursDifference = Math.abs(messageTimestamp.diff(useDayjs()(), 'hours'))
  disabledMoreThan24.value = hoursDifference >= 24
  sendMsg.value = ''
  nextTick(() => window.scrollTo(0, document.body.scrollHeight))
}

const sendMessage = async () => {
  if (sendMsg.value !== '') {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/social-message/${storeCustomer.value.userId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            source: storeCustomer.value.source,
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
        await getMsgById(storeCustomer.value.userId, 0)
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
      `${import.meta.env.VITE_BASE_URL}/social-message/${customerId}?$skip=${total}`,
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
      `${import.meta.env.VITE_BASE_URL}/social-message/${storeCustomer.value.userId}`,
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
    if (storeCustomer) {
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
  storeCustomer.value && (await getMsgById(storeCustomer.value.userId, totalChat.value))
  await getSocialAccount()
  await getLatestMsg()
  await getCustomer()
})

watch(
  () => selectedItem.value,
  (newValue) => {
    storeCustomer.value = null
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
watch(
  () => storeCustomer.value,
  () => {
    templateDrawer.value = false
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
