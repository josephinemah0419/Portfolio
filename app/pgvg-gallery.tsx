import { ExternalLink, Play } from 'lucide-react';
import styles from './pgvg-gallery.module.css';

type Project = { title: string; video: string; poster: string };

// Each grid item owns its media, title, link and divider. Never split into columns.
export default function PGVGGallery({ projects }: { projects: Project[] }) {
  return <div className={styles.grid} data-pgvg-grid>
    {projects.map(project => <article className={styles.card} key={project.video}>
      <div className={styles.media}>
        <video controls playsInline muted={false} preload="metadata" poster={project.poster} aria-label={project.title}>
          <source src={project.video} type="video/mp4" />
        </video>
        <span className={styles.badge}><Play size={11} fill="currentColor" /> PLAY</span>
      </div>
      <div className={styles.info}>
        <h3>{project.title}</h3>
        <a href={project.video} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`}><ExternalLink size={15} /></a>
      </div>
      <div className={styles.divider} />
    </article>)}
  </div>;
}
