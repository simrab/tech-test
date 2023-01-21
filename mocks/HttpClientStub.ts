import { of } from 'rxjs';
export function asyncData<T>(data: T) {
  return of(data);
}

export const httpClientStub = {
  get: () => {
    of({});
  },
};
