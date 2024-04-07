<template>
  <CommonConfirmModal
    v-model="confirmLogout"
    header="คุณต้องการออกจากระบบใช่หรือไม่ ?"
    buttonText="ปิด"
    cancelWording="ยกเลิก"
    confirmWording="ยืนยัน"
    :isSuccess="false"
    @btn-action="confirmLogout = false"
    @confirm-action="useSignOut()"
  />
  <CommonModal
    v-if="!socialInfo && isOwner"
    :header="'ยังไม่ได้ลงทะเบียนบัญชี Social Media!'"
    custom-icon="mdi-store-cog-outline"
    :content="'โปรดเชื่อมต่ออย่างน้อย 1 บัญชี Social Media เพื่อเริ่มใช้งาน ASAP'"
    :buttonText="'ตั้งค่า'"
    :isSuccess="false"
    @btn-action="navigateTo('/setting/chat-integration/')"
  />

  <v-card>
    <v-layout>
      <v-navigation-drawer
        app
        rail
        rail-width="75"
        permanent
      >
        <v-list>
          <v-list-item>
            <v-img
              :src="imageSrc"
              :width="50"
              class="mx-auto"
            />
          </v-list-item>
        </v-list>

        <v-list
          density="compact"
          nav
        >
          <v-list-item
            class="my-6 rounded-md"
            base-color="#B1B1B1"
            color="primary"
            v-for="(item, i) in sidebarList"
            :key="i"
            exact
            link
            :to="item.path"
          >
            <template #title>
              <v-row
                no-gutters
                align="center"
                justify="center"
              >
                <v-col
                  cols="12"
                  class="tw-justify-center tw-flex"
                >
                  <v-icon
                    size="large"
                    color="primary"
                    >{{ item.prependIcon }}</v-icon
                  >
                  <v-tooltip
                    activator="parent"
                    location="start"
                  >
                    {{ item.title }}
                  </v-tooltip>
                </v-col>
              </v-row>
            </template>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="text-center">
            <common-icon-button
              icon="mdi-logout"
              color="primary"
              class="mx-auto"
              @click="confirmLogout = true"
            />
          </div>
        </template>
      </v-navigation-drawer>
      <v-app-bar
        color="primary"
        app
        density="comfortable"
        :elevation="0"
      >
        <v-app-bar-title class="font-weight-bold tw-text-xl">
          <v-icon
            :icon="getIcon()"
            color="white"
            size="small"
            :class="route.name === 'chatbot' ? 'pb-2' : ''"
          />
          {{ pathTitle }}
        </v-app-bar-title>
        <template v-slot:append>
          <span class="tw-text-xl">
            <b>{{ displayName }}</b
            >&nbsp; ({{ generateRole(role) }})</span
          >
        </template>
      </v-app-bar>

      <v-main class="tw-bg-[#f2f2f2] tw-min-h-screen">
        <v-container fluid>
          <slot />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script lang="ts" setup>
import { type PathToTitleMap } from '~/interfaces/index.interface'
import imageSrc from '~/assets/images/logo.png'
import { USER } from '~/constants/Token'
import { getSocialAccount } from '~/services/message.service'

const route = useRoute()
const confirmLogout = ref(false)
const user: any = useCookie(USER)
const { displayName, role, isOwner } = user.value || {}
const { socialInfo } = await getSocialAccount()

const pathToTitle = {
  chat: 'แชต',
  chatbot: 'แชตบอท',
  'chat-template': 'รูปแบบคำตอบ',
  setting: 'ตั้งค่า',
  'setting-profile': 'ตั้งค่า',
  'setting-chat-integration': 'ตั้งค่า',
  'setting-member': 'ตั้งค่า',
} as PathToTitleMap

const sidebarList = [
  {
    prependIcon: 'mdi-message-outline',
    title: 'แชต',
    value: 'chat',
    path: '/chat/',
  },
  {
    prependIcon: 'mdi-robot-outline',
    title: 'แชตบอท',
    value: 'chatbot',
    path: '/chatbot/',
  },
  {
    prependIcon: 'mdi-message-text-outline',
    title: 'รูปแบบคำตอบ',
    value: 'chat-template',
    path: '/chat-template/',
  },
  {
    prependIcon: 'mdi-cog-outline',
    title: 'ตั้งค่า',
    value: 'setting',
    path: '/setting/profile/',
  },
]

const getIcon = () => {
  const routeName = route.name
  switch (routeName) {
    case 'chat':
      return 'mdi-message-outline'
    case 'chatbot':
      return 'mdi-robot-outline'
    case 'chat-template':
      return 'mdi-message-text-outline'
    case 'setting':
    default:
      return 'mdi-cog-outline'
  }
}

const pathTitle = computed(() => {
  if (route.name) {
    return pathToTitle[route.name.toString()]
  }
  return route.name
})
</script>
