import { FOOTER_TEXT } from './data.ts';

export function Footer({ className = '' }: { className?: string }) {
  return (
    <footer className={`footer ${className}`}>
      <span>{FOOTER_TEXT}</span>
      <a href="#registry" className="footer__link">
        Номера записей в Едином реестре объектов классификации
      </a>
    </footer>
  );
}
