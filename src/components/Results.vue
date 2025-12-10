<template>
  <div class="results">
    <!-- View Mode Toggle -->
    <div class="view-controls">
      <label>
        <input 
          type="radio" 
          value="card" 
          :checked="viewMode === 'card'"
          @change="$emit('update:viewMode', 'card')"
        />
        Card View
      </label>
      <label>
        <input 
          type="radio" 
          value="list" 
          :checked="viewMode === 'list'"
          @change="$emit('update:viewMode', 'list')"
        />
        List View
      </label>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading Pokemon...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      Failed to load Pokemon. Please try again.
    </div>

    <!-- Results -->
    <div v-else-if="pokemon.length > 0">
      <!-- Card View -->
      <div v-if="viewMode === 'card'" class="card-grid">
        <PokemonCard
          v-for="p in pokemon"
          :key="p.name"
          :pokemon="p"
          @select="$emit('select', p.name)"
        />
      </div>

      <!-- List View -->
      <div v-else class="list-view">
        <div
          v-for="p in pokemon"
          :key="p.name"
          class="list-item"
          @click="$emit('select', p.name)"
        >
          {{ formatName(p.name) }}
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button 
          @click="$emit('first-page')" 
          :disabled="!hasPrevious"
          class="pagination-btn"
          title="Go to first page"
        >
          First
        </button>
        <button 
          @click="$emit('previous-three-pages')" 
          :disabled="!canGoBack3"
          class="pagination-btn"
          title="Go back 3 pages"
        >
          «
        </button>
        <button 
          @click="$emit('previous-page')" 
          :disabled="!hasPrevious"
          class="pagination-btn"
          title="Go to previous page"
        >
          ‹
        </button>
        <span class="page-info">Page {{ currentPage }}/{{ totalPages }}</span>
        <button 
          @click="$emit('next-page')" 
          :disabled="!hasNext"
          class="pagination-btn"
          title="Go to next page"
        >
          ›
        </button>
        <button 
          @click="$emit('next-three-pages')" 
          :disabled="!canGoForward3"
          class="pagination-btn"
          title="Go forward 3 pages"
        >
          »
        </button>
        <button 
          @click="$emit('last-page')" 
          :disabled="!hasNext"
          class="pagination-btn"
          title="Go to last page"
        >
          Last
        </button>
      </div>
    </div>

    <!-- No Results -->
    <div v-else class="no-results">
      No Pokemon found matching your search.
    </div>
  </div>
</template>

<script setup lang="ts">
import PokemonCard from './PokemonCard.vue';
import type { PokemonListItem, ViewMode } from '../types/pokemon';

defineProps<{
  pokemon: PokemonListItem[];
  viewMode: ViewMode;
  loading: boolean;
  error: boolean;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  canGoBack3: boolean;
  canGoForward3: boolean;
}>();

defineEmits<{
  'update:viewMode': [mode: ViewMode];
  'select': [name: string];
  'first-page': [];
  'previous-three-pages': [];
  'previous-page': [];
  'next-page': [];
  'next-three-pages': [];
  'last-page': [];
}>();

function formatName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
</script>

<style scoped>
.results {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  min-height: 432px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.view-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.875rem;
}

.view-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
}

.view-controls input[type="radio"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.loading,
.error-message,
.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc2626;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  overflow-y: auto;
  max-height: 300px;
}

.list-view {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.list-item {
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.875rem;
}

.list-item:hover {
  background: #e5e7eb;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 2px solid #e5e7eb;
}

.pagination-btn {
  padding: 0.4rem 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #2563eb;
}

.pagination-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}
</style>
