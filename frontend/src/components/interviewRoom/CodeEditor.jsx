import Editor from "@monaco-editor/react";
import { LANGUAGE_CONFIG } from "../../data/language";
import { LuLoaderCircle, LuPlay } from "react-icons/lu";
import { IconBase } from "react-icons/lib";

const CodeEditor = ({selectedLanguage, code, isRunning, onLanguageChange, onCodeChange, onRunCode }) => {

  const icon = LANGUAGE_CONFIG[selectedLanguage]?.icon || null;

  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 boirder-t border-base-300">
        <div className="flex items-center gap-3">
            <div>{icon && <IconBase/>}</div>
             <select value={selectedLanguage} onChange={onLanguageChange}>
                {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => {
                    <option key={key} value={key}>
                        {lang.name}
                    </option>
                })}
             </select>
        </div>

        <button className="gap-2" disabled={isRunning} onClick={onRunCode}>
            {isRunning? (
                <>
                <LuLoaderCircle className="h-4 w-4 animate-spin"/>
                running...
                </>
            ) : (
                <>
                <LuPlay className="h-4 w-4" />
                Run Code
                </>
            )}
        </button>
      </div>

      <div className="flex-1">
        <Editor
         height={"100%"}
         language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
         value={code}
         onChange={onCodeChange}
         theme="vs-dark"
         options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout:true,
            minimap: { enabled: false},
         }}
         />
      </div>
    </div>
  )
}

export default CodeEditor
