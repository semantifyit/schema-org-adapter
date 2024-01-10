import { CacheLiteral, CacheMap } from "../../types/types";
import { cloneJson } from "../general/cloneJson";

/** @ignore
 * RetrievalMemory is a singleton class that caches retrieved data
 */
export class RetrievalMemory {
  private static instance: RetrievalMemory;
  private cache: CacheMap;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    this.cache = new Map();
  }

  /**
   * get the only instance of this class (singleton)
   *
   * @returns the only instance of this class
   */
  public static getInstance(): RetrievalMemory {
    if (!RetrievalMemory.instance) {
      RetrievalMemory.instance = new RetrievalMemory();
    }
    return RetrievalMemory.instance;
  }

  /**
   * Sets data for a given entry name and commit (default is standard)
   * @param dataId - the id/name where to set the data
   * @param data - the data to set
   * @param commit - the commit to set the entry, defaults to "standard"
   */
  public setData(dataId: string, data: CacheLiteral, commit = "standard") {
    let entry = this.cache.get(commit);
    if (!entry) {
      entry = {};
      this.cache.set(commit, entry);
    }
    entry[dataId] = cloneJson(data);
  }

  /**
   * Sets data for a given entry name and commit (default is standard)
   * @param dataId - the entry name where to set the data
   * @param commit - the commit to set the entry, defaults to "standard"
   * @returns the data found
   */
  public getData(dataId: string, commit = "standard") {
    const entry = this.cache.get(commit);
    if (entry) {
      return cloneJson(entry[dataId]);
    }
    return undefined;
  }

  /**
   * Resets the cache Map -> all cached data is deleted
   */
  public deleteCache() {
    this.cache = new Map();
  }
}
