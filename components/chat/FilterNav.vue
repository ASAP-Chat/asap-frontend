<template>
  <v-navigation-drawer
    permanent
    width="175"
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
      >
        <template v-slot:prepend>
          <v-icon color="primary">mdi-message-outline</v-icon>
        </template>
      </v-list-item>
      <v-list-item
        title="แชตของฉัน"
        value="mine"
        exact
        base-color="#707070"
        :active="props.selectedItem === 'mine'"
        @click="updateSelectedItem('mine')"
      >
        <template v-slot:prepend>
          <v-icon color="primary">mdi-message-bookmark-outline</v-icon>
        </template>
      </v-list-item>
      <v-list-item
        title="ยังไม่ได้มอบหมาย"
        value="mine"
        exact
        base-color="#707070"
        :active="props.selectedItem === 'empty'"
        @click="updateSelectedItem('empty')"
      >
        <template v-slot:prepend>
          <v-icon color="primary">mdi-account-remove</v-icon>
        </template>
      </v-list-item>

      <v-list-subheader> สถานะแชต </v-list-subheader>
      <v-divider></v-divider>
      <v-list-item
        value="pending"
        prepend-icon="mdi-circle"
        base-color="#707070"
        :active="props.selectedItem === Status.PENDING"
        @click="updateSelectedItem(Status.PENDING)"
      >
        <template v-slot:prepend>
          <v-icon :color="Status.PENDING"></v-icon>
        </template>
        <template v-slot:title>
          <p :class="`text-${Status.PENDING}`">รอดำเนินการ</p>
        </template>
      </v-list-item>

      <v-list-item
        value="doing"
        prepend-icon="mdi-circle"
        base-color="#707070"
        :active="props.selectedItem === Status.ONGOING"
        @click="updateSelectedItem(Status.ONGOING)"
      >
        <template v-slot:prepend>
          <v-icon :color="Status.ONGOING"></v-icon>
        </template>
        <template v-slot:title>
          <p :class="`text-${Status.ONGOING}`">ดำเนินการ</p>
        </template>
      </v-list-item>
      <v-list-item
        value="done"
        prepend-icon="mdi-circle"
        base-color="#707070"
        :active="props.selectedItem === Status.COMPLETED"
        @click="updateSelectedItem(Status.COMPLETED)"
      >
        <template v-slot:prepend>
          <v-icon :color="Status.COMPLETED"></v-icon>
        </template>
        <template v-slot:title>
          <p :class="`text-${Status.COMPLETED}`">เสร็จสิ้น</p>
        </template>
      </v-list-item>

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
        base-color="#707070"
        :active="props.selectedItem === SocialType.INSTAGRAM"
        @click="updateSelectedItem(SocialType.INSTAGRAM)"
      >
        <template v-slot:prepend>
          <v-icon
            style="
              background: radial-gradient(
                circle at 30% 107%,
                #fdf497 0%,
                #fdf497 5%,
                #fd5949 45%,
                #d6249f 60%,
                #285aeb 90%
              );
              background-clip: text;
              -webkit-text-fill-color: transparent;
            "
            >mdi-instagram</v-icon
          >
        </template>
      </v-list-item>
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
