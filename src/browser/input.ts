/**
 * Keyboard input adapter mapping physical key events to session actions.
 * Conforms to B-CONTROLS requirements.
 */

export type ActionHandler = (action: string) => void;

export class KeyboardInputAdapter {
  private readonly target: HTMLElement;
  private readonly onAction: ActionHandler;
  private isAttached = false;

  constructor(target: HTMLElement, onAction: ActionHandler) {
    this.target = target;
    this.onAction = onAction;
    this.attach();
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    // Ignore key events with Ctrl, Alt, or Meta pressed per B-CONTROLS
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    // Never intercept Tab per B-CONTROLS
    if (event.key === 'Tab') {
      return;
    }

    let action: string | null = null;

    switch (event.code) {
      case 'ArrowLeft':
        action = 'moveLeft';
        break;
      case 'ArrowRight':
        action = 'moveRight';
        break;
      case 'ArrowDown':
        action = 'softDrop';
        break;
      case 'ArrowUp':
      case 'KeyX':
        action = 'rotateCW';
        break;
      case 'KeyZ':
        action = 'rotateCCW';
        break;
      case 'KeyP':
      case 'Escape':
        action = 'pause';
        break;
      case 'Enter':
        action = 'start';
        break;
      case 'KeyR':
        action = 'restart';
        break;
    }

    if (action) {
      // Prevent default scrolling for handled gameplay keys
      event.preventDefault();
      this.onAction(action);
    }
  };

  public attach(): void {
    if (!this.isAttached) {
      this.target.addEventListener('keydown', this.handleKeyDown);
      this.isAttached = true;
    }
  }

  public detach(): void {
    if (this.isAttached) {
      this.target.removeEventListener('keydown', this.handleKeyDown);
      this.isAttached = false;
    }
  }
}
