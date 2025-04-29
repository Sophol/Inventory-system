"use client";

import type React from "react";

import { useState } from "react";
import {
  FaEnvelope,
  FaMobileAlt,
  FaGlobeAmericas,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Add these interfaces at the top of your file, after the imports
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  fullName: boolean;
  email: boolean;
  phone: boolean;
  message: boolean;
}

// Update the useState declarations to use the interfaces
const Contact = ({ setting }: { setting: Setting }) => {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    fullName: false,
    email: false,
    phone: false,
    message: false,
  });

  // Update the handleChange function with TypeScript
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Replace the handleSubmit function with this TypeScript version
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const form = event.currentTarget;
    let isValid = true;
    const newErrors: FormErrors = {
      fullName: !formData.fullName,
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      phone: !formData.phone || !/^\d{10,12}$/.test(formData.phone),
      message: !formData.message,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      isValid = false;
    }

    setValidated(true);

    if (isValid) {
      // Form submission logic here
      console.log("Form submitted:", formData);
    }
  };

  return (
    <section className="py-10 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in <span className="text-primary-500">Touch</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please select a topic below related to your inquiry. If you
            don&apos;t find what you need, fill out our contact form.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Mail & Website Box */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
            <div className="flex items-start">
              <div className="bg-primary-100 p-4 rounded-full mr-4">
                <FaEnvelope className="text-primary-500 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Mail & Website</h3>
                <p className="flex items-center text-gray-600 mb-2">
                  <FaEnvelope className="mr-2" /> {setting.email}
                </p>
                <p className="flex items-center text-gray-600">
                  <FaGlobeAmericas className="mr-2" /> {setting.website}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Box */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
            <div className="flex items-start">
              <div className="bg-primary-100 p-4 rounded-full mr-4">
                <FaMobileAlt className="text-primary-500 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Contact</h3>
                <p className="flex items-center text-gray-600 mb-2">
                  <FaMobileAlt className="mr-2" /> {setting.phone}
                </p>
                <p className="flex items-center text-gray-600">
                  <FaMobileAlt className="mr-2" /> {setting.phone1}
                </p>
              </div>
            </div>
          </div>

          {/* Address Box */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 sm:col-span-2 lg:col-span-1 sm:mx-auto lg:mx-0">
            <div className="flex items-start">
              <div className="bg-primary-100 p-4 rounded-full mr-4">
                <FaMapMarkerAlt className="text-primary-500 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Address</h3>
                <p className="flex items-start text-gray-600">
                  <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                  {setting.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Map */}
          <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
            <iframe
              src={`//maps.google.com/maps?q=${setting.lat},${setting.lng}&z=15&output=embed`}
              className="w-full h-full border-0"
              title="Google Maps"
              loading="lazy"
            ></iframe>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-md border ${
                    validated && errors.fullName
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  id="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                {validated && errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter your full name.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  className={`w-full px-4 py-3 rounded-md border ${
                    validated && errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {validated && errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-md border ${
                    validated && errors.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  id="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {validated && errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a 10-12 digit phone number.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <textarea
                  className={`w-full px-4 py-3 rounded-md border ${
                    validated && errors.message
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  id="message"
                  rows={3}
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                {validated && errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter your message.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-500 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
