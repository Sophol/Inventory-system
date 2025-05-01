import { assets } from "@/assets/assets";
import Image from "next/image";

const About = () => {
  return (
    <section className="py-10 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col xl:flex-row gap-8 items-center">
          {/* Image Column - Using Flexbox */}
          <div className="w-full xl:w-1/2">
            <div className="relative flex flex-wrap h-[500px]">
              {/* Main vertical image (v-img) */}
              <div className="w-[70%] h-full relative">
                <Image
                  src="https://images.unsplash.com/photo-1612839629080-4f2a1b5c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  alt="about"
                />
              </div>

              {/* Right side images container */}
              <div className="w-[50%] h-full absolute right-0 flex flex-col justify-between py-8">
                {/* First horizontal image (h-img) */}
                <div className="w-full h-[48%]">
                  <Image
                    src="https://images.unsplash.com/photo-1612839629080-4f2a1b5c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    alt="about details"
                  />
                </div>

                {/* Second horizontal image (h-img) */}
                <div className="w-full h-[48%]">
                  <Image
                    src="https://images.unsplash.com/photo-1612839629080-4f2a1b5c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    alt="about team"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="w-full xl:w-1/2 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                Who We <span className="text-primary-500">Are?</span>
              </h2>
              <p className="text-lg text-gray-700 font-medium">
                Mommy & Me Sale: Clothes, Shampoo & Vitamins for Kids - All on
                Sale!
              </p>
            </div>

            <p className="text-gray-600">
              Make parenting a little easier (and more affordable!) with the
              Mommy & Me Shop sale. We've got incredible deals on all the
              essentials for your kids. Find a wide selection of stylish and
              durable kid's clothes that they'll love to wear. Keep bath time
              tear-free with our specially formulated shampoo for kids, designed
              for their delicate skin and hair.
            </p>

            <p className="text-gray-600">
              And to help them grow up strong and healthy, we're offering
              discounts on essential vitamins for kids. At Mommy & Me Shop, we
              understand the needs of busy parents, and our sale is designed to
              help you save time and money while providing the best for your
              children. Shop now and see the savings!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
