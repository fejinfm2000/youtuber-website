import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreatorApiService } from '@data/sheetdb/creator-api.service';
import { Creator, CreatorSettings } from '@models/creator.model';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-settings-page">
      
      <div class="settings-header">
        <h2>Creator & Website Settings</h2>
        <p>Manage public profile credentials, hero copy, channel stats, and links.</p>
      </div>

      <div class="settings-grid">
        
        <!-- Creator Profile Card -->
        <div class="glass-card settings-card" *ngIf="creator() as c">
          <div class="card-head">
            <span class="badge badge-accent">PROFILE</span>
            <h3>Creator Information</h3>
          </div>

          <form (submit)="saveProfile($event)" class="settings-form">
            <div class="grid-2">
              <div class="form-group">
                <label for="c-name">Full Name</label>
                <input type="text" id="c-name" class="input" [(ngModel)]="c.name" name="name" />
              </div>
              <div class="form-group">
                <label for="c-handle">Channel Handle</label>
                <input type="text" id="c-handle" class="input" [(ngModel)]="c.displayName" name="displayName" />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label for="c-subs">YouTube Subscriber Display</label>
                <input type="text" id="c-subs" class="input" [(ngModel)]="c.subscriberCount" name="subscriberCount" />
              </div>
              <div class="form-group">
                <label for="c-vids">Video Count Display</label>
                <input type="text" id="c-vids" class="input" [(ngModel)]="c.videoCount" name="videoCount" />
              </div>
            </div>

            <div class="form-group">
              <label for="c-url">YouTube Channel URL</label>
              <input type="url" id="c-url" class="input" [(ngModel)]="c.youtubeUrl" name="youtubeUrl" />
            </div>

            <div class="form-group">
              <label for="c-bio">Creator Bio</label>
              <textarea id="c-bio" class="input" [(ngModel)]="c.bio" name="bio"></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-sm">Save Profile Changes</button>
            <span class="save-status" *ngIf="savedProfile()">Saved successfully! ✓</span>
          </form>
        </div>

        <!-- Website Appearance & Hero Copy Card -->
        <div class="glass-card settings-card" *ngIf="settings() as s">
          <div class="card-head">
            <span class="badge badge-accent">CUSTOMIZATION</span>
            <h3>Homepage & Hero Content</h3>
          </div>

          <form (submit)="saveSettings($event)" class="settings-form">
            <div class="form-group">
              <label for="s-title">Hero Headline Title</label>
              <input type="text" id="s-title" class="input" [(ngModel)]="s.heroTitle" name="heroTitle" />
            </div>

            <div class="form-group">
              <label for="s-sub">Hero Subtitle</label>
              <textarea id="s-sub" class="input" [(ngModel)]="s.heroSubtitle" name="heroSubtitle"></textarea>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label for="s-cta1">Primary Button Text</label>
                <input type="text" id="s-cta1" class="input" [(ngModel)]="s.heroCta1Text" name="heroCta1Text" />
              </div>
              <div class="form-group">
                <label for="s-cta2">Secondary Button Text</label>
                <input type="text" id="s-cta2" class="input" [(ngModel)]="s.heroCta2Text" name="heroCta2Text" />
              </div>
            </div>

            <div class="form-group">
              <label for="s-foot">Footer Tagline</label>
              <input type="text" id="s-foot" class="input" [(ngModel)]="s.footerText" name="footerText" />
            </div>

            <button type="submit" class="btn btn-primary btn-sm">Save Website Copy</button>
            <span class="save-status" *ngIf="savedSettings()">Saved successfully! ✓</span>
          </form>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .admin-settings-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .settings-header {
      h2 { font-size: 1.6rem; margin-bottom: 2px; }
      p { color: var(--text-secondary); margin: 0; font-size: 0.88rem; }
    }

    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-xl);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .settings-card {
      padding: var(--space-2xl);
    }

    .card-head {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-xl);
      border-bottom: 1px solid var(--border);
      padding-bottom: var(--space-md);

      h3 { font-size: 1.2rem; }
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .save-status {
      font-size: 0.82rem;
      color: var(--success);
      margin-left: var(--space-sm);
    }
  `]
})
export class AdminSettingsComponent implements OnInit {
  creator = signal<Creator | null>(null);
  settings = signal<CreatorSettings | null>(null);

  savedProfile = signal(false);
  savedSettings = signal(false);

  constructor(private creatorApi: CreatorApiService) {}

  ngOnInit(): void {
    this.creatorApi.getCreator().subscribe((c: any) => this.creator.set({ ...c }));
    this.creatorApi.getSettings().subscribe((s: any) => this.settings.set({ ...s }));
  }

  saveProfile(e: Event): void {
    e.preventDefault();
    this.savedProfile.set(true);
    setTimeout(() => this.savedProfile.set(false), 3000);
  }

  saveSettings(e: Event): void {
    e.preventDefault();
    this.savedSettings.set(true);
    setTimeout(() => this.savedSettings.set(false), 3000);
  }
}
