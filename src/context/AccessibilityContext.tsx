"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AccessibilityContextType = {
    dyslexiaFont: boolean;
    setDyslexiaFont: (val: boolean) => void;
    textSize: "normal" | "large" | "xlarge";
    setTextSize: (val: "normal" | "large" | "xlarge") => void;
    textSpacing: "normal" | "wide" | "xwide";
    setTextSpacing: (val: "normal" | "wide" | "xwide") => void;
    reducedMotion: boolean;
    setReducedMotion: (val: boolean) => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [dyslexiaFont, setDyslexiaFont] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("lumiu-accessibility");
                return stored ? JSON.parse(stored).dyslexiaFont || false : false;
            } catch (e) { return false; }
        }
        return false;
    });

    const [textSize, setTextSize] = useState<"normal" | "large" | "xlarge">(() => {
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("lumiu-accessibility");
                return stored ? JSON.parse(stored).textSize || "normal" : "normal";
            } catch (e) { return "normal"; }
        }
        return "normal";
    });

    const [textSpacing, setTextSpacing] = useState<"normal" | "wide" | "xwide">(() => {
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("lumiu-accessibility");
                return stored ? JSON.parse(stored).textSpacing || "normal" : "normal";
            } catch (e) { return "normal"; }
        }
        return "normal";
    });

    const [reducedMotion, setReducedMotion] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("lumiu-accessibility");
                return stored ? JSON.parse(stored).reducedMotion || false : false;
            } catch (e) { return false; }
        }
        return false;
    });

    useEffect(() => {
        // Save to local storage
        localStorage.setItem("lumiu-accessibility", JSON.stringify({
            dyslexiaFont, textSize, textSpacing, reducedMotion
        }));

        // Apply classes to HTML element
        const html = document.documentElement;

        if (dyslexiaFont) html.classList.add("font-dyslexic");
        else html.classList.remove("font-dyslexic");

        html.classList.remove("text-size-normal", "text-size-large", "text-size-xlarge");
        html.classList.add(`text-size-${textSize}`);

        html.classList.remove("text-spacing-normal", "text-spacing-wide", "text-spacing-xwide");
        html.classList.add(`text-spacing-${textSpacing}`);

        if (reducedMotion) html.classList.add("reduced-motion");
        else html.classList.remove("reduced-motion");

    }, [dyslexiaFont, textSize, textSpacing, reducedMotion]);

    return (
        <AccessibilityContext.Provider value={{
            dyslexiaFont, setDyslexiaFont,
            textSize, setTextSize,
            textSpacing, setTextSpacing,
            reducedMotion, setReducedMotion
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error("useAccessibility must be used within an AccessibilityProvider");
    }
    return context;
}
