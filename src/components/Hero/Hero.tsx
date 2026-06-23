import { Clock3, Globe2, Linkedin, Mail, MapPin } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { ProfileImage } from './ProfileImage';
import { StatusBadge } from './StatusBadge';

const CONTACT_EMAIL = 'mailto:mbeuapedro@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/helena-software-engineer';
const GITHUB_URL = 'https://github.com/helenapedro';
const PERSONAL_SITE_URL = 'https://hmpedro.com';
const ADDRESS = "Bellevue, WA";
const TIME_ZONE = 'Pacific Time (PST)';

const quickActions = [
  {
    label: 'Contact Me',
    href: CONTACT_EMAIL,
    icon: Mail,
    className:
      'bg-sky-400 text-slate-950 shadow-lg shadow-sky-950/30 hover:bg-sky-300',
  },
  {
    label: 'Personal Website',
    href: PERSONAL_SITE_URL,
    icon: Globe2,
    className:
      'border border-white/15 bg-white/8 text-white hover:border-white/25 hover:bg-white/14',
  },
  {
    label: 'LinkedIn',
    href: LINKEDIN_URL,
    icon: Linkedin,
    className:
      'border border-white/15 bg-white/8 text-white hover:border-white/25 hover:bg-white/14',
  },
  {
    label: 'GitHub',
    href: GITHUB_URL,
    icon: SiGithub,
    className:
      'border border-white/15 bg-white/8 text-white hover:border-white/25 hover:bg-white/14',
  },
];

export function Hero() {
  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      <div className="relative px-5 py-6 sm:px-6 sm:py-8 lg:px-6 lg:py-8 xl:px-7">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <ProfileImage />
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300 sm:text-sm sm:tracking-[0.18em]">
              Award-Winning Software Engineer & AI Innovator | M.S. in Computer Science @ MIU
            </p>
            <h1 className="mt-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 sm:text-5xl lg:text-4xl xl:text-5xl">
              Helena Pedro
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Building scalable, AI-driven systems that make talent visible.
              Specialist in backend architecture, Java, Spring Boot, Kafka, and
              generative AI workflows.
            </p>
          </div>
          <div className="mt-5 flex w-full max-w-sm flex-col gap-2.5 text-sm">
            <StatusBadge Icon={MapPin} text={`${ADDRESS}`} />
            <StatusBadge Icon={Clock3} text={TIME_ZONE} />
          </div>
          <div className="mt-5 w-full max-w-sm rounded-full border border-white/12 bg-white/6 p-1">
            <div className="flex gap-1">
              <Link
                to="/"
                className="flex-1 rounded-full bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-900 shadow-sm transition-all"
              >
                Projects
              </Link>
            </div>
          </div>
          <div className="mt-4 grid w-full max-w-sm grid-cols-1 gap-3 sm:max-w-xl sm:grid-cols-2 lg:max-w-sm xl:max-w-xl">
            {quickActions.map(({ label, href, className, icon: Icon }, index) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${index === 0 ? 'sm:col-span-2 lg:col-span-1 xl:col-span-2' : ''} ${className}`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
