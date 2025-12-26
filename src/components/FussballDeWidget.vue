<template>
  <div :id="containerId"></div>
</template>

<script setup>
import { onMounted, nextTick } from "vue";

const props = defineProps({
  widgetKey: { type: String, required: true }, // kommt aus dem Widget-Center
  containerId: { type: String, required: true }, // eindeutig pro Widget
});

function renderWidget() {
  const api = window.fussballdeWidgetAPI;
  if (!api) {
    console.warn(
      "fussballdeWidgetAPI ist nicht geladen. Script-Tag in index.html prüfen."
    );
    return;
  }
  // Widget rendern
  new api().showWidget(props.containerId, props.widgetKey);
}

onMounted(async () => {
  await nextTick(); // sicherstellen, dass der div im DOM ist
  renderWidget();
});
</script>
