let promise = null;
let connectedLenis = null;

const connectLenis = async (ScrollTrigger) => {
  const { getLenis } = await import('./smooth-scroll.js');
  const nextLenis = getLenis?.() ?? null;
  if (nextLenis === connectedLenis) return;

  connectedLenis?.off?.('scroll', ScrollTrigger.update);
  connectedLenis = nextLenis;
  connectedLenis?.on?.('scroll', ScrollTrigger.update);
};

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

  const modules = await promise;
  await connectLenis(modules.ScrollTrigger);
  return modules;
};
