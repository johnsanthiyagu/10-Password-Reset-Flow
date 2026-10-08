import React, { createContext, useContext, useState } from "react";
import { ClipLoader } from "react-spinners";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const loader = (value) => {
        setLoading(value);
    };
const loaderOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
};
    return (
        <LoaderContext.Provider value={{ loader }}>
            {children}

            {loading && (
                <div style={loaderOverlay}>
                    <ClipLoader
                        color="#ffffff"
                        loading={loading}
                        size={60}
                        aria-label="Loading Spinner"
                    />
                </div>
            )}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => {
    return useContext(LoaderContext);
};