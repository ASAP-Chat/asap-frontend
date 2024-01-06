<template>
  <nav
    id="header"
    class="tw-fixed tw-w-full tw-z-30 top-0"
  >
    <div
      class="tw-w-full tw-container tw-mx-auto tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-mt-0 tw-py-2"
    >
      <div class="tw-pl-4 tw-flex items-center">
        <a
          class="toggleColour tw-no-underline"
          href="#"
        >
          <v-img
            :width="50"
            aspect-ratio="1/1"
            :src="imageSrc"
            class="tw-mx-auto"
          />
        </a>
      </div>
      <div class="tw-block lg:tw-hidden tw-pr-4">
        <v-btn
          v-if="!mobileSidebar"
          @click="mobileSidebar = !mobileSidebar"
          icon="mdi-menu"
          variant="flat"
          size="x-large"
        ></v-btn>
        <v-btn
          v-if="mobileSidebar"
          @click="mobileSidebar = !mobileSidebar"
          icon="mdi-close"
          variant="flat"
          size="x-large"
        ></v-btn>
      </div>
      <div
        :class="mobileSidebar ? '' : 'tw-hidden'"
        class="tw-w-full tw-flex-grow lg:tw-flex lg:tw-items-center lg:tw-w-auto tw-mt-2 lg:tw-mt-0 tw-bg-white lg:tw-bg-transparent tw-text-black tw-p-4 lg:tw-p-0 tw-z-20"
        id="nav-content"
      >
        <ul class="tw-list-reset lg:tw-flex tw-justify-end tw-flex-1 tw-items-center tw-list-none">
          <li class="tw-mr-3">
            <a
              class="tw-inline-block tw-uppercase tw-py-2 tw-px-4 tw-font-medium tw-no-underline"
              :class="data.scrollY > 10 ? 'text-primary' : 'text-white'"
              href="#"
              >Home</a
            >
          </li>
          <li class="tw-mr-3">
            <a
              class="tw-inline-block tw-uppercase tw-no-underline tw-font-medium tw-py-2 tw-px-4"
              href="#about"
              :class="data.scrollY > 10 ? 'text-primary' : 'text-white'"
              >About</a
            >
          </li>
          <li class="tw-mr-3">
            <a
              class="tw-inline-block tw-uppercase tw-no-underline tw-font-medium tw-py-2 tw-px-4"
              href="#customers"
              :class="data.scrollY > 10 ? 'text-primary' : 'text-white'"
              >Customers</a
            >
          </li>
          <li class="tw-mr-3">
            <a
              class="tw-inline-block tw-uppercase tw-no-underline tw-font-medium tw-py-2 tw-px-4"
              href="#pricing"
              :class="data.scrollY > 10 ? 'text-primary' : 'text-white'"
              >Pricing</a
            >
          </li>
          <li class="tw-mr-3">
            <a
              class="tw-inline-block tw-uppercase tw-no-underline tw-font-medium tw-py-2 tw-px-4"
              href="#about"
              :class="data.scrollY > 10 ? 'text-primary' : 'text-white'"
              >รู้จักเรา</a
            >
          </li>
        </ul>
        <div :class="mobileSidebar ? 'mb-3' : 'mr-3'">
          <v-btn
            :block="mobileSidebar ? true : false"
            variant="outlined"
            color="primary"
            class="font-weight-bold"
            @click="navigateTo('/login/')"
            >เข้าสู่ระบบ</v-btn
          >
        </div>
        <div>
          <v-btn
            :block="mobileSidebar ? true : false"
            variant="flat"
            color="primary"
            class="font-weight-bold"
            @click="navigateTo('/signup/')"
            >สมัครใช้งาน</v-btn
          >
        </div>
      </div>
    </div>
    <hr class="tw-border-b tw-border-gray-100 tw-opacity-25 tw-my-0 tw-py-0" />
  </nav>
</template>
<script setup lang="ts">
import imageSrc from '~/assets/images/logo.png'

const data = reactive({
  scrollY: 0,
})
const mobileSidebar = ref(false)
onMounted(() => {
  data.scrollY = window.scrollY
  window.addEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  data.scrollY = window.scrollY
}

watchEffect(() => {
  const header = document.getElementById('header')
  const toToggle = document.querySelector('.toggleColour')

  if (data.scrollY > 10) {
    header?.classList.add('bg-white')
    header?.classList.add('navbar-active')
  } else {
    header?.classList.remove('bg-white')
    header?.classList.remove('navbar-active')
  }
})
</script>

<style></style>
