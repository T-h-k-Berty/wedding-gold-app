"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { MapPin, Clock, Calendar, Phone, Mail, Heart, Volume2, VolumeX } from "lucide-react";

const weddingData = {
  wedding_details: {
    couple: {
      bride_name: "Tharu",
      groom_name: "Ishara",
      display_name: "Tharu & Ishara",
      initials: "T & I",
    },
    event_info: {
      date: "20 . 08 . 2026",
      formatted_date: "AUGUST 20, 2026", // Added for the simple footer
      time: "10:30 AM",
      year: "2026",
      countdown_target: "2026-08-20T10:30:00",
    },
    location: {
      venue: "Kingsbury Hotel",
      city: "Colombo",
      country: "Sri Lanka",
      google_map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.6766436852445!2d79.84131557499657!3d6.929215093070024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593b4a20b70b%3A0xc5cd80072cb066fb!2sThe%20Kingsbury%20Colombo!5e0!3m2!1sen!2slk!4v1714567890123!5m2!1sen!2slk", 
    },
    typography_and_quotes: {
      main_quote: "A journey of a thousand miles begins with a single step, and we're so incredibly happy to take it together.",
      hashtag: "#TharuAndIshara2026",
      spinning_footer_text: "THARU AND ISHARA • LOVE FOREVER",
    },
    contact_details: {
      contact_person: "Groom",
      phone_number: "+94 77 123 4567",
      email_address: "isharawedding@example.com",
    },
    itinerary_schedule: [
      { time: "09:30 AM", title: "Welcome & Guest Arrival", description: "Arrival of guests, welcome drinks, and finding seats." },
      { time: "10:30 AM", title: "Wedding Ceremony", description: "The beautiful moment we exchange our vows and rings." },
      { time: "12:30 PM", title: "Celebration Luncheon", description: "Join us for a grand festive feast and refreshments." },
      { time: "02:30 PM", title: "First Dance & Toasts", description: "Celebrating the newlyweds with heartfelt speeches and dancing." },
      { time: "04:00 PM", title: "Evening Party", description: "Hit the dance floor and make unforgettable memories with us." },
    ],
  },
};

const SectionDivider = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.8 }}
    className="flex items-center justify-center w-full my-16 md:my-24 opacity-80"
  >
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-600/50 to-yellow-600/50"></div>
    <div className="mx-4 text-yellow-600">✧</div>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-yellow-600/50 to-yellow-600/50"></div>
  </motion.div>
);

export default function WeddingInvitation() {
  const [step, setStep] = useState<"envelope" | "opening" | "website">("envelope");
  const { couple, event_info, location, typography_and_quotes, itinerary_schedule, contact_details } = weddingData.wedding_details;

  const [glitter, setGlitter] = useState<{ id: number; left: string; duration: string; delay: string; size: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Background Music State
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const bgAudio = new Audio('/wedding-music.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.5; 
    setAudio(bgAudio);

    return () => {
      bgAudio.pause();
    };
  }, []);

  useEffect(() => {
    if (step === "website") {
      const particles = Array.from({ length: 150 }).map((_, i) => ({
        id: i, left: `${Math.random() * 100}%`, duration: `${Math.random() * 3 + 4}s`, delay: `${Math.random() * 5}s`, size: `${Math.random() * 3 + 2}px`
      }));
      setGlitter(particles);

      const targetDate = new Date(event_info.countdown_target).getTime();
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance > 0) {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        } else {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, event_info.countdown_target]);

  const handleOpenEnvelope = () => {
    if (step !== "envelope") return;
    setStep("opening");

    if (audio) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio autoplay blocked by browser", e));
    }

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ["#D4AF37", "#C0C0C0", "#FFFFFF"];

    const frame = () => {
      if (animationEnd - Date.now() <= 0) return;
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
      requestAnimationFrame(frame);
    };
    frame();

    setTimeout(() => { setStep("website"); }, 4000);
  };

  const toggleAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <main className="min-h-screen w-full overflow-hidden relative">
      
      {/* Floating Music Toggle Button */}
      {step === "website" && (
        <button 
          onClick={toggleAudio}
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-yellow-200 text-yellow-700 hover:bg-yellow-50 transition-all ${isPlaying ? 'music-btn-active' : ''}`}
          aria-label="Toggle Music"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      )}

      {step === "website" && (
          <div className="glitter-rain pointer-events-none">
            {glitter.map((p) => (
              <div key={p.id} className="glitter-particle" style={{ left: p.left, width: p.size, height: p.size, animationDuration: p.duration, animationDelay: p.delay, top: '-10px' }} />
            ))}
          </div>
      )}

      <AnimatePresence mode="wait">
        {(step === "envelope" || step === "opening") && (
          <motion.div 
            key="envelope-view"
            className="absolute inset-0 flex items-center justify-center z-50 bg-[url('/envelope-bg.jpg')] bg-cover bg-center"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            <div className="relative z-10 flex flex-col items-center">
                <div 
                  className={`relative cursor-pointer w-80 md:w-96 h-60 md:h-72 transition-all duration-1000 ${step === "opening" ? "scale-110" : "hover:scale-105"}`}
                  onClick={handleOpenEnvelope}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg shadow-2xl"></div>
                  
                  <motion.div 
                    className="absolute left-4 right-4 bg-white rounded flex items-center justify-center text-center shadow-lg border border-gray-200 p-4"
                    initial={{ top: "15px", height: "85%", zIndex: 1 }}
                    animate={step === "opening" ? { top: "-140px", height: "130%", zIndex: 10 } : {}}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  >
                    <div className="space-y-3">
                      <p className="text-gray-500 font-serif text-sm tracking-widest uppercase">We are getting married</p>
                      <h1 className="font-playfair text-4xl text-gray-900 font-bold">{couple.bride_name}</h1>
                      <h1 className="font-playfair text-xl text-yellow-600 italic">&</h1>
                      <h1 className="font-playfair text-4xl text-gray-900 font-bold">{couple.groom_name}</h1>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-t-lg shadow-sm origin-top z-20"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                    initial={{ rotateX: 0 }}
                    animate={step === "opening" ? { rotateX: 180 } : {}}
                    transition={{ duration: 1 }}
                  />

                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-yellow-500 to-yellow-700 rounded-lg z-10"
                    style={{ clipPath: "polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)" }}
                  />
                  
                  {step === "envelope" && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                        <button className="bg-white/95 p-4 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-yellow-600 animate-bounce border-2 border-yellow-200 hover:bg-white hover:scale-110 transition-all">
                           <Heart className="w-7 h-7 fill-current drop-shadow-md" />
                        </button>
                    </div>
                  )}

                  {step === "envelope" && (
                     <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
                         <span className="text-white text-sm tracking-[0.2em] uppercase drop-shadow-lg font-medium">Click to Open</span>
                     </div>
                  )}
                </div>
            </div>
          </motion.div>
        )}

        {step === "website" && (
          <motion.div
            key="website-view"
            className="relative z-10 min-h-screen py-10 px-4 md:px-8 xl:px-16 flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            
            <div className="glass-panel w-full max-w-5xl rounded-[40px] p-8 md:p-16 flex flex-col items-center text-center shadow-2xl mt-10">
              
              {/* --- UPDATED HEADER SECTION --- */}
              <motion.div 
                variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative space-y-6 w-full flex flex-col items-center pt-8 pb-4"
              >
                  {/* Floating Gold Hearts Animation */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                     <motion.div animate={{ y: [0, -20, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-[15%] md:left-[25%] text-yellow-500 drop-shadow-md">
                        <Heart size={24} fill="currentColor" strokeWidth={0} />
                     </motion.div>
                     <motion.div animate={{ y: [0, -30, 0], scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 5, repeat: Infinity, delay: 1, ease: "easeInOut" }} className="absolute top-4 right-[15%] md:right-[25%] text-yellow-600 drop-shadow-md">
                        <Heart size={32} fill="currentColor" strokeWidth={0} />
                     </motion.div>
                     <motion.div animate={{ y: [0, -15, 0], scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5, ease: "easeInOut" }} className="absolute bottom-10 left-[20%] text-yellow-400 drop-shadow-md">
                        <Heart size={18} fill="currentColor" strokeWidth={0} />
                     </motion.div>
                     <motion.div animate={{ y: [0, -25, 0], scale: [0.9, 1.2, 0.9], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1.5, ease: "easeInOut" }} className="absolute bottom-20 right-[20%] text-yellow-500 drop-shadow-md">
                        <Heart size={22} fill="currentColor" strokeWidth={0} />
                     </motion.div>
                  </div>

                  {/* Names and Announcement */}
                  <div className="relative z-10 flex flex-col items-center">
                    <h1 className="font-playfair text-6xl md:text-8xl text-gray-900 font-extrabold tracking-tight drop-shadow-sm">
                        {couple.bride_name} 
                        <span className="text-yellow-600 font-light italic text-5xl md:text-7xl px-3 md:px-6">&</span> 
                        {couple.groom_name}
                    </h1>
                    
                    <div className="mt-8 flex flex-col items-center space-y-4">
                       <p className="font-lato text-sm md:text-base tracking-[0.4em] text-gray-500 uppercase font-bold">
                          Are Getting Married
                       </p>
                       <div className="w-16 h-[2px] bg-yellow-600/50 rounded-full"></div>
                       <p className="font-playfair text-2xl md:text-3xl text-gray-800 font-medium tracking-wider">
                          {event_info.date}
                       </p>
                    </div>
                  </div>
              </motion.div>
              {/* ----------------------------- */}

              <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] mx-auto overflow-hidden rounded-t-full border-4 border-white shadow-xl bg-gray-100 mt-12">
                   <img src="/couple-main.jpg" alt="Bride and Groom" className="w-full h-full object-cover"/>
                   <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              <p className="mt-12 text-xl md:text-2xl text-gray-700 font-light italic leading-relaxed max-w-2xl mx-auto">
                  "{typography_and_quotes.main_quote}"
              </p>

              <SectionDivider />

              {/* Countdown Timer */}
              <motion.div 
                variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
                className="w-full max-w-3xl"
              >
                <h2 className="font-playfair text-4xl text-gray-900 font-bold mb-10">Waiting for the big day...</h2>
                <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center bg-white/50 border border-white rounded-2xl py-6 shadow-sm">
                       <span className="text-4xl md:text-5xl font-playfair font-bold text-yellow-700">{item.value}</span>
                       <span className="text-xs md:text-sm font-lato text-gray-600 uppercase tracking-widest mt-2">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <SectionDivider />

              {/* Event Schedule */}
              <div className="w-full max-w-4xl">
                  <motion.h2 
                    variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="font-playfair text-5xl text-gray-900 font-extrabold mb-16"
                  >
                    Event Schedule
                  </motion.h2>

                  <div className="relative border-l-2 border-yellow-600/40 ml-4 md:ml-10 space-y-12 pb-4 text-left">
                    {itinerary_schedule.map((item, index) => (
                      <motion.div 
                        key={index} 
                        variants={slideInLeft} 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, amount: 0.5, margin: "-50px" }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-10 md:pl-16 group"
                      >
                        <div className="absolute -left-[11px] top-1.5 w-5 h-5 bg-white border-4 border-yellow-600 rounded-full group-hover:scale-125 transition-transform"></div>
                        
                        <div className="bg-white/40 border border-white rounded-2xl p-6 shadow-sm hover:bg-white/60 transition-colors">
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-1 rounded-full mb-3">{item.time}</span>
                          <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                          <p className="font-lato text-lg text-gray-700 font-light">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
              </div>

              <SectionDivider />

              {/* Map Layout Section */}
              <motion.div 
                variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                className="w-full max-w-5xl"
              >
                  <h2 className="font-playfair text-5xl text-gray-900 font-extrabold mb-16">The Venue</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                      <div className="p-4 bg-yellow-50 rounded-full text-yellow-600 mb-2">
                        <MapPin className="w-10 h-10" />
                      </div>
                      <p className="font-playfair text-4xl font-bold text-gray-900 leading-tight">
                        @ {location.venue} <br/>
                        <span className="text-2xl font-normal text-gray-700">{location.city}, {location.country}</span>
                      </p>
                      <p className="text-gray-600 font-lato leading-relaxed max-w-sm">
                        Join us at this beautiful venue to celebrate our union. Ample parking is available for all guests.
                      </p>
                    </div>

                    <div className="w-full h-80 md:h-[400px] rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-gray-200">
                        <iframe
                          src={location.google_map_embed_url}
                          width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                        ></iframe>
                    </div>
                  </div>
              </motion.div>

              <SectionDivider />

              {/* RSVP Section */}
              <motion.div 
                variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                className="w-full max-w-2xl bg-white/50 border border-white rounded-3xl p-8 md:p-12 shadow-sm"
              >
                  <h2 className="font-playfair text-4xl text-gray-900 font-bold mb-4">Kindly Respond</h2>
                  <h3 className="font-playfair text-2xl text-yellow-700 font-medium mb-6">Reserve Your Seat</h3>
                  <p className="text-gray-700 font-light mb-10">
                    Your presence means the world to us. Please kindly let us know if you will be able to join our celebration.
                  </p>

                  <form className="space-y-6 text-left">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 pl-1">Full Name</label>
                      <input type="text" className="w-full bg-white/80 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="John & Jane Doe" />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 pl-1">Number of Guests</label>
                      <div className="relative">
                        <select className="appearance-none w-full bg-white/80 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="3">3 Guests</option>
                          <option value="4">4 Guests</option>
                          <option value="5">5+ Guests</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-yellow-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="14" r="5"/><path d="M12 2l3 5h-6z"/>
                            </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 pl-1">Dietary Notes (Optional)</label>
                      <textarea className="w-full bg-white/80 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 h-24" placeholder="Any allergies or preferences..."></textarea>
                    </div>

                    <button type="button" className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-playfair font-bold text-xl py-4 rounded-xl hover:shadow-lg hover:from-yellow-700 hover:to-yellow-800 transition-all">
                      Send RSVP
                    </button>
                  </form>
              </motion.div>

              {/* --- UPDATED FOOTER SECTION --- */}
              <motion.div 
                variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                className="w-full mt-24 pt-10 border-t border-yellow-600/30 flex flex-col items-center"
              >
                  {/* Marquee Text */}
                  <div className="marquee-container mb-12">
                      <div className="marquee-text font-playfair text-2xl md:text-3xl text-yellow-700 tracking-[0.4em] font-bold uppercase">
                          {typography_and_quotes.spinning_footer_text}
                      </div>
                  </div>

                  {/* Contact Details */}
                  <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-gray-800 text-base font-medium mb-16">
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-5 h-5 text-yellow-600" /> {contact_details.phone_number} ({contact_details.contact_person})
                    </div>
                    <div className="hidden md:block w-2 h-2 rounded-full bg-yellow-600"></div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-5 h-5 text-yellow-600" /> {contact_details.email_address}
                    </div>
                  </div>

                  {/* Simple, Professional Bottom Design (Replacing Hashtag) */}
                  <div className="flex flex-col items-center justify-center text-center pb-8">
                     <h2 className="font-playfair text-4xl md:text-5xl text-gray-900 italic font-medium mb-4">
                         {couple.bride_name} & {couple.groom_name}
                     </h2>
                     <p className="font-lato text-xs md:text-sm tracking-[0.3em] text-gray-500 uppercase mb-3">
                         Are Getting Married
                     </p>
                     <p className="font-lato text-sm tracking-[0.2em] text-gray-800 uppercase font-medium">
                         {event_info.formatted_date}
                     </p>
                  </div>
              </motion.div>
              {/* ----------------------------- */}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}