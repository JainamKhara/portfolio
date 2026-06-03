import { loaderStore } from "./loaderStore";

export function useLoaderDone() {
  return loaderStore((state) => state.done);
}
