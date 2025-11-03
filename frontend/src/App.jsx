import { useState } from 'react'


import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>welcom to talent iq</h1>

      
      <SignedOut>
        <SignInButton mode = "redirect">
            <button>
              get started
            </button>
        </SignInButton>


      </SignedOut>

      <SignedIn>
        <SignOutButton>
          
        </SignOutButton>
      </SignedIn>

      <Toaster/>
    </>
  )
}

export default App
