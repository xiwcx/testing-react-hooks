type ReducerState<T> = {
  loading: boolean;
  error: string | null;
  data: T[];
}

type ReducerAction<T> =
  | {type: 'error', error: string}
  | {type: 'loading'}
  | { data: T[]; type: 'success'}

export const createFetchReducer = <T>() => (
  prevState: ReducerState<T>,
  action: ReducerAction<T>
): ReducerState<T> => {
  switch (action.type) {
    case 'error':
      return {
        loading: false,
        data: prevState.data,
        error: action.error,
      }
    case 'loading':
      return {
        loading: true,
        data: prevState.data,
        error: null,
      }
    case 'success':
      return {
        loading: false,
        data: action.data,
        error: null
      }
    default:
      return prevState;
  }
}
