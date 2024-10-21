import { useState } from "react"
import Editor from "../lib"

function App() {
  const [value, setValue] = useState("")
  return (
    <main>
      <Editor value={value} onChange={setValue} />
    </main>
  )
}

export default App
