<script lang="ts">
    let state: -1|0|1 = 0, 
        text = 'Messaggio di feedback', 
        timer: ReturnType<typeof setTimeout>|null = null;
    
    function reset() {
        timer = null;
        state = 0;
    }
    function show(s: string, n: 1|-1) {
        state = n;
        text = s;
        if(timer) clearTimeout(timer);
        timer = setTimeout(reset, 2000);
    }
    
    export function good(text: string) { show(text, +1); }
    export function bad(text: string) { show(text, -1); }
</script>

<div class="feedback" data-state={state}>
    <svg viewBox="0 0 10 10">
        <rect x="0" y="0" width="10" height="10" rx="1.5" ry="1.5" fill="var(--olivina)"></rect>
        <path fill="none" stroke="white" stroke-linecap="round" d="M2.5,4.5 L5,7 L11,1"></path>
    </svg>
    <svg viewBox="0 0 10 10">
        <rect x="0" y="0" width="10" height="10" rx="1.5" ry="1.5" fill="var(--rosso)"></rect>
        <path fill="none" stroke="white" stroke-linecap="round" d="M2.5,2.5 L7.5,7.5"></path>
        <path fill="none" stroke="white" stroke-linecap="round" d="M2.5,7.5 L7.5,2.5"></path>
    </svg>
    <span>{text}</span>
</div>

<style>
    .feedback {
        position: fixed;
        top: 6rem;
        right: 0;
        z-index: 30;
        user-select: none;
        background-color: rgba(255,255,255,.4);
        background-color: rgb(54, 50, 80);
        padding: 1ch;
        padding-right: 2ch;
        box-shadow: 0 0 20px rgba(0,0,0,.12);
        border-top-left-radius: var(--small-radius);
        border-bottom-left-radius: var(--small-radius);
        display: flex;
        align-items: center;
        transform: translateX(0);
        transition: transform .2s ease-out;
    }
    [data-state="0"] {transform: translateX(calc(100% + 20px));}
    svg {
        display: none;
        height: 1.4rem;
    }
    [data-state="1"] > svg:first-child,
    [data-state="-1"] > svg:last-of-type {display: inline;}
    span {
        color: white;
        font-size: 1.05rem;
        font-weight: 500;
        margin-left: 1ch;
    }
</style>