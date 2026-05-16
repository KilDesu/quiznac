<script lang="ts" setup>
  import type { QInputProps, QInput } from "quasar";

  // #region:    --Types
  type ToExclude =
    | "color"
    | "labelColor"
    | "outlined"
    | "filled"
    | "rounded"
    | "standout"
    | "borderless"
    | "square";

  type Props = Omit<QInputProps, ToExclude> & {
    color?: "primary" | "secondary" | "tertiary";
  };
  // #endregion: --Types

  // #region:    --Defs
  const props = withDefaults(defineProps<Props>(), {
    color: "primary",
    clearable: true,
  });

  const inputRef = useTemplateRef<QInput>("input");
  // #endregion: --Defs

  // #region:    --Computed
  const highlightColor = computed(() => `var(--${props.color})`);
  // #endregion: --Computed

  // #region:    --Exposes
  defineExpose({
    blur,
    focus,
    resetValidation,
    validate,
  });

  function blur() {
    inputRef.value?.blur?.();
  }

  function focus() {
    inputRef.value?.focus?.();
  }

  function resetValidation() {
    inputRef.value?.resetValidation?.();
  }

  function validate(val?: string) {
    return inputRef.value?.validate?.(val) ?? false;
  }
  // #endregion: --Exposes
</script>

<template>
  <QInput
    ref="input"
    v-bind="props"
    clear-icon="sym_r_close"
    outlined
    :style="`--highlight-color: ${highlightColor}`"
  >
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
      <slot :name v-bind="slotData || {}" />
    </template>
  </QInput>
</template>
