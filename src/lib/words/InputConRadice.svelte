<script context="module">
	import { browser } from "$app/environment";

	let w1 = 0.190, w2 = 0.494;
	if(browser) {
		setTimeout(()=>{
			let s = document.createElement('span');
			s.style.position = 'absolute';
			s.style.fontSize = '1rem';
			s.style.fontWeight = "500";
			const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
			document.body.appendChild(s);
			s.textContent = '|';
			w1 = s.getBoundingClientRect().width / rem - .03;
			s.textContent = '<';
			w2 = s.getBoundingClientRect().width / rem - .03;
			document.body.removeChild(s);
			console.log(`Widths computed:   | ${w1}em    < ${w2}em`);
		}, 1000);
	}
</script>

<!-- svelte-ignore module-script-reactive-declaration -->
<script lang="ts">
    export let radice: string;
	export let value: string;
	export let name: string;
	export let id: string|undefined = undefined;
	export let disabled = false;
	export let readonly = false;
	export let underline = true;
	let pre: string;
    let w: number;
	$: c = value.charCodeAt(0);
	$: switch(c) {
        case 124: 
            pre = radice;
            w = w1;
            break;
        case 60:
            pre = radice.slice(0, -1);
            w = w2;
            break;
        default:
            pre = '';
            w = 0;
    }
</script>

<label class="input-like" class:underline style="--w: {w}em;" class:disabled>
	<span>{pre}</span>
    <input
        {name} {id}
		{disabled}
		{readonly}
		bind:value={value}
		type="text"
		size={value.length + 1}
		autocapitalize="off"
		autocomplete="off">
</label>

<style>
	label {
		width: fit-content;
		display: flex;
        align-items: baseline;
	}
	label.disabled {cursor: not-allowed;}
	.underline {
		padding: 0 .2ch;
		border-bottom: 1px dashed #ccc;
		margin-bottom: -1px;
	}
	.underline:focus-within {
		border-color: var(--olivina);
	}
	span {
		color: #999;
		margin-right: calc(0px - var(--w));
		user-select: none;
	}
	input {
		border: 0;
		border-radius: 0;
		margin-bottom: 0;
		background: transparent;
		font-size: inherit;
		font-weight: inherit;
		padding: 0;
		clip-path: inset(0 0 0 var(--w));
	}
	input:focus {
		outline: none;
		box-shadow: none;
	}
	input:disabled,
	label.disabled > span {
		opacity: 0;
		cursor: not-allowed;
	}
</style>