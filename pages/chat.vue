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
          value="home"
          prepend-icon="mdi-message-outline"
          exact
          base-color="#707070"
        ></v-list-item>

        <v-list-subheader> สถานะแชต </v-list-subheader>
        <v-divider></v-divider>
        <v-list-item
          title="รอดำเนินการ"
          value="pending"
          prepend-icon="mdi-emoticon-neutral-outline"
          base-color="#707070"
        ></v-list-item>

        <v-list-item
          title="ดำเนินการ"
          value="doing"
          prepend-icon="mdi-emoticon-confused-outline"
          base-color="#707070"
        ></v-list-item>
        <v-list-item
          title="เสร็จสิ้น"
          value="done"
          prepend-icon="mdi-emoticon-happy-outline"
          base-color="#707070"
        ></v-list-item>

        <v-list-subheader> Social Media </v-list-subheader>
        <v-divider></v-divider>
        <v-list-item
          title="Line"
          value="line"
          prepend-icon="fa:fa-brands fa-line"
          base-color="#707070"
        ></v-list-item>

        <v-list-item
          title="Facebook"
          value="facebook"
          prepend-icon="mdi-facebook"
          base-color="#707070"
        ></v-list-item>
        <v-list-item
          title="Instagram"
          value="instagram"
          prepend-icon="mdi-instagram"
          base-color="#707070"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- drawer รายชื่อ -->
    <v-navigation-drawer
      permanent
      width="280"
    >
      <v-list
        class="tw-p-0"
        v-if="latestMessages"
        v-for="message in latestMessages.data"
      >
        <v-list-item
          class="tw-gap-x-3"
          height="90"
          :prepend-avatar="message.senderDetail.pictureUrl"
          :title="message.senderDetail.displayName"
          :subtitle="getMessageSubtitle(message)"
          :value="message.senderDetail.userId"
          :active="
            message.senderDetail.userId === selectCustomer.senderDetail.userId
          "
          @click="
            setSelectCustomer(
              message.senderDetail.userId,
              message.senderDetail.displayName,
              message.senderDetail.pictureUrl
            )
          "
        >
          <!-- Todo: อ่านแล้ว -->
          <template v-slot:append>
            <v-badge
              dot
              color="error"
            >
              <v-icon
                color="#02c153"
                :icon="message.source === 'LINE' ? 'fa:fa-brands fa-line' : ''"
                variant="text"
              ></v-icon>
            </v-badge>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
  <!-- TODO: scroll to bottom -->
  <div>
    <div v-if="filteredMessages">
      <div
        v-if="
          selectCustomer.senderDetail.userId.trim() !== '' &&
          selectCustomer.senderDetail.displayName.trim() !== ''
        "
      >
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
              <p>{{ selectCustomer.senderDetail.displayName }}</p>
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
              :src="selectCustomer.senderDetail.pictureUrl"
            ></v-img>
          </template>
          <v-app-bar-title class="font-weight-bold">
            {{ selectCustomer.senderDetail.displayName }}
          </v-app-bar-title>
          <template v-slot:append>
            <v-btn
              icon="mdi-information-outline"
              @click.stop="drawer = !drawer"
            ></v-btn>
          </template>
        </v-app-bar>
      </div>
      <div v-for="(message, index) in filteredMessages.data">
        <ChatBubble
          :msgType="message.messageObject.type"
          :msg-text="message.messageObject.text"
          :msg-sticker="message.messageObject.link"
          :name="message.senderDetail.displayName"
          :img="message.senderDetail.pictureUrl"
          :date="shouldDisplayTime(index) ? message.sourceTimestamp : ''"
          :time="message.sourceTimestamp"
        />
      </div>
    </div>

    <v-footer
      v-if="
        selectCustomer.senderDetail.userId.trim() !== '' &&
        selectCustomer.senderDetail.displayName.trim() !== ''
      "
      app
      name="footer"
    >
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12">
              <CommonTextField
                v-model="sendMsg"
                append-icon="mdi-send"
                type="text"
                @click:append=""
                @keydown.prevent.enter="sendMessage(sendMsg)"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-footer>
  </div>
</template>
<script setup lang="ts">
// import io from 'socket.io-client'
const latestMessages = ref()
const filteredMessages = ref()

const filteredMessagesDate = ref()

const shouldDisplayTime = (index: number) => {
  if (index === 0) {
    return true
  }

  const currentMessage = filteredMessagesDate.value.data[index]
  const previousMessage = filteredMessagesDate.value.data[index - 1]

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

// const socket = io('http://localhost:3000')
// socket.on('connect', () => {
//   console.log('Socket connected FE')
// })

useHead({
  title: 'แชต',
})

const drawer = ref(false)
const rail = ref(false)
const sendMsg = ref()

const selectCustomer = ref<any>({
  senderDetail: {
    userId: '',
    displayName: '',
    pictureUrl: '',
  },
})

const sendMessage = (msg: string) => {
  alert(`Have Send : ${msg}`)
  console.log('sent msg', msg)
}

const setSelectCustomer = (userId: any, displayName: any, pictureUrl: any) => {
  fetchFilterChat(userId)
  selectCustomer.value.senderDetail = { userId, displayName, pictureUrl }
}

let intervalId

const fetchFilterChat = async (customerId: any) => {
  try {
    const response = await useFetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/social-message/ASAP-Shop/652e92d9fbacd5abf57c6249/${customerId}?$limit=50`
    )
    if (selectCustomer) {
      filteredMessages.value = await response.data.value
      filteredMessagesDate.value = filteredMessages.value
    }
    window.scrollTo(0, document.body.offsetHeight)
  } catch (error) {
    console.log(error)
  }
}

const fetchLatestMessages = async () => {
  try {
    const response = await useFetch(
      `${
        import.meta.env.VITE_BASE_URL
      }/social-message/652712a90bfba5fec0dd29f3`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    )
    if (response.status.value === 'success') {
      latestMessages.value = await response.data.value
      if (Array.isArray(latestMessages.value)) {
        latestMessages.value.sort(
          (a: { sourceTimestamp: string }, b: { sourceTimestamp: string }) => {
            return (
              new Date(b.sourceTimestamp).getTime() -
              new Date(a.sourceTimestamp).getTime()
            )
          }
        )
      }
    } else {
      console.log('call - refresh token')
      useRefreshToken()
      fetchLatestMessages()
    }
  } catch (error: any) {
    console.log(error)
  }
}

fetchLatestMessages()
// intervalId = setInterval(() => {
//   fetchLatestMessages()
// }, 1000)
</script>
<style>
.v-list-item-title {
  font-size: 14px;
  font-weight: bold;
}
.v-list-item__prepend {
  display: grid;
}
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
</style>
