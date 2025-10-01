import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Aurore Finances",
  description: "Politique de confidentialité et protection des données d'Aurore Finances",
};

export default function ConfidentialitePage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
            <p className="text-gray-600">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Introduction</h2>
            <p>
              Aurore Finances accorde une grande importance à la protection de vos données personnelles. 
              Cette politique de confidentialité explique comment nous collectons, utilisons et 
              protégeons vos informations personnelles.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Données collectées</h2>
            <h3 className="text-lg font-medium text-gray-800">Informations que vous nous fournissez</h3>
            <ul>
              <li>Adresse email (liste d'attente)</li>
              <li>Informations de profil utilisateur</li>
              <li>Données financières (simulateurs)</li>
              <li>Communications avec notre support</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800">Informations collectées automatiquement</h3>
            <ul>
              <li>Adresse IP</li>
              <li>Type de navigateur et système d'exploitation</li>
              <li>Pages visitées et temps passé sur le site</li>
              <li>Données d'utilisation des fonctionnalités</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">Utilisation des données</h2>
            <p>Nous utilisons vos données personnelles pour :</p>
            <ul>
              <li>Vous tenir informé du développement de nos services</li>
              <li>Fournir nos services financiers personnalisés</li>
              <li>Améliorer l'expérience utilisateur</li>
              <li>Répondre à vos questions et demandes</li>
              <li>Respecter nos obligations légales</li>
              <li>Prévenir la fraude et assurer la sécurité</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">Base légale du traitement</h2>
            <p>Nous traitons vos données personnelles sur la base de :</p>
            <ul>
              <li>Votre consentement explicite</li>
              <li>L'exécution d'un contrat ou de mesures précontractuelles</li>
              <li>Nos intérêts légitimes</li>
              <li>Le respect d'obligations légales</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">Partage des données</h2>
            <p>
              Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos 
              informations avec :
            </p>
            <ul>
              <li>Nos prestataires de services techniques (hébergement, email)</li>
              <li>Nos partenaires financiers (avec votre consentement)</li>
              <li>Les autorités compétentes (obligations légales)</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles 
              appropriées pour protéger vos données personnelles contre :
            </p>
            <ul>
              <li>L'accès non autorisé</li>
              <li>La divulgation</li>
              <li>La modification</li>
              <li>La destruction</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles uniquement pendant la durée nécessaire 
              aux finalités pour lesquelles elles ont été collectées, ou conformément aux 
              exigences légales.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Vos droits</h2>
            <p>Conformément au RGPD et à la LPD suisse, vous disposez des droits suivants :</p>
            <ul>
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition</li>
              <li>Droit de retirer votre consentement</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation. 
              Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela 
              peut affecter le fonctionnement du site.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Transferts internationaux</h2>
            <p>
              Vos données peuvent être transférées et traitées dans des pays en dehors de 
              l'Espace économique européen. Nous nous assurons que de tels transferts 
              respectent les exigences de protection des données.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité. 
              Toute modification sera publiée sur cette page avec une date de mise à jour.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour 
              exercer vos droits, contactez-nous :
            </p>
            <p>
              Email : <a href="mailto:privacy@aurorefinances.ch" className="text-blue-600 hover:underline">
              privacy@aurorefinances.ch</a><br />
              Adresse : [À compléter]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}