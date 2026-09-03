const readDimension = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const initAwardProofDialog = () => {
  const dialog = document.querySelector('[data-award-dialog]');
  const triggers = Array.from(document.querySelectorAll('[data-award-proof]'));
  const panel = dialog?.querySelector('.award-dialog__panel');
  const closeButton = dialog?.querySelector('[data-award-dialog-close]');
  const title = dialog?.querySelector('[data-award-dialog-title]');
  const caption = dialog?.querySelector('[data-award-dialog-caption]');
  const image = dialog?.querySelector('[data-award-dialog-image]');

  if (!dialog || !panel || !closeButton || !title || !caption || !image || !triggers.length) return;

  let activeTrigger = null;
  let backdropPressStarted = false;

  const unlockPage = () => {
    document.documentElement.classList.remove('award-dialog-open');
  };

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  const openDialog = (trigger) => {
    if (typeof dialog.showModal !== 'function') {
      window.open(trigger.dataset.proofSrc, '_blank', 'noopener,noreferrer');
      return;
    }

    activeTrigger = trigger;
    title.textContent = trigger.dataset.proofTitle || '수상 증빙';
    caption.textContent = trigger.dataset.proofCaption || '수상 증빙 이미지입니다.';
    image.width = readDimension(trigger.dataset.proofWidth, 1240);
    image.height = readDimension(trigger.dataset.proofHeight, 1755);
    image.alt = `${title.textContent} 증빙 이미지`;
    image.src = trigger.dataset.proofSrc;

    document.documentElement.classList.add('award-dialog-open');
    if (!dialog.open) dialog.showModal();
    closeButton.focus({ preventScroll: true });
  };

  const onTriggerClick = (event) => {
    openDialog(event.currentTarget);
  };

  const onClose = () => {
    unlockPage();
    backdropPressStarted = false;

    const triggerToRestore = activeTrigger;
    activeTrigger = null;
    if (triggerToRestore?.isConnected) {
      triggerToRestore.focus({ preventScroll: true });
    }
  };

  const onPointerDown = (event) => {
    backdropPressStarted = dialog.open && !panel.contains(event.target);
  };

  const onDocumentClick = (event) => {
    if (dialog.open && backdropPressStarted && !panel.contains(event.target)) closeDialog();
    backdropPressStarted = false;
  };

  const onDialogKeyDown = (event) => {
    if (event.key !== 'Tab') return;

    const focusable = Array.from(dialog.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter((element) => !element.hidden && element.getClientRects().length > 0);

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable.at(-1);
    if (focusable.length === 1 || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus({ preventScroll: true });
    }
  };

  const onPageHide = () => {
    activeTrigger = null;
    closeDialog();
    unlockPage();
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', onTriggerClick));
  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('close', onClose);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('click', onDocumentClick, true);
  dialog.addEventListener('keydown', onDialogKeyDown);
  window.addEventListener('pagehide', onPageHide);

  return {
    destroy() {
      activeTrigger = null;
      closeDialog();
      unlockPage();
      triggers.forEach((trigger) => trigger.removeEventListener('click', onTriggerClick));
      closeButton.removeEventListener('click', closeDialog);
      dialog.removeEventListener('close', onClose);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('click', onDocumentClick, true);
      dialog.removeEventListener('keydown', onDialogKeyDown);
      window.removeEventListener('pagehide', onPageHide);
    }
  };
};
