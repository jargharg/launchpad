<template>
	<div id="app">
		<Launchpad />
		<TransportControls />
	</div>
</template>

<script>
import Launchpad from './components/Launchpad';
import TransportControls from './components/TransportControls';

export default {
	components: { Launchpad, TransportControls },
};
</script>

<style lang="scss">
html,
body {
	padding: 0;
	margin: 0;
}

* {
	box-sizing: border-box;
}

#app {
	height: 100vh;
	width: 100vw;
	font-family: monospace;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: #222;
}

.material-icons {
	font-family: 'Material Icons';
	font-weight: normal;
	font-style: normal;
	font-size: 24px; /* Preferred icon size */
	display: inline-block;
	line-height: 1;
	text-transform: none;
	letter-spacing: normal;
	word-wrap: normal;
	white-space: nowrap;
	direction: ltr;

	/* Support for all WebKit browsers. */
	-webkit-font-smoothing: antialiased;
	/* Support for Safari and Chrome. */
	text-rendering: optimizeLegibility;

	/* Support for Firefox. */
	-moz-osx-font-smoothing: grayscale;

	/* Support for IE. */
	font-feature-settings: 'liga';
}
</style>
