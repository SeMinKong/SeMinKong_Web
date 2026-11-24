const isOutsideDialog = (event, dialog) => {
  const rect = dialog.getBoundingClientRect();
  return (
    event.clientX < rect.left
    || event.clientX > rect.right
    || event.clientY < rect.top
    || event.clientY > rect.bottom
  );
};

export const initArchitectureLightbox = () => {
  const figures = Array.from(document.querySelectorAll('.case-architecture'));
  if (!figures.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'architecture-dialog';
  dialog.id = 'architecture-lightbox-dialog';
  dialog.setAttribute('closedby', 'any');
  dialog.setAttribute('data-lenis-prevent', '');
  dialog.setAttribute('aria-labelledby', 'architecture-dialog-title');

  const header = document.createElement('header');
  header.className = 'architecture-dialog__header';

  const heading = document.createElement('h1');
  heading.id = 'architecture-dialog-title';
  heading.className = 'architecture-dialog__title';
  heading.textContent = '시스템 구조도';

  const closeForm = document.createElement('form');
  closeForm.method = 'dialog';

  const closeButton = document.createElement('button');
  closeButton.type = 'submit';
  closeButton.className = 'architecture-dialog__close';
  closeButton.setAttribute('autofocus', '');
  closeButton.setAttribute('aria-label', '구조도 확대 창 닫기');
  closeButton.innerHTML = '<span aria-hidden="true">×</span>';
  closeForm.appendChild(closeButton);

  header.append(heading, closeForm);

  const stage = document.createElement('div');
  stage.className = 'architecture-dialog__stage';

  const previewImage = document.createElement('img');
  previewImage.className = 'architecture-dialog__image';
  previewImage.decoding = 'async';
  stage.appendChild(previewImage);

  const caption = document.createElement('p');
  caption.className = 'architecture-dialog__caption';

  dialog.append(header, stage, caption);
  document.body.appendChild(dialog);

  const cleanups = [];

  for (const figure of figures) {
    const img = figure.querySelector(':scope > img');
    if (!img) continue;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'case-architecture__trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    trigger.setAttribute('aria-label', `${img.alt || '시스템 구조도'} 크게 보기`);

    const hint = document.createElement('span');
    hint.className = 'case-architecture__hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = '크게 보기 ↗';

    const onOpen = () => {
      const fullSrc = img.currentSrc || img.src;
      if (typeof dialog.showModal !== 'function') {
        window.open(fullSrc, '_blank', 'noopener,noreferrer');
        return;
      }

      const pageTitle = document.querySelector('.case-hero h1')?.textContent?.trim();
      heading.textContent = pageTitle ? `${pageTitle} 구조도` : '시스템 구조도';
      previewImage.src = fullSrc;
      previewImage.alt = img.alt || '시스템 구조도';
      if (img.naturalWidth || img.width) previewImage.width = img.naturalWidth || img.width;
      if (img.naturalHeight || img.height) previewImage.height = img.naturalHeight || img.height;
      caption.textContent = img.alt || '';

      if (!dialog.open) dialog.showModal();
    };

    figure.classList.add('case-architecture--interactive');
    trigger.append(img, hint);
    figure.appendChild(trigger);
    trigger.addEventListener('click', onOpen);

    cleanups.push(() => {
      trigger.removeEventListener('click', onOpen);
      figure.classList.remove('case-architecture--interactive');
      figure.appendChild(img);
      trigger.remove();
    });
  }

  const onClose = () => {
    dialog.returnValue = '';
  };
  dialog.addEventListener('close', onClose);

  // Fallback for browsers without native closedby="any" support (e.g., Safari)
  let pressedOutside = false;
  const supportsClosedBy = 'closedBy' in HTMLDialogElement.prototype;
  const onPointerDown = (event) => {
    pressedOutside = dialog.open && isOutsideDialog(event, dialog);
  };
  const onPointerUp = (event) => {
    if (dialog.open && pressedOutside && isOutsideDialog(event, dialog)) {
      dialog.close();
    }
    pressedOutside = false;
  };
  if (!supportsClosedBy) {
    dialog.addEventListener('pointerdown', onPointerDown);
    dialog.addEventListener('pointerup', onPointerUp);
  }

  const onPageHide = () => {
    if (dialog.open) dialog.close();
  };
  window.addEventListener('pagehide', onPageHide);

  return {
    destroy() {
      if (dialog.open) dialog.close();
      dialog.removeEventListener('close', onClose);
      if (!supportsClosedBy) {
        dialog.removeEventListener('pointerdown', onPointerDown);
        dialog.removeEventListener('pointerup', onPointerUp);
      }
      window.removeEventListener('pagehide', onPageHide);
      for (const cleanup of cleanups) cleanup();
      dialog.remove();
    }
  };
};
