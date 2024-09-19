<script setup lang="ts">
import { cn } from "@/utils/class-names"

type Props = {
  connected: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <i
    class="mr-1.5 size-2 rounded-full bg-[#e38968]"
    :class="cn(props.connected && 'bg-[#86bb71]')"
  ></i>
</template>
