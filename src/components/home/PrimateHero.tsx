'use client';

const AnimatedPrimateText = () => {
  const letters = 'PRIMATE'.split('');

  return (
    <h1 className="text-[80px] md:text-[150px] lg:text-[200px] font-extrabold tracking-tight text-center text-white leading-none">
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block px-2 transform transition duration-300 ease-in-out hover:scale-125 hover:rotate-90 hover:text-red-600"
        >
          {letter}
        </span>
      ))}
    </h1>
  );
};

export default function PrimateHero() {
  return (
    <section className="bg-black min-h-screen px-4 py-24 flex flex-col items-center justify-center">
      <AnimatedPrimateText />
    </section>
  );
}
