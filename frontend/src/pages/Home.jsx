import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Components
import Hero from '../components/Layout/Hero';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturedSection from '../components/Products/FeaturedSection';

// Redux Thunks
import { fetchProductsByFilters } from '../redux/slices/productsSlice'; // صححت الاسم

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: 'female',
        category: 'Bottom Wear',
        limit: 8,
      })
    );

    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (err) {
        console.error('Error fetching best seller product:', err);
      }
    };

    fetchBestSellers();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">Loading best seller product...</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <FeaturedSection />
    </div>
  );
};

export default Home;
