<script lang="ts" setup>
  import type { MaterialSymbol } from "material-symbols";
  import type { QIconProps } from "quasar";

  type Props = QIconProps & {
    name: MaterialSymbol;
    filled?: boolean;
  };

  const props = withDefaults(defineProps<Props>(), {
    filled: false,
  });

  const quasarName = computed(() => `sym_r_${props.name}`);
</script>

<template>
  <QIcon v-bind="props" :name="quasarName" :class="{ filled }">
    <slot />
  </QIcon>
</template>

<style>
  .material-symbols-rounded.filled {
    font-variation-settings:
      "FILL" 1,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
  }
</style>
