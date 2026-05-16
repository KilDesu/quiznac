<script lang="ts" setup>
  import type { MaterialSymbol } from "material-symbols";
  import type { QBtnProps } from "quasar";

  type Props = QBtnProps & {
    icon?: MaterialSymbol;
  };

  const props = defineProps<Props>();

  const quasarBtnIcon = computed(() => props.icon && `sym_r_${props.icon}`);
</script>

<template>
  <QBtn v-bind="props" :icon="quasarBtnIcon">
    <slot />
  </QBtn>
</template>

<style></style>
