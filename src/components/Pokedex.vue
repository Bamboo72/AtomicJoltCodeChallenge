<template>
  <div class="pokedex">
    <!-- Sliding Display Panel (behind Pokedex) -->
    <Display 
      :pokemon="selectedPokemon"
      :loading="detailsLoading"
      :error="detailsError"
      :is-open="isPanelOpen"
      :can-navigate-next="canNavigateToNext"
      :can-navigate-previous="canNavigateToPrevious"
      @close="closePanel"
      @navigate-next="navigateToNext"
      @navigate-previous="navigateToPrevious"
    />
    <div class="pokedex-header">
      <h1>Atomic Pokedex</h1>
      <button class="quiz-btn" disabled>Start Quiz (Coming Soon)</button>
    </div>

    <div class="pokedex-content">
      <!-- Search Bar -->
      <div class="search-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Pokemon by name..."
          class="search-input"
        />
      </div>

      <!-- Results Section -->
      <div class="results-section">
        <Results
          :pokemon="filteredPokemon"
          :view-mode="viewMode"
          :loading="listLoading"
          :error="listError"
          :current-page="currentPage"
          :total-pages="totalPages"
          :has-next="hasNext"
          :has-previous="hasPrevious"
          :can-go-back-3="canGoBack3"
          :can-go-forward-3="canGoForward3"
          @update:view-mode="viewMode = $event"
          @select="handleSelectPokemon"
          @first-page="firstPage"
          @previous-three-pages="previousThreePages"
          @previous-page="previousPage"
          @next-page="nextPage"
          @next-three-pages="nextThreePages"
          @last-page="lastPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import Display from './Display.vue';
import Results from './Results.vue';
import { fetchPokemonList, fetchPokemonBySearch, fetchPokemonByName } from '../services/pokemonApi';
import type { PokemonListItem, Pokemon, ViewMode } from '../types/pokemon';

// State
const viewMode = ref<ViewMode>('card');
const searchQuery = ref('');
const allPokemon = ref<PokemonListItem[]>([]);
const selectedPokemon = ref<Pokemon | null>(null);
const selectedIndex = ref<number>(-1);
const isPanelOpen = ref(false);
const currentPage = ref(1);
const totalCount = ref(0);

// Loading and error states
const listLoading = ref(false);
const listError = ref(false);
const detailsLoading = ref(false);
const detailsError = ref(false);

// Pagination
const itemsPerPage = computed(() => viewMode.value === 'card' ? 30 : 100);
const offset = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage.value));
const hasNext = computed(() => currentPage.value < totalPages.value);
const hasPrevious = computed(() => currentPage.value > 1);
const canGoBack3 = computed(() => currentPage.value > 3);
const canGoForward3 = computed(() => currentPage.value + 3 <= totalPages.value);

// Computed property to display the right Pokemon
const filteredPokemon = computed(() => {
  return allPokemon.value;
});

// Navigation computed properties
const canNavigateToNext = computed(() => selectedIndex.value < allPokemon.value.length - 1);
const canNavigateToPrevious = computed(() => selectedIndex.value > 0);

// Load Pokemon list
async function loadPokemonList() {
  listLoading.value = true;
  listError.value = false;
  
  try {
    let response;
    if (!searchQuery.value.trim()) {
      response = await fetchPokemonList(itemsPerPage.value, offset.value);
    } else {
      console.log('Searching for:', searchQuery.value);
      response = await fetchPokemonBySearch(searchQuery.value, itemsPerPage.value, offset.value);
    }
    allPokemon.value = response.results;
    totalCount.value = response.count;
  } catch (error) {
    console.error('Failed to load Pokemon list:', error);
    listError.value = true;
  } finally {
    listLoading.value = false;
  }
}

// Handle Pokemon selection
async function handleSelectPokemon(name: string) {
  const index = allPokemon.value.findIndex(p => p.name === name);
  if (index !== -1) {
    selectedIndex.value = index;
    isPanelOpen.value = true;
    await loadPokemonDetails(name);
  }
}

// Load Pokemon details
async function loadPokemonDetails(name: string) {
  detailsLoading.value = true;
  detailsError.value = false;
  selectedPokemon.value = null;

  try {
    const pokemon = await fetchPokemonByName(name);
    selectedPokemon.value = pokemon;
  } catch (error) {
    console.error('Failed to load Pokemon details:', error);
    detailsError.value = true;
  } finally {
    detailsLoading.value = false;
  }
}

// Close panel
function closePanel() {
  isPanelOpen.value = false;
}

// Navigate to next Pokemon
async function navigateToNext() {
  if (canNavigateToNext.value) {
    selectedIndex.value++;
    const nextPokemon = allPokemon.value[selectedIndex.value];
    loadPokemonDetails(nextPokemon.name);
  } else if (hasNext.value) {
    // We've reached the end of current page, go to next page
    currentPage.value++;
    await loadPokemonList();
    // Select first Pokemon on new page
    selectedIndex.value = 0;
    if (allPokemon.value.length > 0) {
      loadPokemonDetails(allPokemon.value[0].name);
    }
  }
}

// Navigate to previous Pokemon
async function navigateToPrevious() {
  if (canNavigateToPrevious.value) {
    selectedIndex.value--;
    const prevPokemon = allPokemon.value[selectedIndex.value];
    loadPokemonDetails(prevPokemon.name);
  } else if (hasPrevious.value) {
    // We've reached the start of current page, go to previous page
    currentPage.value--;
    await loadPokemonList();
    // Select last Pokemon on new page
    selectedIndex.value = allPokemon.value.length - 1;
    if (allPokemon.value.length > 0) {
      loadPokemonDetails(allPokemon.value[selectedIndex.value].name);
    }
  }
}

// Pagination handlers
function nextPage() {
  if (hasNext.value) {
    currentPage.value++;
    loadPokemonList();
  }
}

function previousPage() {
  if (hasPrevious.value) {
    currentPage.value--;
    loadPokemonList();
  }
}

function firstPage() {
  if (hasPrevious.value) {
    currentPage.value = 1;
    loadPokemonList();
  }
}

function lastPage() {
  if (hasNext.value) {
    currentPage.value = totalPages.value;
    loadPokemonList();
  }
}

function nextThreePages() {
  if (hasNext.value) {
    currentPage.value = Math.min(currentPage.value + 3, totalPages.value);
    loadPokemonList();
  }
}

function previousThreePages() {
  if (hasPrevious.value) {
    currentPage.value = Math.max(currentPage.value - 3, 1);
    loadPokemonList();
  }
}

// Watch for view mode changes to reload with different page sizes
watch(viewMode, () => {
  currentPage.value = 1;
  loadPokemonList();
});

// Watch for search query changes (live search)
watch(searchQuery, () => {
  currentPage.value = 1;
  loadPokemonList();
});

// Initial load
onMounted(() => {
  loadPokemonList();
});
</script>

<style scoped>
.pokedex {
  position: relative;
  background: rgba(170, 32, 32);
  border-radius: 12px;
  padding: 1rem;
  max-width: 600px;
  min-height: 500px;
  margin: 1rem auto;
  margin-top: 4rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  overflow: visible;
}

.pokedex-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #FFDD00;
  z-index: 1;
}

.pokedex-header h1 {
  margin: 0;
  color: #FFF;
  font-size: 1.5rem;
}

.quiz-btn {
  padding: 0.5rem 1rem;
  background: #cbd5e1;
  color: #64748b;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: not-allowed;
}

.pokedex-content {
  position: relative;
  display: grid;
  gap: 0.75rem;
  z-index: 1;
}

.display-section {
  grid-column: 1 / -1;
}

.search-section {
  grid-column: 1 / -1;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.results-section {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .pokedex {
    margin: 1rem;
    padding: 1rem;
  }

  .pokedex-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .pokedex-header h1 {
    font-size: 1.5rem;
    text-align: center;
  }
}
</style>
