import {createProvider} from './create-provider';
import {ICategory} from '../types';

const {Provider, useContext} = createProvider<ICategory>('Category');

export {Provider as CategoryProvider, useContext as useCategoryContext};
