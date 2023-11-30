<template>
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
          prepend-icon="mdi-emoticon-neutral-outline"
          base-color="#707070"
          :active="selectedItem === 'pending'"
          @click="selectItem('pending')"
        ></v-list-item>

        <v-list-item
          title="ดำเนินการ"
          value="doing"
          prepend-icon="mdi-emoticon-confused-outline"
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
        v-for="(message, i) in latestMessages.data.filter((msg: any) => {
            if (selectedItem === 'all') {
              return true
            } 
            return msg.source === selectedItem
          }
        )"
      >
        <v-list-item
          class="tw-gap-x-3"
          height="90"
          exact
          :title="
            message.isOwner ? message.receiverDetail.displayName : message.senderDetail.displayName
          "
          :subtitle="getMessageSubtitle(message)"
          :value="message.customerId"
          :active="message.customerId === selectCustomer.userId"
          @click="
            setSelectCustomer(
              message.customerId,
              message.isOwner
                ? message.receiverDetail.displayName
                : message.senderDetail.displayName,
              message.isOwner ? message.receiverDetail.pictureUrl : message.senderDetail.pictureUrl,
              message.source
            )
          "
        >
          <template v-slot:prepend>
            <v-badge color="white">
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
          <!-- Todo: อ่านแล้ว -->
          <template v-slot:append>
            <time class="tw-text-xs tw-opacity-50">
              {{ useDayjs()(message.sourceTimestamp).format('HH:mm') }}
            </time>
          </template>
        </v-list-item>
      </v-list>
      <v-list v-if="latestMessages?.data && latestMessages.data.length === 0">
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
      <div v-if="selectCustomer.userId.trim() !== '' && selectCustomer.displayName.trim() !== ''">
        <v-navigation-drawer
          v-model="drawer"
          permanent
          width="280"
          location="right"
          :rail="rail"
          @click="rail = false"
        >
          <div class="pa-3 pt-6">
            <div class="text-center mb-3">
              <h2>
                ข้อมูล
                <span
                  ><v-btn
                    variant="text"
                    icon="mdi-pencil-outline"
                  ></v-btn
                ></span>
              </h2>
            </div>
            <div>
              <h3>ชื่อ</h3>
              <p>{{ selectCustomer.displayName }}</p>
              <h3 class="tw-mt-5">เบอร์โทรศัพท์</h3>
              <p>000000000</p>
              <h3 class="tw-mt-5">อีเมล</h3>
              <p>Example@gmail.com</p>
              <h3 class="tw-mt-5">หมายเหตุ</h3>
              <p>Example</p>
              <h3 class="tw-mt-5">ที่อยู่</h3>
              <p>Example</p>
            </div>
          </div>
        </v-navigation-drawer>

        <v-app-bar>
          <template v-slot:prepend>
            <v-img
              :width="40"
              :height="40"
              aspect-ratio="1/1"
              cover
              class="tw-rounded-full"
              :src="selectCustomer.pictureUrl"
            ></v-img>
          </template>
          <v-app-bar-title class="font-weight-bold">
            {{ selectCustomer.displayName }}
          </v-app-bar-title>
          <template v-slot:append>
            <v-btn
              icon="mdi-information-outline"
              @click.stop="drawer = !drawer"
            ></v-btn>
          </template>
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
        selectCustomer.userId.trim() !== '' && selectCustomer.displayName.trim() !== ''
          ? ''
          : 'tw-bg-[#f2f2f2]'
      "
    >
      <v-form
        :class="
          selectCustomer.userId.trim() !== '' && selectCustomer.displayName.trim() !== ''
            ? ''
            : 'tw-invisible'
        "
      >
        <v-container>
          <v-row>
            <v-col cols="12">
              <CommonTextField
                v-model="sendMsg"
                append-icon="mdi-send"
                rounded
                type="text"
                hide-details
                placeholder="พิมพ์ข้อความ ..."
                @keydown.prevent.enter="sendMessage()"
                @click:append="sendMessage()"
              />
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
const filteredMessages: any = ref()
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

const drawer = ref(false)
const rail = ref(false)
const sendMsg = ref()

const selectCustomer = ref<any>({
  userId: '',
  displayName: '',
  pictureUrl: '',
  source: '',
})

const totalChat = ref(0)

const setSelectCustomer = (
  userId: string,
  displayName: string,
  pictureUrl: string,
  source: string
) => {
  totalChat.value = 0
  getMsgById(userId, totalChat.value)
  selectCustomer.value = { userId, displayName, pictureUrl, source }
}

const customer_Id = ref('')
const latestMessages = ref()

const { user } = useGetCookie()
const accessToken = useCookie('accessToken')

const { shop, isOwner } = user
const { name } = shop

const sendMessage = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/social-message/${name}/${selectCustomer.value.userId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          source: selectCustomer.value.source,
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
      await getMsgById(selectCustomer.value.userId, 0)
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

const getLatestMsg = async () => {
  if (isOwner) {
    try {
      const response = await useFetch(
        `${import.meta.env.VITE_BASE_URL}/social-message/${name}/latest`,
        {
          method: 'get',
          headers: {
            Authorization: 'Bearer ' + accessToken.value,
          },
        }
      )
      if (response.status.value === 'success') {
        latestMessages.value = await response.data.value
      } else {
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
  customer_Id.value = customerId
  loading.value = true
  try {
    const response = await useFetch(
      `${import.meta.env.VITE_BASE_URL}/social-message/${name}/${customerId}`,
      {
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + accessToken.value,
        },
        params: {
          $skip: total,
        },
      }
    )
    if (selectCustomer && response.status.value === 'success') {
      filteredMessages.value = await response.data.value
      totalChat.value = filteredMessages.value && filteredMessages.value.data.length
      loading.value = false
    } else {
      console.log('call - refresh token')
      await useRefreshToken()
      await getMsgById(customerId, totalChat.value)
      loading.value = false
    }
    nextTick(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  } catch (error) {
    console.log(error)
  }
}

const getMoreChat = async () => {
  loadingBtn.value = true
  try {
    const response = await useFetch(
      `${import.meta.env.VITE_BASE_URL}/social-message/${name}/${customer_Id.value}`,
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
    if (selectCustomer) {
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

onBeforeMount(async () => {
  await getLatestMsg()
})

onMounted(() => {
  nextTick(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
})
const selectedItem = ref('all')
const selectItem = (item: string) => {
  selectedItem.value = item
}
</script>
<style>
.v-list-item--one-line .v-list-item-subtitle {
  -webkit-line-clamp: 2;
  line-height: 1.5rem;
}
.v-footer {
  display: grid;
}
.v-badge--dot .v-badge__badge {
  display: none;
}
.v-badge__badge {
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
