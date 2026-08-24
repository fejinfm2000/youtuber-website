import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-widgets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-widgets" aria-label="Floating widgets">
      <!-- AI Assistant button -->
      <div class="widget-container" [class.expanded]="aiOpen()">
        <div class="widget-panel" *ngIf="aiOpen()">
          <div class="widget-header">
            <div class="widget-title">
              <span class="widget-avatar">🤖</span>
              <div>
                <strong>Creator Assistant</strong>
                <span class="widget-status">AI-powered</span>
              </div>
            </div>
            <button class="widget-close" (click)="closeAi()" aria-label="Close AI assistant">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="widget-body ai-body">
            <p class="ai-greeting">Hi! What can I help you find?</p>
            <div class="ai-suggestions">
              <button class="ai-chip" id="ai-chip-videos">🎬 Find a video</button>
              <button class="ai-chip" id="ai-chip-products">🛒 Recommended products</button>
              <button class="ai-chip" id="ai-chip-tools">🔧 Creator's tools</button>
              <button class="ai-chip" id="ai-chip-resources">📚 Resources</button>
            </div>
          </div>
          <div class="widget-footer">
            <input type="text" class="widget-input" placeholder="Type a question..." id="ai-input">
            <button class="widget-send" id="ai-send-btn" aria-label="Send">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>

        <button class="fab ai-fab" (click)="toggleAi()" [class.active]="aiOpen()" id="ai-fab-btn" aria-label="Open AI assistant">
          <span *ngIf="!aiOpen()">🤖</span>
          <span *ngIf="aiOpen()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </span>
          <span class="fab-label" *ngIf="!aiOpen()">AI</span>
        </button>
      </div>

      <!-- Community Chat button -->
      <div class="widget-container" [class.expanded]="chatOpen()">
        <div class="widget-panel" *ngIf="chatOpen()">
          <div class="widget-header">
            <div class="widget-title">
              <span class="widget-avatar">💬</span>
              <div>
                <strong>Community Chat</strong>
                <span class="widget-status online">● Live</span>
              </div>
            </div>
            <button class="widget-close" (click)="closeChat()" aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="widget-body chat-body">
            <div class="chat-message">
              <span class="chat-avatar">R</span>
              <div class="chat-bubble">
                <span class="chat-name">Rahul</span>
                <p>Amazing video! 🔥</p>
              </div>
            </div>
            <div class="chat-message">
              <span class="chat-avatar">A</span>
              <div class="chat-bubble">
                <span class="chat-name">Anu</span>
                <p>Which microphone are you using?</p>
              </div>
            </div>
            <div class="chat-message">
              <span class="chat-avatar">J</span>
              <div class="chat-bubble">
                <span class="chat-name">John</span>
                <p>Great tutorial! Keep it up 🙌</p>
              </div>
            </div>
            <p class="chat-note">Sign in to join the conversation →</p>
          </div>
          <div class="widget-footer">
            <input type="text" class="widget-input" placeholder="Write a message..." id="chat-input">
            <button class="widget-send" id="chat-send-btn" aria-label="Send message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>

        <button class="fab chat-fab" (click)="toggleChat()" [class.active]="chatOpen()" id="chat-fab-btn" aria-label="Open community chat">
          <span *ngIf="!chatOpen()">💬</span>
          <span *ngIf="chatOpen()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .floating-widgets {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: flex-end;
      z-index: 400;
    }

    .widget-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
    }

    .widget-panel {
      width: 320px;
      background: var(--surface-solid);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      animation: slideUp 0.25s ease;

      @media (max-width: 480px) {
        width: calc(100vw - 48px);
      }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .widget-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }

    .widget-title {
      display: flex;
      align-items: center;
      gap: 10px;

      strong { font-size: 0.9rem; display: block; color: var(--text-primary); }
      .widget-avatar { font-size: 1.4rem; }
    }

    .widget-status {
      font-size: 0.72rem;
      color: var(--text-muted);
      &.online { color: var(--success); }
    }

    .widget-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: var(--radius-xs);
      display: flex;
      transition: color var(--transition-fast);
      &:hover { color: var(--text-primary); }
    }

    .widget-body {
      height: 260px;
      overflow-y: auto;
      padding: var(--space-md);
    }

    /* AI body */
    .ai-greeting { font-size: 0.9rem; color: var(--text-primary); margin-bottom: var(--space-md); }
    .ai-suggestions { display: flex; flex-direction: column; gap: var(--space-sm); }
    .ai-chip {
      text-align: left;
      padding: 10px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-fast);
      &:hover { background: var(--accent-soft); border-color: var(--accent); }
    }

    /* Chat body */
    .chat-message {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }
    .chat-avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--accent-soft);
      color: var(--accent);
      font-weight: 700;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .chat-bubble {
      .chat-name { font-size: 0.72rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 2px; }
      p { font-size: 0.875rem; color: var(--text-primary); background: var(--surface); padding: 8px 12px; border-radius: 0 var(--radius-sm) var(--radius-sm) var(--radius-sm); border: 1px solid var(--border); margin: 0; }
    }
    .chat-note { font-size: 0.78rem; color: var(--text-muted); text-align: center; margin-top: var(--space-sm); }

    /* Footer */
    .widget-footer {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-top: 1px solid var(--border);
    }

    .widget-input {
      flex: 1;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 8px 12px;
      font-size: 0.85rem;
      color: var(--text-primary);
      outline: none;
      font-family: inherit;
      &::placeholder { color: var(--text-muted); }
      &:focus { border-color: var(--accent); }
    }

    .widget-send {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-xs);
      background: var(--accent);
      border: none;
      color: #000;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--transition-fast);
      flex-shrink: 0;
      &:hover { background: var(--accent-hover); }
    }

    /* FAB */
    .fab {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-full);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      gap: 6px;
      transition: all var(--transition-base);
      box-shadow: var(--shadow-md);

      &:hover { transform: scale(1.08); box-shadow: var(--shadow-lg); }
      &:active { transform: scale(0.96); }
    }

    .ai-fab {
      background: var(--surface-solid);
      border: 1px solid var(--border);
      color: var(--text-primary);
      &.active { background: var(--surface-hover); }
    }

    .chat-fab {
      background: var(--accent);
      color: #000;
      &.active { background: var(--surface-solid); border: 1px solid var(--border); color: var(--text-primary); }
    }

    .fab-label {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  `]
})
export class FloatingWidgetsComponent {
  aiOpen = signal(false);
  chatOpen = signal(false);

  toggleAi(): void {
    const opening = !this.aiOpen();
    this.aiOpen.set(opening);
    if (opening) this.chatOpen.set(false);
  }

  toggleChat(): void {
    const opening = !this.chatOpen();
    this.chatOpen.set(opening);
    if (opening) this.aiOpen.set(false);
  }

  closeAi(): void { this.aiOpen.set(false); }
  closeChat(): void { this.chatOpen.set(false); }
}
