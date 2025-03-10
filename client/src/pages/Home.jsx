import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import propertyImage from "@/assets/property-2.jpg";


const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section with Background Image */}
      
      <header className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${propertyImage})` }}>

        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-4xl md:text-6xl font-bold">Find Your Perfect Rental</h1>
          <p className="text-lg md:text-xl mt-4">
            Explore top listings in your city and rent your dream space today.
          </p>

          {/* Search Box */}
          <div className="flex mt-6 w-full max-w-lg bg-white rounded-full shadow-md overflow-hidden">
            <input
              type="text"
              placeholder="Search by location or property type..."
              className="flex-grow px-4 py-3 text-gray-700 focus:outline-none"
            />
            <button className="bg-[#D746B7] text-white px-6 py-3 flex items-center justify-center">
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </div>
      </header>

      {/* Signup and Signin Section */}
      <section className="py-12 px-6 md:px-12 flex flex-col items-center">
        <h2 className="text-6xl font-bold text-center mb-8">Join UrbanRent</h2>
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">You don't have account Signup</h3>
          {/* <Input type="text" placeholder="Full Name" className="mb-3" />
          <Input type="email" placeholder="Email Address" className="mb-3" />
          <Input type="password" placeholder="Password" className="mb-3" /> */}
          <Button className="w-full bg-[#D746B7] text-white">Sign Up</Button>
          <p className="text-center text-gray-600 mt-4">Already have an account? <a href="#" className="text-[#D746B7]">Sign In</a></p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-[#F9F9F9] py-12 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-8">Browse by Category</h2>
        <div className="flex justify-center gap-6">
          {["Apartments", "Houses", "Commercial Spaces"].map((category) => (
            <Button key={category} className="px-6 py-3 bg-gray-800 text-white rounded-lg">
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-6 md:px-12 text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
        <p className="text-gray-600 italic">"UrbanRent made finding a rental so easy! Highly recommended."</p>
        <p className="text-lg font-semibold mt-4">- Happy Renter</p>
      </section>
    </div>
  );
};

export default Home;
