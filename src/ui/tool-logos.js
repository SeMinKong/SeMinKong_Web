import {
  siCplusplus,
  siDocker,
  siFastapi,
  siGit,
  siLangchain,
  siNvidia,
  siOllama,
  siPython,
  siPytorch,
  siRos,
  siUbuntu
} from 'simple-icons';

const iconByName = {
  cplusplus: siCplusplus,
  docker: siDocker,
  fastapi: siFastapi,
  git: siGit,
  langchain: siLangchain,
  nvidia: siNvidia,
  ollama: siOllama,
  python: siPython,
  pytorch: siPytorch,
  ros: siRos,
  ubuntu: siUbuntu
};

const svgNamespace = 'http://www.w3.org/2000/svg';

const createIcon = (icon) => {
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS(svgNamespace, 'path');
  path.setAttribute('d', icon.path);
  svg.append(path);
  return svg;
};

export const initToolLogos = () => {
  document.querySelectorAll('[data-tool-icon]').forEach((mark) => {
    const icon = iconByName[mark.dataset.toolIcon];
    if (!icon) return;
    mark.replaceChildren(createIcon(icon));
    mark.classList.add('is-logo-ready');
  });
};
