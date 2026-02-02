export function createNestedObject<T extends object>(obj:T):T{
    const newObj = { value: obj, ...obj } as T;
    return new Proxy<T>(newObj, {
        get(obj, prop) {
        if (typeof prop === 'string' && prop.includes('.')) {
            return prop.split('.').reduce((acc: any, key) => acc?.[key], obj);
        }
        return (obj as any)[prop];
        },
    });
};