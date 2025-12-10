import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Results from './Results.vue';
import PokemonCard from './PokemonCard.vue';
import type { PokemonListItem } from '../types/pokemon';

describe('Results', () => {
  const mockPokemon: PokemonListItem[] = [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
  ];

  const defaultProps = {
    pokemon: mockPokemon,
    viewMode: 'card' as const,
    loading: false,
    error: false,
    currentPage: 1,
    totalPages: 5,
    hasNext: true,
    hasPrevious: false,
    canGoBack3: false,
    canGoForward3: true,
  };

  it('should render loading state when loading is true', () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        loading: true,
      },
    });

    expect(wrapper.find('.spinner').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading Pokemon...');
  });

  it('should render error message when error is true', () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        error: true,
      },
    });

    expect(wrapper.text()).toContain('Failed to load Pokemon. Please try again.');
  });

  it('should render PokemonCard components in card view', () => {
    const wrapper = mount(Results, {
      props: defaultProps,
      global: {
        components: { PokemonCard },
      },
    });

    const cards = wrapper.findAllComponents(PokemonCard);
    expect(cards).toHaveLength(3);
  });

  it('should render list items in list view', () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        viewMode: 'list',
      },
    });

    const listItems = wrapper.findAll('.list-item');
    expect(listItems).toHaveLength(3);
    expect(listItems[0].text()).toBe('Bulbasaur');
  });

  it('should emit update:viewMode when card view is selected', async () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        viewMode: 'list',
      },
    });

    const cardRadio = wrapper.findAll('input[type="radio"]')[0];
    await cardRadio.trigger('change');

    expect(wrapper.emitted('update:viewMode')).toBeTruthy();
    expect(wrapper.emitted('update:viewMode')?.[0]).toEqual(['card']);
  });

  it('should emit update:viewMode when list view is selected', async () => {
    const wrapper = mount(Results, {
      props: defaultProps,
    });

    const listRadio = wrapper.findAll('input[type="radio"]')[1];
    await listRadio.trigger('change');

    expect(wrapper.emitted('update:viewMode')).toBeTruthy();
    expect(wrapper.emitted('update:viewMode')?.[0]).toEqual(['list']);
  });

  it('should emit select event when list item is clicked', async () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        viewMode: 'list',
      },
    });

    await wrapper.find('.list-item').trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual(['bulbasaur']);
  });

  it('should display correct page information', () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        currentPage: 3,
        totalPages: 10,
      },
    });

    expect(wrapper.find('.page-info').text()).toBe('Page 3/10');
  });

  it('should emit next-page event when next button is clicked', async () => {
    const wrapper = mount(Results, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('.pagination-btn');
    const nextButton = buttons.find(btn => btn.text() === '›');
    await nextButton?.trigger('click');

    expect(wrapper.emitted('next-page')).toBeTruthy();
  });

  it('should emit previous-page event when previous button is clicked', async () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        hasPrevious: true,
      },
    });

    const buttons = wrapper.findAll('.pagination-btn');
    const prevButton = buttons.find(btn => btn.text() === '‹');
    await prevButton?.trigger('click');

    expect(wrapper.emitted('previous-page')).toBeTruthy();
  });

  it('should emit first-page event when first button is clicked', async () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        currentPage: 3,
        hasPrevious: true,
      },
    });

    const buttons = wrapper.findAll('.pagination-btn');
    const firstButton = buttons.find(btn => btn.text() === 'First');
    await firstButton?.trigger('click');

    expect(wrapper.emitted('first-page')).toBeTruthy();
  });

  it('should emit last-page event when last button is clicked', async () => {
    const wrapper = mount(Results, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('.pagination-btn');
    const lastButton = buttons.find(btn => btn.text() === 'Last');
    await lastButton?.trigger('click');

    expect(wrapper.emitted('last-page')).toBeTruthy();
  });

  it('should emit next-three-pages event when «« button is clicked', async () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        canGoForward3: true,
      },
    });

    const buttons = wrapper.findAll('.pagination-btn');
    const nextThreeButton = buttons.find(btn => btn.text() === '»');
    await nextThreeButton?.trigger('click');

    expect(wrapper.emitted('next-three-pages')).toBeTruthy();
  });

  it('should emit previous-three-pages event when ««  button is clicked', async () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        currentPage: 5,
        canGoBack3: true,
        hasPrevious: true,
      },
    });

    const buttons = wrapper.findAll('.pagination-btn');
    const prevThreeButton = buttons.find(btn => btn.text() === '«');
    await prevThreeButton?.trigger('click');

    expect(wrapper.emitted('previous-three-pages')).toBeTruthy();
  });

  it('should disable previous button when hasPrevious is false', () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        hasPrevious: false,
      },
    });

    const buttons = wrapper.findAll('.pagination-btn');
    const prevButton = buttons.find(btn => btn.text() === '‹');
    expect(prevButton?.attributes('disabled')).toBeDefined();
  });

  it('should disable next button when hasNext is false', () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        hasNext: false,
      },
    });

    const buttons = wrapper.findAll('.pagination-btn');
    const nextButton = buttons.find(btn => btn.text() === '›');
    expect(nextButton?.attributes('disabled')).toBeDefined();
  });

  it('should show empty state message when no pokemon', () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        pokemon: [],
      },
    });

    expect(wrapper.text()).toContain('No Pokemon found');
  });

  it('should format Pokemon names correctly in list view', () => {
    const wrapper = mount(Results, {
      props: {
        ...defaultProps,
        viewMode: 'list',
      },
    });

    const listItems = wrapper.findAll('.list-item');
    expect(listItems[0].text()).toBe('Bulbasaur');
    expect(listItems[1].text()).toBe('Ivysaur');
    expect(listItems[2].text()).toBe('Venusaur');
  });
});
