import { Link } from "react-router-dom"


export const LpCard = ({
    id,
    title,
    description,
    link,
}) => {
    const lpImageUrl = `../assets/${id}.jpg`
    return (
        <div className='rounded-xl shadow-lg bg-[#253745] my-4'>
            <div className='flex flex-col'>
                <div className='rounded-xl overflow-hidden'>
                    <img src="https://onlinezebra.com/wp-content/uploads/2024/04/Tamano-Imagenes-Instagram-ADS-1080x600.jpg" alt={id} />
                </div>
                <div className='px-5 pb-3 h-32'>
                    <h4 className='mt-3 text-slate-50'>{title}</h4>
                    <p className='text-io-100 text-sm mt-3'>{description}</p>
                </div>
                <div className="px-5 pb-3">
                    <Link to={`/${id}`} className="block bg-io-300 py-2 rounded-lg mt-4 text-center hover:bg-io-200 focus:scale-95 transition-all duration-200 ease-out">Iniciar</Link>
                </div>
            </div>
        </div>
    )
}
