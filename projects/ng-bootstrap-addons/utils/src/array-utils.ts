export abstract class ArrayUtils {
    static containTheSameElements(arr1: any[], arr2: any[]): boolean {
        if(arr1.length !== arr2.length) return false;
        for (const [index, value] of arr1.entries()) {
            if(arr2.findIndex((value2, index2) => value2 === value && index2 === index) < 0) return false;
        }
        return true;
    }

    static isIdentical(arr1: any[], arr2: any[]): boolean {
        if(arr1.length !== arr2.length) return false;
        return JSON.stringify(arr1) === JSON.stringify(arr2);
    }

}