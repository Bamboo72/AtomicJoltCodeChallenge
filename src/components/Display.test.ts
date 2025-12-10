import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Display from './Display.vue';
import type { Pokemon } from '../types/pokemon';

describe('Display', () => {
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
      {
        slot: 2,
        type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
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

  const defaultProps = {
    pokemon: null,
    loading: false,
    error: false,
    isOpen: false,
    canNavigateNext: false,
    canNavigatePrevious: false,
  };

  it('should show error message when error is true', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        error: true,
      },
    });

    expect(wrapper.text()).toContain("There's been an error, try again later");
  });

  it('should show loading spinner when loading is true', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        loading: true,
      },
    });

    expect(wrapper.find('.spinner').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading...');
  });

  it('should display Pokemon details when pokemon prop is provided', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        pokemon: mockPokemon,
      },
    });

    expect(wrapper.text()).toContain('Bulbasaur');
    expect(wrapper.text()).toContain('#001');
    expect(wrapper.text()).toContain('0.7 m');
    expect(wrapper.text()).toContain('6.9 kg');
    expect(wrapper.text()).toContain('grass');
    expect(wrapper.text()).toContain('poison');
  });

  it('should format Pokemon name with capital first letter', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        pokemon: mockPokemon,
      },
    });

    const heading = wrapper.find('h2');
    expect(heading.text()).toBe('Bulbasaur');
  });

  it('should display Pokemon ID with leading zeros', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        pokemon: mockPokemon,
      },
    });

    expect(wrapper.find('.pokemon-number').text()).toBe('#001');
  });

  it('should convert height from decimeters to meters', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        pokemon: mockPokemon,
      },
    });

    expect(wrapper.text()).toContain('0.7 m');
  });

  it('should convert weight from hectograms to kilograms', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        pokemon: mockPokemon,
      },
    });

    expect(wrapper.text()).toContain('6.9 kg');
  });

  it('should display all Pokemon types', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        pokemon: mockPokemon,
      },
    });

    const typeBadges = wrapper.findAll('.type-badge');
    expect(typeBadges).toHaveLength(2);
    expect(typeBadges[0].text()).toBe('grass');
    expect(typeBadges[1].text()).toBe('poison');
  });

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        isOpen: true,
      },
    });

    await wrapper.find('.close-btn').trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('should emit navigate-next event when next button is clicked', async () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        isOpen: true,
        canNavigateNext: true,
      },
    });

    const navButtons = wrapper.findAll('.nav-btn');
    await navButtons[1].trigger('click');

    expect(wrapper.emitted('navigate-next')).toBeTruthy();
  });

  it('should emit navigate-previous event when previous button is clicked', async () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        isOpen: true,
        canNavigatePrevious: true,
      },
    });

    const navButtons = wrapper.findAll('.nav-btn');
    await navButtons[0].trigger('click');

    expect(wrapper.emitted('navigate-previous')).toBeTruthy();
  });

  it('should disable navigation buttons when cannot navigate', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        isOpen: true,
        canNavigateNext: false,
        canNavigatePrevious: false,
      },
    });

    const navButtons = wrapper.findAll('.nav-btn');
    expect(navButtons[0].attributes('disabled')).toBeDefined();
    expect(navButtons[1].attributes('disabled')).toBeDefined();
  });

  it('should add panel-open class when isOpen is true', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        isOpen: true,
      },
    });

    expect(wrapper.find('.display-panel').classes()).toContain('panel-open');
  });

  it('should not have panel-open class when isOpen is false', () => {
    const wrapper = mount(Display, {
      props: {
        ...defaultProps,
        isOpen: false,
      },
    });

    expect(wrapper.find('.display-panel').classes()).not.toContain('panel-open');
  });
});
