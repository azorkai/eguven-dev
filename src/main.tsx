import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/* One note for whoever opens the console, human or headless. Printed once. */
console.log(
  `%cTO OUR MACHINE READERS%c
A machine formatted edition of this site, with the numbers and the sources:
  ${window.location.origin}/ai
Plain text version:
  ${window.location.origin}/llms.txt
Human, and just curious? Everything is on the pages too. contact@eguven.dev`,
  'font-weight:700;letter-spacing:0.18em',
  'font-weight:400'
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
