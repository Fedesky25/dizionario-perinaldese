<script>
    import { page } from '$app/stores';
</script>

<div>
    <h1>{$page.status}</h1>
    <p>{$page.error?.message}</p>
    <a href="/admin/dizionario">Torna indietro</a>
</div>

<style>
    @media (min-width: 24rem) {
        :global(body) {
            background-color: #f2f2f2;
        }
        div {
            width: 20rem;
            height: 20rem;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            padding: 3rem;
            background-color: white;
            background: #f2f2f2;
            border-radius: 3rem;
            box-shadow:  2rem 2rem 4rem #c9c9c9,
                        -2rem -2rem 4rem #ffffff;
            
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
    h1 {
        margin-top: -.5rem;
        font-size: 5rem;
        color: #666;
    }
    p {
        word-wrap: break-word;
        max-width: 100%;
        text-align: center;
    }
    a {
        display: inline-block;
        margin-top: auto;
        border-radius: .3rem;
        padding: .5rem .8rem;
        background-color: var(--olivina);
        color: white;
        text-decoration: none;
        font-weight: 500;
        box-shadow:  1rem 1rem 2rem #c9c9c9,
                    -1rem -1rem 2rem #ffffff;
    }
</style>
