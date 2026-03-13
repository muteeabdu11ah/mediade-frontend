'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface BreadcrumbContextType {
    /** Map of dynamic path segments (e.g. a UUID) to display labels */
    dynamicLabels: Record<string, string>;
    /** Set a label for a dynamic segment */
    setDynamicLabel: (segment: string, label: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
    dynamicLabels: {},
    setDynamicLabel: () => { },
});

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
    const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});

    const setDynamicLabel = useCallback((segment: string, label: string) => {
        setDynamicLabels((prev) => {
            if (prev[segment] === label) return prev;
            return { ...prev, [segment]: label };
        });
    }, []);

    return (
        <BreadcrumbContext.Provider value={{ dynamicLabels, setDynamicLabel }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}

export function useBreadcrumbContext() {
    return useContext(BreadcrumbContext);
}
