type Timer = ReturnType<typeof setTimeout>;

function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: Timer;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export default debounce;
