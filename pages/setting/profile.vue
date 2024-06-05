<template>
  <div
    class="bg-white tw-p-7 tw-rounded-3xl tw-gap-x-12 tw-gap-y-7 tw-mt-6 tw-grid tw-grid-cols-1 sm:tw-grid-cols-2"
  >
    <div>
      <p class="mb-2">ชื่อผู้ใช้งาน</p>
      <div class="profile-info">{{ displayName }}</div>
    </div>
    <div>
      <p class="mb-2">อีเมล</p>
      <div class="profile-info">{{ email }}</div>
    </div>
    <div>
      <p class="mb-2">ตำแหน่งงาน</p>
      <div class="profile-info">{{ generateRole(role) }}</div>
    </div>
    <div v-if="role === Role.OWNER">
      <p class="mb-5">บัญชีที่เชื่อมต่อ</p>
      <span
        v-for="(value, key) in social"
        class="tw-cursor-pointer"
        @click="copyToClipboard(value, String(key))"
      >
        <v-tooltip
          activator="parent"
          location="top"
          ><span v-if="(showCopiedTooltip as any)[key]"
            ><v-icon>mdi-content-copy</v-icon>&nbsp;</span
          >
          {{ (showCopiedTooltip as any)[key] ? 'คัดลอกไปยังคลิปบอร์ด' : value }}
        </v-tooltip>
        <v-icon
          v-if="value"
          :key="key"
          size="x-large"
          class="tw-mr-3.5"
        >
          {{ generateSocialIcon(String(key).toUpperCase()) }}
        </v-icon>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Role } from '~/constants/Role'
import { USER } from '~/constants/Cookie'

useHead({
  title: 'การตั้งค่า',
})
definePageMeta({
  layout: 'setting',
})

const user: any = useCookie(USER)
const { email, displayName, role, shop } = user.value || {}
const { social } = shop

const showCopiedTooltip = ref({
  facebook: false,
  line: false,
  instagram: false,
})

const copyToClipboard = (value: string, social: string) => {
  ;(showCopiedTooltip.value as any)[social] = true
  navigator.clipboard.writeText(value)
  setTimeout(() => {
    ;(showCopiedTooltip.value as any)[social] = false
  }, 1000)
}
</script>
<style>
.profile-info {
  border: 2px solid #d9d9d9;
  background-color: #efefef;
  padding: 12px 30px;
  border-radius: 12px;
  cursor: not-allowed;
}
</style>
