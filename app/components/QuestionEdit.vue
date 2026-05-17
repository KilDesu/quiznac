<script lang="ts" setup>
  import { convertFileSrc } from "@tauri-apps/api/core";
  import type { Question } from "~/bindings";

  const emit = defineEmits<{
    save: [question: Question, originalLabel?: string];
    close: [];
  }>();

  const emptyQuestion: Question = {
    label: "",
    image: null,
    answers: [
      { label: "", isAnswer: false },
      { label: "", isAnswer: false },
    ],
    explanation: "",
  };

  const question = defineModel<Question | "new" | null>({ required: true });

  const editedQuestion = ref<Question>(cloneQuestion(emptyQuestion));
  const closedBySave = ref(false);

  const labelError = ref("");
  const explanationError = ref("");
  const answersError = ref("");

  const imageInputType = ref<"url" | "file">("url");

  const imageUrlDraft = ref("");
  const localImagePath = ref<string | null>(null);
  let originalImage: string | null = null;

  watch(
    question,
    (newVal) => {
      if (!newVal) {
        editedQuestion.value = cloneQuestion(emptyQuestion);
        originalImage = null;
        imageUrlDraft.value = "";
        localImagePath.value = null;
        clearFieldErrors();
        return;
      }

      if (newVal === "new") {
        editedQuestion.value = cloneQuestion(emptyQuestion);
      } else {
        editedQuestion.value = cloneQuestion(newVal);
      }
      originalImage = editedQuestion.value.image;
      imageUrlDraft.value = editedQuestion.value.image ?? "";
      localImagePath.value = null;
      clearFieldErrors();
    },
    { immediate: true },
  );

  const previewSrc = computed(() => {
    if (localImagePath.value) {
      return convertFileSrc(localImagePath.value);
    }
    const u = imageUrlDraft.value.trim();
    return u.length ? u : null;
  });

  function cloneQuestion(q: Question): Question {
    return {
      label: q.label,
      image: q.image,
      explanation: q.explanation,
      answers: q.answers.map((a) => ({ ...a })),
    };
  }

  function clearFieldErrors() {
    labelError.value = "";
    explanationError.value = "";
    answersError.value = "";
  }

  function addAnswer() {
    editedQuestion.value.answers.push({ label: "", isAnswer: false });
  }

  function removeAnswer(index: number) {
    if (editedQuestion.value.answers.length <= 2) {
      return;
    }
    editedQuestion.value.answers.splice(index, 1);
  }

  function toggleAnswerCorrect(index: number) {
    const a = editedQuestion.value.answers[index];
    if (a) {
      a.isAnswer = !a.isAnswer;
    }
  }

  function validate(): boolean {
    clearFieldErrors();
    let ok = true;

    if (!editedQuestion.value.label.trim()) {
      labelError.value = "Le libellé de la question est obligatoire.";
      ok = false;
    }

    if (!editedQuestion.value.explanation.trim()) {
      explanationError.value = "L'explication est obligatoire.";
      ok = false;
    }

    const filled = editedQuestion.value.answers.filter((a) => a.label.trim());
    if (filled.length < 2) {
      answersError.value = "Ajoutez au moins deux réponses contenant du texte.";
      ok = false;
    } else if (
      !editedQuestion.value.answers.some((a) => a.label.trim() && a.isAnswer)
    ) {
      answersError.value =
        "Indiquez au moins une bonne réponse parmi les réponses renseignées.";
      ok = false;
    }

    return ok;
  }

  async function handleSave() {
    if (!validate()) {
      return;
    }

    if (editedQuestion.value.image && !previewSrc.value) {
      editedQuestion.value.image = null;
    }

    if (
      !editedQuestion.value.image &&
      (localImagePath.value || imageUrlDraft.value)
    ) {
      editedQuestion.value.image = localImagePath.value ?? imageUrlDraft.value;
    }

    if (
      JSON.stringify(editedQuestion.value) === JSON.stringify(question.value)
    ) {
      return;
    }

    if (question.value === "new") {
      emit("save", editedQuestion.value);
    } else {
      const originalLabel =
        question.value && question.value.label !== editedQuestion.value.label
          ? question.value.label
          : undefined;
      emit("save", editedQuestion.value, originalLabel);
    }
    clearFieldErrors();
  }

  function onDialogHide() {
    if (closedBySave.value) {
      closedBySave.value = false;
      return;
    }
    emit("close");
  }

  function cancel() {
    question.value = null;
  }

  function clearImage() {
    imageUrlDraft.value = "";
    localImagePath.value = null;
    editedQuestion.value.image = null;
    originalImage = null;
  }
</script>

<template>
  <QDialog :model-value="!!question" persistent @hide="onDialogHide">
    <QCard
      class="surface-container"
      style="width: min(640px, calc(100vw - 48px)); max-width: 100%"
    >
      <QCardSection class="row items-center no-wrap q-py-sm">
        <span class="text-h6">
          {{
            question === "new" ? "Nouvelle question" : "Modifier la question"
          }}
        </span>
        <QSpace />
        <AppBtn flat round dense icon="close" @click="cancel" />
      </QCardSection>

      <QSeparator style="background: var(--outline)" />

      <QCardSection class="q-pt-md scroll" style="max-height: min(72vh, 720px)">
        <div class="column q-gutter-md">
          <AppInput
            v-model="editedQuestion.label"
            label="Question"
            autogrow
            autofocus
            :error="!!labelError"
            :error-message="labelError"
          />

          <AppInput
            v-model="editedQuestion.explanation"
            label="Explication"
            type="textarea"
            autogrow
            :error="!!explanationError"
            :error-message="explanationError"
          />

          <div class="column" style="gap: 1rem">
            <div
              class="flex items-center justify-between text-subtitle2 text-on-surface-variant"
            >
              <span>Image (facultatif)</span>

              <QBtnToggle
                v-model="imageInputType"
                :options="[
                  { label: 'Url', value: 'url' },
                  { label: 'Fichier', value: 'file' },
                ]"
                toggle-color="primary-container"
                toggle-text-color="on-primary-container"
                rounded
                unelevated
                class="surface-container-high"
              />
            </div>

            <AppInput
              v-if="imageInputType === 'url'"
              v-model="imageUrlDraft"
              label="URL de l'image"
              autogrow
            />
            <AppFile
              v-else
              v-model="localImagePath"
              label="Fichier image"
              :accept="['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif']"
            />

            <div
              v-if="previewSrc"
              class="flex justify-center"
              style="width: 100%; min-width: 0"
            >
              <div
                class="rounded-borders overflow-hidden flex flex-center"
                style="
                  width: min(100%, max(50%, max-content));
                  align-items: flex-start;
                "
              >
                <div
                  class="rounded-borders overflow-hidden"
                  style="
                    position: relative;
                    display: inline-block;
                    max-width: 100%;
                  "
                >
                  <img
                    :src="previewSrc"
                    alt="Image preview"
                    class="rounded-borders block"
                    style="
                      display: block;
                      width: auto;
                      height: auto;
                      max-width: 100%;
                      max-height: 25rem;
                      object-fit: contain;
                    "
                  />

                  <div
                    class="absolute-top rounded-borders flex items-center justify-between q-px-md"
                    style="
                      background: color-mix(
                        in srgb,
                        var(--surface-container-high) 75%,
                        transparent
                      );
                      backdrop-filter: blur(4px);
                      height: 3rem;
                    "
                  >
                    <span class="text-body1 text-on-surface-variant">
                      Aperçu
                    </span>
                    <AppBtn
                      flat
                      dense
                      no-caps
                      icon="delete"
                      class="error-container"
                      label="Retirer l'image"
                      @click="clearImage"
                    />
                  </div>
                </div>
              </div>
            </div>

            <AppBtn
              v-else-if="imageUrlDraft.trim() || localImagePath"
              flat
              dense
              no-caps
              icon="delete"
              label="Retirer l'image"
              @click="clearImage"
            />
          </div>

          <div class="column q-gutter-sm">
            <div class="row items-center justify-between">
              <span class="text-subtitle2 text-on-surface-variant">
                Réponses
              </span>
              <AppBtn
                flat
                dense
                no-caps
                icon="add"
                label="Ajouter une réponse"
                @click="addAnswer"
              />
            </div>
            <QBanner
              v-if="answersError"
              dense
              rounded
              class="error-container q-pa-sm"
            >
              {{ answersError }}
            </QBanner>
            <div
              v-for="(answer, index) in editedQuestion.answers"
              :key="index"
              class="row items-start q-gutter-sm no-wrap"
            >
              <AppInput
                v-model="answer.label"
                class="col"
                :label="`Réponse ${index + 1}`"
                autogrow
              >
                <template #after>
                  <div class="flex flex-center" style="gap: 0.5rem">
                    <AppBtn
                      :icon="answer.isAnswer ? 'check_circle' : 'cancel'"
                      flat
                      :color="answer.isAnswer ? 'primary' : 'error'"
                      @click="toggleAnswerCorrect(index)"
                    />

                    <AppBtn
                      flat
                      round
                      dense
                      icon="delete"
                      class="error-container"
                      :disable="editedQuestion.answers.length <= 2"
                      @click="removeAnswer(index)"
                    >
                      <QTooltip v-if="editedQuestion.answers.length <= 2">
                        Au moins deux réponses sont nécessaires
                      </QTooltip>
                    </AppBtn>
                  </div>
                </template>
              </AppInput>
            </div>
          </div>
        </div>
      </QCardSection>

      <QCardActions align="right" class="q-px-md q-pb-md">
        <AppBtn flat label="Annuler" @click="cancel" />
        <AppBtn class="primary" label="Enregistrer" @click="handleSave" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<style scoped>
  .rounded-borders {
    border-radius: 0.75rem;
  }
</style>
