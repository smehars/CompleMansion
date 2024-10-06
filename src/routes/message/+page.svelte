<script lang="ts">
    import Button from "$lib/components/generics/Button.svelte";
    import TextInput from "$lib/components/generics/TextInput.svelte";
    import PostItem from "$lib/components/message/PostItem.svelte";
    import {
        decreaseVote,
        getUserVotes,
        increaseVote,
        newComment,
        newPost,
        onPostChange,
    } from "$lib/firebase";
    import type { Post, VoteType } from "$lib/types";
    import { onMount } from "svelte";


    let _posts: { [id: string]: Post } = {
        "1": {
            id: "1",
            userName: "Alice",
            content: "Hello everyone!",
            downvotes: 0,
            upvotes: 10,
            replies: [
                {
                    id: "0",
                    userName: "David",
                    content: "Welcome welcome",
                },
            ],
        },

        "2": {
            id: "2",
            userName: "Bob",
            content: "Wee woo!",
            downvotes: 0,
            upvotes: 0,
            replies: [],
        },

        "3": {
            id: "3",
            userName: "Charlie",
            content: "Bee boop!",
            downvotes: 0,
            upvotes: 0,
            replies: [],
        },
    };

    let posts: { [id: string]: Post } = {};

    let postContent = "";

    async function addPost() {
        let post = {
            id: "",
            content: postContent,
            upvotes: 0,
            downvotes: 0,
            replies: [],
            userName: userName,
        };

        const createdPost = await newPost(post);
        console.log(createdPost);

        posts[createdPost.id] = createdPost;
        console.log(posts);
    }

    let upvoted: Set<string> = new Set(["1"]);
    let downvoted: Set<string> = new Set();

    function getVoteStatus(postId: string, upvoted: Set<string>, downvoted: Set<string>) {
        if (upvoted.has(postId)) {
            return "upvotes";
        }
        if (downvoted.has(postId)) {
            return "downvotes";
        }

        return undefined;
    }

    function updateVotes(postid: string, vote: VoteType) {
        // remove vote if there is already a vote selected
        const post = posts[postid];

        if (upvoted.has(post.id)) {
            upvoted.delete(post.id);
            post.upvotes -= 1;
            decreaseVote(userName, posts[postid], "upvotes");
        } else if (vote == "upvotes") {
            // increase if not previously increased
            upvoted.add(post.id);
            post.upvotes += 1;
            increaseVote(userName, posts[postid], vote);
        }

        if (downvoted.has(post.id)) {
            downvoted.delete(post.id);
            post.downvotes -= 1;
            decreaseVote(userName, posts[postid], "downvotes");
        } else if (vote === "downvotes") {
            // decrease if not previously decreased
            downvoted.add(post.id);
            post.downvotes += 1;
            increaseVote(userName, posts[postid], vote);
        }

        posts[postid] = post;

        // TODO report change to database
    }

    let userName = "Anon";

    async function addComment(postid: string, content: string) {
        // TODO adapt this for database
        const post = posts[postid];
        const comment = {
            id: "",
            userName,
            content,
        };
        const createdComment = await newComment(post, comment);
        post.replies.push(createdComment!);
        posts[postid] = post;
    }

    onMount(async () => {
        onPostChange((changedPosts) => {
            changedPosts.forEach((post) => {
                posts[post.id] = post;
            });
        });
    });

    $: if (userName) {
        getUserVotes(userName).then((userVotes) => {
            upvoted = new Set(userVotes.upvotes);
            downvoted = new Set(userVotes.downvotes);
        });
    }
</script>

<h1>My Message Board</h1>

<div style="display: flex; flex-direction:column; width:400px;">
    <TextInput label="My name is" placeholder="name here" bind:value={userName} />

    <div class="hori">
        <TextInput
            label="Post"
            placeholder="Body of your post here..."
            style="flex:1;"
            bind:value={postContent}
            disabled={userName.length == 0}
        />
        <Button
            disabled={userName.length == 0}
            on:click={() => {
                addPost();
            }}>
            Submit
        </Button>
    </div>
</div>

<div class="posts">
    {#each Object.values(posts) as post, index (post.id)}
        <PostItem
            {post}
            voteStatus={getVoteStatus(post.id, upvoted, downvoted)}
            on:vote={(e) => {
                updateVotes(e.detail.postid, e.detail.type);
            }}
            on:comment={(e) => {
                addComment(e.detail.postid, e.detail.content);
            }}
            disableComment={userName.length == 0}
        />
    {/each}
</div>

<!-- Import and put the TodoList Component here, and give it the list of todoItems. -->

<style>
    .hori {
        display: flex;
        gap: 0.5rem;
    }
    .posts {
        display: flex;
        flex-direction: column-reverse;
        gap: 0.5rem;
    }
</style>
