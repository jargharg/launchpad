<template>
	<ul class="transport-controls">
		<li>
			<button class="start-tone" @click="togglePlaying">
				<span v-if="playing" class="material-icons">
					pause
				</span>
				<span v-if="!playing" class="material-icons">
					play_arrow
				</span>
			</button>
		</li>
		<li>
			<button class="start-tone" @click="reset">
				<span class="material-icons">
					stop
				</span>
			</button>
		</li>
		<li>
			<button class="start-tone" @click="resetSequence">
				<span class="material-icons">
					refresh
				</span>
			</button>
		</li>
	</ul>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			initialState: true,
		};
	},
	computed: mapState(['playing', 'toneInitialised']),
	watch: {
		playing(newValue) {
			if (newValue) this.initialState = false;
		},
	},
	methods: {
		togglePlaying() {
			if (!this.toneInitialised) {
				this.$store.commit('initialiseTone');
			}
			this.$store.commit('togglePlaying');
		},
		reset() {
			if (this.initialState) return;
			this.initialState = true;
			this.$store.dispatch('resetPlaying');
		},
		resetSequence() {
			this.$store.dispatch('resetSequenceGrid');
		},
	},
};
</script>

<style lang="scss">
.transport-controls {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	justify-content: center;

	li button {
		padding: 5px;
		background: transparent;
		border: none;
		color: darkgray;
		outline: none;
		cursor: pointer;

		&:hover {
			color: white;
		}
	}
}
</style>
