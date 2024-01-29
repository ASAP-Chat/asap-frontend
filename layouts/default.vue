<template>
  <CommonConfirmModal
    v-if="confirmLogout"
    header="คุณต้องการออกจากระบบใช่หรือไม่ ?"
    buttonText="ปิด"
    cancelWording="ยกเลิก"
    confirmWording="ยืนยัน"
    :isSuccess="false"
    @btn-action="confirmLogout = false"
    @confirm-action="useSignOut()"
  />

  <v-card>
    <v-layout>
      <v-navigation-drawer
        app
        rail
        rail-width="60"
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
                  <v-icon size="large">{{ item.prependIcon }}</v-icon>
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
          <v-btn
            @click="confirmLogout = true"
            class="ma-2"
            variant="text"
            icon="mdi-logout"
          />
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
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main class="tw-bg-[#f2f2f2]">
        <v-container
          fluid
          :class="route.name === 'chat' ? 'tw-min-h-[72.9dvh]' : 'tw-min-h-[92.8dvh]'"
        >
          <slot />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script lang="ts" setup>
import { PathToTitleMap } from '~/interfaces/index.interface'
import imageSrc from '~/assets/images/logo.png'

const route = useRoute()
const confirmLogout = ref(false)

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
<style></style>
