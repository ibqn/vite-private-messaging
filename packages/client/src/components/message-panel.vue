<script setup lang="ts">
import type { User } from "server/src/types"
import StatusIcon from "@/components/status-icon.vue"
import { computed, ref } from "vue"

type Props = {
  user: User
}

const { user } = defineProps<Props>()

type Emits = {
  input: [message: string]
}

const emit = defineEmits<Emits>()

const displaySender = (index: number) => {
  return (
    index === 0 ||
    user.messages?.[index].fromSelf !== user.messages?.[index - 1].fromSelf
  )
}

const input = ref("")

const isValid = computed(() => input.value.trim().length > 0)

const onSubmit = () => {
  if (isValid.value) {
    emit("input", input.value)
    input.value = ""
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-between gap-2.5 p-5">
    <div>
      <div
        class="flex flex-row items-baseline gap-x-1.5 border-b border-[#dddddd] pb-5 leading-10"
      >
        <StatusIcon :connected="user.connected" />
        {{ user.username }}
      </div>

      <ul v-if="user.messages" class="p-5">
        <li v-for="(message, index) in user.messages" :key="index">
          <div v-if="displaySender(index)" class="mt-1.5 font-semibold">
            {{ user.username }}
          </div>
          {{ message.content }}
        </li>
      </ul>
    </div>

    <form class="flex flex-row gap-2" @submit.prevent="onSubmit">
      <textarea
        class="flex-1 resize-none border border-[#dddddd] p-2 leading-normal"
        placeholder="your message..."
        v-model="input"
      ></textarea>
      <button
        :disabled="!isValid"
        class="border border-[#dddddd] p-2 px-4 capitalize disabled:opacity-50"
      >
        send
      </button>
    </form>
  </div>
</template>
