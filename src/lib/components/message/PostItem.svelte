<script lang="ts">
    import type { Post, VoteType } from "$lib/types";
    import { createEventDispatcher } from "svelte";
    import Button from "../generics/Button.svelte";
    import TextInput from "../generics/TextInput.svelte";
    import Comment from "./Comment.svelte";
    import { fly } from "svelte/transition";

    // take in a post object in order to "render" the Conpomnent
    export let post: Post;

    // content currently in the input field.
    let commentInput = "";

    // createEventDispatcher returns a function, which lets use dispatch custom events
    // stuff below in <...> is typescript generics to provide type info on our custom event
    const dispatch = createEventDispatcher<{
        // this is how to type eventDispatcher
        comment: {
            postid: string;
            content: string;
        };
        vote: {
            postid: string;
            type: VoteType;
        };
    }>();

    export let voteStatus: VoteType = undefined;

    export let disableComment = false;
</script>

<div class="messageParent" transition:fly={{ x: -50, duration: 500 }}>
    <!-- use the post obj to fill in the blanks -->
    <p id="userName">{post.userName}</p>
    <p>{post.content}</p>

    <div id="votes">
        <Button
            highLighted={voteStatus === "upvotes"}
            on:click={() => {
                dispatch("vote", {
                    type: "upvotes",
                    postid: post.id,
                });
            }}
        >
            👍 {post.upvotes}
        </Button>

        <Button
            highLighted={voteStatus === "downvotes"}
            on:click={() => {
                dispatch("vote", {
                    type: "downvotes",
                    postid: post.id,
                });
            }}
        >
            👎 {post.downvotes}
        </Button>
    </div>

    <div class="horiDivider" />

    <div class="comments">
        {#if post.replies.length > 0}
            {#each post.replies as comment (comment.id)}
                <Comment {comment} />
            {/each}
        {/if}
    </div>

    <div class="hori">
        <!-- extract the value variable and put it into a variable in this page so that we can interact with it. -->
        <TextInput
            placeholder="Comment here!"
            bind:value={commentInput}
            style="flex:1;"
            disabled={disableComment}
        />
        <Button
            disabled={disableComment}
            on:click={() => {
                // trigger the "comment" event on click
                if (commentInput.length > 0) {
                    dispatch("comment", {
                        postid: post.id,
                        content: commentInput,
                    });
                }
            }}>Submit</Button
        >
    </div>
</div>

<style>
    .messageParent {
        padding: 1rem;
        border: 2px solid var(--focus);
        background-color: var(--bg1);

        min-width: 400px;
        max-width: 400px;
    }

    #userName {
        margin-top: 0.25rem;
        font-weight: bold;
    }

    #votes {
        display: flex;
        gap: 0.5rem;
    }

    .horiDivider {
        height: 2px;
        width: auto;

        background-color: var(--focus);
        margin: 0.25rem;
    }

    .hori {
        display: flex;
        gap: 0.5rem;
    }

    .comments {
        display: flex;
        flex-direction: column;

        gap: 0.25rem;

        margin: 0.5rem;
        margin-left: 2rem;
    }
</style>
