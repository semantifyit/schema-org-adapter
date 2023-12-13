/** @ignore */
export const toArray = <T>(o: T | T[]): T[] => (Array.isArray(o) ? o : [o]);
