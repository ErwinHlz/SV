<template>
  <div class="contest-card">
    <form v-if="!myPhoto" class="contest-form" @submit.prevent="submitPhoto">
      <label class="contest-field">
        <span class="contest-field-label">Dein Name</span>
        <input
          v-model="name"
          type="text"
          maxlength="40"
          placeholder="Wie sollen wir dich nennen?"
          class="contest-input"
          required />
      </label>

      <div
        class="contest-dropzone"
        :class="{
          'contest-dropzone--active': isDragOver,
          'contest-dropzone--filled': !!previewUrl,
        }"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="onDrop">
        <img
          v-if="previewUrl"
          :src="previewUrl"
          alt="Vorschau deines Fotos"
          class="contest-dropzone-preview" />
        <div v-else class="contest-dropzone-placeholder">
          <ImagePlus :size="34" :stroke-width="1.6" aria-hidden="true" />
          <span>Foto hierher ziehen<br />oder klicken zum Auswählen</span>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="contest-dropzone-input"
          aria-label="Foto auswählen"
          @change="onFileChange" />
      </div>

      <p v-if="errorMessage" class="contest-error">{{ errorMessage }}</p>

      <div v-if="uploading" class="contest-progress">
        <div
          class="contest-progress-bar"
          :style="{ width: `${uploadProgress}%` }"></div>
      </div>

      <button
        type="submit"
        class="contest-btn contest-btn--primary"
        :disabled="uploading">
        {{ uploading ? `Lädt hoch… ${uploadProgress}%` : "Foto einreichen" }}
      </button>

      <p v-if="successMessage" class="contest-success">{{ successMessage }}</p>
    </form>

    <div v-if="myPhoto" class="contest-own-notice">
      <p>
        Du hast bereits <strong>{{ myPhoto.name }}</strong> eingereicht. Du kannst
        pro Gerät nur ein Foto einreichen.
      </p>
      <p v-if="deleteError" class="contest-error">{{ deleteError }}</p>
      <button
        type="button"
        class="contest-btn contest-btn--ghost"
        :disabled="deletingOwnPhoto"
        @click="deleteMyPhoto">
        {{ deletingOwnPhoto ? "Wird entfernt…" : "Foto entfernen" }}
      </button>
    </div>

    <div class="contest-gallery">
      <p v-if="galleryError" class="contest-error">{{ galleryError }}</p>
      <p v-if="voteError" class="contest-error">{{ voteError }}</p>

      <div class="contest-vote-budget-row">
        <div class="contest-vote-budget">
          <Heart :size="15" />
          Noch {{ votesRemaining }} von 3 Stimmen übrig
        </div>
        <button
          v-if="votedPhotoIds.size > 0"
          type="button"
          class="contest-vote-reset-btn"
          :disabled="resettingVotes"
          @click="resetMyVotes">
          <RotateCcw :size="13" />
          {{ resettingVotes ? "Wird zurückgesetzt…" : "Meine Stimmen zurücksetzen" }}
        </button>
      </div>

      <p v-if="loadingPhotos" class="contest-gallery-status"
        >Fotos werden geladen…</p
      >
      <p v-else-if="photos.length === 0" class="contest-gallery-status">
        Noch keine Fotos – sei die oder der Erste!
      </p>
      <div v-else class="contest-grid">
        <figure
          v-for="photo in photos"
          :key="photo.id"
          class="contest-tile"
          @click="openLightbox(photo)">
          <div class="contest-tile-photo">
            <img
              :src="photo.imageUrl"
              :alt="`Foto von ${photo.name}`"
              loading="lazy" />
          </div>
          <figcaption class="contest-tile-caption">
            <span class="contest-tile-name">{{ photo.name }}</span>
            <ContestVoteButton
              variant="light"
              :name="photo.name"
              :votes="photo.votes"
              :is-own="photo.deviceId === deviceId"
              :is-voted="votedPhotoIds.has(photo.id)"
              :disabled="
                (!votedPhotoIds.has(photo.id) && votesRemaining <= 0) ||
                votingPhotoId === photo.id
              "
              @toggle="toggleVote(photo)" />
          </figcaption>
        </figure>
      </div>
    </div>

    <Transition name="contest-lightbox">
      <div
        v-if="lightboxPhoto"
        class="contest-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="`Foto von ${lightboxPhoto.name}`"
        @click="lightboxPhotoId = null">
        <button
          type="button"
          class="contest-lightbox-close"
          aria-label="Schließen"
          @click.stop="lightboxPhotoId = null">
          ×
        </button>
        <button
          v-if="photos.length > 1"
          type="button"
          class="contest-lightbox-nav contest-lightbox-nav--prev"
          aria-label="Vorheriges Foto"
          @click.stop="showPrevious">
          <ChevronLeft :size="28" />
        </button>
        <button
          v-if="photos.length > 1"
          type="button"
          class="contest-lightbox-nav contest-lightbox-nav--next"
          aria-label="Nächstes Foto"
          @click.stop="showNext">
          <ChevronRight :size="28" />
        </button>

        <div class="contest-lightbox-figure" @click.stop>
          <div class="contest-vote-budget-row">
            <div class="contest-vote-budget contest-vote-budget--lightbox">
              <Heart :size="15" />
              Noch {{ votesRemaining }} von 3 Stimmen übrig
            </div>
            <button
              v-if="votedPhotoIds.size > 0"
              type="button"
              class="contest-vote-reset-btn"
              :disabled="resettingVotes"
              @click="resetMyVotes">
              <RotateCcw :size="13" />
              {{ resettingVotes ? "Wird zurückgesetzt…" : "Meine Stimmen zurücksetzen" }}
            </button>
          </div>

          <!-- Natives horizontales Scroll-Snap statt eigener Touch-Logik:
               der Browser uebernimmt die Geste komplett selbst, dadurch
               kollidiert das Wischen nicht mehr mit dem Zurueck-Wischen des
               Betriebssystems, und Nachbarbilder blitzen am Rand durch. -->
          <div
            ref="trackRef"
            class="contest-lightbox-track"
            @scroll="onTrackScroll">
            <!-- Echte (scrollbare) Platzhalter statt Track-Padding: nur so
                 gibt es fuer das erste/letzte Bild ueberhaupt genug Raum,
                 um es zentriert anzufahren - siehe scrollToIndex(). -->
            <div class="contest-lightbox-spacer" aria-hidden="true"></div>
            <div
              v-for="(photo, index) in photos"
              :key="photo.id"
              class="contest-lightbox-slide"
              :class="{
                'contest-lightbox-slide--active': index === lightboxIndex,
              }">
              <img :src="photo.imageUrl" :alt="`Foto von ${photo.name}`" />
            </div>
            <div class="contest-lightbox-spacer" aria-hidden="true"></div>
          </div>

          <div class="contest-lightbox-caption">
            <span>{{ lightboxPhoto.name }}</span>
            <ContestVoteButton
              :name="lightboxPhoto.name"
              :votes="lightboxPhoto.votes"
              :is-own="lightboxPhoto.deviceId === deviceId"
              :is-voted="votedPhotoIds.has(lightboxPhoto.id)"
              :disabled="
                (!votedPhotoIds.has(lightboxPhoto.id) && votesRemaining <= 0) ||
                votingPhotoId === lightboxPhoto.id
              "
              size="lg"
              @toggle="toggleVote(lightboxPhoto)" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import {
  collection,
  deleteDoc,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { ChevronLeft, ChevronRight, Heart, ImagePlus, RotateCcw } from "@lucide/vue";
import { db, storage } from "@/firebase";
import ContestVoteButton from "@/components/ContestVoteButton.vue";

type ContestPhoto = {
  id: string;
  name: string;
  imageUrl: string;
  storagePath: string;
  deviceId: string;
  votes: number;
};

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_VOTES_PER_DEVICE = 3;
const DEVICE_ID_KEY = "sv-oktoberfest-device-id";
const VOTED_PHOTOS_KEY = "sv-oktoberfest-voted-photos";

/**
 * crypto.randomUUID() only exists in secure contexts (https, or "localhost")
 * - it's undefined when a phone opens the site over a plain http://<lan-ip>
 * URL, which would otherwise throw and crash the whole component on load.
 */
function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getDeviceId(): string {
  try {
    let id = window.localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateId();
      window.localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return generateId();
  }
}

function loadVotedPhotoIds(): Set<string> {
  try {
    const raw = window.localStorage.getItem(VOTED_PHOTOS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveVotedPhotoIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(VOTED_PHOTOS_KEY, JSON.stringify([...ids]));
  } catch {
    // Speicher nicht verfuegbar - Stimmen bleiben serverseitig trotzdem korrekt
  }
}

const deviceId = getDeviceId();

const name = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isDragOver = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const errorMessage = ref("");
const successMessage = ref("");

const photos = ref<ContestPhoto[]>([]);
const loadingPhotos = ref(true);
const galleryError = ref("");
let unsubscribe: (() => void) | null = null;

const myPhoto = computed(() => photos.value.find((p) => p.deviceId === deviceId) ?? null);
const deletingOwnPhoto = ref(false);
const deleteError = ref("");

const votedPhotoIds = ref<Set<string>>(loadVotedPhotoIds());
const votingPhotoId = ref<string | null>(null);
const voteError = ref("");
const resettingVotes = ref(false);
const votesRemaining = computed(() =>
  Math.max(0, MAX_VOTES_PER_DEVICE - votedPhotoIds.value.size),
);

// Lightbox: die Foto-ID ist die Quelle der Wahrheit (nicht der Index), damit
// eine neue Einsendung waehrend des Betrachtens die Zuordnung nicht verschiebt.
const trackRef = ref<HTMLElement | null>(null);
const lightboxPhotoId = ref<string | null>(null);
const lightboxIndex = computed(() => {
  if (lightboxPhotoId.value === null) return null;
  const index = photos.value.findIndex((p) => p.id === lightboxPhotoId.value);
  return index === -1 ? null : index;
});
const lightboxPhoto = computed(() =>
  lightboxIndex.value !== null
    ? (photos.value[lightboxIndex.value] ?? null)
    : null,
);

function handleKeydown(event: KeyboardEvent) {
  if (lightboxPhotoId.value === null) return;

  if (event.key === "Escape") {
    lightboxPhotoId.value = null;
  } else if (event.key === "ArrowLeft") {
    showPrevious();
  } else if (event.key === "ArrowRight") {
    showNext();
  }
}

// Waehrend WIR selbst den Track programmatisch scrollen (Button, Pfeiltaste,
// Oeffnen, Reorder-Korrektur), loest das ebenfalls native "scroll"-Events
// aus - ohne diese Sperre wuerde der Sync-Handler die noch laufende
// Animation mit einer Zwischenposition ueberschreiben und die Navigation
// im schlimmsten Fall wieder zurueckwerfen.
let suppressScrollSync = false;

async function scrollToIndex(index: number, behavior: ScrollBehavior) {
  const photo = photos.value[index];
  if (!photo) return;
  lightboxPhotoId.value = photo.id;

  await nextTick();
  const track = trackRef.value;
  const slide = track?.querySelectorAll(".contest-lightbox-slide")[index] as
    | HTMLElement
    | undefined;
  if (!track || !slide) return;

  suppressScrollSync = true;
  if (scrollSyncTimer) clearTimeout(scrollSyncTimer);

  const target = slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2;
  track.scrollTo({ left: target, behavior });

  window.setTimeout(
    () => {
      suppressScrollSync = false;
    },
    behavior === "smooth" ? 500 : 50,
  );
}

function openLightbox(photo: ContestPhoto) {
  const index = photos.value.findIndex((p) => p.id === photo.id);
  if (index === -1) return;
  scrollToIndex(index, "instant");
}

function showPrevious() {
  const currentIndex = lightboxIndex.value;
  if (currentIndex === null || photos.value.length === 0) return;
  const nextIndex =
    (currentIndex - 1 + photos.value.length) % photos.value.length;
  scrollToIndex(nextIndex, "smooth");
}

function showNext() {
  const currentIndex = lightboxIndex.value;
  if (currentIndex === null || photos.value.length === 0) return;
  const nextIndex = (currentIndex + 1) % photos.value.length;
  scrollToIndex(nextIndex, "smooth");
}

// Waehrend des Wischens per Scroll-Event laufend die naeheste Kachel zur
// Bildunterschrift/Vote-Button synchron halten; debounced, damit erst nach
// dem Ausrollen des nativen Snap-Scrolls ausgewertet wird.
let scrollSyncTimer: ReturnType<typeof setTimeout> | null = null;

function onTrackScroll() {
  if (suppressScrollSync) return;
  if (scrollSyncTimer) clearTimeout(scrollSyncTimer);
  scrollSyncTimer = setTimeout(syncActiveIndexFromScroll, 120);
}

function syncActiveIndexFromScroll() {
  const track = trackRef.value;
  if (!track || lightboxPhotoId.value === null) return;

  const trackRect = track.getBoundingClientRect();
  const center = trackRect.left + trackRect.width / 2;

  let closestIndex = lightboxIndex.value ?? 0;
  let closestDistance = Infinity;

  const slides = track.querySelectorAll(".contest-lightbox-slide");
  Array.from(slides).forEach((child, index) => {
    const rect = (child as HTMLElement).getBoundingClientRect();
    const slideCenter = rect.left + rect.width / 2;
    const distance = Math.abs(slideCenter - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  const photo = photos.value[closestIndex];
  if (photo) {
    lightboxPhotoId.value = photo.id;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);

  const photosQuery = query(
    collection(db, "fotocontest"),
    orderBy("createdAt", "desc"),
    limit(60),
  );

  unsubscribe = onSnapshot(
    photosQuery,
    (snapshot) => {
      photos.value = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: typeof data.name === "string" ? data.name : "Anonym",
          imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
          storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
          deviceId: typeof data.deviceId === "string" ? data.deviceId : "",
          votes: typeof data.votes === "number" ? data.votes : 0,
        };
      });
      loadingPhotos.value = false;
    },
    (error) => {
      console.error("Fotocontest-Galerie konnte nicht geladen werden:", error);
      galleryError.value =
        "Die Galerie konnte nicht geladen werden. Bitte lade die Seite neu.";
      loadingPhotos.value = false;
    },
  );
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (scrollSyncTimer) clearTimeout(scrollSyncTimer);
  unsubscribe?.();
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

function handleFile(file: File | null) {
  selectedFile.value = file;
  errorMessage.value = "";

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  handleFile(target.files?.[0] ?? null);
}

function onDrop(event: DragEvent) {
  isDragOver.value = false;
  const file = event.dataTransfer?.files?.[0] ?? null;
  if (file) {
    handleFile(file);
    // Haelt den nativen Datei-Input synchron, falls das Formular ohne
    // erneute Auswahl abgeschickt wird.
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    if (fileInputRef.value) {
      fileInputRef.value.files = dataTransfer.files;
    }
  }
}

function fileExtension(file: File): string {
  const match = /\.[^./\\]+$/.exec(file.name);
  return match ? match[0].toLowerCase() : "";
}

function describeUploadError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  switch (code) {
    case "storage/unauthorized":
    case "permission-denied":
      return "Der Upload wurde abgelehnt. Bitte prüfe, ob es ein Bild (z. B. JPG oder PNG) unter 15 MB ist.";
    case "storage/canceled":
      return "Der Upload wurde abgebrochen.";
    case "storage/quota-exceeded":
      return "Das Speicherlimit ist gerade erreicht. Bitte versuche es später erneut.";
    case "storage/retry-limit-exceeded":
    case "unavailable":
      return "Verbindungsproblem. Bitte prüfe deine Internetverbindung und versuche es erneut.";
    default:
      return "Fehler beim Hochladen. Bitte versuche es erneut.";
  }
}

function describeVoteError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  if (code === "permission-denied") {
    return "Stimme nicht möglich – entweder schon abgestimmt, eigenes Foto oder alle 3 Stimmen bereits vergeben.";
  }
  return "Deine Stimme konnte nicht gespeichert werden. Bitte versuche es erneut.";
}

async function submitPhoto() {
  errorMessage.value = "";
  successMessage.value = "";

  if (myPhoto.value) {
    errorMessage.value = "Du hast bereits ein Foto eingereicht.";
    return;
  }

  const trimmedName = name.value.trim();
  if (!trimmedName) {
    errorMessage.value = "Bitte gib deinen Namen ein.";
    return;
  }

  const file = selectedFile.value;
  if (!file) {
    errorMessage.value = "Bitte wähle ein Foto aus.";
    return;
  }

  if (!file.type.startsWith("image/")) {
    errorMessage.value = "Bitte wähle eine Bilddatei aus.";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = "Das Foto ist zu groß (max. 15 MB).";
    return;
  }

  uploading.value = true;
  uploadProgress.value = 0;

  try {
    const path = `fotocontest/${deviceId}${fileExtension(file)}`;
    const target = storageRef(storage, path);
    const task = uploadBytesResumable(target, file, { contentType: file.type });

    await new Promise<void>((resolve, reject) => {
      task.on(
        "state_changed",
        (snapshot) => {
          uploadProgress.value = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
        },
        reject,
        () => resolve(),
      );
    });

    const imageUrl = await getDownloadURL(target);

    await setDoc(doc(db, "fotocontest", deviceId), {
      name: trimmedName,
      imageUrl,
      storagePath: path,
      deviceId,
      votes: 0,
      createdAt: serverTimestamp(),
    });

    successMessage.value = "Danke! Dein Foto ist jetzt in der Galerie.";
    selectedFile.value = null;
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = null;
    }
  } catch (error) {
    console.error("Fotocontest-Upload fehlgeschlagen:", error);
    errorMessage.value = describeUploadError(error);
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
}

async function deleteMyPhoto() {
  const photo = myPhoto.value;
  if (!photo || deletingOwnPhoto.value) return;

  deleteError.value = "";
  deletingOwnPhoto.value = true;

  try {
    // Erst aus der Galerie entfernen, damit niemand mehr ein kaputtes Bild
    // sieht, falls der Storage-Teil danach fehlschlaegt.
    await deleteDoc(doc(db, "fotocontest", photo.id));
    if (photo.storagePath) {
      await deleteObject(storageRef(storage, photo.storagePath)).catch(() => {
        // Datei bleibt dann verwaist liegen - unschoen, aber unsichtbar und
        // ohne Auswirkung fuer Besucher.
      });
    }

    if (lightboxPhotoId.value === photo.id) {
      lightboxPhotoId.value = null;
    }
  } catch (error) {
    console.error("Foto loeschen fehlgeschlagen:", error);
    deleteError.value = "Foto konnte nicht entfernt werden. Bitte versuche es erneut.";
  } finally {
    deletingOwnPhoto.value = false;
  }
}

async function toggleVote(photo: ContestPhoto) {
  if (photo.deviceId === deviceId || votingPhotoId.value === photo.id) return;

  if (votedPhotoIds.value.has(photo.id)) {
    await removeVote(photo);
  } else {
    await castVote(photo);
  }
}

async function castVote(photo: ContestPhoto) {
  voteError.value = "";

  if (votesRemaining.value <= 0) {
    voteError.value = "Du hast bereits alle 3 Stimmen vergeben.";
    return;
  }

  votingPhotoId.value = photo.id;

  try {
    const batch = writeBatch(db);

    const voteRef = doc(db, "votes", `${photo.id}_${deviceId}`);
    batch.set(voteRef, {
      photoId: photo.id,
      deviceId,
      createdAt: serverTimestamp(),
    });

    const photoRef = doc(db, "fotocontest", photo.id);
    batch.update(photoRef, { votes: increment(1) });

    const budgetRef = doc(db, "deviceVoteBudget", deviceId);
    batch.set(budgetRef, { count: increment(1) }, { merge: true });

    await batch.commit();

    const updated = new Set(votedPhotoIds.value);
    updated.add(photo.id);
    votedPhotoIds.value = updated;
    saveVotedPhotoIds(updated);
  } catch (error) {
    console.error("Vote fehlgeschlagen:", error);
    voteError.value = describeVoteError(error);
  } finally {
    votingPhotoId.value = null;
  }
}

async function removeVote(photo: ContestPhoto) {
  voteError.value = "";
  votingPhotoId.value = photo.id;

  try {
    const batch = writeBatch(db);

    const voteRef = doc(db, "votes", `${photo.id}_${deviceId}`);
    batch.delete(voteRef);

    const photoRef = doc(db, "fotocontest", photo.id);
    batch.update(photoRef, { votes: increment(-1) });

    const budgetRef = doc(db, "deviceVoteBudget", deviceId);
    batch.update(budgetRef, { count: increment(-1) });

    await batch.commit();

    const updated = new Set(votedPhotoIds.value);
    updated.delete(photo.id);
    votedPhotoIds.value = updated;
    saveVotedPhotoIds(updated);
  } catch (error) {
    console.error("Stimme zurückziehen fehlgeschlagen:", error);
    voteError.value = describeVoteError(error);
  } finally {
    votingPhotoId.value = null;
  }
}

async function resetMyVotes() {
  if (votedPhotoIds.value.size === 0 || resettingVotes.value) return;

  resettingVotes.value = true;
  voteError.value = "";

  try {
    // Die Rules erlauben pro Schreibvorgang nur +-1 auf den Stimmen-Zaehler,
    // daher hier jede Stimme einzeln ueber die bestehende removeVote-Logik
    // zurueckziehen statt in einem Rutsch auf 0 zu springen.
    for (const photoId of [...votedPhotoIds.value]) {
      const photo = photos.value.find((p) => p.id === photoId);
      if (photo) {
        await removeVote(photo);
      } else {
        const updated = new Set(votedPhotoIds.value);
        updated.delete(photoId);
        votedPhotoIds.value = updated;
        saveVotedPhotoIds(updated);
      }
    }
  } finally {
    resettingVotes.value = false;
  }
}
</script>

<style scoped>
.contest-card {
  width: min(880px, 100%);
  margin: 0 auto;
  padding: clamp(20px, 4vw, 36px);
  border-radius: 28px;
  color: var(--sv-text-color);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contest-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.contest-field {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contest-field-label {
  font-size: 0.85rem;
  opacity: 0.8;
}

.contest-input {
  min-height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font: inherit;
  transition: border-color 0.15s ease;
}

.contest-input:focus {
  outline: none;
  border-color: var(--sv-secondary-color);
}

.contest-input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.contest-dropzone {
  position: relative;
  width: min(240px, 100%);
  aspect-ratio: 1;
  border-radius: 20px;
  border: 2px dashed rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    transform 0.15s ease;
}

.contest-dropzone--active {
  border-color: var(--sv-secondary-color);
  background: rgba(244, 208, 71, 0.12);
  transform: scale(1.02);
}

.contest-dropzone--filled {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.25);
}

.contest-dropzone-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  text-align: center;
  font-size: 0.82rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.65);
  pointer-events: none;
}

.contest-dropzone-preview {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.contest-dropzone-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.contest-error {
  margin: 0;
  color: #ffb4b4;
  font-size: 0.9rem;
  text-align: center;
}

.contest-success {
  margin: 0;
  color: var(--sv-secondary-color);
  font-size: 0.9rem;
  text-align: center;
}

.contest-progress {
  width: min(360px, 100%);
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

.contest-progress-bar {
  height: 100%;
  background: var(--sv-secondary-color);
  transition: width 0.2s ease;
}

.contest-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 24px;
  border-radius: 999px;
  border: 1px solid var(--sv-secondary-color);
  background: var(--sv-secondary-color);
  color: #07122c;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.contest-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.contest-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contest-btn--ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

.contest-btn--ghost:hover:not(:disabled) {
  border-color: var(--sv-secondary-color);
  color: var(--sv-secondary-color);
}

.contest-own-notice {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.contest-own-notice p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.contest-gallery {
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.contest-gallery-status {
  margin: 0;
  text-align: center;
  opacity: 0.75;
}

.contest-vote-budget-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.contest-vote-budget {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--sv-secondary-color);
}

.contest-vote-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  font: inherit;
  font-size: 0.8rem;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  padding: 4px 2px;
}

.contest-vote-reset-btn:hover:not(:disabled) {
  color: var(--sv-secondary-color);
}

.contest-vote-reset-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 22px;
}

.contest-tile {
  margin: 0;
  background: #f7f2e7;
  border-radius: 6px;
  padding: 12px 12px 14px;
  box-shadow: 0 14px 28px rgba(1, 12, 35, 0.4);
  cursor: zoom-in;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.contest-tile:hover,
.contest-tile:focus-visible {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 36px rgba(1, 12, 35, 0.5);
}

.contest-tile-photo {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 2px;
  background: #07142f;
}

.contest-tile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.contest-tile:hover .contest-tile-photo img {
  transform: scale(1.05);
}

.contest-tile-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 2px;
}

.contest-tile-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2b2210;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contest-lightbox {
  position: fixed;
  inset: 0;
  /* Ueber dem fixed Header (z-index 1000) inkl. Social-Icons, sonst
     ueberdeckt der Header rechts die Lightbox-Navigation. */
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--sv-header-height) + 24px) 0 24px;
  background: rgba(3, 10, 24, 0.82);
  backdrop-filter: blur(10px);
}

.contest-lightbox-figure {
  margin: 0;
  width: min(720px, 100%);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.contest-lightbox-track {
  display: flex;
  align-items: center;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.contest-lightbox-track::-webkit-scrollbar {
  display: none;
}

/* Echte Flex-Items statt Track-Padding: nur so laesst sich das erste/letzte
   Bild ueberhaupt zentriert anscrollen (Padding zaehlt nicht als
   Scroll-Weg). Prozentwerte bewusst identisch zur Slide-Breite gehalten,
   damit beide gegen dieselbe Basis (Content-Box des Tracks) aufgeloest
   werden - siehe scrollToIndex(). */
.contest-lightbox-spacer {
  flex: 0 0 12%;
  pointer-events: none;
}

.contest-lightbox-slide {
  flex: 0 0 76%;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  filter: grayscale(0.5);
  transition:
    opacity 0.2s ease,
    filter 0.2s ease;
}

.contest-lightbox-slide--active {
  opacity: 1;
  filter: none;
}

.contest-lightbox-slide img {
  width: 100%;
  max-height: calc(100dvh - var(--sv-header-height) - 180px);
  object-fit: contain;
  border-radius: 18px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.contest-lightbox-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 24px;
  color: #ffffff;
  font-weight: 600;
}

.contest-lightbox-close {
  position: absolute;
  top: calc(var(--sv-header-height) + 8px);
  right: 18px;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}

.contest-lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
  transition: background 0.15s ease;
}

.contest-lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.22);
}

.contest-lightbox-nav--prev {
  left: clamp(8px, 3vw, 32px);
}

.contest-lightbox-nav--next {
  right: clamp(8px, 3vw, 32px);
}

@media (max-width: 640px) {
  .contest-lightbox-nav {
    display: none;
  }

  .contest-lightbox-spacer {
    flex-basis: 8%;
  }

  .contest-lightbox-slide {
    flex-basis: 84%;
  }
}

.contest-lightbox-enter-active,
.contest-lightbox-leave-active {
  transition: opacity 0.22s ease;
}

.contest-lightbox-enter-from,
.contest-lightbox-leave-to {
  opacity: 0;
}
</style>
