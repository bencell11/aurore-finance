import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Users, Settings, BarChart3, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration - Aurore Finance",
  description: "Panneau d'administration Aurore Finance",
};

export default function AdminPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
          <p className="text-gray-600">Panneau d'administration Aurore Finance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gestion des utilisateurs */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gérer les utilisateurs inscrits et la liste d'attente
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/users">
                  Voir les utilisateurs
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Analyser les métriques et performances
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/admin/stats">
                  Voir les stats
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-green-600" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Paramètres système et configuration
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/admin/settings">
                  Configuration
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Logs de sécurité et gestion des accès
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/admin/security">
                  Sécurité
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Accès démo */}
          <Card className="hover:shadow-lg transition-shadow border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Démo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Accéder à la version démo du système
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/demo">
                  Accès démo
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Assistant fiscal */}
          <Card className="hover:shadow-lg transition-shadow border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Assistant Fiscal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Accéder à l'assistant fiscal IA
              </p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/assistant-fiscal">
                  Assistant Fiscal
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informations système */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations système</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Version</h3>
              <p className="text-gray-600">v1.0.0-beta</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Environnement</h3>
              <p className="text-gray-600">Production</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Dernière mise à jour</h3>
              <p className="text-gray-600">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}