export abstract class ArrayUtils {
    static containTheSameElements(arr1: any[], arr2: any[]): boolean {
        if(arr1.length !== arr2.length) return false;
        for (const item of arr1) {
            if(arr2.findIndex(i => i === item) < 0) return false;
        }
        return true;
    }
}