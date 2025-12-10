<template>
  <div class="display-panel" :class="{ 'panel-open': isOpen }">
    <!-- Control Buttons -->
    <div class="panel-header">
      <button 
        class="nav-btn" 
        @click="$emit('navigate-previous')"
        :disabled="!canNavigatePrevious"
        title="Previous Pokemon"
      >
        ‹
      </button>
      <button class="close-btn" @click="$emit('close')" title="Close">
        ✕
      </button>
      <button 
        class="nav-btn" 
        @click="$emit('navigate-next')"
        :disabled="!canNavigateNext"
        title="Next Pokemon"
      >
        ›
      </button>
    </div>

    <!-- Content -->
    <div class="display-content">
      <div v-if="error" class="error-message">
        There's been an error, try again later
      </div>
      <div v-else-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
      <div v-else-if="pokemon" class="pokemon-details">
        <img 
          :src="pokemon.sprites.other['official-artwork'].front_default" 
          :alt="pokemon.name"
          class="pokemon-image"
        />
        <h2>{{ formatName(pokemon.name) }}</h2>
        <p class="pokemon-number">#{{ String(pokemon.id).padStart(3, '0') }}</p>
        <div class="pokemon-info">
          <div class="info-row">
            <span class="label">Types:</span>
            <div class="types">
              <span 
                v-for="type in pokemon.types" 
                :key="type.slot"
                class="type-badge"
                :class="`type-${type.type.name}`"
              >
                {{ type.type.name }}
              </span>
            </div>
          </div>
          <div class="info-row">
            <span class="label">Height:</span>
            <span>{{ (pokemon.height / 10).toFixed(1) }} m</span>
          </div>
          <div class="info-row">
            <span class="label">Weight:</span>
            <span>{{ (pokemon.weight / 10).toFixed(1) }} kg</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '../types/pokemon';

defineProps<{
  pokemon: Pokemon | null;
  loading: boolean;
  error: boolean;
  isOpen: boolean;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
}>();

defineEmits<{
  close: [];
  'navigate-next': [];
  'navigate-previous': [];
}>();

function formatName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
</script>

<style scoped>
.display-panel {
  position: absolute;
  top: 5%;
  left: 100%;
  margin-left: -0px;
  width: 350px;
  height: 90%;
  max-height: 650px;
  background: rgba(170, 32, 32, 0.98);
  border-radius: 12px;
  transition: transform 0.4s ease;
  overflow: hidden;
  z-index: -1;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transform: translateX(-100%);
}

.display-panel.panel-open {
  transform: translateX(0);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(139, 0, 0, 0.6);
  border-bottom: 2px solid #FFDD00;
  position: sticky;
  top: 0;
  z-index: 10;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #FFDD00;
  background: rgba(139, 0, 0, 0.9);
  color: #FFDD00;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-weight: bold;
  line-height: 1;
}

.close-btn:hover {
  background: #8B0000;
  transform: scale(1.1);
}

.nav-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #FFDD00;
  background: rgba(139, 0, 0, 0.9);
  color: #FFDD00;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-weight: bold;
  line-height: 1;
}

.nav-btn:hover:not(:disabled) {
  background: #8B0000;
  transform: scale(1.1);
}

.nav-btn:disabled {
  background: rgba(100, 100, 100, 0.5);
  border-color: #999;
  color: #999;
  cursor: not-allowed;
  opacity: 0.5;
}

.display-content {
  padding: 1.5rem 1rem;
  height: calc(100% - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hide scrollbar but keep functionality */
.display-content::-webkit-scrollbar {
  display: none;
}

.display-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.error-message {
  color: #FFDD00;
  font-size: 0.95rem;
  text-align: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.loading {
  text-align: center;
  color: #FFDD00;
}

.spinner {
  border: 3px solid rgba(255, 221, 0, 0.2);
  border-top: 3px solid #FFDD00;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.75rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pokemon-details {
  text-align: center;
  width: 100%;
}

.pokemon-image {
  max-width: 180px;
  height: auto;
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

.pokemon-details h2 {
  font-size: 1.6rem;
  margin: 0.5rem 0;
  color: #FFDD00;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  font-weight: bold;
}

.pokemon-number {
  font-size: 1.1rem;
  color: #FFF;
  margin: 0.25rem 0 1rem;
  font-weight: 500;
}

.pokemon-info {
  max-width: 400px;
  margin: 0 auto;
}

.pokemon-info {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 0.75rem;
  width: 100%;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid rgba(255, 221, 0, 0.3);
  font-size: 0.9rem;
  color: #FFF;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 700;
  color: #FFDD00;
}

.types {
  display: flex;
  gap: 0.5rem;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
  color: white;
}

/* Pokemon type colors */
.type-normal { background-color: #a8a878; }
.type-fire { background-color: #f08030; }
.type-water { background-color: #6890f0; }
.type-electric { background-color: #f8d030; color: #333; }
.type-grass { background-color: #78c850; }
.type-ice { background-color: #98d8d8; }
.type-fighting { background-color: #c03028; }
.type-poison { background-color: #a040a0; }
.type-ground { background-color: #e0c068; }
.type-flying { background-color: #a890f0; }
.type-psychic { background-color: #f85888; }
.type-bug { background-color: #a8b820; }
.type-rock { background-color: #b8a038; }
.type-ghost { background-color: #705898; }
.type-dragon { background-color: #7038f8; }
.type-dark { background-color: #705848; }
.type-steel { background-color: #b8b8d0; }
.type-fairy { background-color: #ee99ac; }

.prompt {
  color: #6b7280;
  font-size: 1.2rem;
  text-align: center;
}
</style>
