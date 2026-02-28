import { Component, OnInit, OnDestroy, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <!-- ══════════════ NAVBAR ══════════════ -->
    <nav class="navbar" [class.scrolled]="scrolled()">
      <div class="nav-inner">
        <div class="nav-brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h10M4 18h7" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
          </div>
          <span>ProjectFlow</span>
        </div>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div class="nav-cta">
          <a routerLink="/login" class="btn-ghost">Sign in</a>
          <a routerLink="/register" class="btn-primary-sm">Get started free</a>
        </div>
      </div>
    </nav>

    <!-- ══════════════ HERO ══════════════ -->
    <section class="hero">
      <div class="hero-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="grid-overlay"></div>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Real-time collaboration · Built for teams
        </div>
        <h1 class="hero-title">
          Ship projects faster<br>with <span class="gradient-text">ProjectFlow</span>
        </h1>
        <p class="hero-subtitle">
          The all-in-one workspace where teams plan, track, and deliver work.<br>
          Kanban boards, real-time messaging, and smart notifications — all in one place.
        </p>
        <div class="hero-actions">
          <a routerLink="/register" class="btn-hero-primary">
            Start for free
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </a>
          <a routerLink="/login" class="btn-hero-ghost">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>
            See demo
          </a>
        </div>
        <div class="hero-social-proof">
          <div class="avatar-group">
            <div class="av" style="background:linear-gradient(135deg,#f85149,#d29922)">J</div>
            <div class="av" style="background:linear-gradient(135deg,#58a6ff,#7c5cfc)">S</div>
            <div class="av" style="background:linear-gradient(135deg,#3fb950,#39d2b7)">M</div>
            <div class="av" style="background:linear-gradient(135deg,#d29922,#f85149)">A</div>
          </div>
          <span>Trusted by <strong>2,400+</strong> teams worldwide</span>
        </div>
      </div>

      <!-- App screenshot mockup -->
      <div class="hero-mockup">
        <div class="mockup-window">
          <div class="mockup-bar">
            <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
            <div class="mockup-url">projectflow.app/dashboard</div>
          </div>
          <div class="mockup-content">
            <!-- Sidebar -->
            <div class="mock-sidebar">
              <div class="mock-logo"></div>
              <div class="mock-nav-item active"></div>
              <div class="mock-nav-item"></div>
              <div class="mock-nav-item"></div>
              <div class="mock-nav-item"></div>
            </div>
            <!-- Main area -->
            <div class="mock-main">
              <div class="mock-header">
                <div class="mock-title"></div>
                <div class="mock-btn"></div>
              </div>
              <div class="mock-stats">
                <div class="mock-stat" *ngFor="let s of [0,1,2,3]"></div>
              </div>
              <div class="mock-kanban">
                <div class="mock-col" *ngFor="let c of [0,1,2]">
                  <div class="mock-col-header"></div>
                  <div class="mock-card" *ngFor="let i of getRange(c)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ STATS ══════════════ -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" *ngFor="let stat of stats">
            <div class="stat-number">{{stat.value}}</div>
            <div class="stat-label">{{stat.label}}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ FEATURES ══════════════ -->
    <section class="features-section" id="features">
      <div class="container">
        <div class="section-badge">Features</div>
        <h2 class="section-title">Everything your team needs<br>to <span class="gradient-text">move fast</span></h2>
        <p class="section-subtitle">Stop context-switching between tools. ProjectFlow brings your entire project ecosystem into one beautiful workspace.</p>

        <div class="features-grid">
          <div class="feature-card" *ngFor="let f of features; let i = index"
               [style.animation-delay]="(i * 0.1) + 's'">
            <div class="feature-icon" [style.background]="f.color">
              <span [innerHTML]="f.icon"></span>
            </div>
            <h3>{{f.title}}</h3>
            <p>{{f.desc}}</p>
            <div class="feature-tags">
              <span class="tag" *ngFor="let tag of f.tags">{{tag}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ HOW IT WORKS ══════════════ -->
    <section class="hiw-section" id="how-it-works">
      <div class="container">
        <div class="section-badge">How it works</div>
        <h2 class="section-title">From idea to done in <span class="gradient-text">3 steps</span></h2>
        <div class="steps-container">
          <div class="step" *ngFor="let step of steps; let i = index">
            <div class="step-number">{{i + 1}}</div>
            <div class="step-connector" *ngIf="i < steps.length - 1"></div>
            <div class="step-content">
              <div class="step-icon" [style.background]="step.color">
                <span [innerHTML]="step.icon"></span>
              </div>
              <h3>{{step.title}}</h3>
              <p>{{step.desc}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ TESTIMONIALS ══════════════ -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-badge">Testimonials</div>
        <h2 class="section-title">Teams love <span class="gradient-text">ProjectFlow</span></h2>
        <div class="testimonials-grid">
          <div class="testimonial-card" *ngFor="let t of testimonials; let i = index"
               [style.animation-delay]="(i * 0.1) + 's'">
            <div class="stars">★★★★★</div>
            <p class="testimonial-text">"{{t.text}}"</p>
            <div class="testimonial-author">
              <div class="author-avatar" [style.background]="t.color">{{t.name[0]}}</div>
              <div>
                <div class="author-name">{{t.name}}</div>
                <div class="author-role">{{t.role}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ PRICING ══════════════ -->
    <section class="pricing-section" id="pricing">
      <div class="container">
        <div class="section-badge">Pricing</div>
        <h2 class="section-title">Simple, transparent <span class="gradient-text">pricing</span></h2>
        <p class="section-subtitle">Start free. Upgrade when your team grows.</p>
        <div class="pricing-grid">
          <div class="pricing-card" *ngFor="let plan of plans" [class.featured]="plan.featured">
            <div class="plan-badge" *ngIf="plan.badge">{{plan.badge}}</div>
            <div class="plan-name">{{plan.name}}</div>
            <div class="plan-price">
              <span class="currency">$</span>{{plan.price}}<span class="period">/mo</span>
            </div>
            <div class="plan-desc">{{plan.desc}}</div>
            <ul class="plan-features">
              <li *ngFor="let f of plan.features">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                {{f}}
              </li>
            </ul>
            <a routerLink="/register" class="plan-cta" [class.featured-cta]="plan.featured">
              {{plan.cta}}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════ CTA ══════════════ -->
    <section class="cta-section">
      <div class="cta-orbs">
        <div class="cta-orb cta-orb-1"></div>
        <div class="cta-orb cta-orb-2"></div>
      </div>
      <div class="container cta-inner">
        <h2 class="cta-title">Ready to transform how<br>your team works?</h2>
        <p class="cta-subtitle">Join thousands of teams already using ProjectFlow to ship faster and collaborate better.</p>
        <div class="cta-actions">
          <a routerLink="/register" class="btn-hero-primary">
            Start free trial
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </a>
        </div>
        <p class="cta-note">No credit card required · Free forever for small teams</p>
      </div>
    </section>

    <!-- ══════════════ FOOTER ══════════════ -->
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <div class="nav-brand">
            <div class="brand-icon sm">
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h10M4 18h7" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
            </div>
            <span>ProjectFlow</span>
          </div>
          <p>The modern project management platform for high-performing teams.</p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How it works</a>
          </div>
          <div class="footer-col">
            <h4>Team</h4>
            <a routerLink="/login">Sign in</a>
            <a routerLink="/register">Get started</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <span>© 2026 ProjectFlow. Built with ❤️ for your hackathon.</span>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    :host { display: block; background: #080d14; color: #e6edf3; font-family: 'Inter', sans-serif; }

    /* ─── NAVBAR ─── */
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 0 24px;
      transition: background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s;
      &.scrolled {
        background: rgba(8,13,20,0.85);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
    }
    .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; height: 64px; gap: 32px; }
    .nav-brand { display:flex; align-items:center; gap:10px; font-size:18px; font-weight:800; color:#e6edf3; text-decoration:none; flex:1;
      span { background: linear-gradient(135deg,#58a6ff,#7c5cfc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    }
    .brand-icon { width:34px; height:34px; background:linear-gradient(135deg,#7c5cfc,#58a6ff); border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
      svg { width:18px; height:18px; }
      &.sm { width:28px; height:28px; border-radius:6px; svg { width:14px; height:14px; } }
    }
    .nav-links { display:flex; gap:28px;
      a { color:rgba(230,237,243,0.7); text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; &:hover { color:#e6edf3; } }
    }
    .nav-cta { display:flex; gap:12px; align-items:center; }
    .btn-ghost { color:rgba(230,237,243,0.7); text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; &:hover { color:#e6edf3; } }
    .btn-primary-sm { background:linear-gradient(135deg,#7c5cfc,#58a6ff); color:white; text-decoration:none; font-size:13px; font-weight:600; padding:8px 18px; border-radius:8px; transition:opacity 0.2s, transform 0.2s;
      &:hover { opacity:0.9; transform:translateY(-1px); }
    }

    /* ─── HERO ─── */
    .hero { min-height: 100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; padding:80px 24px 40px; text-align:center; }
    .hero-bg { position:absolute; inset:0; pointer-events:none; }
    .orb { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.25; animation:orbFloat 8s ease-in-out infinite; }
    .orb-1 { width:500px; height:500px; background:radial-gradient(circle,#7c5cfc,transparent); top:-100px; left:-100px; }
    .orb-2 { width:400px; height:400px; background:radial-gradient(circle,#58a6ff,transparent); top:50%; right:-100px; animation-delay:-3s; }
    .orb-3 { width:300px; height:300px; background:radial-gradient(circle,#3fb950,transparent); bottom:-80px; left:30%; animation-delay:-5s; }
    @keyframes orbFloat { 0%,100% { transform:translateY(0) scale(1); } 50% { transform:translateY(-30px) scale(1.05); } }

    .grid-overlay { position:absolute; inset:0; background-image:linear-gradient(rgba(88,166,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(88,166,255,0.04) 1px,transparent 1px); background-size:60px 60px; }

    .hero-content { position:relative; z-index:2; max-width:760px; }
    .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(88,166,255,0.08); border:1px solid rgba(88,166,255,0.2); color:#58a6ff; font-size:12px; font-weight:600; padding:6px 14px; border-radius:20px; margin-bottom:28px; letter-spacing:0.5px; }
    .badge-dot { width:7px; height:7px; border-radius:50%; background:#3fb950; box-shadow:0 0 8px #3fb950; animation:pulse 2s infinite; }
    @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(1.3); } }

    .hero-title { font-size: clamp(40px,6vw,72px); font-weight:900; line-height:1.1; color:#e6edf3; margin-bottom:20px; letter-spacing:-2px; }
    .gradient-text { background:linear-gradient(135deg,#58a6ff 0%,#7c5cfc 50%,#39d2b7 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .hero-subtitle { font-size:18px; color:rgba(230,237,243,0.65); line-height:1.7; margin-bottom:40px; }

    .hero-actions { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-bottom:40px; }
    .btn-hero-primary { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#7c5cfc,#58a6ff); color:white; text-decoration:none; font-size:16px; font-weight:700; padding:14px 28px; border-radius:12px; transition:all 0.3s; box-shadow:0 8px 32px rgba(124,92,252,0.4);
      svg { width:18px; height:18px; }
      &:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(124,92,252,0.6); }
    }
    .btn-hero-ghost { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); color:#e6edf3; text-decoration:none; font-size:16px; font-weight:600; padding:14px 28px; border-radius:12px; transition:all 0.3s; backdrop-filter:blur(10px);
      svg { width:18px; height:18px; }
      &:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2); transform:translateY(-2px); }
    }

    .hero-social-proof { display:flex; align-items:center; justify-content:center; gap:12px; font-size:13px; color:rgba(230,237,243,0.5);
      strong { color:rgba(230,237,243,0.9); }
    }
    .avatar-group { display:flex; }
    .av { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; color:white; border:2px solid #080d14; margin-left:-8px; &:first-child { margin-left:0; } }

    /* ─── MOCKUP ─── */
    .hero-mockup { position:relative; z-index:2; margin-top:60px; width:100%; max-width:900px; }
    .mockup-window { background:#0d1117; border:1px solid rgba(255,255,255,0.08); border-radius:16px; overflow:hidden; box-shadow:0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05); }
    .mockup-bar { background:#161b22; padding:12px 16px; display:flex; align-items:center; gap:6px;
      .dot { width:12px; height:12px; border-radius:50%; &.red { background:#f85149; } &.yellow { background:#d29922; } &.green { background:#3fb950; } }
    }
    .mockup-url { margin-left:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:3px 12px; font-size:12px; color:rgba(230,237,243,0.4); }
    .mockup-content { display:flex; height:340px; }
    .mock-sidebar { width:56px; background:#0d1117; border-right:1px solid rgba(255,255,255,0.06); padding:12px 10px; display:flex; flex-direction:column; gap:10px; }
    .mock-logo { width:36px; height:36px; background:linear-gradient(135deg,#7c5cfc,#58a6ff); border-radius:8px; margin-bottom:14px; }
    .mock-nav-item { height:36px; border-radius:8px; background:rgba(255,255,255,0.04); &.active { background:rgba(88,166,255,0.15); border-left:3px solid #58a6ff; } }
    .mock-main { flex:1; padding:20px; display:flex; flex-direction:column; gap:14px; overflow:hidden; }
    .mock-header { display:flex; justify-content:space-between; align-items:center; }
    .mock-title { height:22px; width:160px; background:rgba(255,255,255,0.08); border-radius:6px; }
    .mock-btn { height:30px; width:90px; background:linear-gradient(135deg,rgba(124,92,252,0.6),rgba(88,166,255,0.6)); border-radius:8px; }
    .mock-stats { display:flex; gap:10px; }
    .mock-stat { flex:1; height:60px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:10px; animation:shimmer 2s infinite; }
    @keyframes shimmer { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
    .mock-kanban { display:flex; gap:10px; flex:1; overflow:hidden; }
    .mock-col { flex:1; display:flex; flex-direction:column; gap:8px; }
    .mock-col-header { height:20px; background:rgba(255,255,255,0.06); border-radius:6px; }
    .mock-card { flex:1; max-height:60px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:8px; animation:shimmer 2s infinite; }

    /* ─── STATS ─── */
    .stats-section { background:rgba(255,255,255,0.02); border-top:1px solid rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.06); padding:40px 24px; }
    .container { max-width:1200px; margin:0 auto; }
    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .stat-item { text-align:center; }
    .stat-number { font-size:40px; font-weight:900; background:linear-gradient(135deg,#58a6ff,#7c5cfc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1; margin-bottom:6px; }
    .stat-label { font-size:13px; color:rgba(230,237,243,0.5); font-weight:500; }

    /* ─── FEATURES ─── */
    .features-section { padding:100px 24px; }
    .section-badge { display:inline-block; background:rgba(88,166,255,0.08); border:1px solid rgba(88,166,255,0.2); color:#58a6ff; font-size:11px; font-weight:700; padding:5px 14px; border-radius:20px; margin-bottom:20px; letter-spacing:1px; text-transform:uppercase; }
    .section-title { font-size:clamp(28px,4vw,48px); font-weight:900; color:#e6edf3; line-height:1.2; margin-bottom:16px; letter-spacing:-1px; }
    .section-subtitle { font-size:16px; color:rgba(230,237,243,0.55); line-height:1.7; max-width:600px; margin-bottom:64px; }

    .features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
    .feature-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:28px; transition:all 0.3s; animation:fadeInUp 0.5s ease both;
      &:hover { background:rgba(255,255,255,0.05); border-color:rgba(88,166,255,0.2); transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.4); }
      h3 { font-size:17px; font-weight:700; color:#e6edf3; margin:16px 0 8px; }
      p { font-size:14px; color:rgba(230,237,243,0.55); line-height:1.65; }
    }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

    .feature-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; }
    .feature-tags { display:flex; gap:6px; flex-wrap:wrap; margin-top:16px; }
    .tag { background:rgba(88,166,255,0.08); color:rgba(88,166,255,0.9); font-size:11px; font-weight:600; padding:3px 10px; border-radius:6px; }

    /* ─── HOW IT WORKS ─── */
    .hiw-section { padding:100px 24px; background:rgba(255,255,255,0.01); }
    .steps-container { display:flex; gap:0; margin-top:60px; position:relative; }
    .step { flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; position:relative; padding:0 20px; }
    .step-number { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,#7c5cfc,#58a6ff); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:white; margin-bottom:24px; position:relative; z-index:2; }
    .step-connector { position:absolute; top:20px; left:calc(50% + 20px); right:calc(-50% + 20px); height:2px; background:linear-gradient(90deg,rgba(124,92,252,0.6),rgba(88,166,255,0.6)); z-index:1; }
    .step-icon { width:56px; height:56px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; margin:0 auto 16px; }
    .step-content h3 { font-size:18px; font-weight:700; color:#e6edf3; margin-bottom:8px; }
    .step-content p { font-size:14px; color:rgba(230,237,243,0.5); line-height:1.6; }

    /* ─── TESTIMONIALS ─── */
    .testimonials-section { padding:100px 24px; }
    .testimonials-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:56px; }
    .testimonial-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:28px; animation:fadeInUp 0.5s ease both; transition:all 0.3s;
      &:hover { border-color:rgba(88,166,255,0.2); transform:translateY(-2px); }
    }
    .stars { color:#d29922; font-size:14px; margin-bottom:14px; letter-spacing:2px; }
    .testimonial-text { font-size:14px; color:rgba(230,237,243,0.75); line-height:1.7; font-style:italic; margin-bottom:20px; }
    .testimonial-author { display:flex; align-items:center; gap:12px; }
    .author-avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:white; flex-shrink:0; }
    .author-name { font-size:14px; font-weight:700; color:#e6edf3; }
    .author-role { font-size:12px; color:rgba(230,237,243,0.45); }

    /* ─── PRICING ─── */
    .pricing-section { padding:100px 24px; background:rgba(255,255,255,0.01); }
    .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:56px; }
    .pricing-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:20px; padding:32px; position:relative; transition:all 0.3s;
      &.featured { background:linear-gradient(135deg,rgba(124,92,252,0.1),rgba(88,166,255,0.08)); border-color:rgba(124,92,252,0.4); transform:scale(1.04); box-shadow:0 20px 80px rgba(124,92,252,0.25); }
    }
    .plan-badge { position:absolute; top:-13px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#7c5cfc,#58a6ff); color:white; font-size:11px; font-weight:700; padding:4px 14px; border-radius:10px; white-space:nowrap; letter-spacing:0.5px; }
    .plan-name { font-size:16px; font-weight:700; color:rgba(230,237,243,0.7); margin-bottom:12px; }
    .plan-price { font-size:48px; font-weight:900; color:#e6edf3; line-height:1; margin-bottom:6px;
      .currency { font-size:24px; vertical-align:top; margin-top:8px; display:inline-block; color:rgba(230,237,243,0.5); }
      .period { font-size:16px; color:rgba(230,237,243,0.4); font-weight:400; }
    }
    .plan-desc { font-size:13px; color:rgba(230,237,243,0.45); margin-bottom:24px; min-height:36px; }
    .plan-features { list-style:none; padding:0; margin:0 0 28px; display:flex; flex-direction:column; gap:10px;
      li { display:flex; align-items:center; gap:8px; font-size:14px; color:rgba(230,237,243,0.7);
        svg { width:16px; height:16px; color:#3fb950; flex-shrink:0; }
      }
    }
    .plan-cta { display:block; text-align:center; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:#e6edf3; text-decoration:none; font-size:14px; font-weight:700; padding:12px; border-radius:10px; transition:all 0.2s;
      &:hover { background:rgba(255,255,255,0.1); }
      &.featured-cta { background:linear-gradient(135deg,#7c5cfc,#58a6ff); border:none; box-shadow:0 8px 24px rgba(124,92,252,0.4); &:hover { box-shadow:0 12px 32px rgba(124,92,252,0.6); } }
    }

    /* ─── CTA ─── */
    .cta-section { padding:120px 24px; position:relative; overflow:hidden; text-align:center; }
    .cta-orbs { position:absolute; inset:0; pointer-events:none; }
    .cta-orb { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.2; }
    .cta-orb-1 { width:400px; height:400px; background:radial-gradient(circle,#7c5cfc,transparent); top:-100px; left:10%; }
    .cta-orb-2 { width:400px; height:400px; background:radial-gradient(circle,#58a6ff,transparent); bottom:-100px; right:10%; }
    .cta-inner { position:relative; z-index:2; }
    .cta-title { font-size:clamp(28px,4vw,56px); font-weight:900; color:#e6edf3; margin-bottom:16px; line-height:1.2; letter-spacing:-1.5px; }
    .cta-subtitle { font-size:18px; color:rgba(230,237,243,0.55); margin-bottom:40px; }
    .cta-actions { margin-bottom:20px; }
    .cta-note { font-size:13px; color:rgba(230,237,243,0.35); }

    /* ─── FOOTER ─── */
    .footer { border-top:1px solid rgba(255,255,255,0.06); padding:60px 24px 0; }
    .footer-inner { display:flex; gap:60px; margin-bottom:48px; }
    .footer-brand { flex:1;
      p { font-size:14px; color:rgba(230,237,243,0.4); line-height:1.6; margin-top:12px; max-width:260px; }
    }
    .footer-links { display:flex; gap:60px; }
    .footer-col { display:flex; flex-direction:column; gap:10px;
      h4 { font-size:13px; font-weight:700; color:rgba(230,237,243,0.5); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; }
      a { font-size:14px; color:rgba(230,237,243,0.55); text-decoration:none; transition:color 0.2s; &:hover { color:#e6edf3; } }
    }
    .footer-bottom { border-top:1px solid rgba(255,255,255,0.06); padding:20px 0; font-size:13px; color:rgba(230,237,243,0.3); }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 768px) {
      .nav-links { display:none; }
      .features-grid, .testimonials-grid, .pricing-grid { grid-template-columns:1fr; }
      .stats-grid { grid-template-columns:repeat(2,1fr); }
      .steps-container { flex-direction:column; gap:32px; }
      .step-connector { display:none; }
      .pricing-card.featured { transform:none; }
      .footer-inner { flex-direction:column; gap:32px; }
      .footer-links { flex-direction:column; gap:24px; }
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
    scrolled = signal(false);

    stats = [
        { value: '2,400+', label: 'Teams worldwide' },
        { value: '98%', label: 'Customer satisfaction' },
        { value: '10M+', label: 'Tasks completed' },
        { value: '<50ms', label: 'Real-time latency' },
    ];

    features = [
        {
            title: 'Kanban Boards', icon: '📋',
            desc: 'Visualize work across drag-and-drop columns. Move tasks from To Do → In Progress → Done with real-time sync for the whole team.',
            tags: ['Drag & drop', 'Real-time', 'Filters'], color: 'rgba(88,166,255,0.15)'
        },
        {
            title: 'Task Management', icon: '✅',
            desc: 'Create, assign, and track tasks with priority levels, due dates, and progress tracking. Never miss a deadline again.',
            tags: ['Priorities', 'Due dates', 'Assignments'], color: 'rgba(63,185,80,0.15)'
        },
        {
            title: 'Real-time Messaging', icon: '💬',
            desc: 'Direct messages and group discussions built right into your workspace. No more switching to Slack or Teams.',
            tags: ['Direct messages', 'Threads', 'Read receipts'], color: 'rgba(124,92,252,0.15)'
        },
        {
            title: 'Smart Notifications', icon: '🔔',
            desc: 'Get notified about what matters: task updates, @mentions, and messages. Filter by type and mark as read in bulk.',
            tags: ['Push alerts', '@mentions', 'Filters'], color: 'rgba(210,153,34,0.15)'
        },
        {
            title: 'Team Collaboration', icon: '👥',
            desc: 'Add members to projects, manage roles, and track everyone\'s contributions on a shared dashboard overview.',
            tags: ['Member management', 'Roles', 'Audit logs'], color: 'rgba(57,210,183,0.15)'
        },
        {
            title: 'Project Analytics', icon: '📊',
            desc: 'Monitor project health with progress bars, completion rates, and activity feeds. Make data-driven decisions faster.',
            tags: ['Progress tracking', 'Activity feed', 'Reports'], color: 'rgba(248,81,73,0.15)'
        },
    ];

    steps = [
        {
            title: 'Create a project', icon: '🚀',
            desc: 'Set up your project in seconds. Add a name, description, color, and invite your teammates.',
            color: 'rgba(88,166,255,0.15)'
        },
        {
            title: 'Assign tasks', icon: '🎯',
            desc: 'Break work into tasks, set priorities and deadlines, and assign them to the right team members.',
            color: 'rgba(124,92,252,0.15)'
        },
        {
            title: 'Ship it', icon: '🏆',
            desc: 'Track progress on the Kanban board, discuss in real-time, and move work across columns as it gets done.',
            color: 'rgba(63,185,80,0.15)'
        },
    ];

    testimonials = [
        {
            text: 'ProjectFlow replaced 4 tools for us. Our team ships twice as fast now because everything is in one place.',
            name: 'Sarah Chen', role: 'CTO at DevBuilds', color: 'linear-gradient(135deg,#7c5cfc,#58a6ff)'
        },
        {
            text: 'The real-time Kanban board is a game changer. I can see exactly where every task stands without asking anyone.',
            name: 'Marcus Johnson', role: 'Product Lead at Nexus', color: 'linear-gradient(135deg,#3fb950,#39d2b7)'
        },
        {
            text: 'We went from emails and spreadsheets to ProjectFlow in a week. Our project delays dropped by 60%.',
            name: 'Priya Nair', role: 'Engineering Manager at Loopa', color: 'linear-gradient(135deg,#d29922,#f85149)'
        },
    ];

    plans = [
        {
            name: 'Starter', price: '0', desc: 'Perfect for small teams just getting started.',
            badge: null, featured: false, cta: 'Start free',
            features: ['Up to 5 members', '3 projects', 'Kanban boards', 'Basic messaging']
        },
        {
            name: 'Pro', price: '12', desc: 'For growing teams that need the full feature set.',
            badge: 'Most Popular', featured: true, cta: 'Start Pro trial',
            features: ['Unlimited members', 'Unlimited projects', 'Real-time messaging', 'Advanced notifications', 'Priority support']
        },
        {
            name: 'Enterprise', price: '49', desc: 'For large organizations with advanced security needs.',
            badge: null, featured: false, cta: 'Contact sales',
            features: ['Everything in Pro', 'SSO & SAML', 'Audit logs', 'Dedicated support', 'SLA guarantee']
        },
    ];

    @HostListener('window:scroll')
    onScroll(): void {
        this.scrolled.set(window.scrollY > 20);
    }

    getRange(col: number): number[] {
        return Array.from({ length: col === 1 ? 3 : 2 });
    }

    ngOnInit(): void { }
    ngOnDestroy(): void { }
}
