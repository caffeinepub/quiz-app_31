import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    total: bigint;
    name: string;
    score: bigint;
    timestamp: Time;
    category: string;
    percentage: number;
}
export interface StockSignal {
    ticker: string;
    timeframe: string;
    name: string;
    entry: number;
    updatedAt: Time;
    target: number;
    strength: bigint;
    stoploss: number;
    signal: string;
    reason: string;
}
export interface Question {
    id: string;
    categoryId: string;
    text: string;
    correctAnswer: bigint;
    options: Array<string>;
}
export type Time = bigint;
export interface Post {
    id: string;
    content: string;
    tags: Array<string>;
    author: string;
    likes: bigint;
    timestamp: Time;
}
export interface Category {
    id: string;
    name: string;
}
export interface backendInterface {
    clearLeaderboard(): Promise<void>;
    createPost(author: string, content: string, tags: Array<string>): Promise<Post>;
    forceReinitialize(): Promise<void>;
    getCategories(): Promise<Array<Category>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getPosts(): Promise<Array<Post>>;
    getQuestionById(questionId: string): Promise<Question>;
    getQuestionsByCategory(categoryId: string): Promise<Array<Question>>;
    getStockSignals(): Promise<Array<StockSignal>>;
    initialize(): Promise<void>;
    likePost(postId: string): Promise<boolean>;
    submitScore(name: string, score: bigint, total: bigint, category: string): Promise<boolean>;
}
