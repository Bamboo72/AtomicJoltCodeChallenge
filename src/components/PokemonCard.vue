<template>
  <div class="pokemon-card" @click="$emit('select', pokemon.name)">
    <img 
      :src="imageUrl" 
      :alt="pokemon.name"
      class="card-image"
      @error="handleImageError"
    />
    <h3>{{ formatName(pokemon.name) }}</h3>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PokemonListItem } from '../types/pokemon';

const props = defineProps<{
  pokemon: PokemonListItem;
}>();

defineEmits<{
  select: [name: string];
}>();

const imageError = ref(false);

// Extract Pokemon ID from the URL
const pokemonId = computed(() => {
  const parts = props.pokemon.url.split('/');
  return parts[parts.length - 2];
});

// Use official artwork from PokeAPI
const imageUrl = computed(() => {
  if (imageError.value) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId.value}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId.value}.png`;
});

function formatName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function handleImageError() {
  imageError.value = true;
}
</script>

<style scoped>
.pokemon-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pokemon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.pokemon-card h3 {
  font-size: 1rem;
  margin: 0;
  color: #1f2937;
}
</style>
