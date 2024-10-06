// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, increment, onSnapshot, query, QueryDocumentSnapshot, setDoc, updateDoc } from "firebase/firestore";
import type { Comment, Post, VoteType } from "./types";


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyB226b_ohVrR-WuVO5ZbG34-9pPIPrkaX8",

    authDomain: "sf-forum-demo.firebaseapp.com",

    projectId: "sf-forum-demo",

    storageBucket: "sf-forum-demo.appspot.com",

    messagingSenderId: "1084658864793",

    appId: "1:1084658864793:web:68ade01af57ce987935e08"

};


// Initialize Firebase

export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase)

export async function newPost(post: Post) {
    const docRef = await addDoc(collection(db, "posts"), {
        userName: post.userName,
        content: post.content,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        lastModified: Date.now()
    })

    const doc = (await getDoc(docRef));
    if (!doc.exists()) {
        console.log("Post not created.");
        throw "Error while creating post";
    }

    console.log(doc.data());

    return docToPost(doc,);
}

function docToPost(doc: QueryDocumentSnapshot,) {

    let post = doc.data();
    post.id = doc.id;

    post.replies = [];

    console.log(post);


    return post as Post;
}

export async function newComment(post: Post, comment: Comment): Promise<Comment | undefined> {
    const docref = await addDoc(collection(db, "posts", `${post.id}`, "comments"), {
        userName: comment.userName,
        content: comment.content
    })

    const commentDoc = (await getDoc(docref));
    if (!commentDoc.exists()) {
        console.log("Comment not created.");
        throw "Error while creating comment";
    }

    setDoc(doc(db, "posts", post.id,), {
        lastModified: Date.now()
    }, {
        merge: true
    })

    return docToComment(commentDoc);
}

function docToComment(doc: QueryDocumentSnapshot) {
    let comment = doc.data();
    comment.id = doc.id;
    console.log(JSON.parse(JSON.stringify(comment)));

    return comment as Comment;
}


export async function increaseVote(userName: string, post: Post, vote: VoteType) {

    if (vote === undefined) {
        return;
    }

    const voteRef = doc(db, "votes", userName);

    if (!((await getDoc(voteRef)).exists())) {
        await setDoc(voteRef, {
            upvote: [],
            downvote: []
        })
    }
    await updateDoc(voteRef, {
        [vote]: arrayUnion(post.id)
    })

    const postRef = doc(db, "posts", post.id)
    await updateDoc(postRef, {
        [vote]: increment(1)
    });
}


export async function decreaseVote(userName: string, post: Post, vote: VoteType) {
    if (vote === undefined) {
        return;
    }

    const voteRef = doc(db, "votes", userName);

    await updateDoc(voteRef, {
        [vote]: arrayRemove(post.id)
    })

    const postRef = doc(db, "posts", post.id)
    await updateDoc(postRef, {
        [vote]: increment(-1)
    });
}



async function fetchCommentsForPost(post: Post) {

    const comments = await getDocs(query(collection(db, "posts", post.id, "comments")));
    comments.forEach(comment => {
        post.replies.push(docToComment(comment));
    })
}




export async function getAllPosts() {
    const posts: { [id: string]: Post } = {};

    const postDocsResult = await getDocs(query(collection(db, "posts")));

    await Promise.all(postDocsResult.docs.map(async doc => {
        // convert each doc to a post
        const post = docToPost(doc);
        posts[doc.id] = post;
        await fetchCommentsForPost(post);
    }))
    return posts;
}

export async function onPostChange(callback: (posts: Post[]) => void) {
    const unsub = onSnapshot(query(collection(db, "posts")), async snap => {
        const posts: Post[] = [];
        await Promise.all(snap.docChanges().map(async change => {
            const post = docToPost(change.doc)
            posts.push(post);
            await fetchCommentsForPost(post)
        }))

        callback(posts);
    })
}


export async function getUserVotes(userName: string) {
    const userVoteDoc = await getDoc(doc(db, "votes", userName));

    if (!userVoteDoc.exists()) {
        return {
            upvotes: [],
            downvotes: []
        }
    } else {
        const data = userVoteDoc.data();

        return {
            upvotes: data["upvotes"] === undefined ? [] : data["upvotes"],
            downvotes: data["downvotes"] === undefined ? [] : data["downvotes"]
            ,
        }
    }
}
