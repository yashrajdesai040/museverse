import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    useGSAP,
    Flip,
    ScrollTrigger,
    ScrollToPlugin,
    Observer,
    TextPlugin,
    MotionPathPlugin,
    CustomEase,
    RoughEase,
    ExpoScaleEase,
    SlowMo
  );
}

export { gsap, useGSAP, ScrollTrigger };
