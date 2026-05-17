<script lang="ts" setup>
  import type { QSelectProps } from "quasar";

  type ToExclude =
    | "color"
    | "labelColor"
    | "outlined"
    | "filled"
    | "rounded"
    | "standout"
    | "borderless"
    | "square";

  type Props = Omit<QSelectProps, ToExclude> & {
    color?: "primary" | "secondary" | "tertiary";
    optionSelectedClass?: string;
  };

  const {
    color = "primary",
    optionSelectedClass = "primary-container",
    ...rest
  } = defineProps<Props>();

  const highlightColor = computed(() => `var(--${color})`);
</script>

<template>
  <QSelect
    v-bind="rest"
    outlined
    map-options
    popup-content-class="surface-variant"
    :options-selected-class="optionSelectedClass"
    :style="`--highlight-color: ${highlightColor}`"
  >
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
      <slot :name v-bind="slotData || {}" />
    </template>
  </QSelect>
</template>

<style></style>
