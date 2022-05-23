import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import windowSlice from "../slices/windowSlice";
import iconSlice from '../slices/iconSlice';

function render(
  ui : any,
  {
    store = configureStore({ reducer: {window: windowSlice, icon: iconSlice} }),
    ...renderOptions
  } = {}
) {
  function Wrapper({children}: any) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }