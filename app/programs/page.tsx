import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Learning Village Programs | Nature-Based Education at Lil Farm Hill',
  description: 'Explore our Learning Village programs at Lil Farm Hill - nature-based outdoor educational experiences for homeschool families in Upper Ojai, California.',
  keywords: 'nature-based learning, outdoor education, homeschool programs, Learning Village, Ojai education',
};

export default function Programs() {
  // Program offerings with their details
  const programs = [
    {
      id: 'forest-explorers',
      title: 'Forest Explorers',
      ageRange: 'Ages 5-8',
      schedule: 'Tuesdays & Thursdays, 9am-1pm',
      description: 'Young learners discover the wonders of nature through guided exploration, sensory activities, storytelling, and outdoor play. They develop foundational naturalist skills while fostering curiosity and wonder.',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368',
      alt: 'Children exploring a forest trail with magnifying glasses'
    },
    {
      id: 'farm-stewards',
      title: 'Farm Stewards',
      ageRange: 'Ages 9-12',
      schedule: 'Mondays & Wednesdays, 9am-2pm',
      description: 'Students develop deeper connections with the land through hands-on farming, gardening, conservation projects, and ecological studies. This program emphasizes environmental stewardship and sustainable practices.',
      image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2',
      alt: 'Children working in a garden with plants and tools'
    },
    {
      id: 'wilderness-skills',
      title: 'Wilderness Skills',
      ageRange: 'Ages 10-14',
      schedule: 'Fridays, 9am-3pm',
      description: 'Our advanced program focuses on traditional skills, wilderness awareness, naturalist studies, and leadership development. Students learn primitive skills, tracking, foraging, and ecological relationships.',
      image: 'https://images.unsplash.com/photo-1496080174650-637e3f22fa03',
      alt: 'Teenagers learning outdoor survival skills by a campfire'
    }
  ];

  return (
    <div className="py-10">
      <section className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl  text-center mb-4 text-[#707070]">Learning Village Programs</h1>
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xl mb-6 text-[#707070]/80">
            Our nature-based learning experiences connect children with the natural world while supporting their academic, social, and emotional development.
          </p>
          <p className="text-lg text-[#707070]/80">
            All programs are designed to complement homeschool curricula and foster a deep connection to nature, community, and self-directed learning.
          </p>
        </div>

        {/* Program Offerings */}
        <div className="space-y-16 mb-16">
          {programs.map((program, index) => (
            <div key={program.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
              <div className="w-full md:w-1/2">
                <div className="relative h-72 w-full rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src={program.image}
                    alt={program.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-medium text-[#707070]">{program.title}</h2>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{program.ageRange}</span>
                  </div>
                  <p className="text-sm text-[#707070]/80 mb-4">{program.schedule}</p>
                  <p className="text-[#707070]/80 mb-6">{program.description}</p>
                  <Link href={`/programs/${program.id}`} className="inline-flex items-center text-green-600 hover:text-green-800">
                    Learn more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enrollment Section */}
        <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-sm my-10">
          <h2 className="text-2xl text-[#707070] text-center mb-6">Enrollment Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-3 text-[#707070]">Registration Process</h3>
              <ol className="list-decimal pl-5 space-y-2 text-[#707070]/80">
                <li>Complete our online application form</li>
                <li>Schedule a family visit to Lil Farm Hill</li>
                <li>Receive enrollment confirmation</li>
                <li>Complete registration paperwork and payment</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-3 text-[#707070]">Program Details</h3>
              <ul className="space-y-2 text-[#707070]/80">
                <li><span className="font-medium text-[#707070]">Location:</span> Lil Farm Hill, Upper Ojai, California</li>
                <li><span className="font-medium text-[#707070]">Session Length:</span> 10-week sessions (Fall, Winter, Spring)</li>
                <li><span className="font-medium text-[#707070]">Tuition:</span> Sliding scale options available</li>
                <li><span className="font-medium text-[#707070]">Capacity:</span> Limited to 12 students per program</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <a 
              href="#contact" 
              className="inline-block py-3 px-6 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors shadow-md"
            >
              Request Information
            </a>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto my-16">
          <h2 className="text-2xl text-center mb-8 text-[#707070]">What Families Say About Learning Village</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-lg">
                  S
                </div>
                <div className="ml-4">
                  <p className="font-medium text-[#707070]">Sarah M.</p>
                  <p className="text-sm text-[#707070]/80">Parent of two Forest Explorers</p>
                </div>
              </div>
              <p className="italic text-[#707070]/80">"The Learning Village program has transformed our children's relationship with nature. They've developed confidence, curiosity, and a deep respect for the environment that extends into all areas of their learning."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-lg">
                  J
                </div>
                <div className="ml-4">
                  <p className="font-medium text-[#707070]">James T.</p>
                  <p className="text-sm text-[#707070]/80">Parent of a Wilderness Skills participant</p>
                </div>
              </div>
              <p className="italic text-[#707070]/80">"The hands-on approach and skilled guides have helped our son develop practical skills alongside a deeper understanding of ecological systems. His confidence has soared since joining the program."</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 