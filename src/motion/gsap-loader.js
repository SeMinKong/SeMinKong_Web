let promise = null;
let splitTextPromise = null;

export const loadGsap = async () => {
  if (!promise) {
    promise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger.js')
    ]).then(([gsapModule, triggerModule]) => {
      const gsap = gsapModule.gsap ?? gsapModule.default;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    }).catch((error) => {
      promise = null;
      throw error;
    });
  }

  return promise;
};

export const loadGsapWithSplitText = async () => {
  if (!splitTextPromise) {
    splitTextPromise = Promise.all([
      loadGsap(),
      import('gsap/SplitText.js')
    ]).then(([runtime, splitTextModule]) => {
      const SplitText = splitTextModule.SplitText ?? splitTextModule.default;
      runtime.gsap.registerPlugin(SplitText);
      return { ...runtime, SplitText };
    }).catch((error) => {
      splitTextPromise = null;
      throw error;
    });
  }

  return splitTextPromise;
};
