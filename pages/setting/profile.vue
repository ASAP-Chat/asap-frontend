<template>
  <div class="profile-info bg-white pa-5 tw-rounded-md">
    <p class="mb-2"><b>ชื่อ :</b> {{ displayName }}</p>
    <p class="mb-2"><b>อีเมล :</b> {{ email }}</p>
    <p class="mb-2"><b>ตำแหน่ง :</b> {{ generateRole(role) }}</p>
  </div>
</template>
<script setup lang="ts">
import { USER } from '~/constants/Token'

useHead({
  title: 'การตั้งค่า',
})
definePageMeta({
  layout: 'setting',
})

const user: any = useCookie(USER)
const { email, displayName, role } = user.value && user.value
</script>
