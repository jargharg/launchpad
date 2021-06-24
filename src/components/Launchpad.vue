<template>
	<ul class="launchpad-grid">
		<li class="launchpad-grid__row" v-for="(row, x) in displayGrid" :key="x">
			<button
				@click="toggleCell(x, y)"
				class="launchpad-grid__cell"
				:class="{
					'launchpad-grid__cell--selected': cellValue === SELECTED_COLOUR,
					'launchpad-grid__cell--active': cellValue === ACTIVE_COLOUR,
				}"
				v-for="(cellValue, y) in row"
				:key="x + y"
			></button>
		</li>
	</ul>
</template>

<script>
import Launchpad, { SELECTED_COLOUR, ACTIVE_COLOUR } from '../Launchpad';
import { mapState } from 'vuex';
import { Transport, MembraneSynth, Sampler } from 'tone';

export default {
	computed: mapState([
		'displayGrid',
		'sequenceGrid',
		'activeCell',
		'playing',
		'activeTopCell',
	]),
	data() {
		return {
			toneInitialised: false,
			launchpad: null,
			synth: null,
			SELECTED_COLOUR,
			ACTIVE_COLOUR,
		};
	},
	async mounted() {
		try {
			this.launchpad = new Launchpad({
				grid: this.displayGrid,
				latch: true,
				setCellValue: this.$store.dispatch.bind(this, 'setCellValue'),
				togglePlaying: this.$store.commit.bind(this, 'togglePlaying'),
				resetPlaying: this.$store.dispatch.bind(this, 'resetPlaying'),
			});
			await this.launchpad.init();
		} catch (error) {
			console.log('no Launchpad found');
			this.launchpad = { updateGrid: () => {} };
		}

		this.synth = new MembraneSynth().toDestination();

		this.sampler = new Sampler({
			urls: {
				A1: 'A1.mp3',
				A2: 'A2.mp3',
			},
			baseUrl: 'https://tonejs.github.io/audio/casio/',
		}).toDestination();

		Transport.scheduleRepeat((time) => {
			this.$store.dispatch('step');
			this.$store.state.sequenceGrid.forEach((row) => {
				if (row[this.activeTopCell] > 0)
					this.sampler.triggerAttackRelease('C2', '8n');
			});
		}, '8n');

		Transport.loop = true;
	},
	watch: {
		displayGrid(newGrid) {
			this.launchpad.updateGrid(newGrid);
		},
		activeTopCell(topCell) {
			this.launchpad.updateActiveTopCell(topCell);
		},
	},
	methods: {
		toggleCell(row, col) {
			this.$store.dispatch('toggleGridValue', { row, col });
		},
	},
};
</script>

<style lang="scss">
.launchpad-grid {
	box-shadow: 0 0 50px 10px #000;
	background: darkgrey;
	height: 500px;
	width: 500px;
	list-style: none;
	padding: 30px;
	display: flex;
	flex-direction: column;
	justify-content: stretch;
	align-items: stretch;

	&__row {
		width: 100%;
		display: flex;
		flex: 1;
		justify-content: stretch;
		align-items: stretch;
	}

	&__cell {
		margin: 5px;
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background: #222;
		border: none;
		outline: none;
		cursor: pointer;

		&--active {
			background: red !important;
		}

		&--selected {
			background: orange;
		}
	}
}
</style>
