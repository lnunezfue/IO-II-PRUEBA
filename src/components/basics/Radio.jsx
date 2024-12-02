import { createContext, useContext } from "react"

const RadioContext = createContext();

export const Radio = ({ children, ...props }) => {
    const { value, onChange } = useContext(RadioContext);
    return (
        <label
        className={`px-4 py-1 shadow rounded-lg cursor-pointer transition-all
        ${value===props.value?"bg-gradient-to-t from-violet-300 to-violet-200 text-violet-800 shadow-violet-500"
        :"bg-white hover:shadow-md shadow-gray-300"}`}
        >
            <input
                type="radio"
                className="hidden"
                checked={value === props.value}
                onChange={onChange}
                {...props}
            />
            {children}
        </label>
    )
}


export const RadioGroup = ({ value, onChange, children }) => {
    return (
        <RadioContext.Provider value={{ value, onChange }}>
            {children}
        </RadioContext.Provider>
    )
}

