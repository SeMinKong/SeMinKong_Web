let promise = null;

export const loadGsap = async () => {
  promise ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger.js')
  ]).then(([gsapModule, triggerModule]) => {
    const gsap = gsapModule.gsap ?? gsapModule.default;
    const { ScrollTrigger } = triggerModule;
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });

  return promise;
};
