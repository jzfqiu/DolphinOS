import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import systemSlice from "../slices/systemSlice";

function render(
  ui : any,
  {
    store = configureStore({ reducer: {system: systemSlice} }),
    ...renderOptions
  } = {}
) {
  function Wrapper({children}: any) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

function ReactMarkdown({ children }: any){
    return <>{children}</>;
  }

// re-export everything
export * from '@testing-library/react'
// override render method
export { render, ReactMarkdown}