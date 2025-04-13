import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import propertyImage from "@/assets/property-2.jpg";
import { useAuth } from "../../hooks";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect property owners to their dashboard
  useEffect(() => {
    if (user) {
      const userRole = parseInt(user.role);
      console.log("Home - User Role:", userRole, typeof userRole);
      
      if (userRole === 2) {
        console.log("Redirecting property owner to dashboard");
        navigate('/owner/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section with Background Image */}
      <header className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: `url(${propertyImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-4xl md:text-6xl font-bold">Find Your Perfect Rental</h1>
          <p className="text-xl md:text-2xl mt-6 max-w-2xl">
            Explore top listings in your city and rent your dream space today with UrbanRent.
          </p>

          {/* Search Box */}
          <div className="flex mt-8 w-full max-w-lg bg-white rounded-full shadow-md overflow-hidden">
            <input
              type="text"
              placeholder="Search by location or property type..."
              className="flex-grow px-4 py-3 text-gray-700 focus:outline-none"
            />
            <button className="bg-[#D746B7] text-white px-6 py-3 flex items-center justify-center">
              <FaSearch className="mr-2" /> Search
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-8">
            <Link to="/login">
              <Button className="bg-white text-[#D746B7] hover:bg-gray-100 px-8 py-2 text-lg font-semibold">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#D746B7] text-white hover:bg-[#c13da3] px-8 py-2 text-lg font-semibold">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose UrbanRent?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-[#D746B7] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">1</div>
            <h3 className="text-xl font-bold mb-3">Easy Search</h3>
            <p className="text-gray-600">Find properties that match your needs with our powerful search tools.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-[#D746B7] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">2</div>
            <h3 className="text-xl font-bold mb-3">Verified Listings</h3>
            <p className="text-gray-600">All our properties are verified to ensure you get what you see.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-[#D746B7] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">3</div>
            <h3 className="text-xl font-bold mb-3">Secure Transactions</h3>
            <p className="text-gray-600">Book and pay for properties with our secure payment system.</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-[#F9F9F9] py-16 px-6 md:px-12">
        <h2 className="text-4xl font-bold text-center mb-12">Browse by Category</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {["Apartments", "Houses", "Commercial Spaces", "Vacation Rentals"].map((category) => (
            <Button key={category} className="px-8 py-4 bg-gray-800 text-white rounded-lg text-lg">
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 md:px-12 text-center bg-white">
        <h2 className="text-4xl font-bold mb-12">What Our Clients Say</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-xl text-gray-600 italic">"UrbanRent made finding a rental so easy! The platform is intuitive, and I found my dream apartment within days. Highly recommended for anyone looking for a hassle-free rental experience."</p>
          <p className="text-lg font-semibold mt-6">- Sarah Johnson</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#D746B7] text-white py-16 px-6 md:px-12 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Rental?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of satisfied users who found their ideal homes with UrbanRent.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button className="bg-white text-[#D746B7] hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#D746B7] px-8 py-3 text-lg font-semibold">
              Sign Up
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6 md:px-12 text-center">
        <p> 2025 UrbanRent. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
