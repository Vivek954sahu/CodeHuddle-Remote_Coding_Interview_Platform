import { DiJava, DiJavascript1, DiPython } from "react-icons/di";

export const LANGUAGE_CONFIG = {
    javascript: {
        name: "javascript",
        icon: `<DiJavascript1 className="h-6 w-6" />`,
        monacoLang: "javascript",
    },

    python: {
        name: "python",
        icon: `<DiPython className="h-6 w-6" />`,
        monacoLang: "python",
    },

    java: {
        name: "java",
        icon: `<DiJava className="h-6 w-6" />`,
        monacoLang: "java",
    },
};