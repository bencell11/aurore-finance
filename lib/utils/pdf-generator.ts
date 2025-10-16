import { jsPDF } from 'jspdf';

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const today = new Date().toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });

// Fonction pour ajouter du texte avec retour à la ligne automatique
const addWrappedText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number = 6) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + (lines.length * lineHeight);
};

export const generateDemandeRecherchePDF = (formData: LPPFormData): void => {
  const doc = new jsPDF();

  let yPos = 20;
  const leftMargin = 20;
  const pageWidth = 210; // A4 width in mm
  const maxWidth = pageWidth - (leftMargin * 2);

  // En-tête Aurore Finances
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('AURORE FINANCES SA', pageWidth / 2, yPos, { align: 'center' });

  yPos += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Avenue de Rhodanie 40C, 1007 Lausanne', pageWidth / 2, yPos, { align: 'center' });

  yPos += 5;
  doc.text('+41 21 311 27 00 | contact@aurore-finances.ch', pageWidth / 2, yPos, { align: 'center' });

  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos);

  yPos += 10;

  // Date et lieu
  doc.setFontSize(10);
  doc.text(`Lausanne, le ${today}`, pageWidth - leftMargin, yPos, { align: 'right' });

  yPos += 15;

  // Destinataire
  doc.setFont('helvetica', 'bold');
  doc.text('À l\'attention de :', leftMargin, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'normal');
  doc.text('Centrale du 2ème pilier', leftMargin, yPos);
  yPos += 5;
  doc.text('Stiftung Auffangeinrichtung BVG', leftMargin, yPos);
  yPos += 5;
  doc.text('Fonds de garantie LPP', leftMargin, yPos);
  yPos += 5;
  doc.text('Case postale', leftMargin, yPos);
  yPos += 5;
  doc.text('8058 Zurich-Flughafen', leftMargin, yPos);

  yPos += 15;

  // Objet
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Objet : Demande de recherche d\'avoirs de prévoyance professionnelle', leftMargin, yPos);

  yPos += 10;

  // Corps de la lettre
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text('Madame, Monsieur,', leftMargin, yPos);
  yPos += 10;

  const intro = 'Par la présente, nous vous prions de bien vouloir effectuer une recherche d\'avoirs de prévoyance professionnelle (2ème pilier) pour le compte de notre client(e) :';
  yPos = addWrappedText(doc, intro, leftMargin, yPos, maxWidth, 5);
  yPos += 5;

  // Informations client dans un encadré
  doc.setFillColor(245, 245, 245);
  doc.rect(leftMargin, yPos, maxWidth, 65, 'F');
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Nom et prénom :`, leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.nom} ${formData.prenom}`, leftMargin + 50, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Date de naissance :`, leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(formData.dateNaissance), leftMargin + 50, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Numéro AVS :`, leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.numeroAVS, leftMargin + 50, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Genre :`, leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  const genreLabel = formData.genre === 'homme' ? 'Masculin' : formData.genre === 'femme' ? 'Féminin' : 'Autre';
  doc.text(genreLabel, leftMargin + 50, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Nationalité :`, leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.nationalite, leftMargin + 50, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Adresse actuelle :`, leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.rue}, ${formData.npa} ${formData.ville}`, leftMargin + 50, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Email :`, leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.email, leftMargin + 50, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Téléphone :`, leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.telephone, leftMargin + 50, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Langue :`, leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.langue, leftMargin + 50, yPos);
  yPos += 6;

  if (formData.caissePension) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Caisse pension :`, leftMargin + 5, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.caissePension, leftMargin + 50, yPos);
    yPos += 6;
  }

  yPos += 5;

  // Anciennes adresses si présentes
  if (formData.anciennesAdresses) {
    doc.setFont('helvetica', 'bold');
    doc.text('Anciennes adresses :', leftMargin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    yPos = addWrappedText(doc, formData.anciennesAdresses, leftMargin, yPos, maxWidth, 5);
    yPos += 5;
  }

  // Anciens employeurs si présents
  if (formData.anciensEmployeurs) {
    doc.setFont('helvetica', 'bold');
    doc.text('Anciens employeurs :', leftMargin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    yPos = addWrappedText(doc, formData.anciensEmployeurs, leftMargin, yPos, maxWidth, 5);
    yPos += 5;
  }

  // Vérifier si on a besoin d'une nouvelle page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Suite de la lettre
  const para1 = 'Nous vous prions de bien vouloir nous communiquer les coordonnées de toutes les institutions de prévoyance ou de libre passage détenant des avoirs au nom de notre client(e).';
  yPos = addWrappedText(doc, para1, leftMargin, yPos, maxWidth, 5);
  yPos += 8;

  const para2 = 'Une procuration signée par notre client(e) est jointe à la présente demande.';
  yPos = addWrappedText(doc, para2, leftMargin, yPos, maxWidth, 5);
  yPos += 8;

  const para3 = 'Nous vous remercions par avance de votre collaboration et vous prions d\'agréer, Madame, Monsieur, nos salutations distinguées.';
  yPos = addWrappedText(doc, para3, leftMargin, yPos, maxWidth, 5);
  yPos += 15;

  // Signature
  doc.setFont('helvetica', 'bold');
  doc.text('Aurore Finances SA', leftMargin, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Service de gestion patrimoniale', leftMargin, yPos);

  // Télécharger
  doc.save(`Demande_Recherche_LPP_${formData.nom}_${formData.prenom}.pdf`);
};

export const generateProcurationPDF = (formData: LPPFormData, signatureDataUrl?: string): void => {
  const doc = new jsPDF();

  let yPos = 30;
  const leftMargin = 20;
  const pageWidth = 210;
  const maxWidth = pageWidth - (leftMargin * 2);

  // Titre
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROCURATION', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Recherche d\'avoirs de prévoyance professionnelle', pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos);

  yPos += 10;

  // Corps
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Je soussigné(e) :', leftMargin, yPos);
  yPos += 8;

  // Informations dans un encadré
  doc.setFillColor(245, 245, 245);
  doc.rect(leftMargin, yPos, maxWidth, 50, 'F');
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Nom :', leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.nom, leftMargin + 40, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Prénom :', leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.prenom, leftMargin + 40, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Date de naissance :', leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(formData.dateNaissance), leftMargin + 40, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Numéro AVS :', leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.numeroAVS, leftMargin + 40, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Genre :', leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  const genreLabel = formData.genre === 'homme' ? 'Masculin' : formData.genre === 'femme' ? 'Féminin' : 'Autre';
  doc.text(genreLabel, leftMargin + 40, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Nationalité :', leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.nationalite, leftMargin + 40, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Adresse :', leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.rue}, ${formData.npa} ${formData.ville}`, leftMargin + 40, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Email :', leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.email, leftMargin + 40, yPos);
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Téléphone :', leftMargin + 5, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.telephone, leftMargin + 40, yPos);

  yPos += 10;

  // Donne procuration à
  doc.setFont('helvetica', 'bold');
  doc.text('Donne par la présente procuration à :', leftMargin, yPos);
  yPos += 8;

  doc.setFillColor(230, 240, 255);
  doc.rect(leftMargin, yPos, maxWidth, 25, 'F');
  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('AURORE FINANCES SA', leftMargin + 5, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Avenue de Rhodanie 40C', leftMargin + 5, yPos);
  yPos += 5;
  doc.text('1007 Lausanne', leftMargin + 5, yPos);
  yPos += 5;
  doc.text('+41 21 311 27 00 | contact@aurore-finances.ch', leftMargin + 5, yPos);

  yPos += 10;

  // Texte de la procuration
  const para1 = 'Pour effectuer en mon nom toutes les démarches nécessaires auprès de la Centrale du 2ème pilier (Stiftung Auffangeinrichtung BVG) et de toute autre institution de prévoyance ou de libre passage, en vue de :';
  yPos = addWrappedText(doc, para1, leftMargin, yPos, maxWidth, 5);
  yPos += 5;

  doc.text('• Rechercher l\'existence d\'avoirs de prévoyance professionnelle à mon nom', leftMargin + 5, yPos);
  yPos += 5;
  doc.text('• Obtenir les coordonnées des institutions détenant ces avoirs', leftMargin + 5, yPos);
  yPos += 5;
  doc.text('• Recevoir toutes les informations relatives à ces avoirs', leftMargin + 5, yPos);
  yPos += 5;
  doc.text('• Entreprendre les démarches de rapatriement de ces avoirs', leftMargin + 5, yPos);
  yPos += 8;

  const para2 = 'J\'autorise expressément la Centrale du 2ème pilier et toutes les institutions concernées à communiquer directement à Aurore Finances SA toutes les informations relatives aux avoirs de prévoyance détenus à mon nom.';
  yPos = addWrappedText(doc, para2, leftMargin, yPos, maxWidth, 5);
  yPos += 8;

  doc.setFont('helvetica', 'bold');
  const para3 = 'Cette procuration est valable pour une durée de 12 mois à compter de sa signature et peut être révoquée à tout moment par écrit.';
  yPos = addWrappedText(doc, para3, leftMargin, yPos, maxWidth, 5);
  doc.setFont('helvetica', 'normal');
  yPos += 10;

  // Vérifier si on a besoin d'une nouvelle page
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  // Protection des données
  doc.setFillColor(255, 250, 230);
  doc.rect(leftMargin, yPos, maxWidth, 15, 'F');
  yPos += 5;
  doc.setFontSize(8);
  const disclaimer = 'Protection des données : Conformément à la loi fédérale sur la protection des données (LPD), vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, veuillez contacter Aurore Finances SA.';
  yPos = addWrappedText(doc, disclaimer, leftMargin + 2, yPos, maxWidth - 4, 4);
  yPos += 5;
  doc.setFontSize(10);

  yPos += 10;

  // Lieu, date et signature
  doc.setFont('helvetica', 'bold');
  doc.text('Lieu et date :', leftMargin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.ville}, le ${today}`, leftMargin + 30, yPos);

  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Signature :', leftMargin, yPos);

  // Ajouter la signature si disponible
  if (signatureDataUrl) {
    try {
      doc.addImage(signatureDataUrl, 'PNG', leftMargin + 30, yPos - 5, 60, 20);
      yPos += 22;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(0, 150, 0);
      doc.text('✓ Signature digitale certifiée', leftMargin + 30, yPos);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    } catch (error) {
      console.error('Erreur ajout signature au PDF:', error);
      yPos += 20;
      doc.setFont('helvetica', 'italic');
      doc.text('(Signature digitale)', leftMargin + 30, yPos);
    }
  } else {
    doc.line(leftMargin + 30, yPos + 5, leftMargin + 100, yPos + 5);
    yPos += 8;
  }

  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`${formData.prenom} ${formData.nom}`, leftMargin + 30, yPos);

  // Télécharger
  doc.save(`Procuration_LPP_${formData.nom}_${formData.prenom}.pdf`);
};

export const generateCombinedPDF = (formData: LPPFormData, signatureDataUrl?: string): void => {
  // Génère un PDF combiné avec les deux documents
  // TODO: Implémenter la génération combinée dans un seul fichier PDF multi-pages
  // Pour l'instant, on génère les deux séparément

  generateDemandeRecherchePDF(formData);
  setTimeout(() => {
    generateProcurationPDF(formData, signatureDataUrl);
  }, 500);
};
