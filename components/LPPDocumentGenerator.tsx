'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle2, Info, Check } from 'lucide-react';

interface LPPFormData {
  prenom: string;
  nom: string;
  dateNaissance: string;
  numeroAVS: string;
  genre: string;
  nationalite: string;
  rue: string;
  npa: string;
  ville: string;
  email: string;
  telephone: string;
  langue: string;
  caissePension: string;
  anciennesAdresses?: string;
  anciensEmployeurs?: string;
}

interface LPPDocumentGeneratorProps {
  formData: LPPFormData;
  signatureData?: string;
  onBack: () => void;
  onDownload: () => void;
}

export default function LPPDocumentGenerator({ formData, signatureData, onBack, onDownload }: LPPDocumentGeneratorProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const today = new Date().toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle2 className="w-6 h-6" />
          Documents générés avec succès
        </CardTitle>
        <CardDescription>
          Vos documents de demande de recherche d'avoirs LPP et procuration sont prêts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-2">Prochaines étapes :</p>
              <ul className="space-y-1">
                <li>1. Téléchargez les documents ci-dessous</li>
                <li>2. Les documents seront envoyés automatiquement à la Centrale du 2ème pilier</li>
                <li>3. Vous recevrez une confirmation par email</li>
                <li>4. Délai de traitement : 5-10 jours ouvrables</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Document 1: Demande de recherche */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-8 space-y-6 font-serif">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-blue-900">AURORE FINANCES SA</h2>
            <p className="text-sm text-gray-600">Avenue de Rhodanie 40C, 1007 Lausanne</p>
            <p className="text-sm text-gray-600">+41 21 311 27 00 | contact@aurore-finances.ch</p>
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <div className="text-right text-sm mb-6">
              <p>Lausanne, le {today}</p>
            </div>

            <div className="mb-6">
              <p className="font-semibold">À l'attention de :</p>
              <p>Centrale du 2ème pilier</p>
              <p>Stiftung Auffangeinrichtung BVG</p>
              <p>Fonds de garantie LPP</p>
              <p>Case postale</p>
              <p>8058 Zurich-Flughafen</p>
            </div>

            <div className="mb-6">
              <p className="font-semibold text-lg mb-4">Objet : Demande de recherche d'avoirs de prévoyance professionnelle</p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <p>Madame, Monsieur,</p>

              <p>
                Par la présente, nous vous prions de bien vouloir effectuer une recherche d'avoirs de prévoyance
                professionnelle (2ème pilier) pour le compte de notre client(e) :
              </p>

              <div className="bg-gray-50 p-4 rounded my-4 space-y-2">
                <p><span className="font-semibold">Nom et prénom :</span> {formData.nom} {formData.prenom}</p>
                <p><span className="font-semibold">Date de naissance :</span> {formatDate(formData.dateNaissance)}</p>
                <p><span className="font-semibold">Numéro AVS :</span> {formData.numeroAVS}</p>
                <p><span className="font-semibold">Genre :</span> {formData.genre === 'homme' ? 'Masculin' : formData.genre === 'femme' ? 'Féminin' : 'Autre'}</p>
                <p><span className="font-semibold">Nationalité :</span> {formData.nationalite}</p>
                <p><span className="font-semibold">Adresse actuelle :</span> {formData.rue}, {formData.npa} {formData.ville}</p>
                <p><span className="font-semibold">Email :</span> {formData.email}</p>
                <p><span className="font-semibold">Téléphone :</span> {formData.telephone}</p>
                <p><span className="font-semibold">Langue de correspondance :</span> {formData.langue}</p>
                {formData.caissePension && (
                  <p><span className="font-semibold">Caisse de pension actuelle :</span> {formData.caissePension}</p>
                )}
              </div>

              {formData.anciennesAdresses && (
                <div className="my-4">
                  <p className="font-semibold">Anciennes adresses :</p>
                  <p className="ml-4">{formData.anciennesAdresses}</p>
                </div>
              )}

              {formData.anciensEmployeurs && (
                <div className="my-4">
                  <p className="font-semibold">Anciens employeurs :</p>
                  <p className="ml-4">{formData.anciensEmployeurs}</p>
                </div>
              )}

              <p>
                Nous vous prions de bien vouloir nous communiquer les coordonnées de toutes les institutions de
                prévoyance ou de libre passage détenant des avoirs au nom de notre client(e).
              </p>

              <p>
                Une procuration signée par notre client(e) est jointe à la présente demande.
              </p>

              <p>
                Nous vous remercions par avance de votre collaboration et vous prions d'agréer, Madame, Monsieur,
                nos salutations distinguées.
              </p>

              <div className="mt-8">
                <p className="font-semibold">Aurore Finances SA</p>
                <p className="text-sm text-gray-600">Service de gestion patrimoniale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Document 2: Procuration */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-8 space-y-6 font-serif">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-blue-900">PROCURATION</h2>
            <p className="text-sm text-gray-600">Recherche d'avoirs de prévoyance professionnelle</p>
          </div>

          <div className="border-t-2 border-gray-200 pt-6 space-y-4 text-sm leading-relaxed">
            <p className="font-semibold">Je soussigné(e) :</p>

            <div className="bg-gray-50 p-4 rounded space-y-2">
              <p><span className="font-semibold">Nom :</span> {formData.nom}</p>
              <p><span className="font-semibold">Prénom :</span> {formData.prenom}</p>
              <p><span className="font-semibold">Date de naissance :</span> {formatDate(formData.dateNaissance)}</p>
              <p><span className="font-semibold">Numéro AVS :</span> {formData.numeroAVS}</p>
              <p><span className="font-semibold">Genre :</span> {formData.genre === 'homme' ? 'Masculin' : formData.genre === 'femme' ? 'Féminin' : 'Autre'}</p>
              <p><span className="font-semibold">Nationalité :</span> {formData.nationalite}</p>
              <p><span className="font-semibold">Adresse :</span> {formData.rue}, {formData.npa} {formData.ville}</p>
              <p><span className="font-semibold">Email :</span> {formData.email}</p>
              <p><span className="font-semibold">Téléphone :</span> {formData.telephone}</p>
            </div>

            <p className="font-semibold mt-6">Donne par la présente procuration à :</p>

            <div className="bg-blue-50 p-4 rounded">
              <p className="font-semibold">AURORE FINANCES SA</p>
              <p>Avenue de Rhodanie 40C</p>
              <p>1007 Lausanne</p>
              <p>+41 21 311 27 00</p>
              <p>contact@aurore-finances.ch</p>
            </div>

            <p className="mt-6">
              Pour effectuer en mon nom toutes les démarches nécessaires auprès de la Centrale du 2ème pilier
              (Stiftung Auffangeinrichtung BVG) et de toute autre institution de prévoyance ou de libre passage,
              en vue de :
            </p>

            <ul className="list-disc ml-8 space-y-1">
              <li>Rechercher l'existence d'avoirs de prévoyance professionnelle à mon nom</li>
              <li>Obtenir les coordonnées des institutions détenant ces avoirs</li>
              <li>Recevoir toutes les informations relatives à ces avoirs</li>
              <li>Entreprendre les démarches de rapatriement de ces avoirs</li>
            </ul>

            <p className="mt-6">
              J'autorise expressément la Centrale du 2ème pilier et toutes les institutions concernées à communiquer
              directement à Aurore Finances SA toutes les informations relatives aux avoirs de prévoyance détenus à mon nom.
            </p>

            <p>
              Cette procuration est valable pour une durée de <span className="font-semibold">12 mois</span> à compter
              de sa signature et peut être révoquée à tout moment par écrit.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mt-6">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Protection des données :</span> Conformément à la loi fédérale sur la
                protection des données (LPD), vous disposez d'un droit d'accès, de rectification et de suppression de
                vos données personnelles. Pour exercer ces droits, veuillez contacter Aurore Finances SA.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <p className="font-semibold mb-2">Lieu et date :</p>
                <p>{formData.ville}, le {today}</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Signature :</p>
                {signatureData ? (
                  <div className="space-y-2">
                    <div className="border-2 border-blue-200 rounded p-2 bg-blue-50 h-20 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={signatureData}
                        alt="Signature digitale"
                        className="max-h-16 max-w-full"
                      />
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="w-3 h-3" />
                      <p className="text-xs font-semibold">Signature digitale certifiée</p>
                    </div>
                    <p className="text-xs text-gray-600">{formData.prenom} {formData.nom}</p>
                  </div>
                ) : (
                  <div className="border-b-2 border-gray-400 h-16 flex items-end pb-2">
                    <p className="text-xs text-gray-500">(Signature digitale validée)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            Modifier les informations
          </Button>
          <Button
            onClick={onDownload}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger les documents (PDF)
          </Button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-700">
              <p className="font-semibold mb-1">Documents prêts à être envoyés</p>
              <p>
                Les documents seront automatiquement transmis par email sécurisé à la Centrale du 2ème pilier.
                Vous recevrez également une copie par email à {formData.email}.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
