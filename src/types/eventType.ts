export interface EventType {
    name: string
    execute: (...args: any[]) => void | Promise<void>;
    once?: boolean
}