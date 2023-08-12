<div class="track">
    <div class="fluid"></div>
</div>

<style>
    .track {
        width: var(--loading-width, 100%);
        background-color: #ccc;
        height: .125rem;
        border-radius: .25rem;
        overflow: hidden;
    }
    .fluid {
        background-color: var(--rosso);
        height: 100%;
        width: 100%;
        animation: brooom .5s ease-in-out infinite;
    }

    @keyframes brooom {
        0% {
            clip-path: inset(0 100% 0 0);
        }
        50% {
            clip-path: inset(0);
        }
        100% {
            clip-path: inset(0 0 0 100%);
        }
    }
</style>