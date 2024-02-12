<template>
  <v-navigation-drawer
    permanent
    width="145"
    color="#fafafa"
  >
    <v-list color="primary">
      <v-list-item
        title="ทั้งหมด"
        value="all"
        prepend-icon="mdi-message-outline"
        exact
        base-color="#707070"
        :active="props.selectedItem === 'all'"
        @click="updateSelectedItem('all')"
      ></v-list-item>
      <v-list-item
        title="แชตของฉัน"
        value="mine"
        prepend-icon="mdi-message-bookmark-outline"
        exact
        base-color="#707070"
        :active="props.selectedItem === 'mine'"
        @click="updateSelectedItem('mine')"
      ></v-list-item>
      <v-list-item
        title="แชตที่ยังว่าง"
        value="mine"
        prepend-icon="mdi-message-badge-outline"
        exact
        base-color="#707070"
        :active="props.selectedItem === 'empty'"
        @click="updateSelectedItem('empty')"
      ></v-list-item>

      <v-list-subheader> สถานะแชต </v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        title="รอดำเนินการ"
        value="pending"
        prepend-icon="mdi-emoticon-confused-outline"
        base-color="#707070"
        :active="props.selectedItem === Status.PENDING"
        @click="updateSelectedItem(Status.PENDING)"
      ></v-list-item>

      <v-list-item
        title="ดำเนินการ"
        value="doing"
        prepend-icon="mdi-emoticon-neutral-outline"
        base-color="#707070"
        :active="props.selectedItem === Status.ONGOING"
        @click="updateSelectedItem(Status.ONGOING)"
      ></v-list-item>
      <v-list-item
        title="เสร็จสิ้น"
        value="done"
        prepend-icon="mdi-emoticon-happy-outline"
        base-color="#707070"
        :active="props.selectedItem === Status.COMPLETED"
        @click="updateSelectedItem(Status.COMPLETED)"
      ></v-list-item>

      <v-list-subheader> Social Media </v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        title="Line"
        :value="SocialType.LINE"
        prepend-icon="fa:fa-brands fa-line"
        base-color="#707070"
        :active="props.selectedItem === SocialType.LINE"
        @click="updateSelectedItem(SocialType.LINE)"
      >
        <template v-slot:prepend>
          <v-icon color="#02c153"></v-icon>
        </template>
      </v-list-item>

      <v-list-item
        title="Facebook"
        :value="SocialType.FACEBOOK"
        prepend-icon="fa:fa-brands fa-square-facebook"
        base-color="#707070"
        :active="props.selectedItem === SocialType.FACEBOOK"
        @click="updateSelectedItem(SocialType.FACEBOOK)"
      >
        <template v-slot:prepend>
          <v-icon color="#0765FF"></v-icon>
        </template>
      </v-list-item>
      <v-list-item
        title="Instagram"
        :value="SocialType.INSTAGRAM"
        prepend-icon="mdi-instagram"
        base-color="#707070"
        :active="props.selectedItem === SocialType.INSTAGRAM"
        @click="updateSelectedItem(SocialType.INSTAGRAM)"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { SocialType } from '~/interfaces/social.interface'
import { Status } from '~/constants/Status'

const props = defineProps<{
  selectedItem: string
}>()

const emit = defineEmits()

const updateSelectedItem = (item: string) => {
  emit('update:selectedItem', item)
}
</script>
