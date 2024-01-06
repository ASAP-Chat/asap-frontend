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
            :active="i === 3"
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
      </v-app-bar>
      <v-navigation-drawer
        permanent
        width="190"
        color="#fafafa"
      >
        <v-list color="primary">
          <div
            v-for="item in isOwner
              ? settingItems
              : settingItems.filter((item) => item.value !== '/setting/chat-integration/')"
          >
            <v-list-item
              :key="item.value"
              :title="item.title"
              :value="item.value"
              exact
              base-color="#707070"
              :prepend-icon="item.icon"
              :to="item.value"
            ></v-list-item>
            <v-divider></v-divider>
          </div>
        </v-list>
      </v-navigation-drawer>

      <v-main class="tw-bg-[#f2f2f2]">
        <v-container
          fluid
          class="tw-min-h-[92.8dvh]"
        >
          <h1 class="tw-text-xl">
            <v-icon class="pb-2">
              {{ settingItems.find((item) => 'setting-' + item.value === route.name)?.icon || '' }}
            </v-icon>
            {{ settingItems.find((item) => 'setting-' + item.value === route.name)?.title || '' }}
          </h1>
          <slot />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script setup lang="ts">
import imageSrc from '~/assets/images/logo.png'

const route = useRoute()
const confirmLogout = ref(false)

const { user } = useGetCookie()
const { isOwner } = user

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
    value: '/setting/profile/',
    icon: 'mdi-account-outline',
  },
  {
    title: 'การตั้งค่าช่องทาง',
    value: '/setting/chat-integration/',
    icon: 'mdi-store-cog-outline',
  },
  {
    title: 'สมาชิก',
    value: '/setting/member/',
    icon: 'mdi-account-group-outline',
  },
]
</script>
<style>
.v-list-item-title {
  font-size: 14px !important;
  font-weight: bold !important;
}
.v-list-item__prepend {
  display: grid !important;
}
</style>
