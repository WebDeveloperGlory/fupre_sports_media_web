import Link from "next/link";
import { Trophy, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    sports: [
      { label: "Competitions", href: "/sports/competitions" },
      { label: "Football", href: "/sports/football" },
      { label: "Basketball", href: "/sports/basketball" },
      { label: "All Sports", href: "/sports" },
    ],
    quickLinks: [
      { label: "News", href: "/news" },
      { label: "Highlights", href: "/highlights" },
      { label: "Teams", href: "/teams" },
      { label: "Fixtures", href: "/fixtures" },
    ],
    about: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const contactInfo = [
    { icon: MapPin, text: "Federal University of Petroleum Resources, Effurun" },
    { icon: Phone, text: "+234 (0) 803 XXX XXXX" },
    { icon: Mail, text: "info@fupresports.edu.ng" },
  ];

  return (
    <footer className="bg-card/40 backdrop-blur-sm border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-emerald-500">FUPRE</span> Sports
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Your ultimate destination for university sports coverage, live updates, and comprehensive sports media.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sports Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Sports</h3>
            <ul className="space-y-2">
              {footerLinks.sports.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">About & Legal</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-emerald-500 hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Full Width Bold Branding */}
        <div className="mt-12 -mx-4 bg-emerald-500 py-8">
          <h2 className="text-[9vw] md:text-[7vw] font-black tracking-tight text-black leading-none text-center">
            FUPRE SPORTS MEDIA
          </h2>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
