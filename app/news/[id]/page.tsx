'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Clock } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

const articles = [
  {
    id: 3,
    title: "Current Champions vs Past Champions: A Clash of Titans",
    content: "Will Citizens remember that it was Seventeen that helped them clinch the title on the final day? No, it's football and it's a new season. Seventeen are kicking off their season with tough fixtures but how will they react to their loss courtesy of a painful last minute winner in their first game?\n\nCitizens on the other hand also left it late vs Rebull but they will step into the match in high spirits after winning the Super Coppa final.\n\nExpect the fire, expect the flames, two big teams battle for the title. Citizens will walk in as favourites but you never know who will walk out as winners!\n\nCurrent Champs vs Past Champs\nTime: 4PM\nBe there!",
    author: "Churchill Usaide",
    date: "Feb 19, 2025",
    readTime: "2 min read",
    image: "/images/news/Today's game.jpg"
  },
  {
    id: 2,
    title: "Propellers Penalized for Fielding Ineligible Player, Lose Points and Face Fine",
    content: "Effurun, Nigeria – The FUPRE Super League Board has issued a disciplinary action against Propellers FC for fielding an ineligible player, \"Jala,\" in their recent match against Rayos FC.\n\nAs a consequence, the league committee has deducted one point from Propellers FC and imposed a ₦10,000 fine on the team. The board reaffirmed that the punishment follows FSL regulations, and the fine must be paid 24 hours before the club's next fixture.\n\nThe league's leadership, including President Okunrobo Ezeh and SUG Director of Sports Amos S. Oghenekaro, stressed the importance of compliance with player eligibility rules, warning that similar infractions will be met with strict sanctions.\n\nThis decision is expected to serve as a deterrent to other teams, reinforcing the integrity of the FUPRE Super League.",
    author: "Churchill Usaide",
    date: "Feb 15, 2025",
    readTime: "2 min read",
    image: "/images/news/News 2.jpg"
  },
  {
    id: 1,
    title: "FUPRE Super League Fines Propellers FC for Rule Violations",
    content: "In a significant development for the FUPRE Super League (FSL), Propellers FC has been handed a substantial fine following multiple rule violations during their recent fixture. The league's disciplinary committee announced the decision after a thorough review of match officials' reports and video evidence from the game.\n\nThe violations included unsportsmanlike conduct, repeated confrontations with match officials, and failure to control team supporters. The fine, which amounts to a considerable sum, must be settled within 48 hours before the team's next scheduled match.\n\n'We take the integrity of our league very seriously,' stated James Okoye, the FSL Chief Disciplinary Officer. 'This action serves as a clear message that no team is above the rules, regardless of their standing or history in the competition.'\n\nPropellers FC has accepted the ruling and issued a formal apology to the league, match officials, and fans. The team's management has also announced internal measures to prevent similar incidents in the future.\n\nThis decision has sparked discussions about discipline in university sports, with many observers praising the FSL's firm stance on maintaining professional standards. The league has announced plans to conduct a comprehensive workshop on rules and regulations for all participating teams before the next season begins.",
    author: "Churchill Usaide",
    date: "Feb 14, 2025",
    readTime: "3 min read",
    image: "/images/news/News 1.jpg"
  }
];

export default function NewsArticlePage() {
  const params = useParams();
  const articleId = Number(params.id);
  
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BlurFade>
        <article className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
          <div className="mb-6">
            <BackButton />
          </div>
          <header className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-full bg-muted overflow-hidden">
                  <Image
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author}`}
                    alt={article.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <span>{article.author}</span>
              </div>
              <span>·</span>
              <span>{article.date}</span>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          <div className="w-full relative">
            <Image
              src={article.image}
              alt={article.title}
              width={1200}
              height={675}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>

          <div className="prose prose-emerald max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </BlurFade>
    </div>
  );
}