import { optionMenu } from '../data/optionMenu';
export const getOptionsLp = (isActive) => {
    return optionMenu.filter(options => options.isActive === isActive);
}