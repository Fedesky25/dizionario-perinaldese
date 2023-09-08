<div class="outer">
    <div class="inner">
        <slot />
    </div>
</div>

<style>
    .outer {
        max-height: 100%;
    }
    @media (max-width: 100ch) {
        .outer {
            overflow: scroll;
        }
    }
    @media (min-width: 100ch) {
        .outer {
            background-color: white;
            border-radius: 1rem;
            box-shadow: 0 0 45px #0001;
            padding: 1rem;
            
            /* https://stackoverflow.com/questions/27784727/how-to-make-child-div-scrollable-when-it-exceeds-parent-height */
            display: flex;
            flex-direction: column;
        }
        .inner {
            overflow-y: scroll;
            max-height: 100%;
            scrollbar-width: thin;
            scrollbar-color: #e1e1e1 transparent;
            /* overscroll-behavior: none; */
        }
    }
</style>