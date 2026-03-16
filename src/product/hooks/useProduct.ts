import { useContext } from 'react';
import ProductContext from '../contexts/ProductContext';

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct debe usarse dentro de un ProductProvider');
    }
    return context;
};
