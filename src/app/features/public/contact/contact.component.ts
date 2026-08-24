import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../../core/services/seo.service';
import { BusinessEnquiry } from '../../../core/models/community.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-page">
      <section class="section">
        <div class="container contact-layout">
          
          <!-- Left Info Column -->
          <div class="contact-info-col">
            <span class="badge badge-accent">GET IN TOUCH</span>
            <h1 class="contact-title">Let's Build & Collaborate</h1>
            <p class="contact-lead">
              Interested in video sponsorships, dedicated tool reviews, conference keynotes, or consulting? Send a message and let's discuss details.
            </p>

            <div class="contact-points">
              
              <div class="glass-card contact-point-card">
                <div class="point-icon">🤝</div>
                <div>
                  <h4>Sponsorships & Dedicated Videos</h4>
                  <p>Reach 2.4M+ engaged tech professionals and software engineers.</p>
                </div>
              </div>

              <div class="glass-card contact-point-card">
                <div class="point-icon">🎙️</div>
                <div>
                  <h4>Speaking & Workshops</h4>
                  <p>Keynotes on Modern AI tools, full-stack engineering, and developer ergonomics.</p>
                </div>
              </div>

              <div class="glass-card contact-point-card">
                <div class="point-icon">⚡</div>
                <div>
                  <h4>Quick Turnaround</h4>
                  <p>All genuine business enquiries are reviewed within 24-48 business hours.</p>
                </div>
              </div>

            </div>
          </div>

          <!-- Right Form Column -->
          <div class="contact-form-col">
            <div class="glass-card form-card">
              
              <div *ngIf="!submitted()">
                <h3 class="form-title">Send a Business Enquiry</h3>
                <p class="form-sub">Fill out the details below to start the conversation.</p>

                <form (submit)="onSubmit($event)" class="enquiry-form">
                  
                  <div class="grid-2">
                    <div class="form-group">
                      <label for="contact-name">Your Full Name *</label>
                      <input 
                        type="text" 
                        id="contact-name" 
                        class="input" 
                        [(ngModel)]="formData.name" 
                        name="name" 
                        placeholder="e.g. Sarah Jenkins" 
                        required 
                      />
                    </div>

                    <div class="form-group">
                      <label for="contact-company">Company / Brand Name</label>
                      <input 
                        type="text" 
                        id="contact-company" 
                        class="input" 
                        [(ngModel)]="formData.company" 
                        name="company" 
                        placeholder="e.g. Acme Tech" 
                      />
                    </div>
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label for="contact-email">Business Email Address *</label>
                      <input 
                        type="email" 
                        id="contact-email" 
                        class="input" 
                        [(ngModel)]="formData.email" 
                        name="email" 
                        placeholder="sarah@acme.com" 
                        required 
                      />
                    </div>

                    <div class="form-group">
                      <label for="contact-website">Website URL</label>
                      <input 
                        type="url" 
                        id="contact-website" 
                        class="input" 
                        [(ngModel)]="formData.website" 
                        name="website" 
                        placeholder="https://acme.com" 
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="contact-type">Enquiry Type *</label>
                    <select id="contact-type" class="input" [(ngModel)]="formData.enquiryType" name="enquiryType">
                      <option value="SPONSORSHIP">YouTube Video Sponsorship / Integration</option>
                      <option value="PRODUCT_PROMOTION">Product Review / Recommendation</option>
                      <option value="COLLABORATION">Content Collaboration / Podcast</option>
                      <option value="SPEAKING">Speaking / Conference / Workshop</option>
                      <option value="MEDIA">Media & Press Enquiry</option>
                      <option value="OTHER">General Business</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="contact-message">Message & Details *</label>
                    <textarea 
                      id="contact-message" 
                      class="input" 
                      [(ngModel)]="formData.message" 
                      name="message" 
                      placeholder="Tell us about the project, expected timeline, and budget..." 
                      required
                    ></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary btn-lg" id="submit-enquiry-btn">
                    Submit Business Enquiry →
                  </button>
                </form>
              </div>

              <!-- Success State -->
              <div class="success-box animate-fade-in" *ngIf="submitted()">
                <div class="success-icon">🎉</div>
                <h3>Enquiry Received!</h3>
                <p>Thank you for reaching out, {{ formData.name }}. We have received your message regarding <strong>{{ formData.enquiryType }}</strong> and will reply shortly.</p>
                <button class="btn btn-secondary btn-sm" (click)="resetForm()">Send Another Message</button>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  `,
  styles: [`
    .contact-layout {
      display: grid;
      grid-template-columns: 1.1fr 1.3fr;
      gap: var(--space-3xl);
      align-items: flex-start;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: var(--space-2xl);
      }
    }

    .contact-title {
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 900;
      margin: var(--space-sm) 0 var(--space-md);
    }

    .contact-lead {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: var(--space-2xl);
    }

    .contact-points {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .contact-point-card {
      display: flex;
      gap: var(--space-md);
      align-items: center;
      padding: var(--space-lg);

      .point-icon { font-size: 1.8rem; }
      h4 { font-size: 1rem; margin-bottom: 2px; }
      p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }
    }

    .form-card {
      padding: var(--space-2xl);
    }

    .form-title {
      font-size: 1.4rem;
      margin-bottom: 4px;
    }

    .form-sub {
      font-size: 0.88rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-xl);
    }

    .enquiry-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .success-box {
      text-align: center;
      padding: var(--space-2xl) var(--space-lg);

      .success-icon { font-size: 3rem; margin-bottom: var(--space-md); }
      h3 { font-size: 1.6rem; margin-bottom: var(--space-sm); }
      p { color: var(--text-secondary); margin-bottom: var(--space-xl); max-width: 450px; margin-inline: auto; }
    }
  `]
})
export class ContactComponent implements OnInit {
  formData: BusinessEnquiry = {
    name: '',
    company: '',
    email: '',
    website: '',
    enquiryType: 'SPONSORSHIP',
    message: '',
  };

  submitted = signal(false);

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Business Enquiries & Sponsorships',
      description: 'Contact Alex Creator for video sponsorships, dedicated reviews, keynotes, and collaborations.',
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.submitted.set(true);
    }
  }

  resetForm(): void {
    this.formData = {
      name: '',
      company: '',
      email: '',
      website: '',
      enquiryType: 'SPONSORSHIP',
      message: '',
    };
    this.submitted.set(false);
  }
}
