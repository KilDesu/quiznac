<script lang="ts" setup generic="T">
  interface Props {
    title?: string;
  }

  interface Emits {
    delete: [T];
  }

  const modelValue = defineModel<T | null>();
  const props = defineProps<Props>();

  const emit = defineEmits<Emits>();
</script>

<template>
  <QDialog :model-value="!!modelValue" persistent>
    <QCard v-if="modelValue" class="surface-container-low text-body1">
      <QCardSection class="text-h6">
        Supprimer <template v-if="title">{{ title }}</template>
        <slot v-else /> ?
      </QCardSection>

      <QCardSection class="q-pt-none">
        Voulez-vous vraiment supprimer <slot v-bind="modelValue" /> ? Attention
        cette action est <u>irréversible</u>.
      </QCardSection>

      <QCardActions align="right">
        <AppBtn label="Annuler" flat @click="modelValue = null" />
        <AppBtn
          label="Supprimer"
          class="error-container"
          @click="emit('delete', modelValue)"
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<style></style>
