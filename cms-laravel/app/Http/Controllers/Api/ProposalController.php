<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proposal;
use App\Support\PageBlocks;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProposalController extends Controller
{
    /** Cliente monta e envia a proposta no site → chega como “Nova”. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'fullName' => ['required', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:160'],
            'whatsapp' => ['required', 'string', 'max:40'],
            'company' => ['required', 'string', 'max:160'],
            'website' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:5000'],
            'services' => ['array', 'max:30'],
            'services.*.serviceId' => ['required', 'string', 'max:120'],
            'services.*.title' => ['required', 'string', 'max:160'],
            'services.*.notes' => ['nullable', 'string', 'max:2000'],
        ], [], [
            'fullName' => 'nome', 'whatsapp' => 'WhatsApp', 'company' => 'empresa',
        ]);

        $proposal = Proposal::query()->create([
            'full_name' => $data['fullName'],
            'email' => $data['email'],
            'whatsapp' => $data['whatsapp'],
            'company' => $data['company'],
            'website' => $data['website'] ?? null,
            'message' => $data['message'] ?? null,
            'services' => array_map(fn ($s) => [
                'serviceId' => $s['serviceId'],
                'title' => $s['title'],
                'notes' => $s['notes'] ?? '',
            ], $data['services'] ?? []),
            'status' => 'nova',
        ]);

        return response()->json(['doc' => ['id' => $proposal->id], 'message' => 'Proposta recebida'], 201);
    }

    /** Abrir (sem action) ou responder (accept / negotiate) a proposta pelo link do cliente. */
    public function client(Request $request, string $token): JsonResponse
    {
        if ((string) $request->input('password') !== (string) config('cms.proposal_password')) {
            return response()->json(['error' => 'Senha incorreta'], 401);
        }

        $proposal = Proposal::query()->where('access_token', $token)->first();
        if (! $proposal) {
            return response()->json(['error' => 'Proposta não encontrada'], 404);
        }

        if (! in_array($proposal->status, Proposal::VIEWABLE, true)) {
            return response()->json(['error' => 'Proposta ainda não disponível'], 403);
        }

        $action = $request->input('action');

        if (! $action) {
            return response()->json([
                'id' => $proposal->id,
                'company' => $proposal->company,
                'fullName' => $proposal->full_name,
                'status' => $proposal->status,
                'services' => $proposal->services ?? [],
                'formalPrice' => $proposal->formal_price,
                'contentBlocks' => PageBlocks::toApi($proposal->content_blocks),
                'sentAt' => $proposal->sent_at?->toIso8601String(),
                'clientResponse' => $proposal->client_response,
                'negotiateMessage' => $proposal->negotiate_message,
                'clientRespondedAt' => $proposal->client_responded_at?->toIso8601String(),
            ]);
        }

        if ($proposal->client_response) {
            return response()->json(['error' => 'Esta proposta já foi respondida'], 409);
        }

        if (! in_array($action, ['accept', 'negotiate'], true)) {
            return response()->json(['error' => 'Ação inválida'], 400);
        }

        $proposal->update([
            'status' => $action === 'accept' ? 'aceita' : 'negociacao',
            'client_response' => $action,
            'negotiate_message' => $action === 'negotiate' ? mb_substr((string) $request->input('message', ''), 0, 5000) : null,
            'client_responded_at' => now(),
        ]);

        return response()->json([
            'ok' => true,
            'status' => $proposal->status,
            'clientResponse' => $proposal->client_response,
            'negotiateMessage' => $proposal->negotiate_message,
        ]);
    }
}
