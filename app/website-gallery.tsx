'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { websiteProjects, type WebsiteProject } from './website-projects';
import './website-gallery.css';

export default function WebsiteGallery() {
  const [selection, setSelection] = useState<{project: WebsiteProject; view: 'preview' | 'case'} | null>(null);
  return <section className="subpage web-page real-work-page">
    <div className="section-title"><p>04 / 06 · LIVE PROJECTS</p><h1>Web Experiences</h1></div>
    <div className="website-link-grid">
      {websiteProjects.map(project => <article className="website-card live-project-card" key={project.id}>
        <WebsiteThumbnail project={project} explore={() => setSelection({ project, view: 'preview' })}/>
        <h2>{project.title}</h2><p>{project.description}</p>
        <p className="website-role"><span className="website-role-label">My Role</span><strong>{project.role}</strong><span className="website-role-tools">{project.responsibilities}</span></p>
        <div className="website-project-actions">
          <button onClick={() => setSelection({ project, view: 'preview' })}>Explore Website ↗</button>
          <a href={project.url} target="_blank" rel="noopener noreferrer">Visit Live Site ↗</a>
        </div>
      </article>)}
    </div>
    {selection && createPortal(<WebsiteViewer key={selection.project.id + selection.view} {...selection} close={() => setSelection(null)}/>, document.body)}
  </section>;
}

function WebsiteThumbnail({project, explore}: {project: WebsiteProject; explore: () => void}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (visible && !paused && !motion.matches && !document.hidden) {
        video.play().catch(() => setPlaying(false));
      } else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, {threshold: .1});
    observer.observe(video);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync); video.pause(); };
  }, [paused]);
  return <div className="website-card-preview">
    <button className="website-thumbnail" onClick={explore} aria-label={`Explore ${project.title}`}>
      <video ref={videoRef} src={project.video} poster={project.thumbnail} autoPlay muted loop playsInline preload="metadata"
        aria-label={`${project.title} recorded preview`} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
    </button>
    <button className="website-motion-toggle" onClick={() => { if (playing) { setPaused(true); videoRef.current?.pause(); } else { setPaused(false); videoRef.current?.play().catch(() => setPlaying(false)); } }} aria-label={`${playing ? 'Pause' : 'Play'} ${project.title} preview`}>{playing ? 'Pause' : 'Play'}</button>
  </div>;
}

function WebsiteViewer({project, view, close}: {project: WebsiteProject; view: 'preview' | 'case'; close: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState('Desktop');
  const [status, setStatus] = useState<'checking' | 'loading' | 'ready' | 'fallback'>('checking');
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);
  useEffect(() => {
    if (view !== 'preview') return;
    // Browser loading is authoritative; server-side SSL/network errors do not
    // establish whether an external website permits iframe embedding.
    // The browser still enforces the destination's CSP and X-Frame-Options.
    setStatus(project.iframeAllowed ? 'loading' : 'fallback');
  }, [project, view]);
  useEffect(() => {
    if (status !== 'loading') return;
    const timeout = setTimeout(() => setStatus('fallback'), 30000);
    return () => clearTimeout(timeout);
  }, [status]);
  return <dialog ref={dialog} className="website-viewer" aria-labelledby="website-viewer-title" onCancel={close}>
    <header className="website-viewer-heading"><div><small>{view === 'case' ? 'CASE STUDY · WORK IN PROGRESS' : 'INTERACTIVE WEBSITE PREVIEW'}</small><h2 id="website-viewer-title">{project.title}</h2></div><button autoFocus onClick={close} aria-label="Close website preview">Close ×</button></header>
    {view === 'case' ? <div className="website-case">
      <img src={project.thumbnail} alt={`${project.title} overview`}/>
      <p><strong>My role:</strong> {project.role}</p>
      {project.caseStudy.map(section => <section key={section.heading}><h3>{section.heading}</h3><p>{section.text}</p></section>)}
      <h3>Recorded walkthrough</h3><video controls playsInline preload="metadata" poster={project.thumbnail} src={project.video}/>
    </div> : <>
      <div className="website-device-controls" role="group" aria-label="Preview device">
        {['Desktop', 'Tablet', 'Mobile'].map(device => <button key={device} aria-pressed={mode === device} onClick={() => setMode(device)}>{device}</button>)}
      </div>
      <p className="website-preview-note">Scroll and interact inside the preview. Device widths fit the available screen on phones.</p>
      <div className="website-browser-frame" style={{width: mode === 'Tablet' ? '768px' : mode === 'Mobile' ? '390px' : '100%'}}>
        <div className="website-browser-bar"><span aria-hidden="true">● ● ●</span><span>{project.url}</span></div>
        <div className="website-preview-surface">
          {(status === 'loading' || status === 'ready') && <iframe src={project.url} title={`${project.title} — Website Preview`} loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer" onLoad={() => setStatus(s => s === 'loading' ? 'ready' : s)} onError={() => setStatus('fallback')}/>}
          {status !== 'ready' && <div className={`website-preview-fallback ${status === 'loading' ? 'is-loading' : ''}`}>
            <img src={project.thumbnail} alt={`${project.title} website screenshot`}/>
            <p role="status">{status === 'fallback' ? 'The preview did not load, or screenshot view was selected. Open the live website to continue.' : 'Loading the live website…'}</p>
            {status === 'fallback' && project.iframeAllowed && <button onClick={() => setStatus('loading')}>Retry live preview</button>}
            <a href={project.url} target="_blank" rel="noopener noreferrer">Open Live Website ↗</a>
          </div>}
        </div>
      </div>
      <div className="website-preview-help"><span>Preview blank or blocked?</span><button onClick={() => setStatus('fallback')}>Show screenshot instead</button></div>
    </>}
    <footer className="website-viewer-footer"><a href={project.url} target="_blank" rel="noopener noreferrer">Open Full Website ↗</a><button onClick={close}>Back to projects</button></footer>
  </dialog>;
}
