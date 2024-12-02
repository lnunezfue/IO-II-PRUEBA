

export const Input = ({ id, label, type, value, onChange }) => {
    return (
        <div className="items-center inline px-2">
            <input type="text" id={id} className={`border py-2 rounded-md text-center ${type ? 'w-20' : 'w-14'} `}
                value={value}
                onChange={onChange}
            />
            <label htmlFor={id} className="pl-2 ">{label}</label>
        </div>
    )
}