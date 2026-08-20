let promise = null;

export const loadGsap = () => {
  promise ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger')
  ]).then(([gsapModule, triggerModule]) => {
    const gsap = gsapModule.gsap ?? gsapModule.default;
    const { ScrollTrigger } = triggerModule;
    gsap.registerPlugin(ScrollTrigger);
    import('./smooth-scroll.js').then(({ getLenis }) => {
      const lenis = getLenis?.();
      lenis?.on('scroll', ScrollTrigger.update);
    });
    return { gsap, ScrollTrigger };
  });
  return promise;
};
