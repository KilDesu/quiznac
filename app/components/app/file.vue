<script lang="ts" setup>
  import { open } from "@tauri-apps/plugin-dialog";
  import { listen } from "@tauri-apps/api/event";
  import type { DragDropEvent } from "@tauri-apps/api/webview";
  import type { QInputProps, QInput } from "quasar";
  import { PhysicalPosition } from "@tauri-apps/api/dpi";
  import { getCurrentWindow } from "@tauri-apps/api/window";

  // #region:    --Types
  type Model = string[] | string | null;

  type DropPayload = DragDropEvent & { type: "drop" };

  type ToExclude =
    | "color"
    | "labelColor"
    | "outlined"
    | "filled"
    | "rounded"
    | "standout"
    | "borderless"
    | "square"
    | "readonly"
    | "multiple"
    | "modelValue";

  type Props = Omit<QInputProps, ToExclude> & {
    color?: "primary" | "secondary" | "tertiary";
    multiple?: boolean;
    directory?: boolean;
    emitFileName?: boolean;
    accept?: string[];
    modelValue?: Model;
  };
  // #endregion: --Types

  // #region:    --Variables
  let unlisten: Awaited<ReturnType<typeof listen<DragDropEvent>>> | null = null;
  // #endregion: --Variables

  // #region:    --Defs
  const model = defineModel<Model>({ default: null });

  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    color: "primary",
    multiple: false,
    directory: false,
    emitFileName: false,
    accept: () => ["*"],
  });

  const input = useTemplateRef<QInput>("input");

  const errorMessage = ref<string>();
  // #endregion: --Defs

  // #region:    --Computed
  const highlightColor = computed(() => `var(--${props.color})`);

  const inputProps = computed(() => {
    const { modelValue: _, ...rest } = props;
    return rest;
  });

  const defaultHint = computed(() =>
    props.accept?.includes("*")
      ? "Fichiers acceptés : tous types de fichiers"
      : `Fichiers acceptés : ${props.accept?.map((ext) => `.${ext}`).join(", ")}`,
  );

  const inputContent = computed<string | null>(() => {
    if (!model.value) {
      return null;
    }

    if (Array.isArray(model.value)) {
      return props.emitFileName
        ? model.value.map(getFileName).join("\n")
        : model.value.join("\n");
    }

    return props.emitFileName ? getFileName(model.value) : model.value;
  });

  // #endregion: --Computed

  // #region:    --Lifecycles
  onMounted(async () => {
    if (!input.value) return;

    const field = input.value.nativeEl.closest(".q-field");

    unlisten = await listen<DropPayload>("tauri://drag-drop", async (e) => {
      const win = getCurrentWindow();
      const factor = await win.scaleFactor();
      const pos = new PhysicalPosition(e.payload.position);

      const { x, y } = pos.toLogical(factor);

      const element = document.elementFromPoint(x, y);

      if (!field?.contains(element)) {
        return;
      }

      handleDrop(e.payload);
    });
  });

  onBeforeUnmount(() => {
    unlisten?.();
  });
  // #endregion: --Lifecycles

  // #region:    --Functions
  function getFileName(path: string): string {
    return path.split(/[/\\]/).pop() || path;
  }

  function getExtension(filePath: string): string {
    return filePath.split(".").pop()?.toLowerCase() || "";
  }

  function handleDrop(payload: DropPayload) {
    errorMessage.value = undefined;
    model.value = null;

    const { paths } = payload;

    if (!paths.filter(Boolean).length) {
      console.warn("No file path found in drag-drop event.");
      model.value = null;
      return;
    }

    if (props.multiple === false && paths.length > 1) {
      errorMessage.value = "Veuillez ne déposer qu'un seul fichier";
      return;
    }

    const extensions = [...new Set(paths.map(getExtension))];
    const notAccepted = props.accept?.includes("*")
      ? []
      : extensions.filter((ext) => !props.accept?.includes(ext));

    if (notAccepted.length && !props.directory) {
      errorMessage.value = `Les fichiers ${notAccepted.join(", ")} ne sont pas acceptés.`;
      return;
    }

    model.value = (props.multiple !== false ? paths : paths.at(0)) as Model;
  }

  async function onClick() {
    const selected = (await open({
      multiple: props.multiple !== false,
      directory: props.directory,
      filters: props.directory
        ? undefined
        : [
            {
              name: `Fichiers (${props.accept?.join(", ")})`,
              extensions: props.accept,
            },
          ],
    })) as Model;

    if (!selected) {
      // User cancelled the dialog
      model.value = props.multiple !== false ? [] : null;
      return;
    }

    model.value = selected;
  }
  // #endregion: --Functions
</script>

<template>
  <QInput
    v-bind="inputProps"
    ref="input"
    :model-value="inputContent"
    clear-icon="sym_r_close"
    :hint="hint ?? defaultHint"
    :error="props.error || !!errorMessage"
    :error-message="props.errorMessage || errorMessage"
    outlined
    clearable
    readonly
    autogrow
    class="false-readonly"
    :style="`--highlight-color: ${highlightColor}; cursor: pointer;`"
    input-style="cursor: pointer"
    @click="onClick"
  >
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
      <slot :name v-bind="slotData || {}" />
    </template>

    <template v-if="inputContent" #append>
      <AppIcon name="close" style="cursor: pointer" @click="model = null" />
    </template>

    <template #prepend>
      <AppIcon name="attach_file" />
    </template>
  </QInput>
</template>
