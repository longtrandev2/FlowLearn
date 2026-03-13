import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.tsx'
import { startMockServer } from './mocks/browser'

// Start MSW in development mode
if (import.meta.env.DEV) {
  startMockServer()
    .then(() => {
      console.log('[MSW] Mock Service Worker started successfully')
    })
    .catch((error) => {
      console.error('[MSW] Failed to start Mock Service Worker:', error)
    })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router = {router}/>
  </StrictMode>,
)
