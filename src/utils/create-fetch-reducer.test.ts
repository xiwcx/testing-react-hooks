import { renderHook, act } from '@testing-library/react-hooks';
import { useReducer } from 'react';
import { createFetchReducer } from './create-fetch-reducer';

type Item = {
  id: string
}

const items: Item[] = [
  { id: '1'},
  { id: '2'},
  { id: '3'},
]

const initialState = {
  error: null,
  loading: true,
  data: [],
}

test('should return correct state after dispatch', () => {
  const { result } = renderHook(() => useReducer(createFetchReducer<Item>(), initialState))

  const [state, dispatch] = result.current;

  expect(state).toMatchSnapshot();

  act(() => dispatch({type: 'success', data: items}))

  expect(result.current[0]).toMatchSnapshot();

  act(() => dispatch({type: 'error', error: 'oh no!'}))

  expect(result.current[0]).toMatchSnapshot();

  act(() => dispatch({type: 'loading'}))

  expect(result.current[0]).toMatchSnapshot();
})
