import Vue from 'vue';
import Vuex from 'vuex';
import { EMPTY_GRID, SELECTED_COLOUR, ACTIVE_COLOUR } from './Launchpad';
import { start, Transport } from 'tone';

Vue.use(Vuex);

function cloneEmptyGrid() {
	return [...EMPTY_GRID.map((row) => [...row])];
}

export default new Vuex.Store({
	state: {
		toneInitialised: false,
		sequenceGrid: cloneEmptyGrid(),
		displayGrid: cloneEmptyGrid(),
		activeStep: -1,
		activeCell: { row: -1, col: -1 },
		activeTopCell: -1,
		activeRightCells: [0, 2, 4, 6],
		playing: false,
	},
	getters: {
		valueInActiveCell(state) {
			let { row, col } = state.activeCell;
			if (row === -1 || col === -1) return null;
			return state.sequenceGrid[row][col];
		},
	},
	mutations: {
		initialiseTone(state) {
			state.toneInitialised = true;
			start();
		},
		togglePlaying(state) {
			state.playing = !state.playing;
			Transport.toggle();
		},
		updatePlaying(state, playing) {
			state.playing = playing;
			if (playing) {
				Transport.resume();
			} else {
				Transport.pause();
			}
		},
		updateActiveTopCell(state, cell) {
			Vue.set(state, 'activeTopCell', cell);
		},
		updateActiveRightCells(state, cells) {
			Vue.set(state, 'activeRightCells', cells);
		},
		updateDisplayGrid(state) {
			let grid = state.sequenceGrid.map((row) => row.map((col) => col));
			let { row, col } = state.activeCell;
			if (row > -1 && col > -1) grid[row][col] = ACTIVE_COLOUR;
			Vue.set(state, 'displayGrid', grid);
		},
		updateSequenceGrid(state, grid) {
			Vue.set(state, 'sequenceGrid', grid);
		},
	},
	actions: {
		toggleGridValue({ state, commit }, { row, col }) {
			let grid = [...state.sequenceGrid];
			grid[row][col] = !state.sequenceGrid[row][col] && SELECTED_COLOUR;
			commit('updateSequenceGrid', grid);
			commit('updateDisplayGrid');
		},
		resetActiveCell({ state, commit }) {
			Vue.set(state, 'activeCell', { row: -1, col: -1 });
			commit('updateDisplayGrid');
		},
		resetActiveStep({ commit }) {
			commit('updateActiveTopCell', -1);
		},
		resetPlaying({ commit, dispatch }) {
			commit('updatePlaying', false);
			dispatch('resetActiveCell');
		},
		resetSequenceGrid({ commit, dispatch }) {
			commit('updateSequenceGrid', cloneEmptyGrid());
			dispatch('resetActiveCell');
		},
		setActiveCell({ state, commit }, activeCell) {
			Vue.set(state, 'activeCell', activeCell);
			commit('updateDisplayGrid');
		},
		setActiveStep({ state, commit }, activeStep) {
			Vue.set(state, 'activeStep', activeStep);
			commit('updateActiveTopCell', activeStep);
		},
		setCellValue({ state, commit }, { location: { row, col }, value }) {
			let grid = [...state.sequenceGrid];
			grid[row][col] = value;
			commit('updateSequenceGrid', grid);
			commit('updateDisplayGrid');
		},
		step({ state, dispatch }) {
			let nextStep = state.activeStep < 7 ? state.activeStep + 1 : 0;
			dispatch('setActiveStep', nextStep);
		},
	},
});
