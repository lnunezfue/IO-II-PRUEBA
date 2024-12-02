
export const Select = ({ id, options, value, onChange }) => {
    return (
        <div className="inline px-2">
            <select
                id={id}
                className="px-4 py-2 border rounded-md bg-white text-gray-800 shadow-sm focus:outline-none focus:border-blue-500"
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        value={option.value}
                    >{option.label}</option>
                ))}
            </select>
        </div>
    )
}
