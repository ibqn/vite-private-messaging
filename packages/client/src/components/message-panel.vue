<script setup lang="ts">
import { User } from "server/src/types"
import StatusIcon from "@/components/status-icon.vue"

type Props = {
  user: User
}

const props = defineProps<Props>()
</script>

<template>
  <div class="p-5">
    <div
      class="flex flex-row items-baseline gap-x-1.5 border-b border-[#dddddd] pb-5 leading-10"
    >
      <StatusIcon :connected="props.user.connected" />
      {{ props.user.username }}
    </div>
  </div>
</template>
