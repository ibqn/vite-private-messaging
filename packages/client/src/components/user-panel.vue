<script setup lang="ts">
import { User } from "server/src/types"
import { computed } from "vue"
import StatusIcon from "@/components/status-icon.vue"
import { cn } from "@/utils/class-names"

type Props = {
  user: User
  selected: boolean
}
const props = defineProps<Props>()

const status = computed(() => {
  return props.user.connected ? "online" : "offline"
})

type Emits = {
  select: [void]
}

const emit = defineEmits<Emits>()

const onSelectUser = () => emit("select")
</script>

<template>
  <div
    class="cursor-pointer p-2.5"
    @click="onSelectUser"
    :class="cn(selected && 'bg-[#1164a3]')"
  >
    <div class="flex flex-row items-baseline justify-between">
      <div class="flex flex-col">
        <div>
          {{ props.user.username }} {{ props.user.self ? "(you)" : "" }}
        </div>
        <div class="flex flex-row items-baseline gap-1.5 text-[#92959e]">
          <StatusIcon :connected="props.user.connected" />
          {{ status }}
        </div>
      </div>

      <div
        v-if="props.user.hasNewMessages"
        class="flex size-5 items-center justify-center rounded-full bg-[#d9290a] text-white"
      >
        !
      </div>
    </div>
  </div>
</template>
