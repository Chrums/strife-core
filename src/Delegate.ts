export type Constructor<T, DelegateType extends Delegate<T>> = new () => DelegateType;

export type Callback<T> = (trigger: T) => void;

export default class Delegate<T> {
    
    private callbacks: Callback<T>[] = [];
    
    public On(callback: Callback<T>): void {
        this.callbacks.push(callback);
    }
    
    public Emit(trigger: T): void {
        this.callbacks.forEach((callback: Callback<T>): void => callback(trigger));
    }
    
}