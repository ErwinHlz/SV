<template>
  <span class="dummy-silhouette" aria-hidden="true">
    <svg viewBox="0 0 64 64" focusable="false">
      <circle class="dummy-silhouette__head" cx="32" cy="22" r="12" />
      <path
        class="dummy-silhouette__body"
        d="M14 54c0-10.493 8.507-19 19-19s19 8.507 19 19"
      />
    </svg>
  </span>
</template>

<style scoped>
.dummy-silhouette {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.dummy-silhouette svg {
  width: 70%;
  height: 70%;
}

.dummy-silhouette__head,
.dummy-silhouette__body {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}
</style>
