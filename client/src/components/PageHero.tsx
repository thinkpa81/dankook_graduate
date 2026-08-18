import { motion } from "framer-motion";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  objectPosition?: string;
  overlayClassName?: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  objectPosition = "50% 50%",
  overlayClassName = "bg-[#071B33]/70",
}: PageHeroProps) {
  return (
    <section
      className="relative isolate flex min-h-[260px] items-center overflow-hidden bg-[#0B2B50] text-white lg:min-h-[300px]"
      aria-labelledby="page-hero-title"
    >
      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
        decoding="async"
      />
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-4 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-2 text-base font-semibold tracking-wide text-cyan-300">{eyebrow}</p>
          <h1 id="page-hero-title" className="mb-4 text-4xl font-black text-white lg:text-5xl">
            {title}
          </h1>
          <p className="max-w-4xl whitespace-pre-line text-lg leading-relaxed text-slate-100">{description}</p>
        </motion.div>
      </div>
    </section>
  );
}
