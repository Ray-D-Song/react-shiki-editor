import { useEffect, useRef, useState } from "react"
import { createHighlighterCore } from 'shiki/core'
import { shikiCode } from "./editor/index"
import { autoload, hookClosingPairs, hookTab, ShikiCode } from "./editor/plugins"

interface EditorProps {
  value: string
  onChange: (value: string) => void
  theme?: "light" | "dark"
  language?: "json" | "typescript" | "javascript" | "tsx"
}

function Editor({value, onChange, theme, language}: EditorProps) {
  const shikiTheme = theme === "light" ? "github-light" : theme === "dark" ? "catppuccin-mocha" : "github-light"
  language = language ?? "json"

  const [loading, setLoading] = useState(true)
  const [editor, setEditor] = useState<ShikiCode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initEditor = async () => {
      setLoading(true)
      const h = await createHighlighterCore({
        langs: [
          import("shiki/langs/javascript.mjs"),
          import("shiki/langs/typescript.mjs"),
          import("shiki/langs/json.mjs"),
          import("shiki/langs/tsx.mjs")
        ],
        themes: [
          import("shiki/themes/catppuccin-mocha.mjs"),
          import("shiki/themes/github-light.mjs")
        ],
        loadWasm: import("shiki/wasm")
      })
      const newEditor = shikiCode()
        .withOptions({ tabSize: 2 })
        .withPlugins(hookClosingPairs(), hookTab, autoload)
        .create(containerRef.current!, h, {
          value,
          language,
          theme: shikiTheme,
        })
      setEditor(newEditor)
      setLoading(false)

      const textarea = containerRef.current?.querySelector("textarea")
      textarea?.addEventListener("input", () => {
        onChange(textarea.value)
      })
    }

    initEditor()

    return () => {
      editor?.dispose()
    }
  }, [])

  return (
    <div style={{ height: 500 }}>
      {loading && <div>Loading...</div>}
      <div ref={containerRef} style={{ height: "100%", visibility: loading ? "hidden" : "visible" }} />
    </div>
  )
}

export default Editor
