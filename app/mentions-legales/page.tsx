import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales - Aurore Finances",
  description: "Mentions légales et informations juridiques d'Aurore Finances",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentions Légales</h1>
            <p className="text-gray-600">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Informations sur l'entreprise</h2>
            <p>
              <strong>Nom de l'entreprise :</strong> Aurore Finances<br />
              <strong>Forme juridique :</strong> [À compléter]<br />
              <strong>Adresse :</strong> [À compléter]<br />
              <strong>Pays :</strong> Suisse<br />
              <strong>Email :</strong> contact@aurorefinances.ch
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Directeur de la publication</h2>
            <p>
              <strong>Nom :</strong> [À compléter]<br />
              <strong>Qualité :</strong> [À compléter]
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Hébergement</h2>
            <p>
              Ce site est hébergé par Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Propriété intellectuelle</h2>
            <p>
              Le contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels) 
              est la propriété exclusive d'Aurore Finances, à l'exception des marques, logos ou 
              contenus appartenant à d'autres sociétés partenaires ou auteurs.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Responsabilité</h2>
            <p>
              Les informations contenues sur ce site sont aussi précises que possible et le site 
              est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, 
              des omissions ou des lacunes. Si vous constatez une lacune, erreur ou ce qui 
              parait être un dysfonctionnement, merci de bien vouloir le signaler par email 
              en décrivant le problème de la manière la plus précise possible.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Liens hypertextes</h2>
            <p>
              Les liens hypertextes mis en place dans le cadre du présent site web en direction 
              d'autres ressources présentes sur le réseau Internet ne sauraient engager la 
              responsabilité d'Aurore Finances.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Collecte de données</h2>
            <p>
              Le site collecte des données personnelles dans le cadre de la liste d'attente 
              et du fonctionnement des services. Ces données sont traitées conformément à 
              notre <Link href="/confidentialite" className="text-blue-600 hover:underline">
              politique de confidentialité</Link>.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Droit applicable</h2>
            <p>
              Le présent site web et les présentes mentions légales sont régis par le droit suisse. 
              En cas de litige, les tribunaux suisses seront seuls compétents.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous 
              contacter à l'adresse : <a href="mailto:contact@aurorefinances.ch" className="text-blue-600 hover:underline">
              contact@aurorefinances.ch</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}