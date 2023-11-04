<template>
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
            <!-- TODO: Logo -->
            <!-- <v-img
              src="/images/logo.png"
              :width="50"
              class="mx-auto"
            /> -->
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
            <!-- TODO: Tooltip -->

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
                </v-col>
              </v-row>
            </template>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="tw-text-center">
            <v-btn
              id="menu-activator"
              class="ma-2"
              variant="text"
              icon="mdi-account-circle-outline"
            />
            <v-menu
              activator="#menu-activator"
              location="end"
            >
              <v-list>
                <v-list-item>
                  <v-list-item-title>โปรไฟล์</v-list-item-title>
                </v-list-item>
                <v-list-item @click="signOut()">
                  <v-list-item-title>ออกจากระบบ</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-navigation-drawer>
      <v-app-bar
        color="primary"
        app
        density="comfortable"
      >
        <v-app-bar-title class="font-weight-bold tw-text-xl">
          <span class="tw-pb-3">
            <v-icon
              :icon="getIcon()"
              color="white"
              size="small"
            />
          </span>
          {{ pathTitle }}</v-app-bar-title
        >

        <v-spacer></v-spacer>

        <!-- In case
          <p class="tw-text-sm">
          <span>{{ useDayjs()(date).format('DD/MM/YYYY, HH:mm น.') }}</span>
        </p> -->
      </v-app-bar>

      <v-main class="tw-bg-[#f2f2f2]">
        <v-container
          fluid
          class="tw-min-h-screen"
        >
          <slot />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script lang="ts" setup>
import { PathToTitleMap } from '~/interfaces/index.interface'

const route = useRoute()
const router = useRouter()
const date = new Date()

const pathToTitle = {
  chat: 'แชต',
  chatbot: 'แชตบอท',
  'chat-template': 'รูปแบบคำตอบ',
  setting: 'ตั้งค่า',
} as PathToTitleMap

const sidebarList = [
  {
    prependIcon: 'mdi-message-outline',
    title: 'แชต',
    value: 'chat',
    path: '/chat',
  },
  {
    prependIcon: 'mdi-robot-outline',
    title: 'แชตบอท',
    value: 'chatbot',
    path: '/chatbot',
  },
  {
    prependIcon: 'mdi-message-text-outline',
    title: 'รูปแบบคำตอบ',
    value: 'chat-template',
    path: '/chat-template',
  },
  {
    prependIcon: 'mdi-cog-outline',
    title: 'ตั้งค่า',
    value: 'setting',
    path: '/setting',
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
      return 'mdi-cog-outline'
    default:
      return 'mdi-default-icon'
  }
}

const pathTitle = computed(() => {
  if (route.name) {
    return pathToTitle[route.name.toString()]
  }
  return route.name
})

const signOut = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
