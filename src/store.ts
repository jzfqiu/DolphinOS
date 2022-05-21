import { configureStore } from '@reduxjs/toolkit'
import systemSlice from './components/systemSlice'


export default configureStore({
  reducer: {
    system: systemSlice,
  }
})