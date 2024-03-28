<template>
  <v-card min-width="300">
    <h3 class="pa-3">มอบหมายให้</h3>
    <v-divider></v-divider>
    <v-list color="primary">
      <v-list-item
        v-for="member in sortedMembers"
        :value="member"
        :active="member.displayName === localMember.displayName"
        @click="updateAgent(props.id, member)"
      >
        <v-list-item-title class="tw-flex tw-items-center">
          <v-icon
            v-if="member.displayName === localMember.displayName"
            size="x-small"
            class="mr-2"
            >mdi-check-circle
          </v-icon>
          <b v-if="member.displayName === localMember.displayName"
            >{{ member.displayName }} &nbsp; ({{ generateRole(member.role) }})</b
          >
          <span v-else>{{ member.displayName }} &nbsp; ({{ generateRole(member.role) }})</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        color="error"
        variant="outlined"
        @click="updateAgent(props.id, {})"
      >
        ไม่มอบหมาย
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { getMember } from '~/services/member.service'
import { ACCESS_TOKEN } from '~/constants/Token'
import { getCustomer } from '~/services/message.service'

const props = defineProps<{
  id: string
  currentMember: any
}>()

const emits = defineEmits(['update:message'])
const localMember = ref(props.currentMember)
const access_token = useCookie(ACCESS_TOKEN)
const storeSelectCus: any = useCookie('storeSelectCus')

const { memberData } = await getMember()
const roleOrder: { [key: string]: number } = {
  manager: 1,
  agent: 2,
  owner: 0,
}
const sortedMembers = computed(() => {
  return memberData.value.data
    .filter((item: any) => item.status === 'completed')
    .sort((a: any, b: any) => {
      const roleComparison = roleOrder[a.role] - roleOrder[b.role]
      if (roleComparison !== 0) {
        return roleComparison
      }

      // If roles are the same, sort by displayName
      if (a.displayName < b.displayName) {
        return -1
      }
      if (a.displayName > b.displayName) {
        return 1
      }
      return 0
    })
})
const updateAgent = async (id: string, v: any) => {
  localMember.value = v

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chat-customer/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        agent: v,
      }),
      headers: {
        'content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token.value,
      },
    })

    if (response.status === 200) {
      if (storeSelectCus?.value?.statusId === id) {
        storeSelectCus.value.agent = localMember.value.displayName
      }
      if (storeSelectCus?.value.agent === v) {
        emits('update:message')
      }
      await getCustomer()
    } else if (response.status === 401) {
      await useRefreshToken()
      await updateAgent(id, v)
    } else {
      console.log('err')
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<style scoped>
.v-list-item-title {
  font-size: 16px !important;
  font-weight: normal !important;
}
</style>
