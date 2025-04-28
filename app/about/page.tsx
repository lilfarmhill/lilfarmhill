import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Lil Farm Hill Learning Village | Nature-Based Education',
  description: 'Lil Farm Hill Learning Village is a nature-based outdoor learning program supporting homeschool families. Discover our unique approach to education through nature.',
};

export default function About() {
  return (
    <div className="py-10">
      <section className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-light text-center mb-8 text-[#707070]">About Lil Farm Hill Learning Village</h1>
        
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl italic mb-10 text-[#707070]/80">
            Lil Farm Hill Learning Village is a nature-based outdoor learning program supporting homeschool families. 
            We believe that by nature we are all connected, curious, creative and capable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
          {/* Image Card 1 */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="relative h-56 w-full">
              <Image 
                src="https://images.unsplash.com/photo-1523240798612-9d0366c1e1a9"
                alt="Children learning in nature" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4 bg-gray-50">
              <h3 className="font-medium text-lg mb-2 text-[#707070]">Learning in Nature</h3>
              <p className="text-[#707070]/80">Our students explore and learn in a natural environment</p>
            </div>
          </div>

          {/* Image Card 2 */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="relative h-56 w-full">
              <Image 
                src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
                alt="Farm education" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 bg-gray-50">
              <h3 className="font-medium text-lg mb-2 text-[#707070]">Farm-Based Learning</h3>
              <p className="text-[#707070]/80">Hands-on experience with sustainable farming practices</p>
            </div>
          </div>

          {/* Image Card 3 */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="relative h-56 w-full">
              <Image 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
                alt="Outdoor classroom" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 bg-gray-50">
              <h3 className="font-medium text-lg mb-2 text-[#707070]">Outdoor Classroom</h3>
              <p className="text-[#707070]/80">Learning spaces that connect children with nature</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-100 p-8 rounded-lg my-10">
          <h2 className="text-2xl text-center mb-6 text-[#707070]">Our Core Beliefs</h2>
          <ul className="space-y-3">
            {[
              'We are all connected through nature',
              'Every child is naturally curious',
              'Creativity flourishes in natural environments',
              'All children are capable of amazing things',
              'Learning happens best through hands-on experience',
              'Nature provides the perfect classroom'
            ].map((belief, index) => (
              <li key={index} className="pl-8 relative before:content-['✓'] before:absolute before:left-0 before:text-green-600 text-[#707070]/80">
                {belief}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
} 