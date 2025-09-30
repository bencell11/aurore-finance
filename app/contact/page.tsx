import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contactez-nous</h1>
          <p className="text-gray-600">Nous sommes là pour répondre à vos questions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Envoyez-nous un message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Envoyer le message
              </Button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              * Champs obligatoires
            </p>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Pour toute question générale :</p>
                <a href="mailto:contact@aurorefinances.ch" className="text-blue-600 hover:underline font-medium">
                  contact@aurorefinances.ch
                </a>
                
                <p className="text-gray-600 mb-2 mt-4">Pour les questions de confidentialité :</p>
                <a href="mailto:privacy@aurorefinances.ch" className="text-blue-600 hover:underline font-medium">
                  privacy@aurorefinances.ch
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  [Adresse à compléter]<br />
                  Suisse
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Téléphone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  [Numéro à compléter]
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Du lundi au vendredi, 9h-18h
                </p>
              </CardContent>
            </Card>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Temps de réponse</h3>
              <p className="text-gray-600 text-sm">
                Nous nous efforçons de répondre à tous les messages dans les 24 heures ouvrables. 
                Pour les demandes urgentes, n'hésitez pas à le mentionner dans votre message.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Bêta testing</h3>
              <p className="text-gray-600 text-sm">
                Vous souhaitez participer au programme bêta ? 
                <Link href="/" className="text-purple-600 hover:underline ml-1">
                  Rejoignez notre liste d'attente
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}