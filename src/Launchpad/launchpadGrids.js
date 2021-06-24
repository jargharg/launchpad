let columns = 8;
let initialRowNumbers = [0, 16, 32, 48, 64, 80, 96, 112];

export const LAUNCHPAD_TOP_ROW = [104, 105, 106, 107, 108, 109, 110, 111];
export const LAUNCHPAD_RIGHT_ROW = [8, 24, 40, 56, 72, 88, 104, 120];

export const LAUNCHPAD_NOTE_GRID = initialRowNumbers.map((initialNumber) => {
	let rowArray = [];
	for (let column = 0; column < columns; column++) {
		rowArray.push(column + initialNumber);
	}
	return rowArray;
});

export const EMPTY_GRID = initialRowNumbers.map(() => {
	let rowArray = [];
	for (let column = 0; column < columns; column++) {
		rowArray.push(0);
	}
	return rowArray;
});
