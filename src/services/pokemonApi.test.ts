import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchPokemonList, fetchPokemonBySearch, fetchPokemonByName, fetchPokemonById } from './pokemonApi';
import type { PokemonListResponse, Pokemon } from '../types/pokemon';

// Mock fetch globally
global.fetch = vi.fn();

describe('pokemonApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPokemonList', () => {
    it('should fetch a list of Pokemon with correct limit and offset', async () => {
      const mockResponse: PokemonListResponse = {
        count: 1000,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=30&limit=30',
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchPokemonList(30, 0);

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=30&offset=0');
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the fetch fails', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchPokemonList(30, 0)).rejects.toThrow('Failed to fetch Pokemon list');
    });
  });

  describe('fetchPokemonBySearch', () => {
    it('should filter Pokemon by search query and apply pagination', async () => {
      const mockAllPokemon: PokemonListResponse = {
        count: 5,
        next: null,
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
          { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
          { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
          { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
        ],
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAllPokemon,
      });

      const result = await fetchPokemonBySearch('char', 10, 0);

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0');
      expect(result.results).toHaveLength(2);
      expect(result.results[0].name).toBe('charmander');
      expect(result.results[1].name).toBe('charmeleon');
      expect(result.count).toBe(2);
    });

    it('should handle case-insensitive search', async () => {
      const mockAllPokemon: PokemonListResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'Ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAllPokemon,
      });

      const result = await fetchPokemonBySearch('SAUR', 10, 0);

      expect(result.results).toHaveLength(2);
      expect(result.results.map(p => p.name)).toEqual(['bulbasaur', 'Ivysaur']);
    });

    it('should paginate search results correctly', async () => {
      const mockAllPokemon: PokemonListResponse = {
        count: 5,
        next: null,
        previous: null,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
          { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
        ],
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAllPokemon,
      });

      const result = await fetchPokemonBySearch('saur', 2, 1);

      expect(result.results).toHaveLength(2);
      expect(result.results[0].name).toBe('ivysaur');
      expect(result.results[1].name).toBe('venusaur');
      expect(result.count).toBe(3);
      expect(result.next).toBe(null);
      expect(result.previous).toBe('previous');
    });

    it('should throw an error if the fetch fails', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchPokemonBySearch('bulba', 10, 0)).rejects.toThrow('Failed to fetch Pokemon list for search');
    });
  });

  describe('fetchPokemonByName', () => {
    it('should fetch a Pokemon by name', async () => {
      const mockPokemon: Pokemon = {
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
        ],
        sprites: {
          front_default: 'https://example.com/sprite.png',
          other: {
            'official-artwork': {
              front_default: 'https://example.com/artwork.png',
            },
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      });

      const result = await fetchPokemonByName('Bulbasaur');

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/bulbasaur');
      expect(result).toEqual(mockPokemon);
    });

    it('should convert name to lowercase before fetching', async () => {
      const mockPokemon: Pokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        types: [
          {
            slot: 1,
            type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
          },
        ],
        sprites: {
          front_default: 'https://example.com/sprite.png',
          other: {
            'official-artwork': {
              front_default: 'https://example.com/artwork.png',
            },
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      });

      await fetchPokemonByName('PIKACHU');

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
    });

    it('should throw an error if the fetch fails', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchPokemonByName('unknown')).rejects.toThrow('Failed to fetch Pokemon: unknown');
    });
  });

  describe('fetchPokemonById', () => {
    it('should fetch a Pokemon by ID', async () => {
      const mockPokemon: Pokemon = {
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
          },
        ],
        sprites: {
          front_default: 'https://example.com/sprite.png',
          other: {
            'official-artwork': {
              front_default: 'https://example.com/artwork.png',
            },
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      });

      const result = await fetchPokemonById(1);

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1');
      expect(result).toEqual(mockPokemon);
    });

    it('should throw an error if the fetch fails', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchPokemonById(9999)).rejects.toThrow('Failed to fetch Pokemon with ID: 9999');
    });
  });
});
