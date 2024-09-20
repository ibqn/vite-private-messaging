<script setup lang="ts">
import { cn } from "@/utils/class-names"

type Props = {
  connected?: boolean
}

const { connected = false } = defineProps<Props>()
</script>

<template>
  <i
    class="flex size-2 rounded-full"
    :class="cn(connected ? 'bg-[#86bb71]' : 'bg-[#e38968]')"
  ></i>
</template>
