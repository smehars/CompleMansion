

export interface Post {
    id: string;
    userName: string;
    content:string;
    
    upvotes:number;
    downvotes:number;

    replies: Comment[];
}

export interface Comment{
    id:string;
    userName:string;
    content:string;
}



export type VoteType = "upvotes"|"downvotes"|undefined;