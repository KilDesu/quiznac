<script lang="ts" setup>
  const error = defineModel<string | null>();
</script>

<template>
  <QDialog :model-value="!!error" persistent>
    <QCard class="surface-container q-pa-sm">
      <QCardSection class="text-h1 text-center" style="font-weight: bolder">
        <span class="glitch" data-text="Erreur">Erreur</span>
      </QCardSection>

      <QCardSection class="text-h6 q-py-none text-center">
        On dirait qu'une erreur est survenue...
      </QCardSection>

      <QCardSection class="text-center q-pt-none">
        <pre class="surface-container-high shadow-out q-pa-sm overflow-auto">
            {{ error }}
        </pre>
      </QCardSection>

      <QCardActions align="right">
        <AppBtn label="Je comprends" class="primary" @click="error = null" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<style scoped>
  pre {
    border-radius: 0.5rem;
    white-space: normal;
  }

  .glitch {
    color: var(--on-surface-container);
    background-color: var(--surface-container);
    position: relative;
  }
  .glitch:after {
    content: "Erreur";
    position: absolute;
    left: 2px;
    top: 2px;
    clip: rect(0, 900px, 0, 0);
    background-color: var(--surface-container);
    color: var(--on-surface-container);
    animation: glitch 3s infinite alternate-reverse;
    animation-delay: 1s;
  }
  .glitch:before {
    content: "Erreur";
    position: absolute;
    left: -2px;
    top: -2px;
    clip: rect(0, 900px, 0, 0);
    background-color: var(--surface-container);
    color: var(--on-surface-container);
    animation: glitch 3s infinite alternate-reverse;
    animation-delay: 4s;
  }

  @keyframes glitch {
    0% {
      clip: rect(91px, 9999px, 79px, 0);
    }
    5% {
      clip: rect(79px, 9999px, 28px, 0);
    }
    10% {
      clip: rect(49px, 9999px, 86px, 0);
    }
    15% {
      clip: rect(40px, 9999px, 63px, 0);
    }
    20% {
      clip: rect(15px, 9999px, 26px, 0);
    }
    25% {
      clip: rect(89px, 9999px, 55px, 0);
    }
    30% {
      clip: rect(1px, 9999px, 20px, 0);
    }
    35% {
      clip: rect(29px, 9999px, 71px, 0);
    }
    40% {
      clip: rect(80px, 9999px, 24px, 0);
    }
    45% {
      clip: rect(2px, 9999px, 70px, 0);
    }
    50% {
      clip: rect(16px, 9999px, 68px, 0);
    }
    55% {
      clip: rect(99px, 9999px, 76px, 0);
    }
    60% {
      clip: rect(99px, 9999px, 51px, 0);
    }
    65% {
      clip: rect(84px, 9999px, 34px, 0);
    }
    70% {
      clip: rect(48px, 9999px, 67px, 0);
    }
    75% {
      clip: rect(38px, 9999px, 7px, 0);
    }
    80% {
      clip: rect(68px, 9999px, 15px, 0);
    }
    85% {
      clip: rect(46px, 9999px, 65px, 0);
    }
    90% {
      clip: rect(21px, 9999px, 52px, 0);
    }
    95% {
      clip: rect(72px, 9999px, 56px, 0);
    }
    100% {
      clip: rect(91px, 9999px, 48px, 0);
    }
  }
</style>
