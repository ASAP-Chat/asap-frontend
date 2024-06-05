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
            :active="i === 3"
            :disabled="!socialInfo"
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
            icon="mdi-cog-outline"
            color="white"
            size="small"
            class="pb-1"
          />
          ตั้งค่า</v-app-bar-title
        >

        <v-spacer></v-spacer>
        <template v-slot:append>
          <span class="tw-text-xl">
            <b>{{ displayName }}</b
            >&nbsp; ({{ generateRole(role) }})</span
          >
        </template>
      </v-app-bar>
      <v-navigation-drawer
        permanent
        width="175"
        color="#fafafa"
      >
        <v-list
          color="primary"
          class="pa-0"
        >
          <div
            v-for="item in role === Role.OWNER
              ? settingItems
              : role === Role.MANAGER
              ? settingItems.filter((item) => item.path !== '/setting/chat-integration/')
              : settingItems.filter((item) => item.path === '/setting/profile/')"
          >
            <v-list-item
              :key="item.path"
              :title="item.title"
              :value="item.path"
              exact
              base-color="#707070"
              color="primary"
              :to="item.path"
            >
              <template v-slot:prepend>
                <v-icon color="primary">{{ item.icon }}</v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </v-list>
      </v-navigation-drawer>

      <v-main class="tw-bg-[#f2f2f2]">
        <v-container
          fluid
          class="tw-min-h-[92.8dvh] pa-9"
        >
          <h1 class="tw-text-3xl pb-3 text-primary">
            {{ settingItems.find((item) => 'setting-' + item.value === $route.name)?.title || '' }}
          </h1>
          <slot />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script setup lang="ts">
import imageSrc from '~/assets/images/logo.png'
import { Role } from '~/constants/Role'
import { USER } from '~/constants/Cookie'
import { getSocialAccount } from '~/services/message.service'

const { socialInfo } = await getSocialAccount()
const confirmLogout = ref(false)

const user: any = useCookie(USER)
const { displayName, role } = user.value || {}

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

const settingItems = [
  {
    title: 'ข้อมูลส่วนตัว',
    path: '/setting/profile/',
    value: 'profile',
    icon: 'mdi-account-outline',
  },
  {
    title: 'การตั้งค่า Social Media Platforms',
    path: '/setting/chat-integration/',
    value: 'chat-integration',
    icon: 'mdi-store-cog-outline',
  },
  {
    title: 'สมาชิก',
    path: '/setting/member/',
    value: 'member',
    icon: 'mdi-face-agent',
  },
]
</script>
