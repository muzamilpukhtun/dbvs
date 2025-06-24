"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Loader from './components/Loader';

const Page = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for demonstration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-8 gap-8 bg-white dark:bg-black text-black dark:text-white transition-colors">
        {/* Left Section - Content */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold">Digital Voting System</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome to the future of secure voting with blockchain technology. Our distributed 
            voting system leverages the power of blockchain to ensure tamper-proof, transparent, 
            and verifiable elections. Experience the next generation of democratic participation 
            with military-grade security and the convenience of voting from anywhere.
          </p>
          <Link href='/login'>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </Link>
        </motion.div>
        {/* Right Section - Image */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 relative"
        >
          <Image
            src="/hero.png"
            alt="Digital Voting Illustration"
            width={600}
            height={400}
            className="object-contain w-full h-auto"
            priority
          />
        </motion.div>
      </div>

      {/* About Section */}
      <div className="py-16 px-4 md:px-12 text-black dark:text-white bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">How Our Blockchain Voting Works</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Immutable Vote Recording</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Each vote is recorded as a transaction on our blockchain network. Once recorded, 
                it becomes part of an immutable chain that cannot be altered or tampered with, 
                ensuring the integrity of every single vote.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Decentralized Security</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our system operates on a distributed network of nodes, eliminating single points 
                of failure. Every transaction is verified by multiple nodes, making it virtually 
                impossible to manipulate the voting results.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Transparent Verification</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All votes are publicly verifiable while maintaining voter privacy. Each voter 
                can verify their vote was counted correctly, and anyone can audit the entire 
                election process without compromising individual voter anonymity.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Military-Grade Encryption</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We implement advanced cryptographic techniques to secure the voting process. 
                Each vote is encrypted end-to-end, ensuring that only authorized participants 
                can access and verify the voting data.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Project Supervisor Section */}
      <div className="py-16 px-4 md:px-12 text-black dark:text-white bg-white dark:bg-black">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
        >
          {/* Left Content */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-2/3 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Project Supervisor</h2>
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">Afrasiab Kaikobad</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Senior Lecturer at Barani Institute of Information Technology (BIIT), Mr. Afrasiab Kaikobad brings extensive expertise in blockchain technology and distributed systems to our project. With his guidance, we've been able to develop a robust and innovative voting system that meets the highest standards of security and reliability.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              His experience in teaching advanced computing concepts and supervising numerous successful projects has been invaluable in shaping our blockchain-based voting solution. Under his mentorship, we've implemented cutting-edge technologies and best practices in software development.
            </p>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/3"
          >
            <div className="relative w-64 h-64 mx-auto">
              <Image
                src="/supervisor.png"
                alt="Afrasiab Kaikobad"
                fill
                className="rounded-full object-cover border-4 border-blue-500 shadow-xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Technologies Section */}
      <div className="py-16 px-4 md:px-12 text-black dark:text-white bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Technologies We Use</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              { name: 'Next.js', role: 'Frontend & Backend Framework', image: '/next.svg' },
              { name: 'Solana', role: 'Blockchain Platform', image: '/solana.png' },
              { name: 'Devnet', role: 'Development Network', image: '/solana.png' },
              { name: 'Anchor', role: 'Solana Framework', image: '/anchor.png' },
              { name: 'Redis', role: 'Caching Layer', image: '/redis' },
              { name: 'BullMQ', role: 'Queue Management', image: '/bull.png' },
              { name: 'Prisma', role: 'Database ORM', image: '/prisma.svg' },
              { name: 'PostgreSQL', role: 'Database', image: '/postgresql.png' },
              { name: 'Vercel', role: 'Deployment Platform', image: '/vercel.svg' },
              { name: 'GitHub', role: 'Version Control', image: '/github.png' },
              { name: 'React Native', role: 'Mobile App Framework', image: '/native.webp' }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center p-6 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 relative mb-4">
                  <Image
                    src={tech.image}
                    alt={`${tech.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center">{tech.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">{tech.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 md:px-12 text-black dark:text-white bg-white dark:bg-black">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Creators of This App</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Muzamil Khaan', role: 'Web Backend and Blockchain Developer', image: '/muzamil.jpg' },
              { name: 'Haroon Lone', role: 'Android Backend and Blockchain Developer', image: '/haroon.jpg' },
              { name: 'Shahmeer Ali', role: 'Android DB Integration Manager ', image: '/shahmeer.png' },
              { name: 'Mubashir Sohail', role: 'Front End Developer Mobile App', image: '/mubashir.png' },
              { name: 'Faseeh Ur Rehman Hadi', role: 'Front End Web Developer', image: '/faseeh.png' },
              { name: 'Hamza Shahzad', role: 'UI/UX Designer', image: '/hamza.png' }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center p-8 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="w-40 h-40 relative mb-6">
                  <Image
                    src={member.image}
                    alt={`${member.name}'s photo`}
                    fill
                    className="rounded-full object-cover border-4 border-blue-500"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Page;
