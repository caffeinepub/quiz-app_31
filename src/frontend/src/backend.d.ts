import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Entry {
    id: bigint;
    data: string;
    likes: bigint;
    timestamp: Time;
    isPublic: boolean;
}
export type Time = bigint;
export interface backendInterface {
    addToCollection(id: string, entryId: bigint): Promise<void>;
    createEntry(id: string, data: string): Promise<Entry>;
    createUser(id: string): Promise<boolean>;
    deleteEntry(entryId: bigint): Promise<void>;
    getAllEntries(): Promise<Array<Entry>>;
    getAllUsers(): Promise<Array<string>>;
    getEntry(entryId: bigint): Promise<Entry>;
    getUser(id: string): Promise<Array<bigint>>;
    getUserEntries(id: string): Promise<Array<Entry>>;
    isPublic(entryId: bigint): Promise<boolean>;
    likeEntry(id: string, entryId: bigint): Promise<void>;
    removeFromCollection(id: string, entryId: bigint): Promise<void>;
    saveImage(userId: string, name: string, blob: ExternalBlob): Promise<void>;
    saveVideo(userId: string, name: string, blob: ExternalBlob): Promise<void>;
    updateEntry(entryId: bigint, data: string): Promise<void>;
}
