import { NextRequest, NextResponse } from 'next/server';
import { SimpleOpenAIAssistantService, ChatSession } from '@/lib/services/ai/simple-openai-assistant.service';

// Sessions en mémoire (en production, utiliser Redis ou une base de données)
const sessions = new Map<string, ChatSession>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, userId = 'demo-user' } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      );
    }

    // Récupérer ou créer une session
    let session: ChatSession;
    
    if (sessionId && sessions.has(sessionId)) {
      session = sessions.get(sessionId)!;
    } else {
      session = SimpleOpenAIAssistantService.createSession(userId);
      sessions.set(session.id, session);
    }

    // Traiter le message avec OpenAI
    const result = await SimpleOpenAIAssistantService.processMessage(session, message);
    
    // Sauvegarder la session mise à jour
    sessions.set(session.id, result.updatedSession);

    return NextResponse.json({
      success: true,
      response: result.response,
      sessionId: result.updatedSession.id,
      context: {
        messageCount: result.updatedSession.messages.length,
        lastActivity: result.updatedSession.lastActivity
      }
    });

  } catch (error) {
    console.error('Erreur API chat IA:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du traitement du message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID de session requis' },
        { status: 400 }
      );
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        messages: session.messages,
        startTime: session.startTime,
        lastActivity: session.lastActivity,
        messageCount: session.messages.length
      }
    });

  } catch (error) {
    console.error('Erreur récupération session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID de session requis' },
        { status: 400 }
      );
    }

    const deleted = sessions.delete(sessionId);
    
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Session supprimée' : 'Session non trouvée'
    });

  } catch (error) {
    console.error('Erreur suppression session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}