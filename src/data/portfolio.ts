/**
 * ============================================================================
 * Portfolio content — single source of truth for every carousel view.
 *
 * All copy, image paths, and section quips live here so the presentation
 * components stay purely visual. Image paths are served from /public, so
 * they resolve from the site root (e.g. /img/skills/fullstack1.jpg).
 * ============================================================================
 */

/** The four switchable sections of the site, in display order. */
export type ViewId = 'skills' | 'passions' | 'vitae' | 'works';

/** Display order for the tab bar and the sliding selection pill. */
export const VIEW_ORDER: ViewId[] = ['skills', 'passions', 'vitae', 'works'];

/* ----------------------------------------------------------------------------
 * Experience math — every "N+ years" label on the site is derived at runtime
 * from the year the work actually started, so the numbers age themselves and
 * never need a manual bump. Change a START_YEAR only if the history changes.
 * ------------------------------------------------------------------------- */

/**
 * Years elapsed since a given starting year, floored at 0.
 * Uses the live clock, so the site self-updates every January 1st.
 */
export const yearsSince = (startYear: number): number =>
    Math.max(0, new Date().getFullYear() - startYear);

/** Formats a start year as the "13+ years" subtitle used on the cards. */
export const yearsLabel = (startYear: number): string => `${yearsSince(startYear)}+ years`;

/** The year each long-running discipline began — the single source of truth. */
export const START_YEAR = {
    /** Overall professional software career — drives the hero bio number. */
    career: 2013,
    fullStack: 2015,
    machineLearning: 2018,
    gameEngines: 2015,
    cpp: 2013,
    typeScript: 2019,
    realtimeData: 2017,
    embedded: 2014,
} as const;

/** One card in the carousel — title, subtitle line, blurb, and 3 photos. */
export interface PortfolioItem {
    title: string;
    years: string;
    desc: string;
    images: string[];
    /** Optional external link, rendered as "Visit Site ↗" in the detail panel. */
    link?: string;
}

/* ----------------------------------------------------------------------------
 * Hero copy — name, tagline, and bio paragraph.
 * The name is revealed with a character-decode animation, so it also needs
 * to be available as a plain string for the animation target.
 * ------------------------------------------------------------------------- */
export const HERO_NAME = 'D Everett Hinton';
export const HERO_TAGLINE = 'Engineer & Pilot';
export const HERO_BIO =
    `I'm Everett, a results-driven professional and a software expert. With over ${yearsSince(START_YEAR.career)}+ years of experience across full-stack development, enterprise, film & VFX, & games— I excel at turning cross-disciplinary, ambitious ideas into reality and ensuring projects cross the finish line and actually launch. Once described as 'a one man wrecking crew', when I'm not shipping, I'm in the hangar building planes or in the cockpit flying. Let's talk how I can make your goals a reality as soon as (but no earlier than) tomorrow!`;

/** Resume download target — hosted alongside the site under /doc. */
export const RESUME_URL =
    'https://deveretthinton.net/doc/D%20Everett%20Hinton%20-%20Principal%20Engineer,%20Pilot%20-%2011-11-25.pdf';

/* ----------------------------------------------------------------------------
 * Section quips — the italic one-liner under the tab bar. The active quip
 * morphs between these with a scramble animation on every tab switch.
 * ------------------------------------------------------------------------- */
export const QUIPS: Record<ViewId, string> = {
    skills: 'They say a jack of all trades is a master of none... but better than a master of one. Good thing I mastered quite a few!',
    passions: 'People often ask me how I accomplish so much. The answer is, a lot of caffeine and very intense calendering.',
    vitae: 'Just a few highlights from my journey. For the full saga (and my caffeine consumption stats), check my CV or LinkedIn.',
    works: 'Things I built that actually shipped. Some making money, others making progress. Apps, avionics, and everything in between.',
};

/* ----------------------------------------------------------------------------
 * Professional skills — the default view.
 * ------------------------------------------------------------------------- */
export const SKILLS: PortfolioItem[] = [
    {
        title: 'Full-Stack Development',
        years: yearsLabel(START_YEAR.fullStack),
        desc: "From pixel-perfect, beautifully animated frontends— to scalable backends, I've built everything from mobile applications, to web panels, to AWS Lambda functions. Because sometimes you need to be a jack of all trades and a master of... well, most of them.",
        images: ['/img/skills/fullstack1.jpg', '/img/skills/fullstack2.jpg', '/img/skills/fullstack3.jpg'],
    },
    {
        title: 'Machine Learning & Python',
        years: yearsLabel(START_YEAR.machineLearning),
        desc: "Turning caffeine into weights & biases since before it was cool. I've used linear algebra + statistics to train models since 2016— when it was just a niche class in college, we didn't have PyTorch or TensorFlow!",
        images: ['/img/skills/ml1.jpg', '/img/skills/ml2.jpg', '/img/skills/ml3.jpg'],
    },
    {
        title: 'Unreal & Unity',
        years: yearsLabel(START_YEAR.gameEngines),
        desc: "As a passionate gamer, I've been using Unreal since UE3, and Unity just as long. From multiplayer VR experiences to Netflix VP pipeline tooling, I've probably broken & fixed every subsystem in both engines at least twice. Yes, even that one.",
        images: ['/img/skills/unreal1.jpg', '/img/skills/unreal2.jpg', '/img/skills/unreal3.jpg'],
    },
    {
        title: 'C++, C# & CUDA',
        years: yearsLabel(START_YEAR.cpp),
        desc: 'I am one of those weird people who adores C++. Because sometimes you need to make the computer do exactly what you want, down to the last bit— and when one core is not enough, CUDA kernels put a few thousand more to work. C# is easy by comparison!',
        images: ['/img/skills/cpp1.jpg', '/img/skills/cpp2.jpg', '/img/skills/cpp3.jpg'],
    },
    {
        title: 'TypeScript & JavaScript',
        years: yearsLabel(START_YEAR.typeScript),
        desc: "After years of using PHP, using modern libraries is easy by comparison. From using TypeScript to build scalable backends, to using JavaScript to build pixel-perfect frontends, I've got you covered. I mean, this website is proof, isn't it pretty?!",
        images: ['/img/skills/ts1.jpg', '/img/skills/ts2.jpg', '/img/skills/ts3.jpg'],
    },
    {
        title: 'Realtime Data',
        years: yearsLabel(START_YEAR.realtimeData),
        desc: "Virtual production at Netflix, wrangling cutting-edge camera tracking & sensor data on the LED volume. When being off by a single frame means a stage full of cast and crew standing around burning daylight, 'eventually consistent' isn't an answer— it has to land on time, every frame.",
        images: ['/img/skills/realtime1.jpg', '/img/skills/realtime2.jpg', '/img/skills/realtime3.jpg'],
    },
    {
        title: 'Embedded Systems',
        years: yearsLabel(START_YEAR.embedded),
        desc: 'Custom PCB design through ESP32 RISC-V firmware in proper C— or MicroPython when the deadline wins that argument (I scowl the entire time). Board layout, schematic, firmware, enclosure: I ship avionics end to end, from lidar altitude callouts to a software-defined radio decoding air traffic on a $23 chip.',
        images: ['/img/skills/embedded1.jpg', '/img/skills/embedded2.jpg', '/img/skills/embedded3.jpg'],
    },
    {
        title: 'CI/CD Pipeline',
        years: 'DevOps Evangelist',
        desc: 'I build end-to-end multi-platform deployment pipelines that would make a DevOps engineer shed tears of joy. Because the best deployments are the ones that happen smoothly, predictably, and without surprises or headaches.',
        images: ['/img/skills/cicd1.jpg', '/img/skills/cicd2.jpg', '/img/skills/cicd3.jpg'],
    },
    {
        title: 'XR/VR Development',
        years: 'Since the beginning!',
        desc: "I've had the privilege of developing with VR since its public inception with the Oculus DK1. From award-winning research projects to Skydance's Behemoth and LBE Transformers VR experiences, I've been making people motion sick (professionally) for years!",
        images: ['/img/skills/vr1.jpg', '/img/skills/vr2.jpg', '/img/skills/vr3.jpg'],
    },
    {
        title: 'Design & UI',
        years: 'UI Architect',
        desc: "My goal is to create interfaces that ensure Steve Jobs doesn't turn over in his grave. Because good UI is like a joke - if you have to explain it, it's probably not that good. I've been designing & implementing interfaces since 2009, and still learning!",
        images: ['/img/skills/ui1.jpg', '/img/skills/ui2.jpg', '/img/skills/ui3.jpg'],
    },
];

/* ----------------------------------------------------------------------------
 * Passions — planes, engineering, martial arts, and music.
 * ------------------------------------------------------------------------- */
export const PASSIONS: PortfolioItem[] = [
    {
        title: 'IFR Pilot',
        years: '250 hrs',
        desc: 'Licensed instrument-rated pilot with 250+ hours in the logbook, and a passion for flying 3000lb machines through the clouds blind!',
        images: ['/img/personal/pilot1.jpg', '/img/personal/pilot2.jpg', '/img/personal/pilot3.jpg'],
    },
    {
        title: 'Building Planes',
        years: 'Glasair III',
        desc: "Currently constructing a Glasair III. Because buying a plane is too easy, and who doesn't enjoy spending weekends covered in epoxy and aluminum shavings?",
        images: ['/img/personal/glasair1.jpg', '/img/personal/glasair2.jpg', '/img/personal/glasair3.jpg'],
    },
    {
        title: 'Mechanical Engineering',
        years: 'Design & Build',
        desc: 'From CAD to fabrication, bringing ideas to life through design and implementation. Sometimes the best solution is the one that makes other engineers say "you did what?"',
        images: ['/img/personal/mech1.jpg', '/img/personal/mech2.jpg', '/img/personal/mech3.jpg'],
    },
    {
        title: 'Electrical Engineering',
        years: 'Circuit Wizard',
        desc: 'Turning weird ideas into circuits since grade school. Specializing in embedded systems and trying not to let the magic smoke out of components.',
        images: ['/img/personal/ee1.jpg', '/img/personal/ee2.jpg', '/img/personal/ee3.jpg'],
    },
    {
        title: 'AutoCAD & F360',
        years: '3D Design',
        desc: 'Creating precision designs and technical drawings with the accuracy of a surgeon and the patience of a saint. I even build my own Fusion 360 plugins to bend the software to my will. Because sometimes, the 47th revision is the charm.',
        images: ['/img/personal/cad1.jpg', '/img/personal/cad2.jpg', '/img/personal/cad3.jpg'],
    },
    {
        title: 'Mixed Martial Arts',
        years: 'MMA & Powerlifting',
        desc: 'When you get out all of your violence in the morning, even if work is hectic, it seems easy by comparison. Muay Thai, Kickboxing, BJJ, powerlifting, and a passion for the beautiful art that is combat sports!',
        images: ['/img/personal/mma1.jpg', '/img/personal/mma2.jpg', '/img/personal/mma3.jpg'],
    },
    {
        title: 'Live Music',
        years: 'Musician',
        desc: 'Multi-instrumentalist proficient in piano, guitar, bass, and vocals. Making beautiful noise across four different instruments (and occasionally all at once).',
        images: ['/img/personal/music1.jpg', '/img/personal/music2.jpg', '/img/personal/music3.jpg'],
    },
    {
        title: 'Audio Engineering',
        years: 'Producer',
        desc: 'Taking sounds from "what was that?" to "how did you do that?" while making my CPU cry with effects chains that would make a supercomputer sweat.',
        images: ['/img/personal/audio1.jpg', '/img/personal/audio2.jpg', '/img/personal/audio3.jpg'],
    },
];

/* ----------------------------------------------------------------------------
 * Vitae — professional history, most recent first.
 * ------------------------------------------------------------------------- */
export const VITAE: PortfolioItem[] = [
    {
        title: 'Keeper Security',
        years: 'Vault Team',
        desc: "Building and maintaining Keeper's zero-knowledge encrypted vault — the core of the platform's password management, secrets storage, and privileged access management suite used by millions worldwide.",
        images: ['/img/work/keeper1.jpg', '/img/work/keeper2.jpg', '/img/work/keeper3.jpg'],
    },
    {
        title: 'Skydance Interactive',
        years: 'Senior Software Engineer',
        desc: 'Driving force in UE5 & C++ VR development for Oculus Quest, contributing to Behemoth beta launch and an unannounced title. Implemented multiplayer VR systems, replication, and AWS backend services.',
        images: ['/img/work/skydance1.jpg', '/img/work/skydance2.jpg', '/img/work/skydance3.jpg'],
    },
    {
        title: 'Black Box VR',
        years: 'Senior Backend Engineer',
        desc: 'Developed Unity VR systems for location-based fitness centers, integrating hardware resistance machines. Migrated backend to AWS Lambda using JS/TS and implemented XR gameplay features.',
        images: ['/img/work/blackbox1.jpg', '/img/work/blackbox2.jpg', '/img/work/blackbox3.jpg'],
    },
    {
        title: 'Netflix',
        years: 'Senior VFX Pipeline Engineer',
        desc: 'Developed Unreal Engine tools for virtual production VFX pipeline at Scanline VFX. Created synthetic data generation systems for ML models and integrated complex cross-disciplinary systems.',
        images: ['/img/work/netflix1.jpg', '/img/work/netflix2.jpg', '/img/work/netflix3.jpg'],
    },
    {
        title: 'Nextech3D.AI',
        years: 'Lead Unreal Architect',
        desc: 'Built web-based virtual events using Unreal Engine with AWS pixel streaming. Developed UI/UX, Node.js servers, and created custom materials and levels for client specifications.',
        images: ['/img/work/nextech1.jpg', '/img/work/nextech2.jpg', '/img/work/nextech3.jpg'],
    },
    {
        title: 'FCA Fiat Chrysler',
        years: 'Senior Game Developer',
        desc: 'Architected interactive features for CES car showcase using Unreal Engine. Created web-based immersive experience and AR companion apps for iOS/Android.',
        images: ['/img/work/fca1.jpg', '/img/work/fca2.jpg', '/img/work/fca3.jpg'],
    },
    {
        title: 'DMG Entertainment',
        years: 'Lead VR Engineer',
        desc: 'Spearheaded development of two Transformers VR attractions, managing global teams and hardware/software integration. Implemented multiplayer systems and mobile operator tools.',
        images: ['/img/work/dmg1.jpg', '/img/work/dmg2.jpg', '/img/work/dmg3.jpg'],
    },
    {
        title: 'Armstrong State University',
        years: 'Mathematics Researcher',
        desc: 'With the power of "elliptical curves over finite fields," we created cutting-edge primality-test algorithms using Python and SAGE.',
        images: ['/img/work/armstrong1.jpg', '/img/work/armstrong2.jpg', '/img/work/armstrong3.jpg'],
    },
];

/* ----------------------------------------------------------------------------
 * Works — shipped (and shipping) products, software and hardware alike.
 * ------------------------------------------------------------------------- */
export const WORKS: PortfolioItem[] = [
    {
        title: 'NihonDojo.ai',
        years: 'Language Learning App',
        link: 'https://nihondojo.ai',
        desc: 'Mobile app built with Flutter and Supabase. Typescript edge-function based AI integrations for sentence generation. Bleeding edge on-device Japanese TTS with Kokro and ONNX, plus custom FSRS algorithms.',
        images: ['/img/apps/nihondojo1.png', '/img/apps/nihondojo2.png', '/img/apps/nihondojo3.png'],
    },
    {
        title: 'MixMate.ai',
        years: 'Music Production Tool',
        link: 'https://mixmate.ai',
        desc: 'AI production assistant for Ableton via MPC Python bridge with AI cloud analysis through TS edge-functions. Cutting edge, custom, high performance on-device C++ libTorch models for audio processing & classification in realtime.',
        images: ['/img/apps/mixmate1.png', '/img/apps/mixmate2.png', '/img/apps/mixmate3.png'],
    },
    {
        title: 'ADSBin',
        years: 'ADS-B Receiver',
        link: 'https://novabox.works/product/adsbin-traffic-weather-gps-receiver/',
        desc: 'Software-defined radio built from scratch on a dual-core RISC-V ESP32-P4. USB High-Speed I/Q ingest at 2.4 Msps, hard-real-time Mode-S demodulation pinned to one core, CPR position solving on the other, then GDL90 traffic & weather straight to ForeFlight. No PC, no cloud, under $100.',
        images: ['/img/apps/adsbin1.jpg', '/img/apps/adsbin2.jpg', '/img/apps/adsbin3.jpg'],
    },
    {
        title: 'LidarAGL',
        years: 'Neuroaural Flare Advisor',
        link: 'https://novabox.works/product/lidaragl-neuroaural-flare-advisor/',
        desc: 'ESP32-S3 advisory AGL box for experimental aircraft: a belly-mounted lidar drives spoken height callouts and an ascending flare tone. Perceptual audio down to the ISO 226 equal-loudness curve, voice panned to the speech-dominant ear, and in-flight reboot recovery. Advisory only, engineered like it isn\'t.',
        images: ['/img/apps/lidaragl1.jpg', '/img/apps/lidaragl2.jpg', '/img/apps/lidaragl3.jpg'],
    },
    {
        title: 'ergoMAXX',
        years: 'Flight Stick Grip',
        link: 'https://novabox.works/ergomaxx/',
        desc: 'Open-source flight stick grip sculpted around the resting human hand, printed in carbon-fiber nylon. Trim buttons wire straight to the trim motors— no mixer, no controller, no middleman. Four-figure grip ergonomics without the four figures, and the STLs are free.',
        images: ['/img/apps/ergomaxx1.jpg', '/img/apps/ergomaxx2.jpg', '/img/apps/ergomaxx3.jpg'],
    },
    {
        title: 'UFly',
        years: 'Aviation Management (WIP)',
        desc: 'Comprehensive flight school management platform. Handle aircraft scheduling, student management, and flight sales all in one place. Built for aviation professionals.',
        images: ['/img/apps/ufly1.png', '/img/apps/ufly2.png', '/img/apps/ufly3.png'],
    },
    {
        title: 'BreathRep',
        years: 'Fitness Tracking (WIP)',
        desc: 'AI-powered fitness app that counts reps by analyzing your breathing patterns. Hands-free tracking with real-time audio processing and voice feedback through earphones. Uses a completely custom model with my own dataset to classify breathing.',
        images: ['/img/apps/breathrep1.png', '/img/apps/breathrep2.png', '/img/apps/breathrep3.png'],
    },
];

/** Resolve the item list for a given view — skills is the default/fallback. */
export const getItems = (view: ViewId): PortfolioItem[] => {
    switch (view) {
        case 'passions':
            return PASSIONS;
        case 'vitae':
            return VITAE;
        case 'works':
            return WORKS;
        default:
            return SKILLS;
    }
};
