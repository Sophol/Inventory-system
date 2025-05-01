import Image from "next/image";

const About = () => {
  const image1 = "/uploads/homeSlides/baby_clothes.png";
  const image2 = "/uploads/homeSlides/kirkland.png";
  const image3 = "/uploads/homeSlides/smooth_lotion.jpg";
  return (
    <section className="py-10 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col xl:flex-row gap-8 items-center">
          {/* Image Column - Using Flexbox */}
          <div className="w-full xl:w-1/2">
            <div className="relative flex flex-wrap xl:h-[500px] h-[300px]">
              {/* Main vertical image (v-img) */}
              <div className="w-[60%] h-full relative">
                <Image
                  width={500}
                  height={500}
                  src={image1}
                  className="w-full h-full object-contain rounded-lg shadow-lg"
                  alt="about"
                />
              </div>

              {/* Right side images container */}
              <div className="w-[40%] h-full absolute right-0 flex flex-col justify-between px-2">
                {/* First horizontal image (h-img) */}
                <div className="w-full grid grid-rows-2 gap-2">
                  <Image
                    src={image2}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    alt="about details"
                  />
                  <Image
                    src={image3}
                    width={500}
                    height={500}
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
