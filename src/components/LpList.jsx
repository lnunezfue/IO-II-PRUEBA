import { getOptionsLp } from "../helpers";
import { LpCard } from "./LpCard";

export const LpList = () => {
    const options = getOptionsLp(true);
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {
                options.map(option => (
                    <LpCard key={option.id} {...option} />
                ))
            }
        </div>
    )
}
