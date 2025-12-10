import type { PokemonListResponse, Pokemon } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit: number, offset: number): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
}

export async function fetchPokemonBySearch(query: string, limit: number, offset: number): Promise<PokemonListResponse> {
  // Fetch all Pokemon to search through them
  const response = await fetch(`${BASE_URL}/pokemon?limit=2000&offset=0`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list for search');
  }
  const allPokemon: PokemonListResponse = await response.json();
  const filteredResults = allPokemon.results.filter(pokemon =>
    pokemon.name.toLowerCase().includes(query.toLowerCase())
  );
  
  // Apply pagination to the filtered results
  const paginatedResults = filteredResults.slice(offset, offset + limit);
  
  return {
    count: filteredResults.length,
    next: offset + limit < filteredResults.length ? 'next' : null,
    previous: offset > 0 ? 'previous' : null,
    results: paginatedResults,
  };
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${name}`);
  }
  return response.json();
}

export async function fetchPokemonById(id: number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon with ID: ${id}`);
  }
  return response.json();
}
