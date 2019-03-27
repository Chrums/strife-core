export type Constructor<T, DelegateType extends Delegate<T>> = new () => DelegateType;

export type Callback<T> = (trigger: T) => void;

export default class Delegate<T> {
    
    private m_callbacks: Callback<T>[] = [];
    
    public on(callback: Callback<T>): void {
        this.m_callbacks.push(callback);
    }
    
    public emit(trigger: T): void {
        this.m_callbacks.forEach((callback: Callback<T>): void => callback(trigger));
    }
    
}