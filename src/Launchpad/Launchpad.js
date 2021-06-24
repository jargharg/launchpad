import {
	LAUNCHPAD_NOTE_GRID,
	LAUNCHPAD_RIGHT_ROW,
	LAUNCHPAD_TOP_ROW,
} from './launchpadGrids';

const ON = 144;
const OFF = 128;
const FULL_VELOCITY = 127;

export const ACTIVE_COLOUR = 10;
export const SELECTED_COLOUR = 51;

class Launchpad {
	grid = [];
	input = [];
	output = [];

	constructor({ grid, latch, setCellValue, togglePlaying, resetPlaying }) {
		this.grid = grid;
		this.latch = latch;
		this.setCellValue = setCellValue;
		this.togglePlaying = togglePlaying;
		this.resetPlaying = resetPlaying;
	}

	async init() {
		try {
			let midiDevices = await navigator.requestMIDIAccess();
			this.input = this.getLaunchpadFromDeviceList(midiDevices.inputs);
			this.output = this.getLaunchpadFromDeviceList(midiDevices.outputs);
			this.input.onmidimessage = this.onMIDIMessage.bind(this);
			this.clearLights();
			return;
		} catch (error) {
			throw Error('Could not find Launchpad');
		}
	}

	getLaunchpadFromDeviceList(midiDevices) {
		for (var device of midiDevices.values()) {
			if (device.name.includes('Launchpad')) {
				return device;
			}
		}
	}

	switchLight({ row, col }, velocity) {
		this.output.send([velocity ? ON : OFF, LAUNCHPAD_NOTE_GRID[row][col], velocity]);
	}

	clearLights() {
		for (let i = 0; i < 128; i++) {
			let noteMessage = [OFF, i, FULL_VELOCITY];
			this.output.send(noteMessage);
		}
	}

	onMIDIMessage({ data: [command, note, velocity] }) {
		if ([128, 144, 176].includes(command) === false) {
			return;
		}

		if (command === 176 && LAUNCHPAD_TOP_ROW.includes(note) && velocity) {
			return this.handleTopButtonPress(note);
		}

		if (LAUNCHPAD_RIGHT_ROW.includes(note)) {
			return this.handleRightButtonPress(note, velocity);
		}

		if (this.latch && (!velocity || command === 128)) return;
		this.handleMainButtonPress(note, velocity);
	}

	handleTopButtonPress(note) {
		if (note === 104) this.togglePlaying();
		if (note === 105) this.resetPlaying();
		console.log('top button', note);
	}

	handleRightButtonPress(note, velocity) {
		console.log('right button', note, velocity);
	}

	handleMainButtonPress(note, velocity) {
		function findXYPosition(note) {
			for (let row = 0; row < LAUNCHPAD_NOTE_GRID.length; row++) {
				let noteIndex = LAUNCHPAD_NOTE_GRID[row].indexOf(note);
				if (noteIndex > -1) return { row, col: noteIndex };
			}
		}

		let location = findXYPosition(note);
		let value = this.latch
			? !this.grid[location.row][location.col] && SELECTED_COLOUR
			: velocity;

		this.setCellValue({ location, value });
	}

	updateGrid(grid) {
		this.grid = grid;
		this.grid.forEach((row, rowIndex) => {
			row.forEach((velocity, col) => {
				this.switchLight({ row: rowIndex, col }, velocity);
			});
		});
	}

	updateActiveTopCell(cell) {
		LAUNCHPAD_RIGHT_ROW.forEach((note, index) => {
			this.output.send([cell === index ? ON : OFF, note, FULL_VELOCITY]);
		});
	}
}

export default Launchpad;
