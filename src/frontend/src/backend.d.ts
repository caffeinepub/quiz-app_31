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
export interface Question {
    id: string;
    categoryId: string;
    text: string;
    correctAnswer: bigint;
    options: Array<string>;
}
export type Time = bigint;
export interface Category {
    id: string;
    name: string;
}
export interface backendInterface {
    clearLeaderboard(): Promise<void>;
    forceReinitialize(): Promise<void>;
    getCategories(): Promise<Array<Category>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getQuestionById(questionId: string): Promise<Question>;
    getQuestionsByCategory(categoryId: string): Promise<Array<Question>>;
    initialize(): Promise<void>;
    submitScore(name: string, score: bigint, total: bigint, category: string): Promise<boolean>;
}
