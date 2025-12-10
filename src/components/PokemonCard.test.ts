import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonCard from './PokemonCard.vue';
import type { PokemonListItem } from '../types/pokemon';

describe('PokemonCard', () => {
  const mockPokemon: PokemonListItem = {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  };

  it('should render Pokemon name formatted correctly', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon },
    });

    expect(wrapper.text()).toContain('Bulbasaur');
  });

  it('should compute correct Pokemon ID from URL', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon },
    });

    const img = wrapper.find('img');
    expect(img.attributes('src')).toContain('/1.png');
  });

  it('should emit select event when clicked', async () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon },
    });

    await wrapper.find('.pokemon-card').trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual(['bulbasaur']);
  });

  it('should display correct alt text for image', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon },
    });

    const img = wrapper.find('img');
    expect(img.attributes('alt')).toBe('bulbasaur');
  });

  it('should handle Pokemon with double-digit ID', () => {
    const mockPokemon25: PokemonListItem = {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
    };

    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon25 },
    });

    const img = wrapper.find('img');
    expect(img.attributes('src')).toContain('/25.png');
  });

  it('should handle Pokemon with triple-digit ID', () => {
    const mockPokemon151: PokemonListItem = {
      name: 'mew',
      url: 'https://pokeapi.co/api/v2/pokemon/151/',
    };

    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon151 },
    });

    const img = wrapper.find('img');
    expect(img.attributes('src')).toContain('/151.png');
  });
});
