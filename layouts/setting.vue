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
            <v-img
              src="/images/logo.png"
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
            @click="i === 3 ? selectItem('ข้อมูลส่วนตัว') : null"
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
            <v-img
              :width="40"
              :height="40"
              :aspect-ratio="1"
              cover
              class="rounded-circle ma-2 tw-cursor-pointer zoom"
              :src="
                userProfile
                  ? userProfile
                  : 'https://i.pinimg.com/564x/6d/61/eb/6d61eba8c8530d891373ea366b38da7d.jpg'
              "
              id="menu-activator"
            ></v-img>

            <v-menu
              activator="#menu-activator"
              location="end"
            >
              <v-list>
                <v-list-item @click="settingProfile">
                  <v-list-item-title>โปรไฟล์</v-list-item-title>
                </v-list-item>
                <v-list-item @click="useSignOut()">
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
              icon="mdi-cog-outline"
              color="white"
              size="small"
            />
          </span>
          ตั้งค่า</v-app-bar-title
        >

        <v-spacer></v-spacer>
      </v-app-bar>
      <v-navigation-drawer
        permanent
        width="145"
        color="#fafafa"
      >
        <v-list
          color="primary"
          class="tw-text-center"
        >
          <v-list-item
            title="ข้อมูลส่วนตัว"
            value="profile"
            exact
            base-color="#707070"
            :active="selectedItem === 'ข้อมูลส่วนตัว'"
            @click="selectItem('ข้อมูลส่วนตัว')"
            to="profile"
          ></v-list-item>

          <v-divider></v-divider>
          <v-list-item
            title="การตั้งค่าช่องทาง"
            value="integration"
            exact
            base-color="#707070"
            :active="selectedItem === 'การตั้งค่าช่องทาง'"
            @click="selectItem('การตั้งค่าช่องทาง')"
            to="integration"
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-item
            title="จัดการสมาชิก"
            value="team"
            exact
            base-color="#707070"
            :active="selectedItem === 'จัดการสมาชิก'"
            @click="selectItem('จัดการสมาชิก')"
            to="member"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

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
const userProfile = ref()
const router = useRouter()
const route = useRoute()

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
    path: '/setting/profile',
  },
]

const settingProfile = () => {
  router.push('/setting/profile')
  selectedItem.value = 'ข้อมูลส่วนตัว'
}
const selectedItem = ref('ข้อมูลส่วนตัว')

const selectItem = (item: string) => {
  selectedItem.value = item
}

if (route.path.includes('/setting')) {
  selectItem('ข้อมูลส่วนตัว')
} else if (route.path.includes('/setting/profile')) {
  selectItem('ข้อมูลส่วนตัว')
} else if (route.path.includes('/setting/integration')) {
  selectItem('การตั้งค่าช่องทาง')
} else if (route.path.includes('/setting/member')) {
  selectItem('จัดการสมาชิก')
}
</script>
