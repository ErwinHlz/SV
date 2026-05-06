import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const TEAM_VIEW_SLUGS = ["kader", "spielplan", "tabelle"] as const;

export const useTeamViewSwipe = (basePath: string) => {
  const route = useRoute();
  const router = useRouter();
  const touchStartX = ref<number | null>(null);
  const touchStartY = ref<number | null>(null);
  const normalizedBasePath = basePath.replace(/\/$/, "");

  const activeViewIndex = computed(() => {
    const currentPath = route.path.replace(/\/$/, "");

    return TEAM_VIEW_SLUGS.findIndex(
      (slug) => currentPath === `${normalizedBasePath}/${slug}`,
    );
  });

  const navigateToView = (nextIndex: number) => {
    const nextSlug = TEAM_VIEW_SLUGS[nextIndex];
    if (!nextSlug) {
      return;
    }

    router.push(`${normalizedBasePath}/${nextSlug}`);
  };

  const onTouchStart = (event: TouchEvent) => {
    const [touch] = event.changedTouches;
    if (!touch) {
      return;
    }

    touchStartX.value = touch.clientX;
    touchStartY.value = touch.clientY;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const [touch] = event.changedTouches;
    if (
      !touch ||
      touchStartX.value === null ||
      touchStartY.value === null
    ) {
      return;
    }

    const deltaX = touch.clientX - touchStartX.value;
    const deltaY = touch.clientY - touchStartY.value;

    touchStartX.value = null;
    touchStartY.value = null;

    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    const currentIndex = activeViewIndex.value;
    if (currentIndex === -1) {
      return;
    }

    if (deltaX < 0 && currentIndex < TEAM_VIEW_SLUGS.length - 1) {
      navigateToView(currentIndex + 1);
      return;
    }

    if (deltaX > 0 && currentIndex > 0) {
      navigateToView(currentIndex - 1);
    }
  };

  return {
    onTouchEnd,
    onTouchStart,
  };
};
