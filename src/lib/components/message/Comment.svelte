


<script lang="ts">
    import type { Comment } from "$lib/types";
    import { fly } from "svelte/transition";

    
    export let comment : Comment;
</script>

<div class="commentContainer" transition:fly={{x:-50, duration:500}}>
    <p id="username">
        {comment.userName}
    </p>
    <span>{comment.content}</span>
</div>

<style>
    #username {
        font-weight: bold;
        margin: 0.4rem 0;
    }

    .commentContainer {
        padding: 0.5rem;
        background-color: var(--bg0);
        border: 2px solid var(--focus);
        border-radius: 3px;
    }
</style>