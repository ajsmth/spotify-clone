import {createProvider} from './create-provider';

const {Provider, useContext} = createProvider<ICategory>('Category');

export {Provider as CategoryProvider, useContext as useCategoryContext};
